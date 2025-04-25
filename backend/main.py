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
    id: str
    name: str
    votes: int
    color: str = None  # 可选的颜色字段
    imageId: str = None  # 新增的图片URL字段

vote_data = [
    VoteItem(id="1", name="🐟鱼", votes=6, color="hsl(100, 70%, 60%)", imageId="1"),
    VoteItem(id="2", name="🏀球", votes=5, color="hsl(200, 70%, 60%)", imageId="2"),
    VoteItem(id="3", name="🐻熊", votes=2, color="hsl(300, 70%, 60%)", imageId="3"),
    VoteItem(id="4", name="🦑水母", votes=10, color="hsl(50, 70%, 60%)", imageId="4"),
    VoteItem(id="5", name="🦐虾", votes=12, color="hsl(50, 70%, 60%)", imageId="5"),
    VoteItem(id="6", name="🐙章鱼", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="7", name="鱼", votes=3, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="8", name="2鱼", votes=1, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="9", name="3鱼地方屡屡cwecwvvvvvvvvv", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="10", name="34鱼", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="11", name="5鱼", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="12", name="6鱼", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="13", name="7鱼", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="14", name="🐙8", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="15", name="🐙9", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="16", name="🐙6", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="17", name="🐙78", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="18", name="🐙gg", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="19", name="🐙nn", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="20", name="🐙vd", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="21", name="🐙n", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="22", name="🐙m", votes=4, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="23", name="🐙fr", votes=10, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="24", name="🐙vvd", votes=2, color="hsl(50, 70%, 60%)", imageId="6"),
    VoteItem(id="25", name="🐙ww", votes=1, color="hsl(50, 70%, 60%)", imageId="6"),
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
async def vote(vote_id: str):
    global vote_data
    for vote_item in vote_data:
        if vote_item.id == vote_id:
            vote_item.votes += 1
            return {"message": f"投票成功，{vote_item.name}的票数增加。"}
    return {"message": "投票选项未找到。"}