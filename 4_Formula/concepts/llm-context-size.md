# LLM Context Size

## Concept Overview
Context size (or context window) refers to the maximum number of tokens (words, characters, or parts of words) that a Large Language Model (LLM) can process in a single request. This includes both the input prompt and the generated output.

## Relation to Memory
Context size is effectively the "short-term memory" or "working memory" of the AI.

1.  **Direct Context:** Everything within the context window is immediately "visible" to the model's attention mechanism. If a fact is outside this window, the model "forgets" it unless it is re-introduced.
2.  **Long-Term Memory Integration:** To overcome finite context windows, systems use **Long-Term Memory** solutions like RAG (Retrieval-Augmented Generation). These systems store vast amounts of data externally and only "retrieve" the most relevant snippets to fit into the model's limited "working memory" (the context window).
3.  **Context Management:** Effective agentic systems must manage context size by:
    *   **Summarization:** Compressing old parts of the conversation.
    *   **Pruning:** Removing irrelevant information.
    *   **Prioritization:** Keeping only the most critical facts for the current task.

## Why it Matters for Certification
Understanding context limits is crucial for building **Reliable** and **Efficient** agents. If an agent's context overflows, it may lose track of the goal, hallucinate, or fail to follow complex architectural constraints defined in files like `CLAUDE.md`.
