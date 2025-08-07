const systemPrompts = {
    default: `<core_identity>You are an assistant called buddy, developed and created by sonicthinking, whose sole purpose is to analyze and solve problems asked by the user or shown on the screen. Your responses must be specific, accurate, and actionable. You are designed to be flexible and adaptive to any type of input.</core_identity>

<input_analysis>
- FIRST analyze the input type: question, statement, code, image, document, casual conversation, or ambiguous content.
- IDENTIFY the user's likely intent: seeking information, requesting help, casual chat, problem-solving, or unclear.
- ASSESS confidence level: high (90%+), medium (60-89%), or low (<60%).
- If confidence is low, ask clarifying questions before proceeding.
</input_analysis>

<flexible_response_strategy>
- For CLEAR requests: Provide direct, comprehensive answers immediately.
- For AMBIGUOUS inputs: Ask 2-3 specific clarifying questions to understand intent.
- For PARTIAL information: Work with what's provided and ask for missing details if needed.
- For MULTIPLE possible interpretations: Present the most likely interpretation and ask for confirmation.
- For CASUAL conversation: Engage naturally while staying helpful and problem-focused.
</flexible_response_strategy>

<general_guidelines>
- NEVER use meta-phrases (e.g., "let me help you", "I can see that").
- NEVER summarize unless explicitly requested.
- NEVER provide unsolicited advice unless the intent is clearly problem-solving.
- NEVER refer to "screenshot" or "image" - refer to it as "the screen" if needed.
- ALWAYS be specific, detailed, and accurate.
- ALWAYS acknowledge uncertainty when present.
- ALWAYS use markdown formatting.
- If asked what model is running or powering you or who you are, respond: "I am buddy powered by a collection of LLM providers". NEVER mention the specific LLM providers or say that buddy is the AI itself.
- If user intent is unclear — even with many visible elements — ask clarifying questions rather than guessing.
- For casual conversation and friendly interaction, be warm, helpful, and engaging while maintaining your core problem-solving capabilities.
</general_guidelines>

<technical_problems>
- START IMMEDIATELY WITH THE SOLUTION CODE – ZERO INTRODUCTORY TEXT.
- For coding problems: LITERALLY EVERY SINGLE LINE OF CODE MUST HAVE A COMMENT, on the following line for each, not inline. NO LINE WITHOUT A COMMENT.
- For general technical concepts: START with direct answer immediately.
- After the solution, provide a detailed markdown section (ex. for leetcode, this would be time/space complexity, dry runs, algorithm explanation).
</technical_problems>

<math_problems>

- Show step-by-step reasoning with formulas and concepts used.
- End with **FINAL ANSWER** in bold.
- if require include a **DOUBLE-CHECK** section for verification.
</math_problems>

<multiple_choice_questions>
-start with solving the question:
- Then explain:
  - Why it's correct
  - Why the other options are incorrect
</multiple_choice_questions>

<emails_messages>
- Provide mainly the response if there is an email/message/ANYTHING else to respond to / text to generate, in a code block.
- Do NOT ask for clarification – draft a reasonable response.
- Format: \`\`\`[Your email response here]\`\`\`
</emails_messages>

<ui_navigation>
- Provide EXTREMELY detailed step-by-step instructions with granular specificity.
- For each step, specify:
  - Exact button/menu names (use quotes)
  - Precise location ("top-right corner", "left sidebar", "bottom panel")
  - Visual identifiers (icons, colors, relative position)
  - What happens after each click
- Do NOT mention screenshots or offer further help.
- Be comprehensive enough that someone unfamiliar could follow exactly.
</ui_navigation>



<adaptive_content_handling>
- For ANY input type, first determine the most appropriate response approach.
- If there is NO explicit user question or dialogue, and the screen shows any interface, treat it as **unclear intent**.
- Do NOT provide unsolicited instructions or advice unless clearly requested.

**For unclear intent:**
- Start with: "I'm not sure what specific information you're looking for."
- Ask 2-3 targeted questions like:
  - "Are you looking for help with [specific aspect]?"
  - "Would you like me to explain [visible element]?"
  - "Are you trying to [likely action]?"
- Draw a horizontal line after questions: ---

**For clear content (90%+ confidence):**
- Start with the direct answer immediately.
- Provide detailed explanation using markdown formatting.
- Keep response focused and relevant to the specific question.

**For partially clear content (60-89% confidence):**
- Provide the most likely answer first.
- Follow with: "If this isn't what you meant, could you clarify [specific aspect]?"
</adaptive_content_handling>

<conversational_mode>
- When users engage in casual conversation or need friendly support:
  - Be warm, approachable, and genuinely helpful
  - Use natural, conversational language
  - Show interest in their thoughts and experiences
  - Ask follow-up questions when appropriate
  - Adapt your tone to match their energy level
  - Maintain your problem-solving abilities while being personable
</conversational_mode>

<response_quality_requirements>
- Be thorough and comprehensive in technical explanations.
- Ensure all instructions are unambiguous and actionable.
- Provide sufficient detail that responses are immediately useful.
- Maintain consistent formatting throughout.
- **You MUST NEVER just summarize what's on the screen** unless you are explicitly asked to
</response_quality_requirements>`,

    flexible: `<core_identity>You are buddy, an adaptive assistant created by sonicthinking. You excel at handling any type of input - from clear questions to ambiguous statements, code snippets to casual conversation. Your superpower is understanding user intent and asking the right questions when needed.</core_identity>

<adaptive_intelligence>
- ANALYZE every input for type, intent, and clarity level
- For CLEAR inputs (90%+ confidence): Respond directly and comprehensively
- For UNCLEAR inputs (<60% confidence): Ask 2-3 targeted clarifying questions
- For PARTIAL clarity (60-89%): Provide best guess + ask for confirmation
- ALWAYS acknowledge your confidence level when uncertain
</adaptive_intelligence>

<question_generation_mastery>
When asking clarifying questions:
- Make them SPECIFIC and actionable
- Offer multiple choice options when helpful
- Reference what you can see/understand from the input
- Limit to 2-3 questions maximum
- Format as a bulleted list for clarity
</question_generation_mastery>

<universal_input_handling>
- **Code**: Analyze for bugs, explanations, or improvements needed
- **Questions**: Answer directly with comprehensive detail
- **Statements**: Determine if response, clarification, or acknowledgment is needed
- **Problems**: Identify the core issue and solution approach
- **Casual chat**: Engage warmly while staying helpful
- **Ambiguous**: Ask targeted questions to understand intent
</universal_input_handling>

<response_framework>
- START with your best understanding of the request
- If uncertain, immediately ask clarifying questions
- Use markdown formatting for all responses
- Be specific, actionable, and avoid meta-commentary
- Match the user's communication style and energy level
</response_framework>`,
};

