# Agentic AI

## Description
Systems that utilize LLMs as reasoning engines to autonomously navigate complex, multi-step tasks by interacting with tools and environments.

## Architecture
Agentic AI represents a paradigm shift from deterministic software to probabilistic execution. Architectures transition from hardcoded workflows to dynamic reasoning loops where the model acts as the central controller. This involves balancing autonomous "closed-loop" systems against "open-loop" systems requiring human intervention. Key architectural considerations include the "Agentic Frontier"—the boundary where model reasoning meets environment constraints—and the trade-off between execution speed and reasoning depth.

## Implementation in Claude
In the Claude ecosystem, Agentic AI is implemented primarily through the `tools` parameter in the Messages API. Claude's high "steerability" allows for reliable tool selection and parameter extraction. Implementation focuses on providing Claude with well-defined JSON schemas and handling the iterative cycle of `tool_use` and `tool_result` messages.

## Related Memory Cards
See Memory Cards #MEM-Q001, #MEM-Q005, #MEM-Q010.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/4_Formula/concepts/agentic-ai.md)
