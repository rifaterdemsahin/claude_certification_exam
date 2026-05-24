# MCP (Model Context Protocol)

## Description
An open standard that enables LLMs to seamlessly access data and tools from various applications and services through a unified interface.

## Architecture
MCP decouples the "Brain" (LLM) from the "Hands" (Tools) and "Memory" (Data). It uses a client-server architecture where hosts (like Claude Desktop) connect to MCP servers that expose resources, prompts, and tools. This standardization eliminates the need for bespoke integrations for every new tool, creating a plug-and-play ecosystem for agentic capabilities.

## Implementation in Claude
Claude supports MCP through the Claude Desktop app and various SDKs (TypeScript, Python). Developers can build MCP servers that allow Claude to query databases, interact with local filesystems, or trigger API actions, all through a standardized JSON-RPC based protocol.

## Related Memory Cards
See Memory Cards #MEM-Q030, #MEM-Q035.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/mcp.md)
