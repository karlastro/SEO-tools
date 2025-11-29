import React, { useState } from 'react';
import Hero from './components/Hero';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzePlugins } from './services/geminiService';
import { AnalysisResult } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (list: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysisData = await analyzePlugins(list);
      setResult(analysisData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">WP Plugin Auditor</span>
            </div>
            <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-xs font-medium text-slate-500 hover:text-blue-600">
                Powered by Gemini
            </a>
        </div>
      </nav>

      <main>
        {error && (
            <div className="max-w-4xl mx-auto mt-6 px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            </div>
        )}

        {!result ? (
          <Hero onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        ) : (
          <AnalysisDashboard result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>
                <strong>Disclaimer:</strong> This tool uses AI to estimate performance impact based on general knowledge of plugin architectures. 
                Always test changes in a staging environment.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;