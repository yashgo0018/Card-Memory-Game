from pydantic import BaseModel
from typing import Optional, List


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class BaseUser(BaseModel):
    name: str
    username: str

    class Meta:
        orm_mode = True


class User(BaseUser):
    password_hashed: str


class CreateUser(BaseUser):
    password: str

    class Meta:
        orm_mode = True


class LoginUser(BaseModel):
    username: str
    password: str


class Card(BaseModel):
    value: int
    shown: bool
    correct: bool

    class Meta:
        orm_mode = True


class Desk(BaseModel):
    cards: List[Card]
    clicks: int
    active: bool

    class Meta:
        orm_mode = True
