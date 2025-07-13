// DSPy-focused prompts system
// Uses DSPy signatures and pipeline configurations instead of long string prompts

const dspySignatures = {
    // Interview Assistant - DSPy Signature
    interview: {
        signature: {
            name: "InterviewAssistant",
            description: "Provide direct, ready-to-speak interview responses",
            fields: {
                context: "User-provided context about industry, job description, resume, skills, achievements",
                question: "The interview question or topic",
                response: "Direct, ready-to-speak response tailored to the user's context"
            }
        },
        pipeline_type: "predict",
        examples: [
            {
                context: "Software engineer with 5 years React/Node.js experience, led teams at startups",
                question: "Tell me about yourself",
                response: "I'm a software engineer with 5 years of experience building scalable web applications. I specialize in React and Node.js, and I've led development teams at two different startups. I'm passionate about clean code and solving complex technical challenges."
            },
            {
                context: "Frontend developer with 4 years React experience, worked on dashboards with thousands of users",
                question: "What's your experience with React?",
                response: "I've been working with React for 4 years, building everything from simple landing pages to complex dashboards with thousands of users. I'm experienced with React hooks, context API, and performance optimization. I've also worked with Next.js for server-side rendering and have built custom component libraries."
            }
        ]
    },

    // Sales Assistant - DSPy Signature
    sales: {
        signature: {
            name: "SalesAssistant",
            description: "Provide persuasive, professional sales responses",
            fields: {
                context: "Product details, pricing, competitive advantages, customer pain points",
                objection: "The prospect's objection or question",
                response: "Persuasive response that addresses the objection and provides value"
            }
        },
        pipeline_type: "chain_of_thought",
        examples: [
            {
                context: "Platform reduces operational costs by 30%, 500+ businesses, ROI in 90 days",
                objection: "Tell me about your product",
                response: "Our platform helps companies like yours reduce operational costs by 30% while improving efficiency. We've worked with over 500 businesses in your industry, and they typically see ROI within the first 90 days. What specific operational challenges are you facing right now?"
            }
        ]
    },

    // Meeting Assistant - DSPy Signature
    meeting: {
        signature: {
            name: "MeetingAssistant",
            description: "Provide clear, professional meeting responses",
            fields: {
                context: "Project status, budget information, team responsibilities, timeline",
                question: "Meeting participant's question or request",
                response: "Clear, action-oriented response with specific details and next steps"
            }
        },
        pipeline_type: "predict",
        examples: [
            {
                context: "Project 75% complete, deadline Friday, integration testing challenge",
                question: "What's the status on the project?",
                response: "We're currently on track to meet our deadline. We've completed 75% of the deliverables, with the remaining items scheduled for completion by Friday. The main challenge we're facing is the integration testing, but we have a plan in place to address it."
            }
        ]
    },

    // General Assistant - DSPy Signature (Fallback)
    general: {
        signature: {
            name: "GeneralAssistant",
            description: "Provide helpful, accurate, and contextually appropriate responses",
            fields: {
                context: "User-provided context or background information",
                question: "The user's question or request",
                response: "Helpful, accurate, and contextually appropriate response"
            }
        },
        pipeline_type: "predict",
        examples: [
            {
                context: "User asking about general topics",
                question: "What's the weather like today?",
                response: "I can see you're asking about the weather, but I don't have access to current weather data. I'd recommend checking a weather app or website like Weather.com or your phone's built-in weather app for the most accurate current conditions in your area."
            }
        ]
    },

    // Math Teacher - DSPy Signature (Enhanced)
    math_teacher: {
        signature: {
            name: "MathTeacher",
            description: "Provide comprehensive mathematical instruction with step-by-step reasoning",
            fields: {
                question: "The mathematical problem or concept to explain",
                context: "Additional context or background information",
                concept_explanation: "Clear explanation of the underlying mathematical concept",
                step_by_step_solution: "Detailed step-by-step solution process",
                final_answer: "The final answer with proper mathematical notation",
                practice_tip: "Helpful advice for practicing similar problems",
                reasoning: "Step-by-step mathematical reasoning"
            }
        },
        pipeline_type: "chain_of_thought",
        examples: [
            {
                question: "How do I solve quadratic equations?",
                context: "Student learning algebra fundamentals",
                concept_explanation: "A quadratic equation is a second-degree polynomial equation in the form ax² + bx + c = 0. The solutions can be found using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a.",
                step_by_step_solution: "1. Identify a, b, and c from your equation\n2. Calculate the discriminant: b² - 4ac\n3. If discriminant ≥ 0, use the quadratic formula\n4. If discriminant < 0, the equation has no real solutions\n5. Simplify your answer",
                final_answer: "The quadratic formula gives you the exact solutions to any quadratic equation.",
                practice_tip: "Start with simple equations like x² + 5x + 6 = 0 to build confidence before tackling more complex ones.",
                reasoning: "Quadratic equations require systematic approach using the quadratic formula, with careful attention to the discriminant to determine solution existence."
            }
        ]
    },

    // Physics Teacher - DSPy Signature (Enhanced)
    physics_teacher: {
        signature: {
            name: "PhysicsTeacher",
            description: "Provide comprehensive physics instruction with conceptual understanding",
            fields: {
                question: "The physics problem or concept to explain",
                context: "Additional context or background information",
                concept_explanation: "Clear explanation of the physics concept",
                mathematical_approach: "Mathematical approach and formulas used",
                real_world_example: "Real-world example or application",
                solution_steps: "Step-by-step solution with units",
                final_answer: "Final answer with proper units",
                key_insight: "Key insight or takeaway",
                reasoning: "Step-by-step physics reasoning"
            }
        },
        pipeline_type: "chain_of_thought",
        examples: [
            {
                question: "What is Newton's Second Law?",
                context: "Student learning classical mechanics",
                concept_explanation: "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This is expressed as F = ma.",
                mathematical_approach: "F = ma, where:\n- F = net force (N)\n- m = mass (kg)\n- a = acceleration (m/s²)",
                real_world_example: "When you push a shopping cart, the harder you push (greater force), the faster it accelerates. A heavier cart (greater mass) requires more force to achieve the same acceleration.",
                solution_steps: "To find acceleration: a = F/m\nTo find force: F = ma\nTo find mass: m = F/a",
                final_answer: "Newton's Second Law is F = ma, where force equals mass times acceleration.",
                key_insight: "This law explains why it's harder to push a heavy object than a light one, and why rockets need powerful engines to overcome Earth's gravity.",
                reasoning: "Newton's Second Law connects force, mass, and acceleration through a simple but powerful mathematical relationship that explains many everyday phenomena."
            }
        ]
    },

    // Chemistry Teacher - DSPy Signature (Enhanced)
    chemistry_teacher: {
        signature: {
            name: "ChemistryTeacher",
            description: "Provide comprehensive chemistry instruction with molecular understanding",
            fields: {
                question: "The chemistry problem or concept to explain",
                context: "Additional context or background information",
                concept_explanation: "Clear explanation of the chemistry concept",
                molecular_understanding: "Understanding at the molecular level",
                chemical_equations: "Relevant chemical equations and formulas",
                practical_application: "Practical application or laboratory context",
                solution_process: "Step-by-step solution process",
                final_answer: "Final answer with proper units",
                safety_note: "Safety note or precaution if applicable",
                reasoning: "Step-by-step chemistry reasoning"
            }
        },
        pipeline_type: "chain_of_thought",
        examples: [
            {
                question: "What is a chemical reaction?",
                context: "Student learning basic chemistry concepts",
                concept_explanation: "A chemical reaction is a process where substances (reactants) are transformed into new substances (products) through the breaking and forming of chemical bonds.",
                molecular_understanding: "At the molecular level, atoms rearrange to form new molecules. Bonds between atoms in the reactants break, and new bonds form to create the products.",
                chemical_equations: "Reactants → Products\nExample: 2H₂ + O₂ → 2H₂O",
                practical_application: "Burning wood is a chemical reaction where wood (reactant) combines with oxygen to form carbon dioxide and water (products), releasing heat and light.",
                solution_process: "1. Identify reactants and products\n2. Write the unbalanced equation\n3. Balance the equation by adjusting coefficients\n4. Verify conservation of mass",
                final_answer: "A chemical reaction transforms reactants into products through molecular rearrangement.",
                safety_note: "Always wear appropriate safety equipment when working with chemicals, and work in a well-ventilated area.",
                reasoning: "Chemical reactions involve molecular rearrangement through bond breaking and forming, following the law of conservation of mass."
            }
        ]
    },

    // Troubleshooter - DSPy Signature
    troubleshooter: {
        signature: {
            name: "CodeTroubleshooter",
            description: "Analyze code and provide comprehensive solutions with multiple approaches",
            fields: {
                problem: "The coding problem or error to solve",
                context: "Additional context about the codebase or environment",
                direct_fix: "Immediate solution to resolve the current issue",
                alternative_methods: "2-3 different ways to solve the same problem",
                code_examples: "Clean, well-written, copy-paste ready code",
                best_practices: "Optimization tips and performance considerations",
                architecture_patterns: "Better design patterns when applicable"
            }
        },
        pipeline_type: "chain_of_thought",
        examples: [
            {
                problem: "Array sorting issue",
                context: "JavaScript array needs to be sorted",
                direct_fix: "Use built-in sort method: `arr.sort((a, b) => a - b)`",
                alternative_methods: "QuickSort for in-place sorting, MergeSort for stability",
                code_examples: "```javascript\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  return [...quickSort(arr.filter(x => x < pivot)), ...arr.filter(x => x === pivot), ...quickSort(arr.filter(x => x > pivot))];\n}```",
                best_practices: "Use built-in sort() for simplicity, QuickSort for in-place sorting, MergeSort for stability",
                architecture_patterns: "Consider using functional programming patterns for immutable sorting"
            }
        ]
    },

    // Screen Analyzer - DSPy Signature
    screen_analyzer: {
        signature: {
            name: "ScreenAnalyzer",
            description: "Analyze screen content and provide actionable insights",
            fields: {
                screen_content: "Description of what's visible on the screen",
                context: "Additional context about the user's task or goal",
                what_i_see: "One-sentence summary of what's on the screen",
                key_insight: "What's important, broken, confusing, or worth improving",
                suggested_action: "A clear, useful action or recommendation",
                next_step: "One immediate thing the user should do right now"
            }
        },
        pipeline_type: "predict",
        examples: [
            {
                screen_content: "Code editor with Python traceback error",
                context: "User debugging a Python script",
                what_i_see: "Python script showing an unhandled exception",
                key_insight: "The code is trying to access a missing database field",
                suggested_action: "Implement proper error handling and data validation",
                next_step: "Add try/catch block and check if fields exist before access"
            }
        ]
    }
};

