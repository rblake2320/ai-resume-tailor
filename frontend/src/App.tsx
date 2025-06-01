// src/App.tsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [file, setFile] = useState<File|null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobTerm, setJobTerm] = useState<string>("software engineer");
  const [location, setLocation] = useState<string>("remote");

  const submit = async () => {
    if (!file) return;
    
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    
    try {
      const r = await fetch(`/api/tailor?term=${encodeURIComponent(jobTerm)}&loc=${encodeURIComponent(location)}`, { 
        method: "POST", 
        body: fd 
      });
      
      const data = await r.json();
      setResults(data.resumes);
    } catch (error) {
      console.error("Error tailoring resume:", error);
      alert("An error occurred while tailoring your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-5xl mx-auto space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">AI Resume Tailor</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Your Resume</label>
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={jobTerm}
              onChange={e => setJobTerm(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. Software Engineer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. Remote, New York, etc."
            />
          </div>
          
          <button 
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            onClick={submit}
            disabled={!file || loading}
          >
            {loading ? 'Tailoring Resume...' : 'Tailor My Resume'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Tailored Resumes</h2>
          
          {results.map(r => (
            <section key={r.id} className="p-6 border rounded-xl shadow bg-white">
              <h2 className="font-bold text-xl mb-2">{r.job_title} @ {r.company}</h2>
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{r.resume_md}</ReactMarkdown>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => {
                    // In a real app, this would download the resume as PDF
                    alert("In a production app, this would download the tailored resume as PDF");
                  }}
                >
                  Download PDF
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
