from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 数据库路径（确保存在目录）
SQLITE_DB_DIR = "sqlite_db"
os.makedirs(SQLITE_DB_DIR, exist_ok=True)

# 数据库配置
SQLALCHEMY_DATABASE_URL = f"sqlite:///{SQLITE_DB_DIR}/vote.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite专用参数
    echo=True  # 显示SQL日志（调试用）
)

# 会话工厂
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 模型基类
Base = declarative_base()

def init_db():
    """初始化数据库（创建表结构）"""
    import models  # 确保所有模型已导入
    Base.metadata.create_all(bind=engine)