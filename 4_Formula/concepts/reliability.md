# Reliability & Resilience

## Description
The set of practices and architectural patterns that ensure an AI system behaves predictably, handles errors gracefully, and remains available under load.

## Architecture
Resilience in agentic systems involves handling API timeouts, rate limits, and non-deterministic model failures. Architectural patterns include exponential backoff, circuit breakers, and fallback models (e.g., falling back from Sonnet to Haiku). Reliability also encompasses "Output Stability"—ensuring that the model consistently returns valid JSON or adheres to the requested format over thousands of runs.

## Implementation in Claude
Implemented via robust error handling in the client-side code and by using features like `max_tokens` and `stop_sequences` to prevent runaway generation. Developers also use "Prompt Versioning" and "Evaluation Sets" (Evals) to measure how changes to the prompt or model impact system-wide reliability metrics.

## Related Memory Cards
See Memory Cards #MEM-Q090, #MEM-Q100.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/reliability.md)
