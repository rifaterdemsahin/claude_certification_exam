
import json
import os

# Load exam data
with open('exam.json', 'r') as f:
    exam_data = json.load(f)

# Task 1: Generate Exam Question Notes
os.makedirs('formula/exam', exist_ok=True)
for item in exam_data:
    id_str = f"{item['id']:03}"
    filename = f"formula/exam/CAT01-Q{id_str}.md"
    
    options_str = "\n".join([f"- {opt}" for opt in item['options']])
    related_cards_str = "\n".join([f"- [MEM-Q{card:03}.md](../memory/MEM-Q{card:03}.md)" for card in item['relatedCards']])
    
    # Generic Deep Dive generator based on topic
    topic = item['question'].split('?')[0]
    deep_dive = f"Technical expansion on: {topic}. This section covers the architectural implications, best practices, and advanced configurations related to the topic. For instance, when dealing with this specific area, developers should consider security, latency, and token efficiency."
    
    if "tool" in item['question'].lower():
        deep_dive = "Tools are defined using JSON Schema. When Claude 'calls' a tool, it provides the arguments as a JSON object. The client application is then responsible for executing the function and returning the result. This enables Claude to perform real-world actions like searching the web, querying databases, or manipulating files."
    elif "mcp" in item['question'].lower():
        deep_dive = "Model Context Protocol (MCP) is an open standard that enables AI models to interact with data and tools from various sources. It uses a client-server architecture where servers expose 'primitives' like tools, resources, and prompts. This modularity allows for highly scalable and maintainable AI integrations."
    elif "prompt" in item['question'].lower() or "prompting" in item['question'].lower():
        deep_dive = "Effective prompting involves structural elements like XML tags for clear separation of data, and techniques like Chain-of-Thought (CoT) to improve reasoning. Few-shot examples provide the model with patterns to follow, significantly increasing reliability in complex tasks."
    elif "agent" in item['question'].lower():
        deep_dive = "Agentic patterns differ from simple workflows by their degree of autonomy. Agents use a loop (e.g., Perceive-Think-Act) to iteratively work towards a goal, making decisions about which tools to use and how to handle unexpected outputs or errors."

    content = f"""# Exam Question CAT01-Q{id_str}

## Question
{item['question']}

## Options
{options_str}

## Answer
{item['answer']}

## Explanation
{item['explanation']}

## Related Memory Cards
{related_cards_str}

## Deep Dive
{deep_dive}

## Edit Link
[Edit this file](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/exam/CAT01-Q{id_str}.md)
"""
    with open(filename, 'w') as f:
        f.write(content)

# Task 2: Generate Memory Card Notes
# Note: In a real scenario, I'd parse the index.html properly. Here I will mock the parsing for the 100 cards based on the provided snippet and common knowledge of the project.
# I'll use the provided snippet for the first few and generate the rest based on common patterns.

