import math
from pricing_config import LLM_PROVIDERS, PLATFORMS, AGENT_TEMPLATES, REGIONS


def calculate_pw(A, N):
    """Erlang C: Probability that an arriving request must wait in queue"""
    if A >= N:
        return 1.0

    sum_part = sum([(A**i) / math.factorial(i) for i in range(int(N))])
    numerator = (A**N / math.factorial(int(N))) * (N / (N - A))

    return numerator / (sum_part + numerator)


def calculate_optimal_nodes(traffic_intensity: float, target_delay: float = 0.05) -> int:
    """Calculate optimal number of nodes for target delay using Erlang C"""
    nodes = math.ceil(traffic_intensity + 1)
    while calculate_pw(traffic_intensity, nodes) > target_delay:
        nodes += 1
    return nodes


def calculate_llm_cost_monthly(
    daily_requests: int,
    input_tokens: int,
    output_tokens: int,
    provider_key: str
) -> dict:
    """Calculate monthly LLM API costs"""
    provider = LLM_PROVIDERS[provider_key]

    total_input_tokens_monthly = daily_requests * 30 * input_tokens
    total_output_tokens_monthly = daily_requests * 30 * output_tokens

    input_cost = (total_input_tokens_monthly / 1_000_000) * provider["input_cost_per_1m"]
    output_cost = (total_output_tokens_monthly / 1_000_000) * provider["output_cost_per_1m"]

    return {
        "input_tokens_monthly": total_input_tokens_monthly,
        "output_tokens_monthly": total_output_tokens_monthly,
        "input_cost": round(input_cost, 2),
        "output_cost": round(output_cost, 2),
        "total": round(input_cost + output_cost, 2),
    }


def calculate_compute_cost_monthly(
    daily_requests: int,
    processing_time: float,
    platform_key: str,
    nodes_required: int,
    region: str = "us"
) -> dict:
    """Calculate monthly compute costs for a platform"""
    platform = PLATFORMS[platform_key]
    region_multiplier = REGIONS[region]["cost_multiplier"]

    total_processing_seconds_per_day = daily_requests * processing_time
    cpu_hours_per_day = total_processing_seconds_per_day / 3600

    actual_nodes = max(nodes_required, platform["min_nodes"])
    cpu_hours_per_node = cpu_hours_per_day / actual_nodes

    compute_cost_daily = cpu_hours_per_node * platform["compute_per_core_hour"]
    compute_cost_monthly = compute_cost_daily * 30 * region_multiplier

    return {
        "cpu_hours_per_month": round(cpu_hours_per_node * 30, 2),
        "compute_cost": round(compute_cost_monthly, 2),
        "base_cost": platform["base_cost"],
        "total": round(compute_cost_monthly + platform["base_cost"], 2),
        "nodes": actual_nodes,
    }


def compare_all_platforms(
    daily_requests: int,
    input_tokens: int,
    output_tokens: int,
    processing_time: float,
    region: str = "us"
) -> dict:
    """Compare costs across all platforms with efficiency adjustments"""
    results = {}

    arrival_rate = daily_requests / 86400
    traffic_intensity = arrival_rate * processing_time
    nodes = calculate_optimal_nodes(traffic_intensity)

    for platform_key in PLATFORMS.keys():
        compute_info = calculate_compute_cost_monthly(
            daily_requests,
            processing_time,
            platform_key,
            nodes,
            region
        )

        platform = PLATFORMS[platform_key]
        total_cost = compute_info["total"]

        # Adjust cost based on platform efficiency
        # Lower multiplier = more efficient (CreateOS 0.8 = 20% more efficient)
        adjusted_cost = total_cost * platform["efficiency_multiplier"]

        results[platform_key] = {
            "platform_name": PLATFORMS[platform_key]["name"],
            "nodes": compute_info["nodes"],
            "compute_cost_monthly": compute_info["compute_cost"],
            "platform_base_cost": compute_info["base_cost"],
            "total_monthly": total_cost,
            "adjusted_cost": round(adjusted_cost, 2),
            "traffic_intensity": round(traffic_intensity, 4),
            "utilization": round((traffic_intensity / compute_info["nodes"]) * 100, 1),
            "efficiency_gain": round((1 - platform["efficiency_multiplier"]) * 100, 1),
        }

    return results


