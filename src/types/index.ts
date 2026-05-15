export interface AgentConfig {
  agent_type: string;
  daily_requests: number;
  llm_provider: string;
  deployment_region: string;
  custom_input_tokens?: number | null;
  custom_output_tokens?: number | null;
  custom_processing_time?: number | null;
}

export interface AgentTemplate {
  name: string;
  avg_input_tokens: number;
  avg_output_tokens: number;
  processing_time: number;
  description: string;
}

export interface LLMProvider {
  name: string;
  input_cost_per_1m: number;
  output_cost_per_1m: number;
  avg_response_time: number;
}

export interface PlatformInfo {
  name: string;
  base_cost: number;
  compute_per_core_hour: number;
  bandwidth_per_gb: number;
  min_nodes: number;
  efficiency_multiplier: number;
}

export interface CostBreakdown {
  input_cost: number;
  output_cost: number;
  total: number;
  input_tokens_monthly: number;
  output_tokens_monthly: number;
}

export interface PlatformCost {
  platform_name: string;
  nodes: number;
  compute_cost_monthly: number;
  platform_base_cost: number;
  total_monthly: number;
  traffic_intensity: number;
  utilization: number;
}

export interface PlatformComparison {
  [key: string]: PlatformCost;
}

export interface RecommendedPlatform {
  platform_key: string;
  platform_name: string;
  compute_cost_monthly: number;
  platform_base_cost: number;
  platform_total_monthly: number;
  total_monthly_cost: number;
  savings_vs_worst: number;
  efficiency_rating: number;
}

export interface AnalysisResult {
  config: {
    agent_type: string;
    agent_name: string;
    daily_requests: number;
    llm_provider: string;
    llm_provider_name: string;
    deployment_region: string;
    region_name: string;
  };
  agent_specs: {
    input_tokens: number;
    output_tokens: number;
    processing_time: number;
    total_tokens_per_request: number;
  };
  llm_cost_monthly: CostBreakdown;
  platform_comparison: PlatformComparison;
  recommended_platform: RecommendedPlatform;
}

export interface AgentTemplates {
  [key: string]: AgentTemplate;
}

export interface LLMProviders {
  [key: string]: LLMProvider;
}

export interface Regions {
  [key: string]: {
    name: string;
    cost_multiplier: number;
  };
}
