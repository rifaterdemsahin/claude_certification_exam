# Agentic Loop

## Description
The iterative process of perception, reasoning, and action that allows an agent to progress toward a goal while reacting to environment feedback.

## Architecture
The loop typically follows the OODA (Observe, Orient, Decide, Act) pattern or the ReAct (Reason + Act) framework. Architecturally, this requires a state management layer that persists the conversation history (context) and an execution layer that handles tool outputs. The main challenge is "context drift" where the original goal becomes obscured by intermediate step noise. Effective loops implement exit conditions and maximum iteration caps to prevent "hallucination spirals."

## Implementation in Claude
Claude implements this through sequential message exchanges. The developer manages the "loop" by appending Claude's `tool_use` and the system's `tool_result` to the message history. Claude’s ability to follow complex system prompts ensures the loop stays aligned with the objective even over many turns.

## Related Memory Cards
See Memory Cards #MEM-Q002, #MEM-Q008.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/agentic-loop.md)
