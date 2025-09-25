from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os

# FastAPI 앱 초기화
app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 및 템플릿 디렉토리 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# DB 연결 설정
DB_USER = os.getenv("DB_USER", "boarduser")
DB_PASS = os.getenv("DB_PASS", "boardpass")
DB_HOST = os.getenv("DB_HOST", "db")
DB_NAME = os.getenv("DB_NAME", "board_db")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 모델 정의
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    content = Column(String(500))

# 테이블 생성
Base.metadata.create_all(bind=engine)

# 요청 모델
class PostCreate(BaseModel):
    title: str
    content: str

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 게시글 작성
@app.post("/posts/")
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(title=post.title, content=post.content)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# 게시글 목록 조회
@app.get("/posts/")
def read_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

# 메인 페이지 라우트
@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "게시판"})