from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# 配置 CORS 中间件，允许前端从 http://localhost:5173 访问后端
origins = [
    "http://localhost:5173",  # 允许的前端端口
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允许的源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有请求方法
    allow_headers=["*"],  # 允许所有请求头
)

# 投票数据模型和接口定义
class VoteItem(BaseModel):
    id: int
    name: str
    votes: int
    color: str = None  # 可选的颜色字段
    imageId: str = None  # 新增的图片URL字段

vote_data = [
    VoteItem(id=1, name="🐟鱼", votes=3, color="hsl(100, 70%, 60%)", imageId="1"),
    VoteItem(id=2, name="🏀球", votes=5, color="hsl(200, 70%, 60%)", imageId="2"),
    VoteItem(id=3, name="🐻熊", votes=2, color="hsl(300, 70%, 60%)", imageId="3"),
    VoteItem(id=4, name="🦑水母", votes=4, color="hsl(50, 70%, 60%)", imageId="4"),
    VoteItem(id=5, name="🦐虾", votes=4, color="hsl(50, 70%, 60%)", imageId="5"),
    VoteItem(id=6, name="🐙章鱼", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
]

@app.get("/api/votes", response_model=List[VoteItem])
async def get_votes():
    return vote_data

@app.post("/api/vote/new")
async def create_vote(vote_item: VoteItem):
    global vote_data
    vote_data.append(vote_item)
    return {"message": f"新投票项 {vote_item.name} 已添加。"}

@app.post("/api/vote/{vote_id}")
async def vote(vote_id: int):
    global vote_data
    for vote_item in vote_data:
        if vote_item.id == vote_id:
            vote_item.votes += 1
            return {"message": f"投票成功，{vote_item.name}的票数增加。"}
    return {"message": "投票选项未找到。"}