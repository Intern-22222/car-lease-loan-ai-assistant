from pydantic import BaseModel,EmailStr

# class Userbase(BaseModel):
#     email:EmailStr
#     password:str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user_id: int
    message: str
    is_new_user: bool