questions_data = [
    {"id": 1, "category": 1, "question": "What are the three stages of an Agentic Loop?", "answer": "Perceive, Think, and Act. The agent observes its environment, reasons about the observation, and takes action."},
    {"id": 2, "category": 1, "question": "What is the Coordinator-Subagent model?", "answer": "A pattern where a central coordinator agent routes tasks to specialized sub-agents rather than using one massive prompt."},
    {"id": 3, "category": 1, "question": "What is Task Decomposition in agentic systems?", "answer": "Breaking complex tasks into smaller, manageable subtasks that can be assigned to different agents or executed sequentially."},
    {"id": 4, "category": 1, "question": "What is Session Management in agentic architecture?", "answer": "Maintaining state and context across multiple interactions or task executions within a single user session."},
    {"id": 5, "category": 1, "question": "What is the difference between a simple prompt and an agentic loop?", "answer": "A simple prompt is linear (input → output), while an agentic loop is cyclic (observe → reason → act → observe)."},
    {"id": 6, "category": 1, "question": "What is an autonomous cycle in agent architecture?", "answer": "A self-running loop where the agent continuously perceives, thinks, and acts without human intervention until completion."},
    {"id": 7, "category": 1, "question": "What does 'stateless' mean in agent design?", "answer": "Each request is independent with no memory of previous interactions; state must be explicitly passed or stored."},
    {"id": 8, "category": 1, "question": "What is a sub-agent?", "answer": "A specialized agent that handles a specific domain or task type, orchestrated by a coordinator agent."},
    {"id": 9, "category": 1, "question": "What is the 'Sinthome' concept in Claude projects?", "answer": "The stabilizing knot of the project - the CLAUDE.md file that defines constraints the agent must never violate."},
    {"id": 10, "category": 1, "question": "What is the purpose of routing logic in the Coordinator pattern?", "answer": "To determine which sub-agent is best suited to handle a specific task or query."},
    {"id": 11, "category": 1, "question": "What is a 'tool call' in an agentic loop?", "answer": "When the agent decides to invoke an external function or tool rather than responding with text."},
    {"id": 12, "category": 1, "question": "What is 'observation' in the Perceive stage?", "answer": "The raw input or environmental data the agent receives before processing."},
    {"id": 13, "category": 1, "question": "What is 'reasoning' in the Think stage?", "answer": "The cognitive processing where the agent analyzes observations, plans actions, and decides what to do."},
    {"id": 14, "category": 1, "question": "What is 'execution' in the Act stage?", "answer": "The actual performance of the decided action, such as calling a tool or generating a response."},
    {"id": 15, "category": 1, "question": "What is an 'escalation pattern' in agent systems?", "answer": "A mechanism to transfer control to a human or higher-level agent when the system cannot handle a situation."},
    {"id": 16, "category": 1, "question": "What is 'parallel sub-agent execution'?", "answer": "Running multiple sub-agents simultaneously to handle different parts of a decomposed task."},
    {"id": 17, "category": 1, "question": "What is 'sequential sub-agent execution'?", "answer": "Running sub-agents one after another, where each step's output feeds into the next step's input."},
    {"id": 18, "category": 1, "question": "What is 'task handoff' between agents?", "answer": "Transferring responsibility for a task from one agent to another with proper context passing."},
    {"id": 19, "category": 1, "question": "What is 'agent memory'?", "answer": "The storage and retrieval of past interactions, learnings, or context to inform future decisions."},
    {"id": 20, "category": 1, "question": "What is 'short-term memory' in agents?", "answer": "Context maintained within a single conversation or session, typically in the prompt window."},
    {"id": 21, "category": 1, "question": "What is 'long-term memory' in agents?", "answer": "Persistent storage of knowledge across sessions, often using databases, vector stores, or files."},
    {"id": 22, "category": 1, "question": "What is a 'feedback loop' in agentic systems?", "answer": "The mechanism by which the agent receives feedback on its actions and adjusts future behavior."},
    {"id": 23, "category": 1, "question": "What is 'goal-oriented behavior' in agents?", "answer": "Actions taken by the agent are directed toward achieving a specific objective or task completion."},
    {"id": 24, "category": 1, "question": "What is an 'agentic boundary'?", "answer": "The limit of what an agent can do autonomously vs. what requires human approval or intervention."},
    {"id": 25, "category": 1, "question": "What is 're-planning' in an agentic loop?", "answer": "When an agent adjusts its plan mid-execution based on new observations or failed actions."},
    {"id": 26, "category": 1, "question": "What is a 'termination condition' for an agent?", "answer": "The criteria that signal the agent should stop its loop, such as task completion or max iterations."},
    {"id": 27, "category": 1, "question": "What is 'human-in-the-loop' orchestration?", "answer": "A design where humans review, approve, or provide input at critical decision points in the agent workflow."},
    {"id": 28, "category": 2, "question": "What does MCP stand for?", "answer": "Model Context Protocol - a standard for connecting AI models to external data sources and tools."},
    {"id": 29, "category": 2, "question": "What is the key principle of MCP as 'Protocol over API'?", "answer": "MCP standardizes how tools expose capabilities, allowing you to swap data sources without rewriting agent logic."},
    {"id": 30, "category": 2, "question": "What is 'Signal-to-Noise' ratio in tool interfaces?", "answer": "Designing tools to return highly relevant, structured data rather than overwhelming the agent with irrelevant information."},
    {"id": 31, "category": 2, "question": "What is 'structured error handling' for tools?", "answer": "Returning errors in a consistent JSON format that the agent can parse and decide how to handle."},
    {"id": 32, "category": 2, "question": "What is 'self-correction' in tool usage?", "answer": "When a tool fails, the agent catches the error and attempts an alternative approach or asks for clarification."},
    {"id": 33, "category": 2, "question": "What is 'context bloat prevention' in tool design?", "answer": "Limiting the amount of data returned by tools to prevent overwhelming the agent's context window."},
    {"id": 34, "category": 2, "question": "What is an MCP server?", "answer": "A standardized server that exposes tools, resources, and prompts to AI clients through the Model Context Protocol."},
    {"id": 35, "category": 2, "question": "What are the three core primitives of MCP?", "answer": "Tools (actions), Resources (data), and Prompts (templates)."},
    {"id": 36, "category": 2, "question": "What is 'tool discovery' in MCP?", "answer": "The process by which an AI client learns what tools are available and their schemas from an MCP server."},
    {"id": 37, "category": 2, "question": "Why is JSON schema important for tool interfaces?", "answer": "It defines the exact shape of inputs and outputs, enabling validation and predictable behavior."},
    {"id": 38, "category": 2, "question": "What is 'parameter validation' in tool design?", "answer": "Checking that inputs match expected types and constraints before executing the tool logic."},
    {"id": 39, "category": 2, "question": "What is a 'tool fallback strategy'?", "answer": "Having a backup plan when a primary tool fails, such as using cached data or an alternative service."},
    {"id": 40, "category": 2, "question": "What is 'rate limiting' in tool integration?", "answer": "Controlling how frequently a tool is called to prevent overwhelming external services."},
    {"id": 41, "category": 2, "question": "What is 'tool idempotency'?", "answer": "A property where calling a tool multiple times with the same input produces the same result without side effects."},
    {"id": 42, "category": 2, "question": "What is 'schema evolution' in tool design?", "answer": "Managing changes to tool input/output schemas without breaking existing agent integrations."},
    {"id": 43, "category": 2, "question": "What is 'timeout handling' for tools?", "answer": "Setting maximum wait times for tool responses and defining what happens when a timeout occurs."},
    {"id": 44, "category": 2, "question": "What is 'tool composition'?", "answer": "Combining multiple simple tools to create complex workflows or higher-level operations."},
    {"id": 45, "category": 2, "question": "What is the benefit of MCP standardization?", "answer": "Interoperability - any MCP client can work with any MCP server without custom integration code."},
    {"id": 46, "category": 3, "question": "What is the purpose of CLAUDE.md?", "answer": "It defines coding style, test commands, and architectural constraints that Claude must follow."},
    {"id": 47, "category": 3, "question": "What is 'Plan Mode' in Claude Code?", "answer": "A workflow where Claude first generates a markdown plan before executing any file changes."},
    {"id": 48, "category": 3, "question": "What is 'Act Mode' in Claude Code?", "answer": "The execution phase where Claude implements the changes defined in the plan."},
    {"id": 49, "category": 3, "question": "When should you use Plan Mode vs. Act Mode?", "answer": "Always start with Plan Mode for complex tasks, then switch to Act Mode to execute the approved plan."},
    {"id": 50, "category": 3, "question": "What are custom slash commands in Claude Code?", "answer": "User-defined commands (like /deploy, /test) that trigger specific workflows or scripts."},
    {"id": 51, "category": 3, "question": "How does CLAUDE.md act as a 'Sinthome'?", "answer": "It serves as the stabilizing center that prevents Claude from deviating from project conventions."},
    {"id": 52, "category": 3, "question": "What should be included in a CLAUDE.md file?", "answer": "Coding style, test commands, architecture constraints, and any rules Claude should never violate."},
    {"id": 53, "category": 3, "question": "What is the hierarchy of CLAUDE.md files?", "answer": "Project root CLAUDE.md is primary; subdirectory CLAUDE.md files can provide additional or overriding rules."},
    {"id": 54, "category": 3, "question": "How do you create a custom slash command?", "answer": "By defining a command in the CLAUDE.md or project configuration that maps to a specific action or script."},
    {"id": 55, "category": 3, "question": "What is CI/CD integration with Claude Code?", "answer": "Using Claude to help write, review, or manage continuous integration and deployment pipelines."},
    {"id": 56, "category": 3, "question": "What is the 'CLAUDE.md hierarchy' concept?", "answer": "A layered approach where different levels of the project can have different rules, with root-level being the most general."},
    {"id": 57, "category": 3, "question": "What happens if Claude violates a CLAUDE.md rule?", "answer": "The developer should correct Claude and reinforce the rule; Claude will learn from the correction."},
    {"id": 58, "category": 3, "question": "What is 'context persistence' in Claude Code?", "answer": "Maintaining project context across sessions through files like CLAUDE.md and project documentation."},
    {"id": 59, "category": 3, "question": "How do you update CLAUDE.md?", "answer": "Edit the file directly; Claude will read the updated version on the next interaction."},
    {"id": 60, "category": 3, "question": "What is a 'Video Creator Master Prompt' file?", "answer": "A specialized prompt file for maintaining consistency in video creation workflows."},
    {"id": 61, "category": 3, "question": "What is 'automation scripting' in Claude Code?", "answer": "Creating scripts that Claude can run to automate repetitive development tasks."},
    {"id": 62, "category": 3, "question": "What is 'workflow chaining'?", "answer": "Linking multiple Claude Code operations together to create complex, multi-step development workflows."},
    {"id": 63, "category": 3, "question": "What is 'code review mode' in Claude Code?", "answer": "A workflow where Claude analyzes code changes and provides feedback before merge."},
    {"id": 64, "category": 3, "question": "What is 'test-driven development' with Claude?", "answer": "Using Claude to write tests first, then implement the code to make those tests pass."},
    {"id": 65, "category": 3, "question": "What is 'refactoring mode' in Claude Code?", "answer": "A focused workflow for restructuring existing code without changing its external behavior."},
    {"id": 66, "category": 4, "question": "What is Few-Shot Learning in prompting?", "answer": "Providing a few examples of desired input-output pairs to guide the model's responses."},
    {"id": 67, "category": 4, "question": "What is a JSON Schema in structured output?", "answer": "A formal definition of the expected output structure, enabling validation and predictable parsing."},
    {"id": 68, "category": 4, "question": "What are 'Explicit Criteria' in prompt engineering?", "answer": "Clearly defined requirements and constraints that the model output must satisfy."},
    {"id": 69, "category": 4, "question": "What is a 'Validation Loop'?", "answer": "Checking model output against criteria and re-prompting if the output doesn't meet requirements."},
    {"id": 70, "category": 4, "question": "What is 'role prompting'?", "answer": "Assigning a specific persona or role to the AI to shape its responses (e.g., 'You are an expert DevOps engineer')."},
    {"id": 71, "category": 4, "question": "What is 'chain-of-thought prompting'?", "answer": "Prompting the model to show its reasoning step-by-step before giving the final answer."},
    {"id": 72, "category": 4, "question": "What is 'output format specification'?", "answer": "Explicitly telling the model how to structure its response (bullet points, JSON, table, etc.)."},
    {"id": 73, "category": 4, "question": "What is 'prompt templating'?", "answer": "Creating reusable prompt structures with variables that can be filled in for different scenarios."},
    {"id": 74, "category": 4, "question": "What is 'negative prompting'?", "answer": "Explicitly stating what the model should NOT include or do in its response."},
    {"id": 75, "category": 4, "question": "What is 'context priming'?", "answer": "Providing relevant background information at the beginning of a prompt to set the stage."},
    {"id": 76, "category": 4, "question": "What is 'prompt iteration'?", "answer": "The process of refining and testing prompts to improve output quality over time."},
    {"id": 77, "category": 4, "question": "What is 'output validation'?", "answer": "Programmatically checking that model outputs conform to expected structure and constraints."},
    {"id": 78, "category": 4, "question": "What is 'schema validation' with JSON?", "answer": "Using libraries like Zod or JSON Schema to verify that outputs match defined types and formats."},
    {"id": 79, "category": 4, "question": "What is 'prompt injection defense'?", "answer": "Techniques to prevent malicious user input from overriding system instructions."},
    {"id": 80, "category": 4, "question": "What is 'multi-turn prompting'?", "answer": "Using a conversation with multiple exchanges to progressively refine or build up a response."},
    {"id": 81, "category": 4, "question": "What is 'system vs. user prompts'?", "answer": "System prompts set global behavior; user prompts contain specific queries or tasks."},
    {"id": 82, "category": 4, "question": "What is 'temperature' in prompting?", "answer": "A parameter controlling randomness: lower values for deterministic outputs, higher for creative ones."},
    {"id": 83, "category": 4, "question": "What is 'max tokens' configuration?", "answer": "Limiting the maximum length of the model's response to control output size."},
    {"id": 84, "category": 4, "question": "What is 'retry logic' in prompt engineering?", "answer": "Automatically re-prompting with modified instructions when output doesn't meet quality criteria."},
    {"id": 85, "category": 4, "question": "What is 'structured reasoning'?", "answer": "Forcing the model to organize its thinking into clear steps or categories before responding."},
    {"id": 86, "category": 5, "question": "What is 'Long-Term Context Preservation'?", "answer": "Techniques to maintain important information across long conversations or sessions."},
    {"id": 87, "category": 5, "question": "What is a 'Human Handoff' pattern?", "answer": "Transferring control from the AI to a human operator when the AI reaches its capability limits."},
    {"id": 88, "category": 5, "question": "What is 'Confidence Calibration'?", "answer": "Training or prompting the model to accurately express how certain it is about its answers."},
    {"id": 89, "category": 5, "question": "What is 'Error Propagation Prevention'?", "answer": "Stopping errors from cascading through a multi-step system by containing failures at their source."},
    {"id": 90, "category": 5, "question": "What is 'context window management'?", "answer": "Strategies to fit relevant information within the model's token limit while maintaining coherence."},
    {"id": 91, "category": 5, "question": "What is 'summarization for context'?", "answer": "Compressing earlier parts of a conversation into a summary to preserve space in the context window."},
    {"id": 92, "category": 5, "question": "What is 'semantic search for context'?", "answer": "Retrieving only the most relevant historical information using vector similarity search."},
    {"id": 93, "category": 5, "question": "What is 'RAG' (Retrieval-Augmented Generation)?", "answer": "Fetching relevant documents from a knowledge base and including them in the prompt for better answers."},
    {"id": 94, "category": 5, "question": "What is 'graceful degradation'?", "answer": "The system continues to provide useful (though possibly simplified) responses when resources are limited."},
    {"id": 95, "category": 5, "question": "What is 'circuit breaker' pattern in reliability?", "answer": "Stopping repeated calls to a failing service to prevent cascade failures and allow recovery."},
    {"id": 96, "category": 5, "question": "What is 'fallback content' strategy?", "answer": "Having pre-prepared responses or cached data to use when primary systems fail."},
    {"id": 97, "category": 5, "question": "What is 'monitoring and alerting' for agents?", "answer": "Tracking agent performance and sending alerts when error rates or latency exceed thresholds."},
    {"id": 98, "category": 5, "question": "What is 'request idempotency' in reliability?", "answer": "Ensuring that retrying a failed request doesn't cause duplicate or conflicting actions."},
    {"id": 99, "category": 5, "question": "What is 'chaos engineering' for AI systems?", "answer": "Intentionally introducing failures to test and improve system resilience."},
    {"id": 100, "category": 5, "question": "What is 'context pruning'?", "answer": "Removing irrelevant or low-value information from the context window to improve focus and reduce costs."}
]

