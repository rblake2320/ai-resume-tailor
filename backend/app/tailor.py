# app/tailor.py
import os, textwrap, openai, uuid
from pydantic import BaseModel
from tenacity import retry, wait_random_exponential, stop_after_attempt

openai.api_key = os.environ["OPENAI_API_KEY"]

class Tailored(BaseModel):
    id: str
    job_title: str
    company: str
    resume_md: str      # markdown-formatted version

@retry(wait=wait_random_exponential(), stop=stop_after_attempt(5))
def tailor_resume(parsed_resume: dict, job: dict) -> Tailored:
    prompt = textwrap.dedent(f"""
        You are an ATS-aware résumé rewriter.
        **Candidate JSON**:
        {parsed_resume}

        **Job posting**:
        Title: {job['title']}
        Company: {job['company']}
        Description:\n{job['description']}

        Output a **full resume in Markdown** that:
        • keeps contact details unchanged  
        • highlights only skills/experience relevant to the posting  
        • injects exact keywords from the job advert where they align truthfully  
        • stays under 2 pages (≈650 words)  
        • is fully ATS friendly (no tables, no graphics).  
    """)
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        max_tokens=900,
        temperature=0.3
    )
    return Tailored(
        id=str(uuid.uuid4()),
        job_title=job['title'],
        company=job['company'],
        resume_md=resp.choices[0].message.content.strip()
    )
