from datetime import timedelta
from typing import Optional, List

from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine
from .settings import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from .utils import create_access_token, verify_password
import json
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000"
]

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependency


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@app.post("/api/register", response_model=schemas.BaseUser)
async def register(user: schemas.CreateUser, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user.username)
    if db_user is not None:
        raise HTTPException(detail="Username Already Taken.", status_code=400)
    db_user = crud.create_user(db, user)
    return schemas.BaseUser(name=db_user.name, username=db_user.username)


@app.post("/api/login", response_model=schemas.Token)
async def login(user: schemas.LoginUser, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user.username)
    if not (db_user and verify_password(user.password, db_user.hashed_password)):
        raise HTTPException(
            detail="Invalid Credentials",
            status_code=401,
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/new_game")
def new_game(user=Depends(get_current_user), db=Depends(get_db)):
    _ = crud.new_game(db, user)
    return {"message": "new game ready"}


def game_over(db, desk):
    desk.solved = True
    desk.active = False
    db.commit()

def check_click(db, user, pos):
    desk = db.query(models.Desk).filter_by(
        user_id=user.id, active=True).first()
    if desk is None:
        desk = crud.new_game(db, user)
    cards = desk.cards
    clicked_card = cards[pos]
    value = clicked_card.value
    if clicked_card.shown:
        return value, desk.clicks, False
    desk.clicks += 1
    shown_cards = list(
        filter(lambda card: card.shown and not card.correct, desk.cards))
    if len(shown_cards) == 0:
        clicked_card.shown = True
        db.commit()
        return value, desk.clicks, False
    else:
        shown_card = shown_cards[0]
        if shown_card.value == value:
            shown_card.correct = True
            clicked_card.correct = True
            clicked_card.shown = True
            db.commit()
            if len(list(filter(lambda card: card.correct, desk.cards))) == 12:
                game_over(db, desk)
                return value, desk.clicks, True
            return value, desk.clicks, False
        else:
            shown_card.shown = False
            db.commit()
            return value, desk.clicks, False


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


async def send_best_scores(websocket, user, db):
    best_score = db.query(models.Desk).filter_by(solved=True).order_by(models.Desk.clicks)[0].clicks
    player_best_score = db.query(models.Desk).filter_by(solved=True, user_id=user.id).order_by(models.Desk.clicks)[0].clicks
    await manager.broadcast(f"Global Best is {best_score}")
    await manager.send_personal_message(f"Player Best is {player_best_score}", websocket)

@app.websocket("/api/game")
async def game(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    print("Hello")
    token = await websocket.receive_text()
    print(token)
    user = await get_current_user(token, db)
    print(user.name)
    await send_best_scores(websocket, user, db)
    try:
        while True:
            data = await websocket.receive_text()
            if data[:5] == "click":
                pos = int(data[6:])
                value, clicks, solved = check_click(db, user, pos)
                await manager.send_personal_message(json.dumps({"pos": pos, "value": value, "clicks": clicks}), websocket)
                if solved:
                    await send_best_scores(websocket, user, db)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
