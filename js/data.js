// ================== DATA ==================
// Core question data: 100 questions across 5 categories
// Each question has: id, category, question, answer, concepts, and generated UIDs/URLs
const questionsData = [
    { id: 1, category: 1, question: "What are the three stages of an Agentic Loop?", answer: "Perceive, Think, and Act. The agent observes its environment, reasons about the observation, and takes action." , concepts: ["agentic-loop", "agentic-ai"] },
    { id: 2, category: 1, question: "What is the Coordinator-Subagent model?", answer: "A pattern where a central coordinator agent routes tasks to specialized sub-agents rather than using one massive prompt." , concepts: ["agentic-loop", "agentic-ai", "coordinator-subagent"] },
    { id: 3, category: 1, question: "What is Task Decomposition in agentic systems?", answer: "Breaking complex tasks into smaller, manageable subtasks that can be assigned to different agents or executed sequentially." , concepts: ["agentic-loop", "agentic-ai", "coordinator-subagent"] },
    { id: 4, category: 1, question: "What is Session Management in agentic architecture?", answer: "Maintaining state and context across multiple interactions or task executions within a single user session." , concepts: ["long-term-memory", "reliability"] },
    { id: 5, category: 1, question: "What is the difference between a simple prompt and an agentic loop?", answer: "A simple prompt is linear (input → output), while an agentic loop is cyclic (observe → reason → act → observe)." , concepts: ["agentic-loop"] },
    { id: 6, category: 1, question: "What is an autonomous cycle in agent architecture?", answer: "A self-running loop where the agent continuously perceives, thinks, and acts without human intervention until completion." , concepts: ["agentic-loop", "agentic-ai"] },
    { id: 7, category: 1, question: "What does 'stateless' mean in agent design?", answer: "Each request is independent with no memory of previous interactions; state must be explicitly passed or stored." , concepts: ["long-term-memory", "reliability"] },
    { id: 8, category: 1, question: "What is a sub-agent?", answer: "A specialized agent that handles a specific domain or task type, orchestrated by a coordinator agent." , concepts: ["coordinator-subagent"] },
    { id: 9, category: 1, question: "What is the 'Sinthome' concept in Claude projects?", answer: "The stabilizing knot of the project - the CLAUDE.md file that defines constraints the agent must never violate." , concepts: ["claude-code", "reliability"] },
    { id: 10, category: 1, question: "What is the purpose of routing logic in the Coordinator pattern?", answer: "To determine which sub-agent is best suited to handle a specific task or query." , concepts: ["coordinator-subagent"] },
    { id: 11, category: 1, question: "What is a 'tool call' in an agentic loop?", answer: "When the agent decides to invoke an external function or tool rather than responding with text." , concepts: ["agentic-loop", "mcp"] },
    { id: 12, category: 1, question: "What is 'observation' in the Perceive stage?", answer: "The raw input or environmental data the agent receives before processing." , concepts: ["agentic-loop"] },
    { id: 13, category: 1, question: "What is 'reasoning' in the Think stage?", answer: "The cognitive processing where the agent analyzes observations, plans actions, and decides what to do." , concepts: ["agentic-loop", "chain-of-thought"] },
    { id: 14, category: 1, question: "What is 'execution' in the Act stage?", answer: "The actual performance of the decided action, such as calling a tool or generating a response." , concepts: ["agentic-loop", "mcp"] },
    { id: 15, category: 1, question: "What is an 'escalation pattern' in agent systems?", answer: "A mechanism to transfer control to a human or higher-level agent when the system cannot handle a situation." , concepts: ["reliability"] },
    { id: 16, category: 1, question: "What is 'parallel sub-agent execution'?", answer: "Running multiple sub-agents simultaneously to handle different parts of a decomposed task." , concepts: ["coordinator-subagent"] },
    { id: 17, category: 1, question: "What is 'sequential sub-agent execution'?", answer: "Running sub-agents one after another, where each step's output feeds into the next step's input." , concepts: ["agentic-loop", "coordinator-subagent"] },
    { id: 18, category: 1, question: "What is 'task handoff' between agents?", answer: "Transferring responsibility for a task from one agent to another with proper context passing." , concepts: ["coordinator-subagent"] },
    { id: 19, category: 1, question: "What is 'agent memory'?", answer: "The storage and retrieval of past interactions, learnings, or context to inform future decisions." , concepts: ["long-term-memory"] },
    { id: 20, category: 1, question: "What is 'short-term memory' in agents?", answer: "Context maintained within a single conversation or session, typically in the prompt window." , concepts: ["long-term-memory"] },
    { id: 21, category: 1, question: "What is 'long-term memory' in agents?", answer: "Persistent storage of knowledge across sessions, often using databases, vector stores, or files." , concepts: ["long-term-memory"] },
    { id: 22, category: 1, question: "What is a 'feedback loop' in agentic systems?", answer: "The mechanism by which the agent receives feedback on its actions and adjusts future behavior." , concepts: ["agentic-loop", "validation-loops"] },
    { id: 23, category: 1, question: "What is 'goal-oriented behavior' in agents?", answer: "Actions taken by the agent are directed toward achieving a specific objective or task completion." , concepts: ["agentic-ai"] },
    { id: 24, category: 1, question: "What is an 'agentic boundary'?", answer: "The limit of what an agent can do autonomously vs. what requires human approval or intervention." , concepts: ["reliability"] },
    { id: 25, category: 1, question: "What is 're-planning' in an agentic loop?", answer: "When an agent adjusts its plan mid-execution based on new observations or failed actions." , concepts: ["agentic-loop"] },
    { id: 26, category: 1, question: "What is a 'termination condition' for an agent?", answer: "The criteria that signal the agent should stop its loop, such as task completion or max iterations." , concepts: ["agentic-loop"] },
    { id: 27, category: 1, question: "What is 'human-in-the-loop' orchestration?", answer: "A design where humans review, approve, or provide input at critical decision points in the agent workflow." , concepts: ["claude-code", "reliability"] },
    { id: 28, category: 2, question: "What does MCP stand for?", answer: "Model Context Protocol - a standard for connecting AI models to external data sources and tools." , concepts: ["mcp"] },
    { id: 29, category: 2, question: "What is the key principle of MCP as 'Protocol over API'?", answer: "MCP standardizes how tools expose capabilities, allowing you to swap data sources without rewriting agent logic." , concepts: ["mcp"] },
    { id: 30, category: 2, question: "What is 'Signal-to-Noise' ratio in tool interfaces?", answer: "Designing tools to return highly relevant, structured data rather than overwhelming the agent with irrelevant information." , concepts: ["mcp", "prompt-engineering"] },
    { id: 31, category: 2, question: "What is 'structured error handling' for tools?", answer: "Returning errors in a consistent JSON format that the agent can parse and decide how to handle." , concepts: ["mcp", "reliability"] },
    { id: 32, category: 2, question: "What is 'self-correction' in tool usage?", answer: "When a tool fails, the agent catches the error and attempts an alternative approach or asks for clarification." , concepts: ["validation-loops"] },
    { id: 33, category: 2, question: "What is 'context bloat prevention' in tool design?", answer: "Limiting the amount of data returned by tools to prevent overwhelming the agent's context window." , concepts: ["mcp", "reliability"] },
    { id: 34, category: 2, question: "What is an MCP server?", answer: "A standardized server that exposes tools, resources, and prompts to AI clients through the Model Context Protocol." , concepts: ["mcp"] },
    { id: 35, category: 2, question: "What are the three core primitives of MCP?", answer: "Tools (actions), Resources (data), and Prompts (templates)." , concepts: ["mcp"] },
    { id: 36, category: 2, question: "What is 'tool discovery' in MCP?", answer: "The process by which an AI client learns what tools are available and their schemas from an MCP server." , concepts: ["mcp"] },
    { id: 37, category: 2, question: "Why is JSON schema important for tool interfaces?", answer: "It defines the exact shape of inputs and outputs, enabling validation and predictable behavior." , concepts: ["mcp", "prompt-engineering"] },
    { id: 38, category: 2, question: "What is 'parameter validation' in tool design?", answer: "Checking that inputs match expected types and constraints before executing the tool logic." , concepts: ["mcp", "validation-loops"] },
    { id: 39, category: 2, question: "What is a 'tool fallback strategy'?", answer: "Having a backup plan when a primary tool fails, such as using cached data or an alternative service." , concepts: ["mcp", "reliability"] },
    { id: 40, category: 2, question: "What is 'rate limiting' in tool integration?", answer: "Controlling how frequently a tool is called to prevent overwhelming external services." , concepts: ["mcp", "reliability"] },
    { id: 41, category: 2, question: "What is 'tool idempotency'?", answer: "A property where calling a tool multiple times with the same input produces the same result without side effects." , concepts: ["mcp", "reliability"] },
    { id: 42, category: 2, question: "What is 'schema evolution' in tool design?", answer: "Managing changes to tool input/output schemas without breaking existing agent integrations." , concepts: ["mcp"] },
    { id: 43, category: 2, question: "What is 'timeout handling' for tools?", answer: "Setting maximum wait times for tool responses and defining what happens when a timeout occurs." , concepts: ["mcp", "reliability"] },
    { id: 44, category: 2, question: "What is 'tool composition'?", answer: "Combining multiple simple tools to create complex workflows or higher-level operations." , concepts: ["coordinator-subagent", "mcp"] },
    { id: 45, category: 2, question: "What is the benefit of MCP standardization?", answer: "Interoperability - any MCP client can work with any MCP server without custom integration code." , concepts: ["mcp"] },
    { id: 46, category: 3, question: "What is the purpose of CLAUDE.md?", answer: "It defines coding style, test commands, and architectural constraints that Claude must follow." , concepts: ["claude-code", "reliability"] },
    { id: 47, category: 3, question: "What is 'Plan Mode' in Claude Code?", answer: "A workflow where Claude first generates a markdown plan before executing any file changes." , concepts: ["agentic-loop", "claude-code"] },
    { id: 48, category: 3, question: "What is 'Act Mode' in Claude Code?", answer: "The execution phase where Claude implements the changes defined in the plan." , concepts: ["agentic-loop", "claude-code"] },
    { id: 49, category: 3, question: "When should you use Plan Mode vs. Act Mode?", answer: "Always start with Plan Mode for complex tasks, then switch to Act Mode to execute the approved plan." , concepts: ["claude-code"] },
    { id: 50, category: 3, question: "What are custom slash commands in Claude Code?", answer: "User-defined commands (like /deploy, /test) that trigger specific workflows or scripts." , concepts: ["claude-code"] },
    { id: 51, category: 3, question: "How does CLAUDE.md act as a 'Sinthome'?", answer: "It serves as the stabilizing center that prevents Claude from deviating from project conventions." , concepts: ["claude-code", "reliability"] },
    { id: 52, category: 3, question: "What should be included in a CLAUDE.md file?", answer: "Coding style, test commands, architecture constraints, and any rules Claude should never violate." , concepts: ["claude-code"] },
    { id: 53, category: 3, question: "What is the hierarchy of CLAUDE.md files?", answer: "Project root CLAUDE.md is primary; subdirectory CLAUDE.md files can provide additional or overriding rules." , concepts: ["claude-code"] },
    { id: 54, category: 3, question: "How do you create a custom slash command?", answer: "By defining a command in the CLAUDE.md or project configuration that maps to a specific action or script." , concepts: ["claude-code"] },
    { id: 55, category: 3, question: "What is CI/CD integration with Claude Code?", answer: "Using Claude to help write, review, or manage continuous integration and deployment pipelines." , concepts: ["claude-code", "reliability"] },
    { id: 56, category: 3, question: "What is the 'CLAUDE.md hierarchy' concept?", answer: "A layered approach where different levels of the project can have different rules, with root-level being the most general." , concepts: ["claude-code"] },
    { id: 57, category: 3, question: "What happens if Claude violates a CLAUDE.md rule?", answer: "The developer should correct Claude and reinforce the rule; Claude will learn from the correction." , concepts: ["claude-code", "reliability"] },
    { id: 58, category: 3, question: "What is 'context persistence' in Claude Code?", answer: "Maintaining project context across sessions through files like CLAUDE.md and project documentation." , concepts: ["claude-code", "long-term-memory"] },
    { id: 59, category: 3, question: "How do you update CLAUDE.md?", answer: "Edit the file directly; Claude will read the updated version on the next interaction." , concepts: ["claude-code"] },
    { id: 60, category: 3, question: "What is a 'Video Creator Master Prompt' file?", answer: "A specialized prompt file for maintaining consistency in video creation workflows." , concepts: ["prompt-engineering", "reliability"] },
    { id: 61, category: 3, question: "What is 'automation scripting' in Claude Code?", answer: "Creating scripts that Claude can run to automate repetitive development tasks." , concepts: ["claude-code"] },
    { id: 62, category: 3, question: "What is 'workflow chaining'?", answer: "Linking multiple Claude Code operations together to create complex, multi-step development workflows." , concepts: ["claude-code"] },
    { id: 63, category: 3, question: "What is 'code review mode' in Claude Code?", answer: "A workflow where Claude analyzes code changes and provides feedback before merge." , concepts: ["claude-code"] },
    { id: 64, category: 3, question: "What is 'test-driven development' with Claude?", answer: "Using Claude to write tests first, then implement the code to make those tests pass." , concepts: ["claude-code", "validation-loops"] },
    { id: 65, category: 3, question: "What is 'refactoring mode' in Claude Code?", answer: "A focused workflow for restructuring existing code without changing its external behavior." , concepts: ["claude-code"] },
    { id: 66, category: 4, question: "What is Few-Shot Learning in prompting?", answer: "Providing a few examples of desired input-output pairs to guide the model's responses." , concepts: ["prompt-engineering"] },
    { id: 67, category: 4, question: "What is a JSON Schema in structured output?", answer: "A formal definition of the expected output structure, enabling validation and predictable parsing." , concepts: ["validation-loops", "prompt-engineering"] },
    { id: 68, category: 4, question: "What are 'Explicit Criteria' in prompt engineering?", answer: "Clearly defined requirements and constraints that the model output must satisfy." , concepts: ["prompt-engineering"] },
    { id: 69, category: 4, question: "What is a 'Validation Loop'?", answer: "Checking model output against criteria and re-prompting if the output doesn't meet requirements." , concepts: ["validation-loops", "reliability"] },
    { id: 70, category: 4, question: "What is 'role prompting'?", answer: "Assigning a specific persona or role to the AI to shape its responses (e.g., 'You are an expert DevOps engineer')." , concepts: ["prompt-engineering"] },
    { id: 71, category: 4, question: "What is 'chain-of-thought prompting'?", answer: "Prompting the model to show its reasoning step-by-step before giving the final answer." , concepts: ["chain-of-thought", "prompt-engineering"] },
    { id: 72, category: 4, question: "What is 'output format specification'?", answer: "Explicitly telling the model how to structure its response (bullet points, JSON, table, etc.)." , concepts: ["prompt-engineering"] },
    { id: 73, category: 4, question: "What is 'prompt templating'?", answer: "Creating reusable prompt structures with variables that can be filled in for different scenarios." , concepts: ["prompt-engineering"] },
    { id: 74, category: 4, question: "What is 'negative prompting'?", answer: "Explicitly stating what the model should NOT include or do in its response." , concepts: ["prompt-engineering"] },
    { id: 75, category: 4, question: "What is 'context priming'?", answer: "Providing relevant background information at the beginning of a prompt to set the stage." , concepts: ["prompt-engineering"] },
    { id: 76, category: 4, question: "What is 'prompt iteration'?", answer: "The process of refining and testing prompts to improve output quality over time." , concepts: ["prompt-engineering", "reliability"] },
    { id: 77, category: 4, question: "What is 'output validation'?", answer: "Programmatically checking that model outputs conform to expected structure and constraints." , concepts: ["validation-loops"] },
    { id: 78, category: 4, question: "What is 'schema validation' with JSON?", answer: "Using libraries like Zod or JSON Schema to verify that outputs match defined types and formats." , concepts: ["mcp", "validation-loops"] },
    { id: 79, category: 4, question: "What is 'prompt injection defense'?", answer: "Techniques to prevent malicious user input from overriding system instructions." , concepts: ["prompt-engineering", "reliability"] },
    { id: 80, category: 4, question: "What is 'multi-turn prompting'?", answer: "Using a conversation with multiple exchanges to progressively refine or build up a response." , concepts: ["prompt-engineering"] },
    { id: 81, category: 4, question: "What is 'system vs. user prompts'?", answer: "System prompts set global behavior; user prompts contain specific queries or tasks." , concepts: ["prompt-engineering"] },
    { id: 82, category: 4, question: "What is 'temperature' in prompting?", answer: "A parameter controlling randomness: lower values for deterministic outputs, higher for creative ones." , concepts: ["prompt-engineering", "reliability"] },
    { id: 83, category: 4, question: "What is 'max tokens' configuration?", answer: "Limiting the maximum length of the model's response to control output size." , concepts: ["reliability"] },
    { id: 84, category: 4, question: "What is 'retry logic' in prompt engineering?", answer: "Automatically re-prompting with modified instructions when output doesn't meet quality criteria." , concepts: ["validation-loops", "reliability"] },
    { id: 85, category: 4, question: "What is 'structured reasoning'?", answer: "Forcing the model to organize its thinking into clear steps or categories before responding." , concepts: ["chain-of-thought", "prompt-engineering"] },
    { id: 86, category: 5, question: "What is 'Long-Term Context Preservation'?", answer: "Techniques to maintain important information across long conversations or sessions." , concepts: ["long-term-memory", "reliability"] },
    { id: 87, category: 5, question: "What is a 'Human Handoff' pattern?", answer: "Transferring control from the AI to a human operator when the AI reaches its capability limits." , concepts: ["claude-code", "reliability"] },
    { id: 88, category: 5, question: "What is 'Confidence Calibration'?", answer: "Training or prompting the model to accurately express how certain it is about its answers." , concepts: ["prompt-engineering", "reliability"] },
    { id: 89, category: 5, question: "What is 'Error Propagation Prevention'?", answer: "Stopping errors from cascading through a multi-step system by containing failures at their source." , concepts: ["validation-loops", "reliability"] },
    { id: 90, category: 5, question: "What is 'context window management'?", answer: "Strategies to fit relevant information within the model's token limit while maintaining coherence." , concepts: ["long-term-memory", "reliability"] },
    { id: 91, category: 5, question: "What is 'summarization for context'?", answer: "Compressing earlier parts of a conversation into a summary to preserve space in the context window." , concepts: ["long-term-memory", "prompt-engineering"] },
    { id: 92, category: 5, question: "What is 'semantic search for context'?", answer: "Retrieving only the most relevant historical information using vector similarity search." , concepts: ["mcp", "long-term-memory"] },
    { id: 93, category: 5, question: "What is 'RAG' (Retrieval-Augmented Generation)?", answer: "Fetching relevant documents from a knowledge base and including them in the prompt for better answers." , concepts: ["mcp", "long-term-memory"] },
    { id: 94, category: 5, question: "What is 'graceful degradation'?", answer: "The system continues to provide useful (though possibly simplified) responses when resources are limited." , concepts: ["reliability"] },
    { id: 95, category: 5, question: "What is 'circuit breaker' pattern in reliability?", answer: "Stopping repeated calls to a failing service to prevent cascade failures and allow recovery." , concepts: ["reliability"] },
    { id: 96, category: 5, question: "What is 'fallback content' strategy?", answer: "Having pre-prepared responses or cached data to use when primary systems fail." , concepts: ["reliability"] },
    { id: 97, category: 5, question: "What is 'monitoring and alerting' for agents?", answer: "Tracking agent performance and sending alerts when error rates or latency exceed thresholds." , concepts: ["reliability"] },
    { id: 98, category: 5, question: "What is 'request idempotency' in reliability?", answer: "Ensuring that retrying a failed request doesn't cause duplicate or conflicting actions." , concepts: ["mcp", "reliability"] },
    { id: 99, category: 5, question: "What is 'chaos engineering' for AI systems?", answer: "Intentionally introducing failures to test and improve system resilience." , concepts: ["reliability"] },
    { id: 100, category: 5, question: "What is 'observability' in agent systems?", answer: "The ability to understand internal system states through logs, metrics, and traces." , concepts: ["long-term-memory", "reliability"] }
];

