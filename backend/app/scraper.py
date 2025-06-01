# app/scraper.py
from jobspy import scrape_jobs           # JobSpy ships FastAPI helpers

def get_jobs(term: str, location: str = "United States", limit: int = 20):
    jobs_df = scrape_jobs(
        keywords=[term],
        location=location,
        providers=["linkedin", "indeed", "ziprecruiter"],
        results_wanted=limit,
        save=False
    )
    for _ , row in jobs_df.iterrows():
        yield {
            "title": row['title'],
            "company": row['company_name'],
            "description": row['description'],
            "link": row['job_url']
        }
