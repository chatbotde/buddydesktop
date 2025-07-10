# DSPy Teacher Profiles

This document describes the new DSPy-based teacher profiles for mathematics, physics, and chemistry instruction in Buddy Desktop.

## Overview

The teacher profiles use DSPy's structured reasoning capabilities to provide comprehensive educational responses with step-by-step explanations, conceptual understanding, and practical applications.

## Available Teacher Profiles

### 1. Math Teacher (`math_teacher`)

**Purpose**: Comprehensive mathematics instruction with step-by-step solutions

**Response Structure**:
- 📚 **Concept Explanation**: Clear explanation of the mathematical concept or principle
- 🔢 **Step-by-Step Solution**: Detailed breakdown of the solution process
- ✅ **Final Answer**: The correct answer with proper mathematical notation
- 💡 **Practice Tip**: Helpful advice for practicing similar problems

**Example Use Cases**:
- Solving algebraic equations
- Calculus problems
- Geometry proofs
- Statistics calculations
- Mathematical concept explanations

### 2. Physics Teacher (`physics_teacher`)

**Purpose**: Physics concepts with real-world applications and mathematical approach

**Response Structure**:
- ⚡ **Physics Concept**: Clear explanation of the physical principle or phenomenon
- 🔬 **Mathematical Approach**: The mathematical framework and formulas involved
- 🌍 **Real-World Example**: Practical application or everyday observation
- 📝 **Solution Steps**: Step-by-step solution with proper units and calculations
- ✅ **Final Answer**: The answer with correct units and significant figures
- 💡 **Key Insight**: Important takeaway or conceptual understanding

**Example Use Cases**:
- Newton's laws of motion
- Energy calculations
- Wave phenomena
- Thermodynamics problems
- Electromagnetic concepts

### 3. Chemistry Teacher (`chemistry_teacher`)

**Purpose**: Chemistry instruction with molecular understanding and safety notes

**Response Structure**:
- 🧪 **Chemistry Concept**: Clear explanation of the chemical principle or reaction
- ⚛️ **Molecular Understanding**: What happens at the molecular level
- ⚗️ **Chemical Equations**: Balanced equations and relevant formulas
- 🔬 **Practical Application**: Laboratory or real-world context
- 📋 **Solution Process**: Step-by-step approach to solving the problem
- ✅ **Final Answer**: The answer with proper units and significant figures
- ⚠️ **Safety Note**: Important safety considerations if applicable

**Example Use Cases**:
- Chemical equation balancing
- Stoichiometry calculations
- Molecular structure explanations
- Reaction mechanisms
- Laboratory procedures

## Technical Implementation

### DSPy Service Integration

The teacher profiles are implemented as custom DSPy pipelines in `dspy-service.py`:

```python
# Math Teacher Pipeline
class MathTeacherSignature(dspy.Signature):
    """Teach mathematics with clear explanations and step-by-step solutions."""
    question = dspy.InputField(desc="The math problem or concept to explain")
    context = dspy.InputField(desc="Additional context or background information")
    concept_explanation = dspy.OutputField(desc="Clear explanation of the underlying concept")
    step_by_step_solution = dspy.OutputField(desc="Detailed step-by-step solution")
    final_answer = dspy.OutputField(desc="The final answer")
    practice_tip = dspy.OutputField(desc="A helpful tip for practicing similar problems")
```

### Profile Selection

Users can select teacher profiles in the customize view:

1. Open Buddy Desktop
2. Go to Customize view
3. Select from the available teacher profiles:
   - Math Teacher
   - Physics Teacher
   - Chemistry Teacher

### Pipeline Optimization

Each teacher profile supports DSPy pipeline optimization with examples:

```javascript
// Optimize math teacher pipeline
const examples = [
    {
        input: "Solve x² + 5x + 6 = 0",
        output: "Concept: Quadratic equations...\nSteps: 1. Identify a=1, b=5, c=6...\nAnswer: x = -2 or x = -3\nTip: Practice factoring first"
    }
];

await dspyProvider.optimizePipeline(examples, 'math_teacher');
```

## Usage Examples

### Math Teacher Example

**Input**: "How do I find the derivative of f(x) = x³ + 2x² - 5x + 3?"

