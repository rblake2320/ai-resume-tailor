import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "AI Resume Tailor - Customize Your Resume for Any Job",
  description: "AI-powered resume tailoring application that customizes your resume for specific job postings. Get more interviews with perfectly matched resumes.",
  keywords: "resume, AI, job application, career, ATS, resume builder",
  authors: [{ name: "Randy Blake" }],
  openGraph: {
    title: "AI Resume Tailor",
    description: "Customize your resume for any job with AI",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
