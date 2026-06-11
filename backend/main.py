from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from database import init_db,get_all_exams,create_exam,delete_exam,update_exam
from pydantic import BaseModel
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://grisharoz.github.io",
        "http://localhost:63343",
        "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
init_db()

class ExamCreate(BaseModel):
    module:str
    date:str
    diff:str


@app.get("/")
async def root():
    return {'message':"Study Buddy API is working!"}


@app.get("/exams")
async def get_exams(user: str = Query(...)):
    if not user or len(user) == 0:
        raise HTTPException(status_code=400, detail="user required")
    return get_all_exams(user)

@app.post("/exams",status_code=201)
async def add_exam(exam: ExamCreate, user: str = Query(...)):
    if not user or len(user) == 0:
        raise HTTPException(status_code=400, detail="user required")
    create_exam(user, exam.module, exam.date, exam.diff)
    return {'message':"ok"}

@app.delete("/exams/{exam_id}")
async def remove_exam(exam_id: int, user: str = Query(...)):
    if not user or len(user) == 0:
        raise HTTPException(status_code=400, detail="user required")
    delete_exam(exam_id, user)
    return {'message':"deleted"}


@app.put("/exams/{exam_id}",status_code=200)
async def changing_exam(exam_id: int, exam: ExamCreate, user: str = Query(...)):
    if not user or len(user) == 0:
        raise HTTPException(status_code=400, detail="user required")
    update_exam(exam_id, user, exam.module, exam.date, exam.diff)
    return (
        {'message':"updated"}
    )



