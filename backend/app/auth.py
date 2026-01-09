from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "examynex_super_secret_key"  # keep constant
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Use pbkdf2_sha256 to avoid bcrypt backend/version issues and 72-byte limits
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """Hash a password using the configured scheme"""
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Error hashing password: {e}")
        raise

def verify_password(plain: str, hashed: str) -> bool:
    """Verify a password against a hashed password"""
    try:
        return pwd_context.verify(plain, hashed)
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False

def create_access_token(user_id: int, role: str):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