// Enrich data with UIDs, media links, prompts, and related content
questionsData.forEach(q => {
    q.uid = `CAT0${q.category}-Q${String(q.id).padStart(3, '0')}`;
    const padId = String(q.id).padStart(3, '0');
    const memId = `MEM-Q${padId}`;
    q.youtubeShortUrl = q.youtubeShortUrl || '';
    q.audioUrl = q.audioUrl || '';

    // Logic to handle image formats: SVG for new ones, PNG for existing ones
    const ext = (q.id >= 16) ? 'svg' : 'png';
    q.imageUrl = q.imageUrl || `https://claudecertstore.blob.core.windows.net/memory-images/${memId}_v1.${ext}`;

    q.googleImageUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q.question + ' claude llm')}`;
    q.relatedVideoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q.question + ' tutorial')}`;

    // Azure Blob URL for image
    q.azureImageUrl = `https://claudecertstore.blob.core.windows.net/memory-images/${memId}_v1.${ext}`;
    q.notesUrl = q.notesUrl || `https://claudecertstore.blob.core.windows.net/memory-cards/${memId}.md`;
    q.claudePrompt = q.claudePrompt || `As a Claude Developer Certification teaching assistant, explain this concept in depth: "${q.question}". Include analogies, why it matters for the exam, and 2 quiz questions to check my understanding.`;
});

// ================== CATEGORIES ==================
// Defines the 5 competency areas for the Claude Developer Certification
// Includes name, color code, and weight percentage
const categories = {
    1: { name: "Agentic Architecture", color: "#ef4444", weight: "27%" },
    2: { name: "Tool Design & MCP", color: "#3b82f6", weight: "18%" },
    3: { name: "Claude Code Workflows", color: "#10b981", weight: "20%" },
    4: { name: "Prompt Engineering", color: "#f59e0b", weight: "20%" },
    5: { name: "Context & Reliability", color: "#a855f7", weight: "15%" }
};

const categorySlugs = {
    "agentic-loop": "Agentic Loop",
    "agentic-ai": "Agentic AI",
    "coordinator-subagent": "Coordinator-Subagent",
    "mcp": "MCP",
    "claude-code": "Claude Code",
    "chain-of-thought": "Chain-of-Thought",
    "validation-loops": "Validation Loops",
    "long-term-memory": "Long-Term Memory",
    "prompt-engineering": "Prompt Engineering",
    "reliability": "Reliability"
};

// ================== HINTS & MNEMONICS ==================
// Visual memory aids for each question to help with retention
const questionHints = {
    1: { emoji: "🔄🧠", text: "Think of a never-ending cycle", memory: "PERCEIVE (eyes) → THINK (brain) → ACT (hands) → REPEAT" },
    2: { emoji: "👑🤖", text: "One boss, many workers", memory: "Coordinator = Traffic Cop, Subagents = Cars following directions" },
    3: { emoji: "🧩📋", text: "Break big into small", memory: "Like JIRA tickets - one epic becomes multiple stories" },
    4: { emoji: "💾🗂️", text: "Remember everything", memory: "Session = Movie, Context = Your popcorn bucket - finite but refilled" },
    5: { emoji: "➡️🔄", text: "Linear vs Circular", memory: "Prompt = Vending machine (one coin, one snack). Agent = Chef (keeps cooking until meal is done)" },
    6: { emoji: "🤖⚡", text: "Robot on autopilot", memory: "Like a Roomba - keeps going until room is clean or battery dies" },
    7: { emoji: "🗑️📝", text: "No memory goldfish", memory: "Every request is a fresh start - like talking to Dory from Finding Nemo" },
    8: { emoji: "🔧👷", text: "Specialist worker", memory: "Sub-agent = Specialist doctor, Coordinator = GP who refers you" },
    9: { emoji: "🪢📜", text: "The unbreakable knot", memory: "Sinthome = The rule book that keeps Claude from going rogue" },
    10: { emoji: "🗺️📍", text: "GPS for tasks", memory: "Routing = Mail sorting - each letter goes to the right department" },
    11: { emoji: "🔨📞", text: "Call a tool, not just talk", memory: "Tool call = Ordering from a menu instead of cooking yourself" },
    12: { emoji: "👀📡", text: "What the agent sees", memory: "Observation = Camera feed before AI processes what it sees" },
    13: { emoji: "🧠⚙️", text: "The thinking step", memory: "Reasoning = Chess player contemplating moves before touching a piece" },
    14: { emoji: "🎬🏃", text: "Action time", memory: "Execution = The actual move, not the plan to move" },
    15: { emoji: "🚨🙋", text: "Call for help", memory: "Escalation = 'Help, I've fallen and I can't get up' button" },
    16: { emoji: "🏃‍♂️🏃‍♀️", text: "Many at once", memory: "Parallel = Multiple chefs cooking different dishes simultaneously" },
    17: { emoji: "⛓️🔗", text: "One after another", memory: "Sequential = Assembly line - each station needs the previous one's output" },
    18: { emoji: "🤝📦", text: "Pass the baton", memory: "Handoff = Relay race - runner passes baton with momentum intact" },
    19: { emoji: "🧠💾", text: "Agent's diary", memory: "Memory = Agent's notebook of everything it learned" },
    20: { emoji: "💬🗨️", text: "Current chat only", memory: "Short-term = RAM - fast but clears when power (session) goes off" },
    21: { emoji: "💽🏛️", text: "Permanent records", memory: "Long-term = Hard drive or library - stays forever" },
    22: { emoji: "📢↩️", text: "Learn from results", memory: "Feedback = Game score - tells you if your move was good or bad" },
    23: { emoji: "🎯🎯", text: "Eye on the prize", memory: "Goal-oriented = GPS navigation - every turn gets you closer to destination" },
    24: { emoji: "🚧⛔", text: "Stay in your lane", memory: "Boundary = Fence - keeps agent from wandering into dangerous territory" },
    25: { emoji: "🗺️🔄", text: "Change the plan", memory: "Re-planning = GPS recalculating when you take a wrong turn" },
    26: { emoji: "🏁✋", text: "Stop signal", memory: "Termination = Finish line or max laps in a race" },
    27: { emoji: "👤🤖👤", text: "Human checkpoint", memory: "Human-in-loop = Co-pilot - plane flies but pilot can override anytime" },
    28: { emoji: "🌐📡", text: "Universal translator", memory: "MCP = Universal adapter - one plug fits all sockets" },
    29: { emoji: "🔌🔄", text: "Swap without rewrite", memory: "Protocol over API = USB-C - swap devices, same cable" },
    30: { emoji: "📻🔇", text: "Clear signal", memory: "Signal-to-Noise = Radio station - tune out static, hear music" },
    31: { emoji: "🛡️📋", text: "Graceful failures", memory: "Structured error = Error message vs blue screen of death" },
    32: { emoji: "🔄🩹", text: "Fix yourself", memory: "Self-correction = Autocorrect but for agent actions" },
    33: { emoji: "🎈📉", text: "Don't overfeed", memory: "Context bloat = Overstuffed suitcase - hard to close, heavy to carry" },
    34: { emoji: "🖥️📡", text: "The server middleman", memory: "MCP Server = Restaurant kitchen - takes orders, delivers dishes" },
    35: { emoji: "🛠️📚📝", text: "Three building blocks", memory: "Primitives = Hammer (tool), Book (resource), Recipe (prompt)" },
    36: { emoji: "🔍📋", text: "What's available?", memory: "Discovery = Reading a restaurant menu before ordering" },
    37: { emoji: "📐✅", text: "Blueprint for data", memory: "JSON Schema = Building blueprint - defines every room's shape" },
    38: { emoji: "🔒📝", text: "Check before act", memory: "Validation = Bouncer at club - checks ID before entry" },
    39: { emoji: "🛟📦", text: "Plan B", memory: "Fallback = Backup parachute when main one fails" },
    40: { emoji: "⏱️🚦", text: "Traffic control", memory: "Rate limiting = Speed limit - prevents crashing the service highway" },
    41: { emoji: "♻️🔄", text: "Same result every time", memory: "Idempotency = Light switch - flipping on twice doesn't make it 'more on'" },
    42: { emoji: "📈🔄", text: "Upgrade safely", memory: "Schema evolution = Renovating house while people still live in it" },
    43: { emoji: "⏳⌛", text: "Don't wait forever", memory: "Timeout = Microwave timer - ding when food should be done" },
    44: { emoji: "🧱🏗️", text: "Build bigger from small", memory: "Composition = LEGO blocks - simple bricks make complex castles" },
    45: { emoji: "🤝🌍", text: "Works everywhere", memory: "Interoperability = Speaking English - everyone understands" },
    46: { emoji: "📜⚖️", text: "The law of the project", memory: "CLAUDE.md = Constitution - fundamental laws Claude must follow" },
    47: { emoji: "📝🗺️", text: "Think before doing", memory: "Plan Mode = Architect drawing blueprints before construction" },
    48: { emoji: "🔨🏗️", text: "Build the plan", memory: "Act Mode = Construction workers building from blueprints" },
    49: { emoji: "📋✅", text: "Always plan first", memory: "Plan then Act = Measure twice, cut once" },
    50: { emoji: "⚡📝", text: "Shortcuts", memory: "Slash commands = Speed dial - one key for complex action" },
    51: { emoji: "🪢📜", text: "The stabilizing center", memory: "Sinthome = Anchor - keeps ship from drifting in storm" },
    52: { emoji: "📋🔧", text: "Rule book contents", memory: "CLAUDE.md contents = Recipe ingredients + cooking instructions" },
    53: { emoji: "🏛️📜", text: "Layers of rules", memory: "Hierarchy = Federal > State > Local laws - each level adds detail" },
    54: { emoji: "⚡🎯", text: "Make your own shortcut", memory: "Custom slash = Programming your TV remote buttons" },
    55: { emoji: "🔄🚀", text: "Automate deployment", memory: "CI/CD = Assembly line for code - build, test, ship automatically" },
    56: { emoji: "🏗️📚", text: "Rule layers", memory: "Hierarchy = Onion layers - each layer wraps the next with more rules" },
    57: { emoji: "❌🔄", text: "Correct and learn", memory: "Rule violation = Dog training - correct behavior, reinforce learning" },
    58: { emoji: "🧠💾", text: "Remember the project", memory: "Context persistence = Bookmark - remembers where you left off" },
    59: { emoji: "✏️📜", text: "Change the rules", memory: "Update = Editing constitution - change, then everyone follows new version" },
    60: { emoji: "🎬📝", text: "Video creator rules", memory: "Master prompt = Film director's shot list - keeps vision consistent" },
    61: { emoji: "🤖⚙️", text: "Let Claude work", memory: "Automation scripting = RPA bot - repeats tasks without getting tired" },
    62: { emoji: "⛓️🔗", text: "Connect the steps", memory: "Workflow chaining = Dominoes - one triggers the next in sequence" },
    63: { emoji: "👀💻", text: "Review code", memory: "Code review = Editor checking manuscript before publishing" },
    64: { emoji: "🧪✅", text: "Test first", memory: "TDD = Checking recipe works before serving to guests" },
    65: { emoji: "🔄🔧", text: "Clean up code", memory: "Refactoring = Cleaning room - same stuff, better organized" },
    66: { emoji: "📚🎯", text: "Learn from examples", memory: "Few-shot = Show 3 examples of good work, then ask for similar" },
    67: { emoji: "📐🔒", text: "Shape the output", memory: "JSON Schema = Mold for clay - defines exact shape of result" },
    68: { emoji: "📋✅", text: "Be specific", memory: "Explicit criteria = Job requirements - clear, measurable, specific" },
    69: { emoji: "🔄✅", text: "Check and retry", memory: "Validation loop = Teacher grading - if fail, redo until pass" },
    70: { emoji: "🎭🎬", text: "Wear a costume", memory: "Role prompting = Actor playing a role - behaves accordingly" },
    71: { emoji: "🧠📝", text: "Show your work", memory: "Chain-of-thought = Math homework - show steps, not just answer" },
    72: { emoji: "📄📊", text: "Tell format upfront", memory: "Format spec = Ordering at restaurant - 'medium rare, side of fries'" },
    73: { emoji: "📋🔄", text: "Reusable templates", memory: "Templating = Mad Libs - fill in blanks, story always structured" },
    74: { emoji: "🚫📝", text: "Say what not to do", memory: "Negative prompting = 'Don't press the red button'" },
    75: { emoji: "💡📖", text: "Set the scene", memory: "Context priming = 'Once upon a time...' - sets story direction" },
    76: { emoji: "🔁✨", text: "Keep improving", memory: "Iteration = Sculpting - rough clay to masterpiece through refinement" },
    77: { emoji: "✅🔍", text: "Check the output", memory: "Output validation = Spell check - catches errors before sending" },
    78: { emoji: "📐🔍", text: "Match the schema", memory: "Schema validation = Fitting puzzle pieces - must match exactly" },
    79: { emoji: "🛡️💉", text: "Guard the prompt", memory: "Prompt injection defense = SQL injection prevention - sanitize inputs" },
    80: { emoji: "💬🔄", text: "Build up answers", memory: "Multi-turn = Interview - each answer builds on previous questions" },
    81: { emoji: "🤖👤", text: "Two types of messages", memory: "System vs User = Director (system) gives actor (user) scene instructions" },
    82: { emoji: "🌡️🎲", text: "Control randomness", memory: "Temperature = Thermostat - low = predictable, high = creative chaos" },
    83: { emoji: "📏✂️", text: "Limit length", memory: "Max tokens = Twitter character limit - forces conciseness" },
    84: { emoji: "🔄🎯", text: "Try again", memory: "Retry logic = Video game checkpoint - die, respawn, try different approach" },
    85: { emoji: "🧠📊", text: "Organize thinking", memory: "Structured reasoning = Outline before essay - organized thoughts" },
    86: { emoji: "💾🕰️", text: "Remember forever", memory: "Long-term = Elephant memory - never forgets important stuff" },
    87: { emoji: "🙋🤖", text: "Pass to human", memory: "Human handoff = Elevator operator - takes over when autopilot can't" },
    88: { emoji: "📊🎯", text: "Know your confidence", memory: "Calibration = Weather forecast - 80% rain means bring umbrella" },
    89: { emoji: "🛑🌊", text: "Stop the spread", memory: "Error propagation = Firebreak - stop fire from spreading to rest of forest" },
    90: { emoji: "🪟📏", text: "Manage space", memory: "Context window = Suitcase - limited space, pack wisely" },
    91: { emoji: "📝✂️", text: "Compress history", memory: "Summarization = Movie trailer - captures essence in minutes" },
    92: { emoji: "🔍🧠", text: "Find relevant stuff", memory: "Semantic search = Google - finds related concepts, not just keywords" },
    93: { emoji: "📚🔍", text: "Bring knowledge", memory: "RAG = Open-book exam - allowed to look up answers in textbook" },
    94: { emoji: "🔄📉", text: "Keep working", memory: "Graceful degradation = Phone on low battery - basic features still work" },
    95: { emoji: "🚫⚡", text: "Stop the cascade", memory: "Circuit breaker = Fuse box - trips before whole house burns" },
    96: { emoji: "📦🛟", text: "Have a backup", memory: "Fallback = Spare tire - not ideal but gets you home" },
    97: { emoji: "📊🚨", text: "Watch and warn", memory: "Monitoring = Smoke detector - alerts before fire spreads" },
    98: { emoji: "🔁✅", text: "Safe to retry", memory: "Idempotency = Paying with credit card - duplicate charge gets reversed" },
    99: { emoji: "💥🧪", text: "Break on purpose", memory: "Chaos engineering = Fire drill - practice failure to prepare for real thing" },
    100: { emoji: "🔍📊", text: "See inside", memory: "Observability = X-ray vision - see what's happening inside the body" }
};

