from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Dict

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter(prefix="/exams", tags=["Exams"])


# =========================
# CREATE EXAM (ADMIN ONLY)
# =========================
@router.post("/", response_model=schemas.ExamOut)
def create_exam(
    exam: schemas.ExamCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create exams")

    db_exam = models.Exam(
        title=exam.title,
        description=exam.description,
        duration_minutes=exam.duration_minutes,
    )

    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam


# =========================
# LIST EXAMS (ALL USERS)
# =========================
@router.get("/", response_model=list[schemas.ExamOut])
def list_exams(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    return db.query(models.Exam).all()


# =========================
# GET SINGLE EXAM
# =========================
@router.get("/{exam_id}", response_model=schemas.ExamOut)
def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


# =========================
# START EXAM
# =========================
@router.post("/{exam_id}/start")
def start_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    return {
        "exam_id": exam_id,
        "status": "started",
        "user_id": user["user_id"],
    }


# =========================
# GET EXAM QUESTIONS (SAFE)
# =========================
@router.get("/{exam_id}/questions")
def get_exam_questions(
    exam_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    questions = (
        db.query(models.Question)
        .filter(models.Question.exam_id == exam_id)
        .all()
    )

    return [
        {
            "id": q.id,
            "text": q.question_text,          # ✅ FIX
            "question_type": "mcq" if q.is_mcq else "text",
            "options": [
                q.option_a,
                q.option_b,
                q.option_c,
                q.option_d,
            ] if q.is_mcq else None,
        }
        for q in questions
    ]

# =========================
# SUBMIT EXAM (BASIC)
# =========================
@router.post("/{exam_id}/submit")
def submit_exam(
    exam_id: int,
    payload: Dict,  # { answers: { question_id: value } }
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    print("SUBMISSION:", payload)

    return {
        "exam_id": exam_id,
        "user_id": user["user_id"],
        "status": "submitted",
    }