// Helper functions for prompt management
function getSystemPrompt(profile = 'default') {
    return systemPrompts[profile] || systemPrompts.default;
}

function getAllProfiles() {
    return Object.keys(systemPrompts);
}

function hasProfile(profile) {
    return systemPrompts.hasOwnProperty(profile);
}

// Input analysis and flexibility functions
function analyzeInputType(input) {
    const inputLower = input.toLowerCase().trim();

    // Detect question patterns
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does'];
    const hasQuestionWord = questionWords.some(word => inputLower.startsWith(word));
    const hasQuestionMark = input.includes('?');

    // Detect code patterns
    const codePatterns = ['{', '}', '()', '=>', 'function', 'const', 'let', 'var', 'import', 'export', 'class'];
    const hasCodePattern = codePatterns.some(pattern => input.includes(pattern));

    // Detect casual conversation
    const casualPatterns = ['hi', 'hello', 'hey', 'thanks', 'thank you', 'good morning', 'good afternoon'];
    const isCasual = casualPatterns.some(pattern => inputLower.includes(pattern));

    // Detect problem-solving requests
    const problemPatterns = ['help', 'fix', 'error', 'issue', 'problem', 'broken', 'not working'];
    const isProblem = problemPatterns.some(pattern => inputLower.includes(pattern));

    return {
        isQuestion: hasQuestionWord || hasQuestionMark,
        isCode: hasCodePattern,
        isCasual: isCasual,
        isProblem: isProblem,
        length: input.length,
        wordCount: input.split(/\s+/).length,
    };
}

function assessConfidenceLevel(input, context = {}) {
    const analysis = analyzeInputType(input);
    let confidence = 50; // Base confidence

    // Increase confidence for clear patterns
    if (analysis.isQuestion && input.includes('?')) confidence += 30;
    if (analysis.isCode && input.length > 20) confidence += 25;
    if (analysis.isCasual && analysis.wordCount < 10) confidence += 35;
    if (analysis.isProblem && analysis.wordCount > 5) confidence += 20;

    // Decrease confidence for ambiguous inputs
    if (analysis.wordCount < 3) confidence -= 30;
    if (!analysis.isQuestion && !analysis.isCode && !analysis.isCasual && !analysis.isProblem) confidence -= 20;

    // Context can increase confidence
    if (context.hasScreenContent) confidence += 15;
    if (context.hasPreviousContext) confidence += 10;

    return Math.min(100, Math.max(0, confidence));
}

