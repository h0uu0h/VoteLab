from sqlalchemy import Column, Integer, String
from database import Base  # 注意这里从database导入Base

class VoteItem(Base):
    __tablename__ = "vote_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    votes = Column(Integer, default=0)
    image_url = Column(String(200))