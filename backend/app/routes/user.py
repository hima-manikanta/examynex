from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])


from sqlalchemy.exc import IntegrityError

@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(models.User).filter(
            models.User.email == user.email
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        new_user = models.User(
            email=user.email,
            password=hash_password(user.password),
            role=user.role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "User created successfully"}

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Invalid user data or duplicate entry"
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )



@router.post("/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        user_id=db_user.id,
        role=db_user.role
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }

