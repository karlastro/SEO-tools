import React, { useState } from 'react';
import { Zap, Activity, Layers } from 'lucide-react';

interface HeroProps {
  onAnalyze: (list: string) => void;
  isAnalyzing: boolean;
}

const Hero: React.FC<HeroProps> = ({ onAnalyze, isAnalyzing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input);
    }
  };

  const handleSample = () => {
    const sample = `Elementor
WooCommerce
Jetpack
Contact Form 7
WPForms
Slider Revolution
Yoast SEO
All in One SEO
Really Simple SSL
W3 Total Cache
Autoptimize
Wordfence Security
`;
    setInput(sample);
  };

  return (
    <div className="bg-white border-b border-slate-200 pb-12 pt-10 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Audit Your <span className="text-blue-600">Plugin Stack</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Identify slow plugins, find duplicates, and get recommendations for lighter alternatives or manual code replacements to speed up your WordPress site.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-10">
        <form onSubmit={handleSubmit} className="relative">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-blue-600">
            <textarea
              rows={6}
              name="pluginList"
              id="pluginList"
              className="block w-full resize-none border-0 bg-transparent py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6 font-mono"
              placeholder="Paste your list of active plugins here... (e.g. Elementor, Yoast, Jetpack)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSample}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
              disabled={isAnalyzing}
            >
              Try with a sample list
            </button>
            <button
              type="submit"
              disabled={isAnalyzing || !input.trim()}
              className={`inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isAnalyzing ? 'animate-pulse' : ''}`}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze Performance
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
          <div className="h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Performance Impact</h3>
          <p className="text-sm text-slate-500 text-center mt-1">Find out which plugins are adding seconds to your load time.</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
          <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Find Duplicates</h3>
          <p className="text-sm text-slate-500 text-center mt-1">Detect redundant features (e.g., 3 SEO plugins installed).</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
          <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Smart Alternatives</h3>
          <p className="text-sm text-slate-500 text-center mt-1">Get suggestions for lighter plugins or simple code snippets.</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;