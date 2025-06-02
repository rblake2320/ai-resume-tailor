import pdf from "pdf-parse"

export interface ParsedResume {
  rawText: string
  summary?: string
  experience?: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate?: string
    current: boolean
    bullets: string[]
  }>
  education?: Array<{
    degree: string
    school: string
    location: string
    graduationDate: string
    gpa?: string
  }>
  skills?: {
    technical: string[]
    soft: string[]
  }
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  certifications?: Array<{
    name: string
    issuer: string
    date: string
  }>
}

export async function parsePDF(buffer: Buffer): Promise<ParsedResume> {
  try {
    const data = await pdf(buffer)
    const text = data.text

    // This is a simplified parser. In a production app, you'd use
    // more sophisticated NLP techniques or a specialized resume parser
    const parsed: ParsedResume = {
      rawText: text,
      experience: extractExperience(text),
      education: extractEducation(text),
      skills: extractSkills(text),
      summary: extractSummary(text),
    }

    return parsed
  } catch (error) {
    console.error("Error parsing PDF:", error)
    throw new Error("Failed to parse PDF resume")
  }
}

function extractSummary(text: string): string {
  // Look for summary/objective section
  const summaryMatch = text.match(
    /(SUMMARY|OBJECTIVE|PROFILE|ABOUT)[\s\S]*?(?=\n[A-Z]{4,}|\n\n|$)/i
  )
  
  if (summaryMatch) {
    return summaryMatch[0]
      .replace(/(SUMMARY|OBJECTIVE|PROFILE|ABOUT)/i, "")
      .trim()
  }
  
  // If no summary section, take first paragraph
  const firstParagraph = text.split("\n\n")[0]
  return firstParagraph.length > 50 ? firstParagraph : ""
}

function extractExperience(text: string): ParsedResume["experience"] {
  const experience: ParsedResume["experience"] = []
  
  // Look for experience section
  const expMatch = text.match(
    /(EXPERIENCE|WORK HISTORY|EMPLOYMENT)[\s\S]*?(?=\n[A-Z]{4,}|$)/i
  )
  
  if (!expMatch) return experience

  const expText = expMatch[0]
  
  // Simple pattern matching for job entries
  // In production, use more sophisticated parsing
  const jobPattern = /([A-Za-z\s]+)\s*[-–—|]\s*([A-Za-z\s&,.']+)\s*\n([A-Za-z\s,]+)\s*[-–—|]\s*([A-Za-z0-9\s–-]+)/g
  
  let match
  while ((match = jobPattern.exec(expText)) !== null) {
    experience.push({
      title: match[1].trim(),
      company: match[2].trim(),
      location: match[3].trim(),
      startDate: extractDate(match[4]),
      endDate: match[4].toLowerCase().includes("present") ? undefined : extractDate(match[4]),
      current: match[4].toLowerCase().includes("present"),
      bullets: extractBullets(expText, match.index),
    })
  }

  return experience
}

function extractEducation(text: string): ParsedResume["education"] {
  const education: ParsedResume["education"] = []
  
  const eduMatch = text.match(
    /(EDUCATION|ACADEMIC)[\s\S]*?(?=\n[A-Z]{4,}|$)/i
  )
  
  if (!eduMatch) return education

  const eduText = eduMatch[0]
  
  // Simple pattern for degree extraction
  const degreePattern = /(Bachelor|Master|PhD|Ph\.D\.|B\.S\.|M\.S\.|MBA|B\.A\.|M\.A\.)[^,\n]*[,\s]+([^,\n]+)[,\s]+([0-9]{4})/gi
  
  let match
  while ((match = degreePattern.exec(eduText)) !== null) {
    education.push({
      degree: match[1].trim(),
      school: match[2].trim(),
      location: "", // Would need more sophisticated parsing
      graduationDate: match[3],
    })
  }

  return education
}

function extractSkills(text: string): ParsedResume["skills"] {
  const skills = {
    technical: [] as string[],
    soft: [] as string[],
  }
  
  const skillsMatch = text.match(
    /(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[\s\S]*?(?=\n[A-Z]{4,}|$)/i
  )
  
  if (!skillsMatch) return skills

  const skillsText = skillsMatch[0]
  
  // Extract skills separated by commas, bullets, or pipes
  const skillsList = skillsText
    .replace(/(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)/i, "")
    .split(/[,•|]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 50)
  
  // Simple categorization - in production, use a skills taxonomy
  const technicalKeywords = ["python", "java", "react", "node", "sql", "aws", "docker", "kubernetes"]
  
  skillsList.forEach(skill => {
    if (technicalKeywords.some(tech => skill.toLowerCase().includes(tech))) {
      skills.technical.push(skill)
    } else {
      skills.soft.push(skill)
    }
  })

  return skills
}

function extractBullets(text: string, startIndex: number): string[] {
  // Extract bullet points after a job entry
  const bullets: string[] = []
  const bulletText = text.substring(startIndex, startIndex + 1000)
  
  const bulletPattern = /[•·\-*]\s*(.+?)(?=\n[•·\-*]|\n\n|$)/g
  
  let match
  while ((match = bulletPattern.exec(bulletText)) !== null) {
    bullets.push(match[1].trim())
    if (bullets.length >= 5) break // Limit bullets
  }
  
  return bullets
}

function extractDate(dateStr: string): string {
  // Simple date extraction
  const match = dateStr.match(/([A-Za-z]+\s+)?(\d{4})/)
  return match ? match[2] : ""
}
