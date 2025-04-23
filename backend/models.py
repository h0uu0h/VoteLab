from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class VoteItemDB(Base):
    __tablename__ = "vote_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    votes = Column(Integer, default=0)
    color = Column(String, nullable=True)
    imageId = Column(String, nullable=True)