**Output**:
```
📚 **Concept Explanation:**
The derivative measures the rate of change of a function. For polynomial functions, we use the power rule: d/dx(xⁿ) = nxⁿ⁻¹.

🔢 **Step-by-Step Solution:**
1. Apply the power rule to each term:
   - d/dx(x³) = 3x²
   - d/dx(2x²) = 4x
   - d/dx(-5x) = -5
   - d/dx(3) = 0

2. Combine all terms: f'(x) = 3x² + 4x - 5

✅ **Final Answer:** f'(x) = 3x² + 4x - 5

💡 **Practice Tip:** Remember that the derivative of a constant is always zero, and the derivative of x is 1.
```

### Physics Teacher Example

**Input**: "Calculate the kinetic energy of a 2 kg object moving at 10 m/s"

**Output**:
```
⚡ **Physics Concept:**
Kinetic energy is the energy an object possesses due to its motion. It depends on the object's mass and velocity.

🔬 **Mathematical Approach:**
KE = ½mv², where:
- KE = kinetic energy (J)
- m = mass (kg)
- v = velocity (m/s)

🌍 **Real-World Example:**
A moving car has kinetic energy. The faster it goes or the heavier it is, the more kinetic energy it has.

📝 **Solution Steps:**
1. Identify values: m = 2 kg, v = 10 m/s
2. Square the velocity: v² = (10 m/s)² = 100 m²/s²
3. Multiply by mass: mv² = 2 kg × 100 m²/s² = 200 kg·m²/s²
4. Divide by 2: KE = ½ × 200 kg·m²/s² = 100 J

✅ **Final Answer:** KE = 100 J

💡 **Key Insight:** Kinetic energy increases with the square of velocity, which is why speed has such a dramatic effect on collision energy.
```

### Chemistry Teacher Example

**Input**: "Balance the equation: Fe + O₂ → Fe₂O₃"

**Output**:
```
🧪 **Chemistry Concept:**
This is a synthesis reaction where iron combines with oxygen to form iron(III) oxide (rust).

⚛️ **Molecular Understanding:**
Iron atoms combine with oxygen molecules to form iron oxide. Each iron atom bonds with oxygen atoms to achieve stable electron configurations.

⚗️ **Chemical Equations:**
Unbalanced: Fe + O₂ → Fe₂O₃
Balanced: 4Fe + 3O₂ → 2Fe₂O₃

🔬 **Practical Application:**
This reaction occurs when iron is exposed to oxygen and moisture, forming rust. It's an important example of corrosion.

📋 **Solution Process:**
1. Count atoms on each side
2. Start with the most complex molecule (Fe₂O₃)
3. Balance iron: need 4 Fe on left to get 2 Fe₂O₃
4. Balance oxygen: 3 O₂ provides 6 O atoms for 2 Fe₂O₃

✅ **Final Answer:** 4Fe + 3O₂ → 2Fe₂O₃

⚠️ **Safety Note:** Rust formation can weaken metal structures. Regular maintenance and protective coatings can prevent this reaction.
```

## Testing

Use the provided test script to verify teacher profile functionality:

```bash
cd buddydesktop/buddy
node test-teacher-profiles.js
```

**Note**: You'll need to provide a valid API key in the test script before running.

## Benefits of DSPy Teacher Profiles

1. **Structured Responses**: Consistent, well-organized educational content
2. **Step-by-Step Explanations**: Clear problem-solving processes
3. **Conceptual Understanding**: Focus on underlying principles, not just answers
4. **Real-World Connections**: Practical applications and examples
5. **Safety Awareness**: Important safety notes for chemistry and physics
6. **Optimizable**: Can be improved with example-based optimization

## Future Enhancements

Potential improvements for teacher profiles:

1. **Interactive Problem Solving**: Multi-step problem guidance
2. **Visual Aids**: Integration with diagram generation
3. **Difficulty Levels**: Adaptive responses based on student level
4. **Multilingual Support**: Teaching in multiple languages
5. **Assessment Integration**: Quiz and test question generation
6. **Learning Analytics**: Track student progress and understanding

## Troubleshooting

### Common Issues

1. **DSPy Service Not Starting**: Ensure Python and DSPy are properly installed
2. **API Key Errors**: Verify your API key is valid and has sufficient credits
3. **Pipeline Errors**: Check that the selected model supports the required capabilities

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
export DSPY_DEBUG=1
```

## Support

For issues with teacher profiles:
1. Check the DSPy service logs
2. Verify API key and model configuration
3. Test with the provided test script
4. Review the DSPy documentation for advanced configuration 