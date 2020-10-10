from sqlalchemy import String, Boolean, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    desk = relationship("Desk", uselist=False, back_populates="user")


class Desk(Base):
    __tablename__ = "desks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    clicks = Column(Integer, index=True, default=0)
    active = Column(Boolean, default=True)
    solved = Column(Boolean, default=False)

    cards = relationship("Card")
    user = relationship("User", back_populates="desk")


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(Integer, index=True)
    shown = Column(Boolean, default=False)
    correct = Column(Boolean, default=False)
    desk_id = Column(Integer, ForeignKey("desks.id"))
