import { useState } from 'react';
import { Calculator } from 'lucide-react';
import type { AgentConfig } from '../types';

interface ConfigurationPanelProps {
  onAnalyze: (config: AgentConfig) => void;
  loading: boolean;
}

const AGENT_TYPES = {
  'code-review': 'Code Review Agent',
  'text-summarization': 'Text Summarization',
  'image-analysis': 'Image Analysis',
  'data-processing': 'Data Processing',
};

const LLM_PROVIDERS = {
  'claude-3.5': 'Claude 3.5 (Anthropic)',
  'gpt-4-turbo': 'GPT-4 Turbo (OpenAI)',
  'llama-70b': 'Llama 70B (Meta)',
  'gemini-pro': 'Gemini Pro (Google)',
  'mistral-large': 'Mistral Large',
  'local-model': 'Local/Self-Hosted',
};

const REGIONS = {
  'us': 'US (Primary)',
  'eu': 'EU',
  'apac': 'Asia Pacific',
};

export default function ConfigurationPanel({ onAnalyze, loading }: ConfigurationPanelProps) {
  const [config, setConfig] = useState<AgentConfig>({
    agent_type: 'code-review',
    daily_requests: 5000,
    llm_provider: 'claude-3.5',
    deployment_region: 'us',
  });

  const [showCustomTokens, setShowCustomTokens] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleCustomTokenChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value ? parseInt(value) : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(config);
  };

  return (
    <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl h-fit sticky top-8">
      <h2 className="flex items-center gap-2 font-bold mb-8 text-slate-400 text-xs uppercase tracking-widest">
        <Calculator size={16} /> Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agent Type */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Agent Type
          </label>
          <select
            name="agent_type"
            value={config.agent_type}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
          >
            {Object.entries(AGENT_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Daily Requests */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Daily Requests
          </label>
          <input
            type="range"
            name="daily_requests"
            min="100"
            max="1000000"
            step="100"
            value={config.daily_requests}
            onChange={handleChange}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="text-3xl font-black text-blue-400 font-mono mt-3">
            {config.daily_requests.toLocaleString()}
            <span className="text-[10px] font-normal text-slate-600 uppercase tracking-widest ml-2">
              req/day
            </span>
          </div>
        </div>

        {/* LLM Provider */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            LLM Provider
          </label>
          <select
            name="llm_provider"
            value={config.llm_provider}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
          >
            {Object.entries(LLM_PROVIDERS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Deployment Region */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Deployment Region
          </label>
          <select
            name="deployment_region"
            value={config.deployment_region}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
          >
            {Object.entries(REGIONS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Custom Token Toggle */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomTokens}
              onChange={(e) => setShowCustomTokens(e.target.checked)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Custom Token Specs
            </span>
          </label>
        </div>

        {/* Custom Tokens (conditional) */}
        {showCustomTokens && (
          <div className="space-y-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <input
              type="number"
              placeholder="Input tokens"
              value={config.custom_input_tokens || ''}
              onChange={(e) => handleCustomTokenChange('custom_input_tokens', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Output tokens"
              value={config.custom_output_tokens || ''}
              onChange={(e) => handleCustomTokenChange('custom_output_tokens', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Processing time (seconds)"
              step="0.1"
              value={config.custom_processing_time || ''}
              onChange={(e) => handleCustomTokenChange('custom_processing_time', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:opacity-50 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
        >
          {loading ? 'Calculating...' : 'Calculate Costs'}
        </button>
      </form>
    </div>
  );
}
