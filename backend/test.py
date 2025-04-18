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

# 投票数据模型和接口定义保持不变
class VoteItem(BaseModel):
    id: int
    name: str
    votes: int
    color: str = None  # 可选的颜色字段

vote_data = [
    VoteItem(id=1, name="选项 A", votes=3, color="hsl(100, 70%, 60%)"),
    VoteItem(id=2, name="选项 B", votes=5, color="hsl(200, 70%, 60%)"),
    VoteItem(id=3, name="选项 C", votes=2, color="hsl(300, 70%, 60%)"),
    VoteItem(id=4, name="选项 D", votes=4, color="hsl(50, 70%, 60%)"),
]

@app.get("/api/votes", response_model=List[VoteItem])
async def get_votes():
    return vote_data

@app.post("/api/vote/{vote_id}")
async def vote(vote_id: int):
    global vote_data
    for vote_item in vote_data:
        if vote_item.id == vote_id:
            vote_item.votes += 1
            return {"message": f"投票成功，{vote_item.name}的票数增加。"}
    return {"message": "投票选项未找到。"}