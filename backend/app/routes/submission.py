from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app import models, schemas

router = APIRouter(prefix="/submit", tags=["Exam Submission"])

@router.post("/")
def submit_exam(
    data: schemas.ExamSubmit,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # 🔒 Role check
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can submit exams")

    # 📝 Create submission
    submission = models.ExamSubmission(
        exam_id=data.exam_id,
        user_id=user["user_id"]
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    score = 0
    total_mcq = 0

    # 📊 Process answers
    for ans in data.answers:
        question = db.query(models.Question).filter(
            models.Question.id == ans.question_id
        ).first()

        if not question:
            continue

        # Auto-grading for MCQs
        if question.is_mcq:
            total_mcq += 1
            if (
                question.correct_answer
                and ans.answer_text.strip().lower()
                == question.correct_answer.strip().lower()
            ):
                score += 1

        db.add(models.Answer(
            submission_id=submission.id,
            question_id=ans.question_id,
            answer_text=ans.answer_text
        ))

    # 🧮 Final score
    if total_mcq > 0:
        submission.score = (score / total_mcq) * 100

    db.commit()

    return {
        "message": "Exam submitted & auto-graded",
        "score": submission.score
    }
