import React, { useState } from 'react';
import { Play, FileDown, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import AgentStatus from './components/AgentStatus';
import ScoreDashboard from './components/ScoreDashboard';
import IssuesList from './components/IssuesList';
import RefactoredCode from './components/RefactoredCode';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { useToast } from './components/Toast';

// --- History Helpers ---
const HISTORY_KEY = 'codedoctor_history';
const MAX_HISTORY = 5;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function ReviewPage() {
  const { showToast } = useToast();
  const [code, setCode] = useState('// Paste code here\nfunction processPayment(req) {\n  let id = req.id;\n  db.query("SELECT * FROM users WHERE id=" + id);\n}');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const [agentStatuses, setAgentStatuses] = useState({
    auditor: 'pending', style: 'pending', security: 'pending', performance: 'pending', refactor: 'pending'
  });

  const [mockResults, setMockResults] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [showHistory, setShowHistory] = useState(false);

  const resetState = () => {
    setIsAnalyzing(false);
    setIsDone(false);
    setMockResults(null);
    setAgentStatuses({
      auditor: 'pending', style: 'pending', security: 'pending', performance: 'pending', refactor: 'pending'
    });
  };

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
              // Save to history
              const entry = { code: code.substring(0, 200), score: data.data.score, language, timestamp: Date.now(), issueCount: data.data.issues?.length || 0 };
              saveToHistory(entry);
              setHistory(loadHistory());
              showToast('Roast complete! Your code has been judged.', 'success');
            } else if (data.type === 'error') {
              console.error('Stream Error:', data.message);
              showToast(`Agent error: ${data.message}`, 'error');
            }
          } catch (e) {
            console.error('Error parsing chunk', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to trigger analysis stream', error);
      showToast('Backend offline — using demo mode. Your code is still trash though.', 'info');

      // Fallback Mock locally just in case backend isn't running
      setTimeout(() => setAgentStatuses(p => ({ ...p, auditor: 'completed' })), 1000);
      setTimeout(() => setAgentStatuses(p => ({ ...p, security: 'completed' })), 1500);
      setTimeout(() => setAgentStatuses(p => ({ ...p, style: 'completed' })), 1800);
      setTimeout(() => setAgentStatuses(p => ({ ...p, performance: 'completed' })), 2000);
      setTimeout(() => {
        setAgentStatuses(p => ({ ...p, refactor: 'completed' }));
        setIsAnalyzing(false);
        setIsDone(true);
        const results = {
          score: 74,
          breakdown: { bugs: 2, security: 1, style: 3, performance: 1 },
          issues: [
            { severity: 'critical', category: 'security', line: 4, message: 'SQL Injection Vulnerability detected. Using untrusted input directly in network connection string.', suggestion: 'Use parameterized execution blocks.' },
            { severity: 'warning', category: 'style', line: 3, message: 'Consider upgrading variables from let to const.', suggestion: 'Replace `let id` with `const id` to strictly type the scope blocks.' }
          ],
          refactoredCode: '// Paste code here\nfunction processPayment(req) {\n  const id = req.id;\n  db.query("SELECT * FROM users WHERE id=$1", [id]);\n}'
        };
        setMockResults(results);
        const entry = { code: code.substring(0, 200), score: results.score, language, timestamp: Date.now(), issueCount: results.issues.length };
        saveToHistory(entry);
        setHistory(loadHistory());
        showToast('Roast complete (demo mode)!', 'success');
      }, 3000);
    }
  };

  const exportMarkdown = () => {
    if (!mockResults) return;
    const md = `# Code Doctor Roast Report\n\n## Overall Score: ${mockResults.score}/100\n\n` +
      `### Breakdown\n- Bugs: ${mockResults.breakdown.bugs}\n- Security: ${mockResults.breakdown.security}\n` +
      `- Style: ${mockResults.breakdown.style}\n- Performance: ${mockResults.breakdown.performance}\n\n` +
      `## Issues Found:\n${mockResults.issues.map(i => `- [${(i.severity || 'info').toUpperCase()}] ${i.category}: ${i.message} (Line ${i.line || 'N/A'})\n  *Suggestion: ${i.suggestion}*`).join('\n\n')}\n\n` +
      `## Refactored Code:\n\`\`\`${language}\n${mockResults.refactoredCode}\n\`\`\`\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CodeDoctor_Roast_${new Date().getTime()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report exported!', 'success');
  };

  return (
    <div className="min-h-screen text-black bg-[#fffceb] flex flex-col items-center relative pb-20 pt-28">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Editor & Controls */}
        <div className="flex flex-col gap-6 h-[800px]">
          <div className="flex items-center justify-between p-6 bg-[var(--accent-amber)] border-4 border-black shadow-[6px_6px_0px_#000]">
            <div>
              <h2 className="text-2xl font-black uppercase mb-1">Garbage Bin</h2>
              <p className="text-sm font-bold opacity-80">Paste your code so our agents can judge you.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* History Toggle */}
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-1 px-4 py-3 border-4 border-black font-black uppercase text-sm bg-white text-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-[0_0_0_#000] transition-all"
                >
                  📜 {showHistory ? 'Hide' : 'History'}
                </button>
              )}
              {/* Reset Button */}
              {isDone && (
                <button
                  onClick={resetState}
                  className="flex items-center gap-2 px-4 py-3 border-4 border-black font-black uppercase text-sm bg-white text-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-[0_0_0_#000] transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> New Roast
                </button>
              )}
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase transition-all shadow-[4px_4px_0px_#000] focus:outline-none focus:ring-4 focus:ring-black ${isAnalyzing ? 'bg-zinc-400 text-black cursor-not-allowed shadow-[0_0_0_#000] translate-y-1 translate-x-1' : 'bg-white text-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-[0_0_0_#000]'
                  }`}
              >
                {isAnalyzing ? (
                  <div className="w-4 h-4 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
                ) : (
                  <Play className="w-4 h-4" fill="currentColor" />
                )}
                {isAnalyzing ? 'ROASTING...' : 'ROAST THIS TRASH'}
              </button>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && history.length > 0 && (
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-4 max-h-48 overflow-y-auto">
              <h4 className="font-black uppercase text-sm text-black mb-3 bg-[var(--accent-cyan)] inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">Recent Roasts</h4>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border-2 border-black bg-zinc-50 hover:bg-[var(--accent-amber)] transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black bg-white border border-black px-2 py-0.5">{h.score}/100</span>
                      <span className="text-xs font-bold text-black truncate max-w-[200px]">{h.code}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-black/60">
                      <span>{h.issueCount} issues</span>
                      <span className="font-mono">{new Date(h.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {!isDone && !isAnalyzing && (
            <div className="bg-white border-4 border-dashed border-black shadow-[6px_6px_0px_#000] p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="text-6xl">🔥</div>
              <h3 className="text-2xl font-black uppercase text-black">Ready to Roast</h3>
              <p className="text-base font-bold text-black/70 max-w-md">
                Paste your code in the editor, upload a file, or just hit "Roast This Trash" and watch our agents tear it apart.
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm font-bold text-black/50 bg-zinc-100 border-2 border-black px-4 py-2">
                <Sparkles className="w-4 h-4" /> Supports 12 languages · Drag & drop files
              </div>
            </div>
          )}

          {isDone && mockResults && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between bg-[var(--accent-pink)] p-4 border-4 border-black shadow-[6px_6px_0px_#000]">
                <span className="text-lg font-black text-black uppercase tracking-widest">Roast Complete</span>
                <button onClick={exportMarkdown} className="flex items-center gap-2 text-sm font-bold text-black border-2 border-dashed border-black px-3 py-1 bg-white hover:bg-[var(--accent-cyan)] transition-colors">
                  <FileDown className="w-4 h-4" /> Export Insults
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

export default function App() {
  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-[#fffceb] overflow-hidden pointer-events-none selection:bg-[var(--accent-pink)]">
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </>
  );
}
