import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalysisResult } from '../types';

interface PlatformComparisonProps {
  data: AnalysisResult;
  llmCost: number;
}

export default function PlatformComparison({ data, llmCost }: PlatformComparisonProps) {
  const chartData = Object.entries(data.platform_comparison).map(([key, platform]) => ({
    name: platform.platform_name.split(' ')[0],
    fullName: platform.platform_name,
    total: llmCost + platform.total_monthly,
    compute: platform.total_monthly,
    nodes: platform.nodes,
    isBest: key === data.recommended_platform.platform_key,
  })).sort((a, b) => a.total - b.total);

  const bestPlatform = chartData.find(p => p.isBest);
  const worstPlatform = chartData[chartData.length - 1];

  return (
    <div className="space-y-6">
      {/* Platform Comparison Chart */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Platform Cost Comparison (Monthly)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value) => `$${(value as number).toFixed(2)}`}
              labelFormatter={(label) => `${label} Platform`}
            />
            <Bar
              dataKey="total"
              fill="#3b82f6"
              name="Total Cost"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Details Table */}
      <div className="grid grid-cols-1 gap-4">
        {chartData.map((platform) => (
          <div
            key={platform.fullName}
            className={`border rounded-2xl p-6 transition-all ${
              platform.isBest
                ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-bold text-slate-100">{platform.fullName}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {platform.nodes} node{platform.nodes !== 1 ? 's' : ''} • {platform.isBest ? '✓ BEST' : `+${((platform.total / (bestPlatform?.total || 1) - 1) * 100).toFixed(0)}%`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black font-mono text-blue-400">
                  ${platform.total.toFixed(0)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  monthly
                </div>
              </div>
            </div>

            {platform.isBest && (
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                💰 Save ${(worstPlatform.total - platform.total).toFixed(2)}/month vs worst option
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Efficiency Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">
              Cost per Request
            </div>
            <div className="text-2xl font-black font-mono text-blue-400">
              ${(bestPlatform ? (bestPlatform.total + llmCost) / (data.config.daily_requests * 30) : 0).toFixed(4)}
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">
              Efficiency Rating
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {data.recommended_platform.efficiency_rating}/10 ⭐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
