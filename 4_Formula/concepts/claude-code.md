# Claude Code

## Description
An agentic CLI tool designed for software engineering that can research, write, and execute code directly within a terminal environment.

## Architecture
Claude Code is a "Human-in-the-loop" (HITL) agentic system. It operates on a local file system, using a "Research-Strategy-Execution" lifecycle. It combines traditional CLI utilities (grep, find) with LLM reasoning. Architecturally, it prioritizes safety via permission prompts for destructive actions and maintains a "Project Memory" to track long-term context across sessions.

## Implementation in Claude
Claude Code is implemented as a specialized wrapper around the Claude API, utilizing custom tools for file manipulation, shell execution, and codebase indexing. It leverages Sonnet 3.5's superior coding and reasoning capabilities to provide a seamless developer experience.

## Related Memory Cards
See Memory Cards #MEM-Q040, #MEM-Q045.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/4_Formula/concepts/claude-code.md)