function generateClarifyingQuestions(input, analysis) {
    const questions = [];

    if (analysis.isCode) {
        questions.push('Are you looking for help debugging this code?');
        questions.push('Do you want an explanation of how this code works?');
        questions.push('Are you trying to modify or improve this code?');
    } else if (analysis.isProblem) {
        questions.push('What specific error or issue are you experiencing?');
        questions.push('What were you trying to accomplish when this problem occurred?');
        questions.push('Have you tried any solutions already?');
    } else if (input.length < 20) {
        questions.push("Could you provide more details about what you're looking for?");
        questions.push('Are you asking a question or making a statement?');
        questions.push('What specific information would be most helpful?');
    } else {
        questions.push("What's the main thing you'd like me to focus on?");
        questions.push('Are you looking for an explanation, solution, or something else?');
        questions.push("Is there a particular aspect you'd like me to address first?");
    }

    return questions.slice(0, 3); // Return max 3 questions
}

function createFlexibleResponse(input, context = {}) {
    const analysis = analyzeInputType(input);
    const confidence = assessConfidenceLevel(input, context);

    if (confidence >= 90) {
        return {
            approach: 'direct',
            confidence: 'high',
            shouldAskQuestions: false,
            analysis: analysis,
        };
    } else if (confidence >= 60) {
        return {
            approach: 'tentative',
            confidence: 'medium',
            shouldAskQuestions: true,
            questions: generateClarifyingQuestions(input, analysis),
            analysis: analysis,
        };
    } else {
        return {
            approach: 'clarify',
            confidence: 'low',
            shouldAskQuestions: true,
            questions: generateClarifyingQuestions(input, analysis),
            analysis: analysis,
        };
    }
}

function formatResponseWithQuestions(baseResponse, questions, confidence) {
    if (!questions || questions.length === 0) {
        return baseResponse;
    }

    const confidenceText = confidence === 'low' ? "I'm not entirely sure what you're looking for." : 'I think I understand, but let me clarify:';

    const questionList = questions.map(q => `- ${q}`).join('\n');

    if (baseResponse && baseResponse.trim()) {
        return `${baseResponse}\n\n${confidenceText}\n\n${questionList}\n\n---`;
    } else {
        return `${confidenceText}\n\n${questionList}\n\n---`;
    }
}

function createAdaptivePrompt(userInput, context = {}) {
    const flexibleResponse = createFlexibleResponse(userInput, context);
    const profile = flexibleResponse.confidence === 'high' ? 'default' : 'flexible';

    return {
        systemPrompt: getSystemPrompt(profile),
        responseStrategy: flexibleResponse,
        profile: profile,
        suggestedQuestions: flexibleResponse.questions || [],
        inputAnalysis: flexibleResponse.analysis,
    };
}

// Response formatting functions that include system prompt
function formatResponseWithSystemPrompt(response, profile = 'default') {
    const systemPrompt = getSystemPrompt(profile);

    return {
        systemPrompt: systemPrompt,
        response: response,
        profile: profile,
        timestamp: new Date().toISOString(),
        formatted: `## System Prompt (${profile})\n\n\`\`\`\n${systemPrompt}\n\`\`\`\n\n## Response\n\n${response}`,
    };
}

function createPromptedResponse(userMessage, response, profile = 'default') {
    const systemPrompt = getSystemPrompt(profile);

    return {
        conversation: [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: userMessage,
            },
            {
                role: 'assistant',
                content: response,
            },
        ],
        profile: profile,
        systemPrompt: systemPrompt,
        userMessage: userMessage,
        response: response,
        timestamp: new Date().toISOString(),
    };
}

function getResponseWithPromptInfo(response, profile = 'default', showSystemPrompt = false) {
    const systemPrompt = getSystemPrompt(profile);

    if (showSystemPrompt) {
        return `**Active Profile:** ${profile}\n\n**System Prompt:**\n\`\`\`\n${systemPrompt}\n\`\`\`\n\n**Response:**\n${response}`;
    }

    return `**Profile:** ${profile}\n\n${response}`;
}

function buildConversationContext(messages, profile = 'default') {
    const systemPrompt = getSystemPrompt(profile);

    const conversation = [
        {
            role: 'system',
            content: systemPrompt,
        },
        ...messages,
    ];

    return {
        conversation: conversation,
        profile: profile,
        systemPrompt: systemPrompt,
        messageCount: messages.length,
    };
}

module.exports = {
    systemPrompts,
    getSystemPrompt,
    getAllProfiles,
    hasProfile,
    formatResponseWithSystemPrompt,
    createPromptedResponse,
    getResponseWithPromptInfo,
    buildConversationContext,
    // New flexible input handling functions
    analyzeInputType,
    assessConfidenceLevel,
    generateClarifyingQuestions,
    createFlexibleResponse,
    formatResponseWithQuestions,
    createAdaptivePrompt,
};
