# //as user enter emaail and password it will be creating new datbse entry for user{if user exist updte tht}
# //jwt crete to -->uplod.py  -->chtbot
# connect login.py ---forntend AND design the dagatabse


# task final : make a formmula to compare this values--->> sla eithr send to LLM-like chatbot model to tell yes or no  OR FORMULA/CALCULATION to know whether
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.db.database import get_db
from backend.db import model, pydantic

from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


router = APIRouter(tags=["Login"])



@router.post("/login", response_model=pydantic.LoginResponse)
def login_user(data: pydantic.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.email == data.email).first()
    

    # If user does not exist → create new one
    if not user:
        hashed_pwd = hash_password(data.password)
        new_user = model.User(
            email=data.email,
            password=hashed_pwd
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # TODO: generate JWT here and return it
        return {
            "user_id": new_user.id,
            "is_new_user": True,
            "message": "User created successfully"
        }

    # If user exists → verify password
    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    # TODO: generate JWT here and return it
    return {
        "user_id": user.id,
        "is_new_user": False,
        "message": "Login successful"
    }