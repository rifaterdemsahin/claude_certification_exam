# Coordinator-Subagent

## Description
A multi-agent design pattern where a high-level "Coordinator" agent decomposes tasks and delegates them to specialized "Subagents" or "Workers."

## Architecture
This pattern addresses the "Context Window Saturation" and "Instruction Following" limits of a single agent. By modularizing tasks, the Coordinator maintains the global state and strategy, while Subagents operate within a narrow, highly-optimized context. This creates a recursive tree of execution. Architectural trade-offs involve increased API costs and latency versus improved precision and the ability to parallelize independent sub-tasks.

## Implementation in Claude
This is often realized by using a highly capable model like Claude 3.5 Sonnet as the Coordinator and specialized system prompts (or smaller models like Haiku) for Subagents. The Coordinator receives a "Master Prompt," generates instructions for Subagents, and aggregates their results into a final response.

## Related Memory Cards
See Memory Cards #MEM-Q015, #MEM-Q022.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/coordinator-subagent.md)
