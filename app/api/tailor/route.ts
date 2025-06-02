import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { tailorResume, Resume } from "@/lib/ai/resume-tailor"
import { parsePDF } from "@/lib/pdf/parser"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string
    const jobTitle = formData.get("jobTitle") as string
    const company = formData.get("company") as string

    if (!resumeFile || !jobDescription || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Parse the PDF resume
    const resumeBuffer = await resumeFile.arrayBuffer()
    const parsedResume = await parsePDF(Buffer.from(resumeBuffer))
    
    // Convert parsed text to structured resume data
    // In a real app, this would use more sophisticated parsing
    const resume: Resume = {
      personalInfo: {
        name: session.user.name || "Unknown",
        email: session.user.email || "",
        phone: "",
        location: "",
      },
      summary: parsedResume.summary || "",
      experience: parsedResume.experience || [],
      education: parsedResume.education || [],
      skills: parsedResume.skills || { technical: [], soft: [] },
      projects: parsedResume.projects || [],
      certifications: parsedResume.certifications || [],
    }

    // Save the original resume to database
    const savedResume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: `Resume - ${new Date().toLocaleDateString()}`,
        content: resume,
        rawText: parsedResume.rawText,
      },
    })

    // Save job posting
    const jobPosting = await prisma.jobPosting.create({
      data: {
        title: jobTitle,
        company: company,
        description: jobDescription,
        requirements: {},
        keywords: [],
      },
    })

    // Tailor the resume using AI
    const tailoredResult = await tailorResume(resume, {
      jobDescription,
      jobTitle,
      company,
      emphasis: "balanced",
      maxBullets: 5,
    })

    // Save the tailored resume
    const savedTailoredResume = await prisma.tailoredResume.create({
      data: {
        resumeId: savedResume.id,
        jobPostingId: jobPosting.id,
        content: tailoredResult,
        matchScore: tailoredResult.matchScore,
        highlights: tailoredResult.highlights,
      },
    })

    // Return the tailored resume
    return NextResponse.json({
      success: true,
      tailoredResume: tailoredResult,
      matchScore: tailoredResult.matchScore,
      highlights: tailoredResult.highlights,
      tailoredResumeId: savedTailoredResume.id,
    })
  } catch (error) {
    console.error("Error in tailor API:", error)
    return NextResponse.json(
      { error: "Failed to tailor resume", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's tailored resumes
    const tailoredResumes = await prisma.tailoredResume.findMany({
      where: {
        resume: {
          userId: session.user.id,
        },
      },
      include: {
        resume: true,
        jobPosting: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    return NextResponse.json({
      success: true,
      tailoredResumes,
    })
  } catch (error) {
    console.error("Error fetching tailored resumes:", error)
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    )
  }
}
