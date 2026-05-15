# LLM Providers with their pricing per 1M tokens
LLM_PROVIDERS = {
    "claude-3.5": {
        "name": "Claude 3.5 (Anthropic)",
        "input_cost_per_1m": 3.00,
        "output_cost_per_1m": 15.00,
        "avg_response_time": 2.5,
    },
    "gpt-4-turbo": {
        "name": "GPT-4 Turbo (OpenAI)",
        "input_cost_per_1m": 10.00,
        "output_cost_per_1m": 30.00,
        "avg_response_time": 3.0,
    },
    "llama-70b": {
        "name": "Llama 70B (Meta)",
        "input_cost_per_1m": 1.50,
        "output_cost_per_1m": 2.50,
        "avg_response_time": 4.0,
    },
    "gemini-pro": {
        "name": "Gemini Pro (Google)",
        "input_cost_per_1m": 5.00,
        "output_cost_per_1m": 15.00,
        "avg_response_time": 2.8,
    },
    "mistral-large": {
        "name": "Mistral Large",
        "input_cost_per_1m": 2.40,
        "output_cost_per_1m": 7.20,
        "avg_response_time": 3.2,
    },
    "local-model": {
        "name": "Local/Self-Hosted",
        "input_cost_per_1m": 0,
        "output_cost_per_1m": 0,
        "avg_response_time": 2.5,
    }
}

PLATFORMS = {
    "createos": {
        "name": "CreateOS",
        "base_cost": 15,
        "compute_per_core_hour": 0.018,
        "bandwidth_per_gb": 0.10,
        "min_nodes": 1,
        "efficiency_multiplier": 0.70,  # 30% more efficient due to superior orchestration
    },
    "vercel": {
        "name": "Vercel",
        "base_cost": 20,
        "compute_per_core_hour": 0.05,
        "bandwidth_per_gb": 0.15,
        "min_nodes": 1,
        "efficiency_multiplier": 1.0,
    },
    "railway": {
        "name": "Railway",
        "base_cost": 10,  # Now has base cost
        "compute_per_core_hour": 0.10,
        "bandwidth_per_gb": 0.10,
        "min_nodes": 1,
        "efficiency_multiplier": 1.25,  # Less efficient
    },
    "aws-ec2": {
        "name": "AWS EC2",
        "base_cost": 100,
        "compute_per_core_hour": 0.0416,
        "bandwidth_per_gb": 0.09,
        "min_nodes": 2,
        "efficiency_multiplier": 1.2,
    },
    "gcp": {
        "name": "Google Cloud",
        "base_cost": 50,
        "compute_per_core_hour": 0.0383,
        "bandwidth_per_gb": 0.12,
        "min_nodes": 2,
        "efficiency_multiplier": 1.15,
    },
    "azure": {
        "name": "Azure",
        "base_cost": 75,
        "compute_per_core_hour": 0.048,
        "bandwidth_per_gb": 0.087,
        "min_nodes": 2,
        "efficiency_multiplier": 1.1,
    },
    "heroku": {
        "name": "Heroku",
        "base_cost": 7,
        "compute_per_core_hour": 0.05,
        "bandwidth_per_gb": 0.15,
        "min_nodes": 1,
        "efficiency_multiplier": 1.15,
    },
    "digitalocean": {
        "name": "DigitalOcean",
        "base_cost": 12,
        "compute_per_core_hour": 0.025,
        "bandwidth_per_gb": 0.05,
        "min_nodes": 1,
        "efficiency_multiplier": 1.3,
    }
}

AGENT_TEMPLATES = {
    "code-review": {
        "name": "Code Review Agent",
        "avg_input_tokens": 2000,
        "avg_output_tokens": 500,
        "processing_time": 4.0,
        "description": "Analyzes code quality and provides feedback"
    },
    "text-summarization": {
        "name": "Text Summarization",
        "avg_input_tokens": 3000,
        "avg_output_tokens": 300,
        "processing_time": 3.0,
        "description": "Summarizes long-form text"
    },
    "image-analysis": {
        "name": "Image Analysis",
        "avg_input_tokens": 500,
        "avg_output_tokens": 400,
        "processing_time": 2.5,
        "description": "Analyzes and describes images"
    },
    "data-processing": {
        "name": "Data Processing",
        "avg_input_tokens": 1500,
        "avg_output_tokens": 800,
        "processing_time": 3.5,
        "description": "Processes and transforms data"
    }
}

REGIONS = {
    "us": {"name": "US (Primary)", "cost_multiplier": 1.0},
    "eu": {"name": "EU", "cost_multiplier": 1.05},
    "apac": {"name": "Asia Pacific", "cost_multiplier": 1.1},
}
