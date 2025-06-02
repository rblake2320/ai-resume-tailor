"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/file-upload"
import { ResumePreview } from "@/components/resume-preview"
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Download, 
  History, 
  Target,
  Briefcase,
  User
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [tailoredResume, setTailoredResume] = useState(null)
  const [matchScore, setMatchScore] = useState(0)

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  const handleResumeUpload = (file: File) => {
    setUploadedResume(file)
    toast({
      title: "Resume uploaded",
      description: "Your resume has been uploaded successfully.",
    })
  }

  const handleTailorResume = async () => {
    if (!uploadedResume || !jobDescription || !jobTitle) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and provide job details.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append("resume", uploadedResume)
      formData.append("jobDescription", jobDescription)
      formData.append("jobTitle", jobTitle)
      formData.append("company", company)

      const response = await fetch("/api/tailor", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to tailor resume")
      }

      const data = await response.json()
      setTailoredResume(data.tailoredResume)
      setMatchScore(data.matchScore)
      setActiveTab("preview")
      
      toast({
        title: "Resume tailored successfully!",
        description: `Match score: ${data.matchScore}%`,
      })
    } catch (error) {
      console.error("Error tailoring resume:", error)
      toast({
        title: "Error",
        description: "Failed to tailor resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Resume Tailor</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {session?.user?.name || "User"}
            </span>
            <Button variant="outline" size="sm" onClick={() => router.push("/api/auth/signout")}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Resume Dashboard</h1>
          <p className="text-muted-foreground">
            Upload your resume and job description to get a tailored version
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Resume Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                  <CardDescription>
                    Upload your master resume in PDF format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    accept=".pdf"
                    onFileSelect={handleResumeUpload}
                    className="h-40"
                  />
                  {uploadedResume && (
                    <div className="mt-4 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{uploadedResume.name}</span>
                      <Badge variant="secondary">
                        {(uploadedResume.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Provide information about the position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>
                  Paste the full job description here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleTailorResume}
                disabled={isProcessing || !uploadedResume || !jobDescription}
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tailor Resume
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {tailoredResume ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Tailored Resume</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span className="text-sm font-medium">Match Score:</span>
                          <Badge variant={matchScore >= 80 ? "default" : matchScore >= 60 ? "secondary" : "destructive"}>
                            {matchScore}%
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResumePreview resume={tailoredResume} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No tailored resume yet. Upload a resume and job description to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resume History</CardTitle>
                <CardDescription>
                  View and download your previously tailored resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="mx-auto mb-4 h-12 w-12" />
                  <p>No resume history yet. Start tailoring resumes to see them here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
