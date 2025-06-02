import OpenAI from "openai"
import { z } from "zod"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Schema for structured resume data
export const ResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.string(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    bullets: z.array(z.string()),
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    location: z.string(),
    graduationDate: z.string(),
    gpa: z.string().optional(),
  })),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
  }),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    link: z.string().optional(),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
  })).optional(),
})

export type Resume = z.infer<typeof ResumeSchema>

export interface TailoringOptions {
  jobDescription: string
  jobTitle: string
  company: string
  emphasis?: "technical" | "leadership" | "balanced"
  maxBullets?: number
}

export interface TailoredResume extends Resume {
  matchScore: number
  highlights: {
    keywords: string[]
    skills: string[]
    improvements: string[]
  }
}

export async function tailorResume(
  resume: Resume,
  options: TailoringOptions
): Promise<TailoredResume> {
  const { jobDescription, jobTitle, company, emphasis = "balanced", maxBullets = 5 } = options

  const prompt = `
You are an expert resume writer and ATS optimization specialist. Your task is to tailor the following resume for a specific job opportunity while maintaining honesty and accuracy.

ORIGINAL RESUME:
${JSON.stringify(resume, null, 2)}

JOB DETAILS:
Title: ${jobTitle}
Company: ${company}
Description: ${jobDescription}

TAILORING EMPHASIS: ${emphasis}

INSTRUCTIONS:
1. Analyze the job description to identify key requirements, skills, and keywords
2. Rewrite the professional summary to directly address the job requirements
3. Reorganize and rewrite experience bullets to highlight relevant achievements
4. Prioritize the most relevant experiences and skills
5. Use strong action verbs and quantify achievements where possible
6. Ensure ATS compatibility by using standard formatting and relevant keywords
7. Keep bullets to a maximum of ${maxBullets} per position
8. Maintain complete honesty - do not add skills or experiences not present in the original

OUTPUT FORMAT:
Return a JSON object with the tailored resume following the exact same structure as the input, plus:
- matchScore: A percentage (0-100) indicating how well the resume matches the job
- highlights: An object containing:
  - keywords: Array of important keywords incorporated
  - skills: Array of highlighted skills
  - improvements: Array of specific improvements made

Ensure the response is valid JSON that can be parsed.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer specializing in ATS optimization and job matching. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(response.choices[0].message.content || "{}")
    
    // Validate the response structure
    const tailoredResume: TailoredResume = {
      ...result,
      matchScore: result.matchScore || 0,
      highlights: result.highlights || {
        keywords: [],
        skills: [],
        improvements: [],
      },
    }

    return tailoredResume
  } catch (error) {
    console.error("Error tailoring resume:", error)
    throw new Error("Failed to tailor resume. Please try again.")
  }
}

export async function extractKeywords(jobDescription: string): Promise<string[]> {
  const prompt = `
Extract the most important keywords and phrases from this job description that should be included in a resume. Focus on:
- Technical skills and technologies
- Soft skills
- Industry-specific terms
- Qualifications and certifications
- Action verbs

Job Description:
${jobDescription}

Return a JSON array of keywords, prioritized by importance.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing job descriptions and extracting relevant keywords for resume optimization.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(response.choices[0].message.content || '{"keywords":[]}')
    return result.keywords || []
  } catch (error) {
    console.error("Error extracting keywords:", error)
    return []
  }
}

export async function analyzeJobMatch(
  resume: Resume,
  jobDescription: string
): Promise<{
  score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
}> {
  const prompt = `
Analyze how well this resume matches the job description. Provide:
1. A match score (0-100)
2. Key strengths that align with the job
3. Gaps or missing qualifications
4. Specific suggestions for improvement

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

Return a JSON object with: score, strengths (array), gaps (array), suggestions (array)
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor analyzing resume-job fit.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    return JSON.parse(response.choices[0].message.content || '{"score":0,"strengths":[],"gaps":[],"suggestions":[]}')
  } catch (error) {
    console.error("Error analyzing job match:", error)
    return {
      score: 0,
      strengths: [],
      gaps: [],
      suggestions: ["Unable to analyze match. Please try again."],
    }
  }
}
