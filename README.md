# AI Resume Tailor

## 🎯 Overview

AI Resume Tailor is a powerful web application that automatically customizes your resume for specific job postings using advanced AI. Simply upload your master resume and a job description, and get a perfectly tailored resume that highlights your most relevant experience.

## ✨ Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 to analyze job descriptions and match your skills
- **Smart Keyword Optimization**: Automatically incorporates relevant keywords from job postings
- **Multiple Resume Formats**: Support for PDF upload/download and live preview
- **Resume History**: Save and manage multiple versions of your resume
- **ATS Optimization**: Ensures your resume passes Applicant Tracking Systems
- **Real-time Preview**: See changes as the AI tailors your resume
- **Secure Authentication**: Protected user accounts with NextAuth.js
- **Modern UI**: Beautiful, responsive design with dark mode support

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **AI**: OpenAI GPT-4 API
- **Authentication**: NextAuth.js
- **File Processing**: PDF-parse, jsPDF
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- OpenAI API key
- GitHub OAuth app (for authentication)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rblake2320/ai-resume-tailor.git
   cd ai-resume-tailor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Usage

1. **Sign Up/Login**: Create an account using GitHub authentication
2. **Upload Master Resume**: Upload your comprehensive resume as a PDF
3. **Add Job Description**: Paste or upload the job posting you're applying for
4. **AI Analysis**: Click "Tailor Resume" to let AI optimize your resume
5. **Review & Edit**: Review the tailored resume and make manual adjustments
6. **Download**: Export your tailored resume as a PDF

## 🗂️ Project Structure

```
ai-resume-tailor/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── resume/           # Resume-specific components
├── lib/                   # Utility functions
│   ├── ai/               # AI integration
│   ├── pdf/              # PDF processing
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
├── public/               # Static assets
└── types/                # TypeScript types
```

## 🔧 Configuration

### AI Model Settings

Edit `lib/ai/config.ts` to adjust AI behavior:

```typescript
export const AI_CONFIG = {
  model: "gpt-4-turbo-preview",
  temperature: 0.7,
  maxTokens: 2000,
};
```

### Resume Templates

Customize resume templates in `components/resume/templates/`.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Vercel](https://vercel.com) for hosting
- [Shadcn/ui](https://ui.shadcn.com) for UI components
- [Supabase](https://supabase.com) for database hosting

## 📧 Contact

Randy Blake - [@rblake2320](https://github.com/rblake2320)

Project Link: [https://github.com/rblake2320/ai-resume-tailor](https://github.com/rblake2320/ai-resume-tailor)
