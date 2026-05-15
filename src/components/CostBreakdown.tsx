import type { AnalysisResult } from '../types';
import { DollarSign } from 'lucide-react';

interface CostBreakdownProps {
  data: AnalysisResult;
}

export default function CostBreakdown({ data }: CostBreakdownProps) {
  const recommended = data.recommended_platform;
  const total = data.llm_cost_monthly.total + recommended.platform_total_monthly;

  return (
    <div className="space-y-6">
      {/* Cost Breakdown Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            LLM API Cost
          </div>
          <div className="text-4xl font-black font-mono text-emerald-400">
            ${data.llm_cost_monthly.total.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Input: ${data.llm_cost_monthly.input_cost.toFixed(2)} | Output: ${data.llm_cost_monthly.output_cost.toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            Compute Cost ({recommended.platform_name})
          </div>
          <div className="text-4xl font-black font-mono text-emerald-400">
            ${recommended.compute_cost_monthly.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Base: ${recommended.platform_base_cost.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Total Cost & Recommendation */}
      <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-blue-500/30 p-8 rounded-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Total Monthly Cost
            </div>
            <div className="text-5xl font-black font-mono text-blue-400">
              ${total.toFixed(2)}
            </div>
          </div>
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
            ✓ Best Option
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 mb-4">
          <DollarSign size={20} />
          <p className="text-sm font-semibold">
            Save <span className="text-emerald-300">${recommended.savings_vs_worst.toFixed(2)}/month</span> vs next best platform
          </p>
        </div>

        <div className="flex items-center gap-2 text-blue-300">
          <span className="text-xs font-bold uppercase tracking-widest">Efficiency Rating:</span>
          <span className="text-lg font-black">{recommended.efficiency_rating}/10</span>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cost Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300">Agent Type</span>
            <span className="font-mono text-slate-100">{data.config.agent_name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300">Daily Requests</span>
            <span className="font-mono text-slate-100">{data.config.daily_requests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300">Input Tokens (Monthly)</span>
            <span className="font-mono text-slate-100">{data.llm_cost_monthly.input_tokens_monthly.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300">Output Tokens (Monthly)</span>
            <span className="font-mono text-slate-100">{data.llm_cost_monthly.output_tokens_monthly.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300">Processing Time</span>
            <span className="font-mono text-slate-100">{data.agent_specs.processing_time.toFixed(1)}s</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300">Nodes Required</span>
            <span className="font-mono text-blue-400 font-bold">{recommended.platform_key === 'createos' ? 'Optimized' : 'Static'} x{data.platform_comparison[recommended.platform_key].nodes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
