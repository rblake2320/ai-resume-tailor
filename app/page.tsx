import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Sparkles, Download, Shield, Clock, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Resume Tailor</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/auth/signin">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="mr-1 h-3 w-3" />
          Powered by GPT-4
        </Badge>
        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Tailor Your Resume for
          <span className="gradient-text"> Every Job</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Stop sending generic resumes. Our AI analyzes job descriptions and customizes your resume 
          to highlight the most relevant experience, increasing your chances of landing interviews.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg">
              Start Free Trial
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">Why Choose AI Resume Tailor?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Target className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Smart Keyword Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI identifies and incorporates relevant keywords from job postings, 
                ensuring your resume passes ATS filters.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Clock className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Save Hours of Work</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create tailored resumes in minutes instead of hours. 
                Apply to more jobs with perfectly customized resumes.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>ATS Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Every resume is formatted to pass Applicant Tracking Systems, 
                increasing your chances of human review.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <FileText className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Multiple Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Export your tailored resume as PDF, Word, or plain text. 
                Perfect for any application requirement.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Sparkles className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                GPT-4 analyzes job requirements and matches them with your experience, 
                creating compelling narratives.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Download className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Instant Download</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Download your tailored resume immediately. 
                No waiting, no manual review process.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
        <Card className="mx-auto max-w-2xl bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Land More Interviews?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Join thousands of job seekers who are getting more responses with tailored resumes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary">
                Start Your Free Trial
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/60">
              No credit card required • 5 free tailored resumes
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Resume Tailor</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AI Resume Tailor. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="text-sm hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
