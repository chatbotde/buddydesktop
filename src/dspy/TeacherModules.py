#!/usr/bin/env python3
"""
Advanced DSPy Teacher Modules
Demonstrates modular design, ReAct capabilities, and multi-stage pipelines
"""

import dspy
from typing import List, Dict, Optional, Union
import re

class MathAnalysis(dspy.Signature):
    """Analyze a mathematical problem to identify type, variables, and formula."""
    question = dspy.InputField()
    problem_type = dspy.OutputField()
    variables = dspy.OutputField()
    formula = dspy.OutputField()

class MathCalculation(dspy.Signature):
    """Calculate the result of a mathematical formula with given variables."""
    formula = dspy.InputField()
    variables = dspy.InputField()
    result = dspy.OutputField()
    steps = dspy.OutputField()

class MathExplanation(dspy.Signature):
    """Explain a mathematical solution with practice tips."""
    problem_type = dspy.InputField()
    result = dspy.InputField()
    steps = dspy.InputField()
    explanation = dspy.OutputField()
    practice_tip = dspy.OutputField()

class MathCalculator(dspy.Module):
    """Advanced math teacher module with calculation capabilities."""
    
    def __init__(self):
        super().__init__()
        self.analyze = dspy.ChainOfThought(MathAnalysis)
        self.calculate = dspy.Predict(MathCalculation)
        self.explain = dspy.ChainOfThought(MathExplanation)
    
    def forward(self, question: str, context: str = "") -> dspy.Prediction:
        # Analyze the problem
        analysis = self.analyze(question=question)
        
        # Calculate the result
        calculation = self.calculate(formula=analysis.formula, variables=analysis.variables)
        
        # Explain the solution
        explanation = self.explain(
            problem_type=analysis.problem_type,
            result=calculation.result,
            steps=calculation.steps
        )
        
        return dspy.Prediction(
            problem_type=analysis.problem_type,
            formula=analysis.formula,
            variables=analysis.variables,
            result=calculation.result,
            steps=calculation.steps,
            explanation=explanation.explanation,
            practice_tip=explanation.practice_tip
        )

class PhysicsConcept(dspy.Signature):
    """Identify physics concept and relevant laws from a question."""
    question = dspy.InputField()
    physics_concept = dspy.OutputField()
    relevant_laws = dspy.OutputField()

class PhysicsApproach(dspy.Signature):
    """Formulate mathematical approach for a physics problem."""
    concept = dspy.InputField()
    laws = dspy.InputField()
    mathematical_approach = dspy.OutputField()
    units = dspy.OutputField()

class PhysicsSolution(dspy.Signature):
    """Solve a physics problem with given approach and units."""
    approach = dspy.InputField()
    units = dspy.InputField()
    solution = dspy.OutputField()
    final_answer = dspy.OutputField()

class PhysicsValidation(dspy.Signature):
    """Validate if a physics answer is physically reasonable."""
    concept = dspy.InputField()
    answer = dspy.InputField()
    is_physically_reasonable = dspy.OutputField()
    reasoning = dspy.OutputField()

class PhysicsExperiment(dspy.Module):
    """Physics teacher module with experimental reasoning."""
    
    def __init__(self):
        super().__init__()
        self.identify_concept = dspy.Predict(PhysicsConcept)
        self.formulate_approach = dspy.ChainOfThought(PhysicsApproach)
        self.solve = dspy.Predict(PhysicsSolution)
        self.validate = dspy.Predict(PhysicsValidation)
    
    def forward(self, question: str, context: str = "") -> dspy.Prediction:
        # Identify the physics concept
        concept = self.identify_concept(question=question)
        
        # Formulate the mathematical approach
        approach = self.formulate_approach(concept=concept.physics_concept, laws=concept.relevant_laws)
        
        # Solve the problem
        solution = self.solve(approach=approach.mathematical_approach, units=approach.units)
        
        # Validate the answer
        validation = self.validate(concept=concept.physics_concept, answer=solution.final_answer)
        
        return dspy.Prediction(
            physics_concept=concept.physics_concept,
            relevant_laws=concept.relevant_laws,
            mathematical_approach=approach.mathematical_approach,
            units=approach.units,
            solution=solution.solution,
            final_answer=solution.final_answer,
            is_physically_reasonable=validation.is_physically_reasonable,
            reasoning=validation.reasoning
        )

