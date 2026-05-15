import { useState, useEffect } from 'react';
import { Plus, TrendingDown, Trash2 } from 'lucide-react';
import type { AnalysisResult } from './types';

interface Agent {
  id: string;
  name: string;
  inputTokens: number;
  outputTokens: number;
  processingTime: number;
}

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Code Review Agent', inputTokens: 1500, outputTokens: 800, processingTime: 4.0 },
    { id: '2', name: 'Text Summarization', inputTokens: 2000, outputTokens: 300, processingTime: 3.0 },
    { id: '3', name: 'Image Analysis', inputTokens: 200, outputTokens: 400, processingTime: 2.5 },
  ]);

  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [dailyRequests, setDailyRequests] = useState(5000);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');

  // Real-time analysis - updates whenever inputs change
  useEffect(() => {
    const analyzeRealTime = async () => {
      setLoading(true);
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';
        const res = await fetch(`${baseUrl}/api/analyze-cost`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent_type: 'code-review',
            daily_requests: dailyRequests,
            llm_provider: 'claude-3.5',
            deployment_region: 'us',
            custom_input_tokens: selectedAgent.inputTokens,
            custom_output_tokens: selectedAgent.outputTokens,
            custom_processing_time: selectedAgent.processingTime,
          }),
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error:', err);
      }
      setLoading(false);
    };

    // Debounce the analysis
    const timer = setTimeout(analyzeRealTime, 300);
    return () => clearTimeout(timer);
  }, [selectedAgent, dailyRequests]);

  const addAgent = () => {
    if (newAgentName.trim()) {
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: newAgentName,
        inputTokens: 1500,
        outputTokens: 500,
        processingTime: 3.0,
      };
      setAgents([...agents, newAgent]);
      setSelectedAgent(newAgent);
      setNewAgentName('');
    }
  };

  const updateAgent = (agent: Agent, updates: Partial<Agent>) => {
    const updated = { ...agent, ...updates };
    setAgents(agents.map(a => a.id === agent.id ? updated : a));
    if (selectedAgent.id === agent.id) {
      setSelectedAgent(updated);
    }
  };

  const deleteAgent = (agentId: string) => {
    const remaining = agents.filter(a => a.id !== agentId);
    if (remaining.length > 0) {
      setAgents(remaining);
      if (selectedAgent.id === agentId) {
        setSelectedAgent(remaining[0]);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-black mb-2 text-slate-900">AI Agent Cost Analyzer</h1>
          <p className="text-slate-600">See why CreateOS is the fastest, cheapest way to ship AI agents</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Library */}
            <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600">Agent Library</h2>
                <Plus size={16} className="text-blue-600 cursor-pointer hover:text-blue-700" />
              </div>

              <div className="space-y-2 mb-4">
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all group relative ${
                      selectedAgent.id === agent.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 text-slate-900'
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{agent.name}</div>
                        <div className={`text-xs mt-1 ${selectedAgent.id === agent.id ? 'text-blue-100' : 'text-slate-600'}`}>
                          {agent.inputTokens} in / {agent.outputTokens} out
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAgent(agent.id);
                        }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          selectedAgent.id === agent.id ? 'text-blue-100 hover:text-red-300' : 'text-slate-400 hover:text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Agent Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New agent name"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAgent()}
                  className="flex-1 bg-white border border-blue-300 rounded px-2 py-1 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addAgent}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Agent Configuration */}
            <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 mb-4">Configure {selectedAgent.name}</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Input Tokens</label>
                  <input
                    type="number"
                    value={selectedAgent.inputTokens}
                    onChange={(e) => updateAgent(selectedAgent, { inputTokens: parseInt(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Output Tokens</label>
                  <input
                    type="number"
                    value={selectedAgent.outputTokens}
                    onChange={(e) => updateAgent(selectedAgent, { outputTokens: parseInt(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Processing Time (seconds)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedAgent.processingTime}
                    onChange={(e) => updateAgent(selectedAgent, { processingTime: parseFloat(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Daily Requests */}
            <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-sm">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-600 block mb-4">Daily Requests</label>
              <input
                type="range"
                min="100"
                max="1000000"
                step="100"
                value={dailyRequests}
                onChange={(e) => setDailyRequests(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="text-3xl font-black text-blue-600 font-mono mt-3">
                {dailyRequests.toLocaleString()}
              </div>
              <input
                type="number"
                min="100"
                max="1000000"
                value={dailyRequests}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 100 && val <= 1000000) {
                    setDailyRequests(val);
                  }
                }}
                className="w-full bg-blue-50 border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mt-3"
              />
            </div>

            {/* Live Analysis Status */}
            {loading && (
              <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg text-xs text-blue-700 text-center">
                ⚡ Analyzing in real-time...
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="flex items-center justify-center h-96 gap-4">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-slate-400">Calculating optimal deployment...</p>
              </div>
            )}

            {data && !loading && (
              <div className="space-y-6">
                {/* Recommendation Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Recommended Platform</h3>
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold">✓ BEST</span>
                  </div>
                  <div className="text-3xl font-black text-white mb-2">
                    {data.recommended_platform.platform_name}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-blue-100 uppercase tracking-widest">Monthly Cost</div>
                      <div className="text-2xl font-black text-white font-mono">
                        ${data.recommended_platform.total_monthly_cost.toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-100 uppercase tracking-widest">Savings</div>
                      <div className="text-2xl font-black text-blue-100 font-mono">
                        ${data.recommended_platform.savings_vs_worst.toFixed(0)}/mo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Comparison */}
                <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 mb-4">Platform Comparison</h3>
                  <div className="space-y-3">
                    {Object.entries(data.platform_comparison)
                      .sort(([, a], [, b]) => a.total_monthly - b.total_monthly)
                      .map(([key, platform]) => {
                        const isRecommended = key === data.recommended_platform.platform_key;
                        const maxCost = Math.max(...Object.values(data.platform_comparison).map(p => p.total_monthly));
                        const barWidth = (platform.total_monthly / maxCost) * 100;

                        return (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-sm font-semibold ${isRecommended ? 'text-blue-600' : 'text-slate-700'}`}>
                                {platform.platform_name}
                              </span>
                              <span className="text-sm font-mono text-slate-600">
                                ${(data.llm_cost_monthly.total + platform.total_monthly).toFixed(0)}
                              </span>
                            </div>
                            <div className="h-2 bg-blue-100 rounded overflow-hidden">
                              <div
                                className={`h-full transition-all ${isRecommended ? 'bg-blue-600' : 'bg-blue-300'}`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 mb-4">Cost Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Compute Tiers</span>
                      <span className="font-mono text-slate-900">${data.recommended_platform.compute_cost_monthly.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Platform Base</span>
                      <span className="font-mono text-slate-900">${data.recommended_platform.platform_base_cost.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-100 pt-2 mt-2 flex justify-between font-bold">
                      <span className="text-slate-900">Total</span>
                      <span className="text-blue-600">${data.recommended_platform.total_monthly_cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!data && !loading && (
              <div className="h-96 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center bg-blue-50">
                <div className="text-center">
                  <TrendingDown size={32} className="mx-auto mb-4 text-blue-400" />
                  <p className="text-slate-600 text-sm">Configure your agent and results will update in real-time</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}