const youtubeResources = [
    { category: "Agentic Architecture & Orchestration (27%)", videos: [
        { title: "Building Agentic AI Systems", url: "https://www.youtube.com/watch?v=MoFuMRa5T2s", desc: "Deep dive into agentic loops and orchestration patterns" },
        { title: "Multi-Agent Systems Explained", url: "https://www.youtube.com/watch?v=hR6FnJ10Byk", desc: "Coordinator-subagent models and task decomposition" },
        { title: "LangChain Agents Tutorial", url: "https://www.youtube.com/watch?v=viQ3y6t1_8M", desc: "Hands-on implementation of agentic loops" }
    ]},
    { category: "Tool Design & MCP Integration (18%)", videos: [
        { title: "🐍 MCP Python Server & Client Guide", url: "pages/mcp_python.html", desc: "Local implementation guide with Python code samples" },
        { title: "Model Context Protocol Deep Dive", url: "https://www.youtube.com/watch?v=kQmXqiY1Jf8", desc: "MCP architecture and standardized interfaces" },
        { title: "Building MCP Servers", url: "https://www.youtube.com/watch?v=6cD6bg5lJ0s", desc: "Practical guide to implementing MCP servers" },
        { title: "AI Tool Design Patterns", url: "https://www.youtube.com/watch?v=6cD6bg5lJ0s", desc: "Best practices for tool interfaces and error handling" }
    ]},
    { category: "Claude Code Configuration & Workflows (20%)", videos: [
        { title: "Claude Code Masterclass", url: "https://www.youtube.com/watch?v=IgJdrGv9vgE", desc: "Complete guide to Claude Code workflows" },
        { title: "CLAUDE.md Best Practices", url: "https://www.youtube.com/watch?v=IgJdrGv9vgE", desc: "Creating effective project configuration files" },
        { title: "Plan Mode vs Act Mode", url: "https://www.youtube.com/watch?v=IgJdrGv9vgE", desc: "Understanding Claude Code workflow modes" }
    ]},
    { category: "Prompt Engineering & Structured Output (20%)", videos: [
        { title: "Advanced Prompt Engineering", url: "https://www.youtube.com/watch?v=d-MQ8Z_nU1A", desc: "Few-shot, chain-of-thought, and structured output techniques" },
        { title: "JSON Schema Validation for LLMs", url: "https://www.youtube.com/watch?v=d-MQ8Z_nU1A", desc: "Ensuring structured output from language models" },
        { title: "Prompt Engineering Patterns", url: "https://www.youtube.com/watch?v=d-MQ8Z_nU1A", desc: "Common patterns and anti-patterns" }
    ]},
    { category: "Context Management & Reliability (15%)", videos: [
        { title: "📊 Claude Pricing Evolution", url: "pages/claude_pricing.html", desc: "Historical pricing and model tier evolution" },
        { title: "LLM Context Window Management", url: "https://www.youtube.com/watch?v=5pAkOizVaVo", desc: "RAG, summarization, and semantic search" },
        { title: "Building Reliable AI Systems", url: "https://www.youtube.com/watch?v=5pAkOizVaVo", desc: "Error handling, confidence calibration, and fallbacks" },
        { title: "AI Observability and Monitoring", url: "https://www.youtube.com/watch?v=5pAkOizVaVo", desc: "Tracking and improving AI system reliability" }
    ]}
];