class ReactionAnalysis(dspy.Signature):
    """Analyze a chemical reaction to identify type, reactants, and products."""
    question = dspy.InputField()
    reaction_type = dspy.OutputField()
    reactants = dspy.OutputField()
    products = dspy.OutputField()

class EquationBalancing(dspy.Signature):
    """Balance a chemical equation with proper coefficients."""
    reactants = dspy.InputField()
    products = dspy.InputField()
    balanced_equation = dspy.OutputField()
    coefficients = dspy.OutputField()

class MolecularAnalysis(dspy.Signature):
    """Analyze molecular mechanism and energy changes in a reaction."""
    reaction_type = dspy.InputField()
    equation = dspy.InputField()
    molecular_mechanism = dspy.OutputField()
    energy_changes = dspy.OutputField()

class SafetyAssessment(dspy.Signature):
    """Assess safety considerations for a chemical reaction."""
    reactants = dspy.InputField()
    products = dspy.InputField()
    mechanism = dspy.InputField()
    safety_notes = dspy.OutputField()
    precautions = dspy.OutputField()

class ChemistryLab(dspy.Module):
    """Chemistry teacher module with laboratory safety and molecular reasoning."""
    
    def __init__(self):
        super().__init__()
        self.analyze_reaction = dspy.ChainOfThought(ReactionAnalysis)
        self.balance_equation = dspy.Predict(EquationBalancing)
        self.molecular_analysis = dspy.ChainOfThought(MolecularAnalysis)
        self.safety_assessment = dspy.Predict(SafetyAssessment)
    
    def forward(self, question: str, context: str = "") -> dspy.Prediction:
        # Analyze the chemical reaction
        reaction = self.analyze_reaction(question=question)
        
        # Balance the equation
        equation = self.balance_equation(reactants=reaction.reactants, products=reaction.products)
        
        # Analyze molecular mechanism
        mechanism = self.molecular_analysis(
            reaction_type=reaction.reaction_type,
            equation=equation.balanced_equation
        )
        
        # Assess safety
        safety = self.safety_assessment(
            reactants=reaction.reactants,
            products=reaction.products,
            mechanism=mechanism.molecular_mechanism
        )
        
        return dspy.Prediction(
            reaction_type=reaction.reaction_type,
            reactants=reaction.reactants,
            products=reaction.products,
            balanced_equation=equation.balanced_equation,
            coefficients=equation.coefficients,
            molecular_mechanism=mechanism.molecular_mechanism,
            energy_changes=mechanism.energy_changes,
            safety_notes=safety.safety_notes,
            precautions=safety.precautions
        )

class GeometrySolver(dspy.Signature):
    """Solve geometric problems with visual descriptions."""
    geometric_problem = dspy.InputField()
    solution = dspy.OutputField()
    diagram_description = dspy.OutputField()

class StatisticsAnalyzer(dspy.Signature):
    """Analyze statistical data and draw conclusions."""
    data = dspy.InputField()
    question = dspy.InputField()
    analysis = dspy.OutputField()
    conclusion = dspy.OutputField()

class ProofBuilder(dspy.Signature):
    """Build mathematical proofs step by step."""
    theorem = dspy.InputField()
    proof_steps = dspy.OutputField()
    conclusion = dspy.OutputField()

