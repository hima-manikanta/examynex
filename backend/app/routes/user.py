from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

# Also create auth router for cleaner separation
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


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


# =========================
# AUTH ROUTER ENDPOINTS (for frontend compatibility)
# =========================
@auth_router.post("/register")
def auth_register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register endpoint under /auth prefix"""
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


@auth_router.post("/login")
def auth_login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login endpoint under /auth prefix"""
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


# =========================
# GET CURRENT USER INFO
# =========================
@router.get("/me", response_model=schemas.UserOut)
def get_user_info(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current logged-in user information"""
    db_user = db.query(models.User).filter(models.User.id == user["user_id"]).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user