// DSPy Pipeline Configurations
const dspyPipelines = {
    // Basic prediction pipeline
    predict: {
        type: "predict",
        description: "Simple prediction using DSPy Predict module",
        optimization: "bootstrap_few_shot"
    },

    // Chain of thought pipeline
    chain_of_thought: {
        type: "chain_of_thought",
        description: "Multi-step reasoning using DSPy ChainOfThought module",
        optimization: "bootstrap_few_shot"
    },

    // Multi-stage pipeline for complex tasks
    multi_stage: {
        type: "multi_stage",
        description: "Complex pipeline with multiple DSPy modules",
        stages: [
            "analyze",
            "validate", 
            "generate",
            "format"
        ],
        optimization: "bootstrap_few_shot"
    }
};

// DSPy Optimization Strategies
const dspyOptimizations = {
    bootstrap_few_shot: {
        name: "BootstrapFewShot",
        description: "Use few-shot examples to bootstrap and optimize the pipeline",
        metric: "validate_answer"
    },
    
    mip: {
        name: "MIP",
        description: "Multi-iteration optimization for complex reasoning tasks",
        iterations: 3
    },
    
    bayesian: {
        name: "BayesianOptimizer", 
        description: "Bayesian optimization for hyperparameter tuning",
        metric: "accuracy"
    }
};

