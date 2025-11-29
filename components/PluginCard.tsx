import React from 'react';
import { PluginAnalysis, ImpactLevel, RecommendationType } from '../types';
import { AlertCircle, Check, Info, Zap, Trash2, RefreshCw, Code2 } from 'lucide-react';

interface PluginCardProps {
  plugin: PluginAnalysis;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin }) => {
  const isHighImpact = plugin.impactLevel === ImpactLevel.HIGH;
  const isMediumImpact = plugin.impactLevel === ImpactLevel.MEDIUM;

  const getImpactColor = () => {
    if (isHighImpact) return 'bg-red-50 border-red-200';
    if (isMediumImpact) return 'bg-amber-50 border-amber-200';
    return 'bg-white border-slate-200';
  };

  const getImpactBadge = () => {
    if (isHighImpact) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Impact</span>;
    if (isMediumImpact) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Medium Impact</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low Impact</span>;
  };

  const getActionIcon = () => {
    switch (plugin.recommendation) {
        case RecommendationType.DELETE: return <Trash2 className="w-4 h-4 mr-1" />;
        case RecommendationType.REPLACE_PLUGIN: return <RefreshCw className="w-4 h-4 mr-1" />;
        case RecommendationType.REPLACE_MANUAL: return <Code2 className="w-4 h-4 mr-1" />;
        default: return <Check className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className={`rounded-lg border p-5 transition-all ${getImpactColor()}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-lg font-bold text-slate-900">{plugin.name}</h4>
            {getImpactBadge()}
            {plugin.category && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{plugin.category}</span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">{plugin.functionality}</p>
          
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {plugin.reasonForImpact && (
                <span className="flex items-center text-slate-500 bg-slate-100/50 px-2 py-1 rounded border border-slate-200">
                    <Info className="w-3 h-3 mr-1" />
                    {plugin.reasonForImpact}
                </span>
            )}
             <span className="flex items-center text-slate-500 bg-slate-100/50 px-2 py-1 rounded border border-slate-200">
                    <Zap className="w-3 h-3 mr-1" />
                    Bloat Score: {plugin.bloatScore}/10
            </span>
          </div>
        </div>
      </div>

      {plugin.recommendation !== RecommendationType.KEEP && (
        <div className="mt-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${plugin.recommendation === RecommendationType.DELETE ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {getActionIcon()}
                </div>
                <div>
                    <h5 className="text-sm font-semibold text-slate-900 flex items-center">
                        Recommendation: {plugin.recommendation}
                    </h5>
                    {plugin.alternative && (
                        <div className="mt-1 text-sm text-slate-600">
                            Try <span className="font-semibold text-slate-800">{plugin.alternative.name}</span>: {plugin.alternative.description}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PluginCard;