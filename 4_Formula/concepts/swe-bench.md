# SWE Benchmarks

## Description
Software Engineering benchmarks measure how well AI agents perform real-world coding tasks — fixing bugs, implementing features, and refactoring code across diverse repositories. They go beyond simple code generation to test long-horizon, multi-file engineering work.

## Why They Matter
Traditional coding benchmarks (HumanEval, MBPP) test isolated function completion. SWE benchmarks test whether an agent can understand a codebase, locate the right files, reason about the fix, implement it, and verify it passes tests — the full engineering loop.

## Key Properties of a Good SWE Benchmark

- **Contamination-free**: Tasks written from scratch, not from existing commits or PRs, so no model has seen the solution during pretraining
- **High diversity**: Tasks span many repositories and languages, not just Python
- **Real-world complexity**: Solutions require understanding multiple files, not just one function
- **Reliable verification**: Test software behavior, not implementation details

## Benchmark Landscape

| Benchmark | Focus | Key Trait |
|-----------|-------|-----------|
| SWE-bench | GitHub issues → PRs | First widely-used SWE benchmark |
| SWE-bench Pro | Harder subset | Longer, more complex tasks |
| DeepSWE | Long-horizon engineering | 5.5x more code per solution, contamination-free |
| HumanEval | Function completion | Simple, isolated tasks |
| MBPP | Basic Python problems | Entry-level coding |

## Connection to Agentic Architecture

SWE benchmarks are the proving ground for agentic systems:
- **Agentic Loop**: Agent must perceive codebase, think about the fix, act by editing files, then verify
- **Coordinator-Subagent**: Complex tasks may need separate agents for research, coding, and testing
- **Validation Loops**: Agent must run tests, check results, retry if failures
- **Context Management**: Large codebases require smart context window usage

## What Separates Frontier Models

As top models saturate existing benchmarks, the gap narrows. New benchmarks like DeepSWE push the frontier by requiring:
- 5.5x more code per solution
- ~2x more output tokens
- Hand-written verifiers (not just `assert` statements)
- Tasks from 91 repositories across 5 languages

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/4_Formula/concepts/swe-bench.md)