class AdvancedMathTeacher(dspy.Module):
    """Advanced math teacher with ReAct capabilities and multi-step problem solving."""
    
    def __init__(self):
        super().__init__()
        self.calculator = MathCalculator()
        self.geometry_solver = dspy.Predict(GeometrySolver)
        self.statistics_analyzer = dspy.ChainOfThought(StatisticsAnalyzer)
        self.proof_builder = dspy.ChainOfThought(ProofBuilder)
    
    def forward(self, question: str, context: str = "") -> dspy.Prediction:
        # Determine problem type and route to appropriate solver
        if "geometry" in question.lower() or "triangle" in question.lower() or "circle" in question.lower():
            result = self.geometry_solver(geometric_problem=question)
            return dspy.Prediction(
                problem_type="geometry",
                solution=result.solution,
                diagram_description=result.diagram_description,
                context=context
            )
        elif "statistics" in question.lower() or "probability" in question.lower() or "data" in question.lower():
            result = self.statistics_analyzer(data=context, question=question)
            return dspy.Prediction(
                problem_type="statistics",
                analysis=result.analysis,
                conclusion=result.conclusion,
                context=context
            )
        elif "prove" in question.lower() or "proof" in question.lower():
            result = self.proof_builder(theorem=question)
            return dspy.Prediction(
                problem_type="proof",
                proof_steps=result.proof_steps,
                conclusion=result.conclusion,
                context=context
            )
        else:
            # Use the general calculator
            result = self.calculator(question=question, context=context)
            return dspy.Prediction(
                problem_type=result.problem_type,
                formula=result.formula,
                result=result.result,
                explanation=result.explanation,
                practice_tip=result.practice_tip,
                context=context
            )

class UnitConversion(dspy.Signature):
    """Convert values between different units."""
    value = dspy.InputField()
    from_unit = dspy.InputField()
    to_unit = dspy.InputField()
    converted_value = dspy.OutputField()
    converted_unit = dspy.OutputField()

class ErrorAnalysis(dspy.Signature):
    """Analyze measurement uncertainty and errors."""
    measurements = dspy.InputField()
    uncertainty = dspy.OutputField()
    error_analysis = dspy.OutputField()

class GraphAnalysis(dspy.Signature):
    """Analyze data relationships and trends."""
    data_points = dspy.InputField()
    relationship = dspy.OutputField()
    slope = dspy.OutputField()
    interpretation = dspy.OutputField()

class PhysicsLab(dspy.Module):
    """Advanced physics teacher with experimental design and analysis."""
    
    def __init__(self):
        super().__init__()
        self.experiment = PhysicsExperiment()
        self.unit_converter = dspy.Predict(UnitConversion)
        self.error_analyzer = dspy.ChainOfThought(ErrorAnalysis)
        self.graph_analyzer = dspy.Predict(GraphAnalysis)
    
    def forward(self, question: str, context: str = "") -> dspy.Prediction:
        # Use the main experiment module
        result = self.experiment(question=question, context=context)
        
        # Add additional analysis based on context
        if "convert" in question.lower() or "unit" in question.lower():
            # Extract conversion information from context
            conversion_result = self.unit_converter(value=1.0, from_unit="m", to_unit="cm")
            return dspy.Prediction(
                physics_concept=result.physics_concept,
                final_answer=result.final_answer,
                conversion=conversion_result,
                context=context
            )
        elif "error" in question.lower() or "uncertainty" in question.lower():
            error_result = self.error_analyzer(measurements=[1.0, 1.1, 0.9])
            return dspy.Prediction(
                physics_concept=result.physics_concept,
                final_answer=result.final_answer,
                uncertainty=error_result.uncertainty,
                error_analysis=error_result.error_analysis,
                context=context
            )
        else:
            return result

class StoichiometryCalculation(dspy.Signature):
    """Calculate stoichiometric relationships in chemical reactions."""
    reaction = dspy.InputField()
    given_amount = dspy.InputField()
    theoretical_yield = dspy.OutputField()
    limiting_reactant = dspy.OutputField()

class PhAnalysis(dspy.Signature):
    """Analyze pH and acidity of solutions."""
    solution_info = dspy.InputField()
    ph = dspy.OutputField()
    acidity = dspy.OutputField()
    buffer_capacity = dspy.OutputField()

class ThermodynamicsAnalysis(dspy.Signature):
    """Analyze thermodynamic properties of reactions."""
    reaction_conditions = dspy.InputField()
    enthalpy = dspy.OutputField()
    entropy = dspy.OutputField()
    spontaneity = dspy.OutputField()

