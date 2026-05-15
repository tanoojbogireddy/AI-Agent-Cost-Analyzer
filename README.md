# Agent Cost Calculator

A full-stack predictive decision engine designed to evaluate and calculate the true unit economics of deploying Agentic AI infrastructure. This platform mathematically models workload requirements against cloud infrastructure tiers to optimize cost-efficiency and eliminate the "idle server tax" found in traditional clouds.

---

## The Core Theorem: Erlang C Implementation

Unlike traditional calculators that arbitrarily estimate pricing, this application implements the **Erlang C Theorem ($M/M/c$ queuing model)** within its Python backend. 

The system processes real-world operational inputs—**Throughput** (Daily Requests) and **Latency** (Processing Time)—to calculate the traffic intensity ($A$) measured in Erlangs:

$$A = \lambda \cdot h$$

Using an optimization routine, the backend evaluates the state-space distribution to solve for the absolute minimum number of parallel AI processing channels ($N$) required to satisfy an ideal service level, keeping the probability of waiting ($P_w$) near zero:

$$P_w = \frac{\frac{A^N}{N!} \cdot \frac{N}{N - A}}{\left( \sum_{i=0}^{N-1} \frac{A^i}{i!} \right) + \left( \frac{A^N}{N!} \cdot \frac{N}{N - A} \right)}$$

By determining deterministic scaling boundaries rather than over-provisioning static hardware, the application maps precise compute usage against major cloud providers (AWS, Azure, GCP, Heroku) to show optimal margin yield.

---

## The Optimization Algorithm Workflow

The Python FastAPI backend executes a specialized iterative algorithm to dynamically discover the optimal infrastructure footprint:

```python
# Conceptual execution flow inside src/main.py
1. Convert Daily Requests into raw arrivals-per-second: λ = (Requests / 86400)
2. Calculate raw offered load (Traffic Intensity): A = λ * Processing_Time
3. Initialize Node Capacity threshold: N = ceil(A) + 1  (Ensures stability bound where A < N)

4. WHILE (True):
     a. Compute the Erlang C numerator: (A^N / N!) * (N / (N - A))
     b. Compute the Erlang C denominator state-sum array
     c. Evaluate Probability of Waiting: Pw = Numerator / Denominator
     
     d. IF Pw <= Target_Service_Level (e.g., 5% probability of congestion):
           BREAK and lock Node Count (N)
        ELSE:
           N += 1 (Scale up capacity dynamically and re-evaluate)

5. Return N to compute operational billing across cloud provider matrices.
