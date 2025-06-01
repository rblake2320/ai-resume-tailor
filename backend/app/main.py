# app/main.py
from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from pathlib import Path
from tempfile import NamedTemporaryFile
from .parser import parse_resume
from .scraper import get_jobs
from .tailor import tailor_resume, Tailored

app = FastAPI()

@app.post("/tailor")
async def tailor(file: UploadFile = File(...), term: str = "software engineer", loc: str = "remote"):
    tmp: Path
    with NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
    parsed = parse_resume(Path(tmp.name))
    jobs = list(get_jobs(term, loc, limit=5))
    tailored = [tailor_resume(parsed, j) for j in jobs]
    return {"resumes": [t.dict() for t in tailored]}