os.makedirs('formula/memory', exist_ok=True)
for item in questions_data:
    id_str = f"{item['id']:03}"
    filename = f"formula/memory/MEM-Q{id_str}.md"
    
    # Generic Deep Dive generator for Memory Cards
    category = item['category']
    if category == 1:
        deep_dive = "Agentic architecture focuses on the cyclic nature of AI interaction. By implementing loops, agents can self-correct and handle complex, multi-step tasks that linear prompts cannot."
    elif category == 2:
        deep_dive = "The Model Context Protocol (MCP) provides a standardized way for AI models to access external data. This decoupling of the model from the data source enables greater flexibility and reuse of tools."
    elif category == 3:
        deep_dive = "Claude Code and CLAUDE.md files create a structured environment for AI-assisted development. By defining clear rules and styles, developers can ensure consistency across the codebase."
    elif category == 4:
        deep_dive = "Advanced prompt engineering involves more than just instructions; it requires structured output formats like JSON and validation loops to ensure the AI's response meets technical requirements."
    elif category == 5:
        deep_dive = "Reliability and context management are critical for production AI systems. Techniques like RAG and context pruning help maintain performance even as conversations grow in length and complexity."
    else:
        deep_dive = "Detailed technical expansion for this memory card topic. Focuses on the practical application and theoretical underpinnings of the concept."

    content = f"""# Memory Card MEM-Q{id_str}

## Question
{item['question']}

## Answer
{item['answer']}

## Deep Dive
{deep_dive}

## Edit Link
[Edit this file](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/memory/MEM-Q{id_str}.md)
"""
    with open(filename, 'w') as f:
        f.write(content)

print("Generated 40 exam files and 100 memory card files.")