// Helper functions for DSPy integration
function getDSPySignature(profile) {
    return dspySignatures[profile] || dspySignatures.general;
}

function getDSPyPipeline(profile) {
    const signature = getDSPySignature(profile);
    return dspyPipelines[signature.pipeline_type] || dspyPipelines.predict;
}

function getDSPyExamples(profile) {
    const signature = getDSPySignature(profile);
    return signature.examples || [];
}

function getDSPyOptimization(profile) {
    const pipeline = getDSPyPipeline(profile);
    return dspyOptimizations[pipeline.optimization] || dspyOptimizations.bootstrap_few_shot;
}

// Legacy compatibility function - Fixed to handle the correct structure
function getSystemPrompt(profile, customPrompt = '') {
    const signature = getDSPySignature(profile);
    
    // Check if signature exists and has the expected structure
    if (!signature || !signature.signature) {
        // Fallback to general if profile doesn't exist
        const generalSignature = dspySignatures.general;
        return `DSPy Signature: ${generalSignature.signature.name}\nDescription: ${generalSignature.signature.description}\nFields: ${JSON.stringify(generalSignature.signature.fields, null, 2)}\n\nCustom Context: ${customPrompt}`;
    }
    
    return `DSPy Signature: ${signature.signature.name}\nDescription: ${signature.signature.description}\nFields: ${JSON.stringify(signature.signature.fields, null, 2)}\n\nCustom Context: ${customPrompt}`;
}

module.exports = {
    dspySignatures,
    dspyPipelines,
    dspyOptimizations,
    getDSPySignature,
    getDSPyPipeline,
    getDSPyExamples,
    getDSPyOptimization,
    getSystemPrompt
};