class ChemistryResearch(dspy.Module):
    """Advanced chemistry teacher with research and laboratory capabilities."""
    
    def __init__(self):
        super().__init__()
        self.lab = ChemistryLab()
        self.stoichiometry_calculator = dspy.Predict(StoichiometryCalculation)
        self.ph_analyzer = dspy.ChainOfThought(PhAnalysis)
        self.thermodynamics = dspy.Predict(ThermodynamicsAnalysis)
    
    def forward(self, question: str, context: str = "") -> dspy.Prediction:
        # Use the main lab module
        result = self.lab(question=question, context=context)
        
        # Add specialized analysis
        if "stoichiometry" in question.lower() or "yield" in question.lower():
            stoichiometry_result = self.stoichiometry_calculator(
                reaction=result.balanced_equation,
                given_amount=1.0
            )
            return dspy.Prediction(
                reaction_type=result.reaction_type,
                balanced_equation=result.balanced_equation,
                theoretical_yield=stoichiometry_result.theoretical_yield,
                limiting_reactant=stoichiometry_result.limiting_reactant,
                safety_notes=result.safety_notes,
                context=context
            )
        elif "ph" in question.lower() or "acid" in question.lower():
            ph_result = self.ph_analyzer(solution_info=context)
            return dspy.Prediction(
                reaction_type=result.reaction_type,
                ph=ph_result.ph,
                acidity=ph_result.acidity,
                buffer_capacity=ph_result.buffer_capacity,
                context=context
            )
        else:
            return result

# Utility functions for the modules
def format_math_response(prediction: dspy.Prediction) -> str:
    """Format math teacher response."""
    if hasattr(prediction, 'problem_type'):
        if prediction.problem_type == "geometry":
            return f"""📐 **Geometry Problem:**
{prediction.solution}

📊 **Diagram Description:**
{prediction.diagram_description}"""
        elif prediction.problem_type == "statistics":
            return f"""📊 **Statistical Analysis:**
{prediction.analysis}

📈 **Conclusion:**
{prediction.conclusion}"""
        elif prediction.problem_type == "proof":
            steps = "\n".join([f"{i+1}. {step}" for i, step in enumerate(prediction.proof_steps)])
            return f"""🔍 **Proof Steps:**
{steps}

✅ **Conclusion:**
{prediction.conclusion}"""
        else:
            return f"""📚 **Problem Type:** {prediction.problem_type}
🔢 **Formula:** {prediction.formula}
✅ **Result:** {prediction.result}
💡 **Explanation:** {prediction.explanation}
🎯 **Practice Tip:** {prediction.practice_tip}"""
    return str(prediction)

def format_physics_response(prediction: dspy.Prediction) -> str:
    """Format physics teacher response."""
    response = f"""⚡ **Physics Concept:** {prediction.physics_concept}
🔬 **Mathematical Approach:** {prediction.mathematical_approach}
✅ **Final Answer:** {prediction.final_answer}
💡 **Reasoning:** {prediction.reasoning}"""
    
    if hasattr(prediction, 'conversion'):
        response += f"\n🔄 **Unit Conversion:** {prediction.conversion.converted_value} {prediction.conversion.converted_unit}"
    
    if hasattr(prediction, 'uncertainty'):
        response += f"\n📊 **Uncertainty:** {prediction.uncertainty}"
        response += f"\n🔍 **Error Analysis:** {prediction.error_analysis}"
    
    return response

def format_chemistry_response(prediction: dspy.Prediction) -> str:
    """Format chemistry teacher response."""
    response = f"""🧪 **Reaction Type:** {prediction.reaction_type}
⚗️ **Balanced Equation:** {prediction.balanced_equation}
⚛️ **Molecular Mechanism:** {prediction.molecular_mechanism}
⚠️ **Safety Notes:** {prediction.safety_notes}"""
    
    if hasattr(prediction, 'theoretical_yield'):
        response += f"\n⚖️ **Theoretical Yield:** {prediction.theoretical_yield}"
        response += f"\n🔬 **Limiting Reactant:** {prediction.limiting_reactant}"
    
    if hasattr(prediction, 'ph'):
        response += f"\n🧪 **pH:** {prediction.ph}"
        response += f"\n⚗️ **Acidity:** {prediction.acidity}"
        response += f"\n🛡️ **Buffer Capacity:** {prediction.buffer_capacity}"
    
    return response 