def calculate_efficiency_rating(monthly_cost: float, nodes: int) -> float:
    """Calculate efficiency rating (0-10 scale)"""
    cost_per_node = monthly_cost / max(nodes, 1)
    rating = max(0, min(10, 10 - (cost_per_node / 100)))
    return round(rating, 1)


def analyze_cost_configuration(
    agent_type: str,
    daily_requests: int,
    llm_provider: str,
    deployment_region: str = "us",
    custom_input_tokens: int = None,
    custom_output_tokens: int = None,
    custom_processing_time: float = None
) -> dict:
    """Main cost analysis function"""

    if agent_type not in AGENT_TEMPLATES:
        raise ValueError(f"Invalid agent type: {agent_type}")

    if llm_provider not in LLM_PROVIDERS:
        raise ValueError(f"Invalid LLM provider: {llm_provider}")

    if deployment_region not in REGIONS:
        raise ValueError(f"Invalid region: {deployment_region}")

    agent = AGENT_TEMPLATES[agent_type]
    input_tokens = custom_input_tokens or agent["avg_input_tokens"]
    output_tokens = custom_output_tokens or agent["avg_output_tokens"]
    processing_time = custom_processing_time or agent["processing_time"]

    llm_cost = calculate_llm_cost_monthly(
        daily_requests,
        input_tokens,
        output_tokens,
        llm_provider
    )

    platform_comparison = compare_all_platforms(
        daily_requests,
        input_tokens,
        output_tokens,
        processing_time,
        deployment_region
    )

    # Find best and worst using adjusted cost (includes efficiency)
    best_platform = min(
        platform_comparison.items(),
        key=lambda x: x[1]["adjusted_cost"]
    )

    worst_platform = max(
        platform_comparison.items(),
        key=lambda x: x[1]["total_monthly"]
    )

    total_cost_best_platform = llm_cost["total"] + best_platform[1]["total_monthly"]
    total_cost_worst_platform = llm_cost["total"] + worst_platform[1]["total_monthly"]

    # Calculate actual savings showing the efficiency benefit
    raw_cost_best = best_platform[1]["total_monthly"]
    adjusted_cost_best = best_platform[1]["adjusted_cost"]
    efficiency_savings = round(raw_cost_best - adjusted_cost_best, 2)

    return {
        "config": {
            "agent_type": agent_type,
            "agent_name": agent["name"],
            "daily_requests": daily_requests,
            "llm_provider": llm_provider,
            "llm_provider_name": LLM_PROVIDERS[llm_provider]["name"],
            "deployment_region": deployment_region,
            "region_name": REGIONS[deployment_region]["name"],
        },
        "agent_specs": {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "processing_time": processing_time,
            "total_tokens_per_request": input_tokens + output_tokens,
        },
        "llm_cost_monthly": {
            "input_cost": llm_cost["input_cost"],
            "output_cost": llm_cost["output_cost"],
            "total": llm_cost["total"],
            "input_tokens_monthly": llm_cost["input_tokens_monthly"],
            "output_tokens_monthly": llm_cost["output_tokens_monthly"],
        },
        "platform_comparison": platform_comparison,
        "recommended_platform": {
            "platform_key": best_platform[0],
            "platform_name": best_platform[1]["platform_name"],
            "compute_cost_monthly": best_platform[1]["compute_cost_monthly"],
            "platform_base_cost": best_platform[1]["platform_base_cost"],
            "platform_total_monthly": best_platform[1]["total_monthly"],
            "adjusted_cost_monthly": best_platform[1]["adjusted_cost"],
            "efficiency_savings_monthly": efficiency_savings,
            "total_monthly_cost": round(total_cost_best_platform, 2),
            "savings_vs_worst": round(total_cost_worst_platform - total_cost_best_platform, 2),
            "efficiency_gain_percentage": best_platform[1]["efficiency_gain"],
            "efficiency_rating": calculate_efficiency_rating(
                best_platform[1]["total_monthly"],
                best_platform[1]["nodes"]
            ),
        },
    }
