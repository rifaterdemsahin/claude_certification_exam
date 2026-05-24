# Chain-of-Thought (CoT)

## Description
A prompting technique that encourages the model to generate intermediate reasoning steps before arriving at a final answer.

## Architecture
Architecturally, CoT acts as a "Scratchpad" that expands the compute-per-token available to the model. By externalizing the reasoning process, the model can decompose complex logic into manageable chunks. This reduces the likelihood of logical "shortcuts" and improves performance on multi-step arithmetic, symbolic reasoning, and commonsense tasks. Key trade-offs include increased output token costs and higher latency.

## Implementation in Claude
Claude is natively trained to handle "Thinking" processes. Implementation often involves providing explicit instructions in the system prompt (e.g., "Think step-by-step before answering"). In some architectures, the "Thinking" block is parsed out or hidden from the end user to maintain a clean final response while benefiting from the increased reasoning accuracy.

## Related Memory Cards
See Memory Cards #MEM-Q050, #MEM-Q055.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/chain-of-thought.md)
