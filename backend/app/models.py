# app/models.py
from pydantic import BaseModel
from typing import List, Optional

class Contact(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class Experience(BaseModel):
    title: str
    company: str
    date_range: str
    description: List[str]

class Education(BaseModel):
    degree: str
    institution: str
    date: str

class Resume(BaseModel):
    contact: Contact
    skills: List[str]
    experiences: List[Experience]
    education: List[Education]

class Job(BaseModel):
    title: str
    company: str
    description: str
    link: str

class TailoredResume(BaseModel):
    id: str
    job_title: str
    company: str
    resume_md: str
