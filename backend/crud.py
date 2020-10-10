from sqlalchemy.orm import Session

from . import models, schemas

from .utils import get_password_hash
from random import shuffle


def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.CreateUser):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username,
                          name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def new_game(db: Session, user: schemas.BaseUser):
    old_desk = db.query(models.Desk).filter_by(
        user_id=user.id, active=True).first()
    if old_desk is not None:
        old_desk.active = False
        db.commit()
    db_desk = models.Desk(user_id=user.id)
    db.add(db_desk)
    db.commit()
    db.refresh(db_desk)
    cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
    shuffle(cards)
    for i in cards:
        db_card = models.Card(value=i, desk_id=db_desk.id)
        db.add(db_card)
        db.commit()
    db.refresh(db_desk)
    return db_desk
