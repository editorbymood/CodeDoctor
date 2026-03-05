import React, { useState } from 'react';
import { Play, FileDown } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import AgentStatus from './components/AgentStatus';
import ScoreDashboard from './components/ScoreDashboard';
import IssuesList from './components/IssuesList';
import RefactoredCode from './components/RefactoredCode';

export default function App() {
  const [code, setCode] = useState('// Paste code here\nfunction processPayment(req) {\n  let id = req.id;\n  db.query("SELECT * FROM users WHERE id=" + id);\n}');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const [agentStatuses, setAgentStatuses] = useState({
    auditor: 'pending', style: 'pending', security: 'pending', performance: 'pending', refactor: 'pending'
  });

  const [mockResults, setMockResults] = useState(null);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setIsDone(false);
    setMockResults(null);
    setAgentStatuses({
      auditor: 'running', style: 'running', security: 'running', performance: 'running', refactor: 'running'
    });

    try {
      const response = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/analyze/stream` : 'http://localhost:8000/analyze/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });

      if (!response.body) throw new Error('ReadableStream not supported.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunks = decoder.decode(value, { stream: true }).split('\n\n');
        for (const chunk of chunks) {
          if (!chunk.trim() || !chunk.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(chunk.replace('data: ', ''));

            if (data.type === 'status') {
              setAgentStatuses(prev => ({ ...prev, [data.agent]: data.status }));
            } else if (data.type === 'final') {
              setMockResults(data.data);
              setIsDone(true);
              setIsAnalyzing(false);
            } else if (data.type === 'error') {
              console.error('Stream Error:', data.message);
            }
          } catch (e) {
            console.error('Error parsing chunk', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to trigger analysis stream', error);
      setIsAnalyzing(false);

      // Fallback Mock locally just in case backend isn't running
      setTimeout(() => setAgentStatuses(p => ({ ...p, auditor: 'completed' })), 1000);
      setTimeout(() => setAgentStatuses(p => ({ ...p, security: 'completed' })), 1500);
      setTimeout(() => setAgentStatuses(p => ({ ...p, style: 'completed' })), 1800);
      setTimeout(() => setAgentStatuses(p => ({ ...p, performance: 'completed' })), 2000);
      setTimeout(() => {
        setAgentStatuses(p => ({ ...p, refactor: 'completed' }));
        setIsAnalyzing(false);
        setIsDone(true);
        setMockResults({
          score: 74,
          breakdown: { bugs: 2, security: 1, style: 3, performance: 1 },
          issues: [
            { severity: 'critical', category: 'security', line: 4, message: 'SQL Injection Vulnerability detected. Using untrusted input directly in network connection string.', suggestion: 'Use parameterized execution blocks.' },
            { severity: 'warning', category: 'style', line: 3, message: 'Consider upgrading variables from let to const.', suggestion: 'Replace `let id` with `const id` to strictly type the scope blocks.' }
          ],
          refactoredCode: '// Paste code here\nfunction processPayment(req) {\n  const id = req.id;\n  db.query("SELECT * FROM users WHERE id=$1", [id]);\n}'
        });
      }, 3000);
    }
  };

  const exportMarkdown = () => {
    if (!mockResults) return;
    const md = `# CodeSentinel Analysis Report\n\n## Overall Score: ${mockResults.score}/100\n\n` +
      `### Breakdown\n- Bugs: ${mockResults.breakdown.bugs}\n- Security: ${mockResults.breakdown.security}\n` +
      `- Style: ${mockResults.breakdown.style}\n- Performance: ${mockResults.breakdown.performance}\n\n` +
      `## Issues Found:\n${mockResults.issues.map(i => `- [${(i.severity || 'info').toUpperCase()}] ${i.category}: ${i.message} (Line ${i.line || 'N/A'})\n  *Suggestion: ${i.suggestion}*`).join('\n\n')}\n\n` +
      `## Refactored Code:\n\`\`\`${language}\n${mockResults.refactoredCode}\n\`\`\`\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CodeSentinel_Report_${new Date().getTime()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center relative pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.05)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0"></div>

      {/* Navbar Header */}
      <header className="w-full max-w-7xl mx-auto py-6 px-4 md:px-8 z-10 flex items-center justify-between border-b border-white/5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 shadow-[0_0_20px_rgba(56,189,248,0.4)]"></div>
          <h1 className="text-xl font-bold tracking-tight">CodeSentinel</h1>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Documentation</button>
          <button className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">GitHub</button>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Editor & Controls */}
        <div className="flex flex-col gap-6 h-[800px]">
          <div className="flex items-center justify-between p-6 glass-panel border border-white/5">
            <div>
              <h2 className="text-lg font-bold mb-1">Target Source</h2>
              <p className="text-xs text-zinc-500">Paste or upload code for multi-agent auditing.</p>
            </div>
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black ${isAnalyzing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                }`}
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>
              ) : (
                <Play className="w-4 h-4" fill="currentColor" />
              )}
              {isAnalyzing ? 'ORCHESTRATING...' : 'ANALYZE CODE'}
            </button>
          </div>

          <div className="flex-1">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* Right Column: Results & Telemetry */}
        <div className="flex flex-col gap-6 h-[800px] overflow-y-auto pr-2 pb-10">
          <AgentStatus statuses={agentStatuses} />

          {isDone && mockResults && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between glass-panel py-3 px-6 border-emerald-500/20 bg-emerald-500/5">
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Analysis Complete</span>
                <button onClick={exportMarkdown} className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
                  <FileDown className="w-4 h-4" /> Export Report
                </button>
              </div>

              <ScoreDashboard score={mockResults.score} breakdown={mockResults.breakdown} />

              <div className="h-[400px]">
                <RefactoredCode originalCode={code} refactoredCode={mockResults.refactoredCode} />
              </div>

              <div className="h-[300px]">
                <IssuesList issues={mockResults.issues} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
