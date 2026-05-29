# Long-Term Memory

## Description
The ability for an agent to persist and retrieve information across different sessions or long durations, moving beyond the immediate context window.

## Architecture
LLMs are stateless; memory must be externalized. Architectures typically utilize Vector Databases for RAG (Retrieval-Augmented Generation) or key-value stores for structured project state. The "Memory Management" layer must decide what information is worth "committing" to long-term storage and what can be discarded. This involves trade-offs between storage costs, retrieval latency, and the risk of retrieving irrelevant "distractor" context.

## Implementation in Claude
Implementation in Claude-based systems often involves a "Search" tool that allows the model to query an external index (like Pinecone or a local JSON file). Claude receives the retrieved fragments as part of the context, enabling it to "remember" facts or decisions made in previous interactions.

## Related Memory Cards
See Memory Cards #MEM-Q070, #MEM-Q075.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/long-term-memory.md)
