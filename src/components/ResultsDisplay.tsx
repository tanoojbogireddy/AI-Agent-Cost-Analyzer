import type { AnalysisResult } from '../types';
import CostBreakdown from './CostBreakdown';
import PlatformComparison from './PlatformComparison';
import { TrendingUp } from 'lucide-react';

interface ResultsDisplayProps {
  data: AnalysisResult;
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  return (
    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-100 mb-2">
              Cost Analysis Results
            </h2>
            <p className="text-sm text-slate-400">
              {data.config.agent_name} • {data.config.llm_provider_name} • {data.config.region_name}
            </p>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500 px-4 py-2 rounded-full flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Optimized</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <CostBreakdown data={data} />

      {/* Platform Comparison */}
      <PlatformComparison data={data} llmCost={data.llm_cost_monthly.total} />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            LLM Provider Performance
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Provider</span>
              <span className="font-mono text-slate-100">{data.config.llm_provider_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Monthly Token Usage</span>
              <span className="font-mono text-slate-100">
                {(data.llm_cost_monthly.input_tokens_monthly + data.llm_cost_monthly.output_tokens_monthly).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Avg Response Time</span>
              <span className="font-mono text-slate-100">{data.agent_specs.processing_time.toFixed(2)}s</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Deployment Details
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Platform</span>
              <span className="font-mono text-blue-400 font-bold">{data.recommended_platform.platform_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Nodes</span>
              <span className="font-mono text-slate-100">{data.platform_comparison[Object.keys(data.platform_comparison).find(k => data.platform_comparison[k].platform_name === data.recommended_platform.platform_name) || ''].nodes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Region</span>
              <span className="font-mono text-slate-100">{data.config.region_name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
