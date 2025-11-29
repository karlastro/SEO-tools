import React from 'react';
import { AnalysisResult, ImpactLevel, PluginAnalysis, RecommendationType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { AlertTriangle, CheckCircle, PackageMinus, Code, ArrowRight } from 'lucide-react';
import PluginCard from './PluginCard';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  const highImpactPlugins = result.plugins.filter(p => p.impactLevel === ImpactLevel.HIGH);
  const duplicates = Object.entries(result.redundancyGroups);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-600';
  };

  const chartData = result.plugins.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    bloat: p.bloatScore,
    full: p // pass full object for tooltip customization if needed
  })).sort((a, b) => b.bloat - a.bloat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      {/* Header Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
          <p className="text-slate-500 mt-1">{result.summary}</p>
        </div>
        <div className="flex items-center space-x-8">
            <div className="text-center">
                <p className="text-sm font-medium text-slate-500">Est. Impact</p>
                <p className="text-3xl font-bold text-red-500">{result.estimatedLoadTimeImpact}</p>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-slate-500">Health Score</p>
                <p className={`text-5xl font-extrabold ${getHealthColor(result.overallHealthScore)}`}>
                    {result.overallHealthScore}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts and High Impact Alerts */}
        <div className="space-y-8 lg:col-span-2">
            
           {/* Chart */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Bloat Score by Plugin</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" domain={[0, 10]} hide />
                            <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="bloat" radius={[0, 4, 4, 0]} barSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.bloat > 7 ? '#ef4444' : entry.bloat > 4 ? '#f59e0b' : '#22c55e'} />
                                ))}
                            </Bar>
                            <ReferenceLine x={5} stroke="#cbd5e1" strokeDasharray="3 3" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 mt-2 px-4">
                    <span>Lightweight</span>
                    <span>Heavy / Bloated</span>
                </div>
           </div>

           {/* All Plugins List */}
           <div className="space-y-4">
               <div className="flex items-center justify-between">
                   <h3 className="text-lg font-semibold text-slate-900">Detailed Breakdown</h3>
                   <span className="text-sm text-slate-500">{result.plugins.length} plugins analyzed</span>
               </div>
               {result.plugins.map((plugin, idx) => (
                   <PluginCard key={idx} plugin={plugin} />
               ))}
           </div>
        </div>

        {/* Right Column: Recommendations & Redundancy */}
        <div className="space-y-8">
            
            {/* Redundancy Alert */}
            {duplicates.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-semibold text-amber-800">Duplicate Functionality Detected</h3>
                            <p className="text-xs text-amber-700 mt-1 mb-3">
                                You have multiple plugins doing the same thing. This causes conflicts and slows down your site.
                            </p>
                            <div className="space-y-3">
                                {duplicates.map(([group, names]) => (
                                    <div key={group} className="bg-white/60 rounded p-2">
                                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">{group}</span>
                                        <div className="mt-1 text-sm text-amber-800">
                                            {(names as string[]).join(' + ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions / Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Recommendations</h3>
                <div className="space-y-4">
                    {result.plugins
                        .filter(p => p.recommendation !== RecommendationType.KEEP)
                        .slice(0, 5) // Top 5 actions
                        .map((p, idx) => (
                            <div key={idx} className="flex flex-col pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-slate-900">{p.name}</span>
                                    {p.recommendation === RecommendationType.DELETE && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Delete</span>}
                                    {p.recommendation === RecommendationType.REPLACE_PLUGIN && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Switch</span>}
                                    {p.recommendation === RecommendationType.REPLACE_MANUAL && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Code It</span>}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{p.reasonForImpact}</p>
                                
                                {p.alternative && (
                                    <div className="mt-2 text-sm bg-slate-50 p-2 rounded flex items-start gap-2">
                                        {p.alternative.type === 'code' ? <Code className="w-4 h-4 text-purple-600 mt-0.5" /> : <PackageMinus className="w-4 h-4 text-blue-600 mt-0.5" />}
                                        <div className="text-slate-700">
                                            <span className="font-semibold block text-xs uppercase tracking-wide text-slate-500">Try Instead</span>
                                            {p.alternative.name}
                                            <p className="text-xs text-slate-500 mt-0.5">{p.alternative.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                    ))}
                    {result.plugins.every(p => p.recommendation === RecommendationType.KEEP) && (
                        <div className="text-center py-6">
                            <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                            <p className="text-slate-600">Great job! Your plugin stack looks optimized.</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={onReset}
                className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
            >
                Analyze New List
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;