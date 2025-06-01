# app/parser.py
from openresume_parser import ResumeParser   # thin wrapper around OpenResume core
from pathlib import Path

def parse_resume(file_path: Path) -> dict:
    data = ResumeParser(str(file_path)).parse()
    # normalise keys for downstream use
    return {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("mobile_number"),
        "skills": data.get("skills", []),
        "experiences": data.get("experience", []),
        "education": data.get("education", [])
    }
