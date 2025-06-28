#!/usr/bin/env python3
"""
DSPy Service for Buddy Desktop
Provides DSPy functionality via HTTP API for the Electron app
"""

import json
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import sys
import os

try:
    import dspy
    DSPY_AVAILABLE = True
except ImportError:
    DSPY_AVAILABLE = False
    print("DSPy not installed. Run: pip install -U dspy-ai")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DSPyHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.dspy_lm = None
        super().__init__(*args, **kwargs)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/health':
            self.send_json_response({
                'status': 'healthy',
                'dspy_available': DSPY_AVAILABLE
            })
        elif parsed_path.path == '/models':
            self.send_json_response({
                'available_models': self.get_available_models()
            })
        else:
            self.send_error(404, 'Endpoint not found')
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        
        if content_length > 0:
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_error(400, 'Invalid JSON')
                return
        else:
            data = {}
        
        if parsed_path.path == '/configure':
            self.configure_dspy(data)
        elif parsed_path.path == '/generate':
            self.generate_response(data)
        elif parsed_path.path == '/optimize':
            self.optimize_pipeline(data)
        else:
            self.send_error(404, 'Endpoint not found')
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def get_available_models(self):
        """Get list of available DSPy models"""
        if not DSPY_AVAILABLE:
            return []
        
        return [
            'gpt-4',
            'gpt-3.5-turbo',
            'claude-3-5-sonnet-20241022',
            'gemini-pro',
        ]
    
    def configure_dspy(self, data):
        """Configure DSPy with the provided settings"""
        if not DSPY_AVAILABLE:
            self.send_json_response({
                'error': 'DSPy not available'
            }, 500)
            return
        
        try:
            provider = data.get('provider', 'openai')
            model = data.get('model', 'gpt-3.5-turbo')
            api_key = data.get('api_key')
            
            # Try different DSPy initialization methods based on version
            if provider == 'openai':
                try:
                    # Try modern DSPy LM approach first
                    self.dspy_lm = dspy.LM(model=model, api_key=api_key, max_tokens=1000)
                except Exception:
                    try:
                        # Try legacy OpenAI class
                        OpenAI = getattr(dspy, 'OpenAI', None)
                        if OpenAI:
                            self.dspy_lm = OpenAI(model=model, api_key=api_key, max_tokens=1000)
                        else:
                            raise Exception("OpenAI provider not available")
                    except Exception:
                        # Fallback to basic configuration
                        self.dspy_lm = dspy.LM(model=f"openai/{model}", api_key=api_key)
                        
            elif provider == 'anthropic':
                try:
                    self.dspy_lm = dspy.LM(model=model, api_key=api_key, max_tokens=1000)
                except Exception:
                    try:
                        Claude = getattr(dspy, 'Claude', None)
                        if Claude:
                            self.dspy_lm = Claude(model=model, api_key=api_key, max_tokens=1000)
                        else:
                            raise Exception("Claude provider not available")
                    except Exception:
                        self.dspy_lm = dspy.LM(model=f"anthropic/{model}", api_key=api_key)
                        
            elif provider == 'google':
                try:
                    self.dspy_lm = dspy.LM(model=model, api_key=api_key, max_tokens=1000)
                except Exception:
                    try:
                        GooglePaLM = getattr(dspy, 'GooglePaLM', None)
                        if GooglePaLM:
                            self.dspy_lm = GooglePaLM(model=model, api_key=api_key)
                        else:
                            raise Exception("Google provider not available")
                    except Exception:
                        self.dspy_lm = dspy.LM(model=f"google/{model}", api_key=api_key)
            else:
                raise ValueError(f"Unsupported provider: {provider}")
            
            # Set as default language model
            dspy.settings.configure(lm=self.dspy_lm)
            
            self.send_json_response({
                'status': 'configured',
                'provider': provider,
                'model': model
            })
            
        except Exception as e:
            logger.error(f"Configuration error: {e}")
            self.send_json_response({
                'error': str(e)
            }, 500)
    
    def generate_response(self, data):
        """Generate response using DSPy"""
        if not DSPY_AVAILABLE:
            self.send_json_response({
                'error': 'DSPy not available'
            }, 500)
            return
        
        if not self.dspy_lm:
            self.send_json_response({
                'error': 'DSPy not configured. Call /configure first.'
            }, 400)
            return
        
        try:
            query = data.get('query', '')
            context = data.get('context', '')
            pipeline_type = data.get('pipeline_type', 'basic')
            
            if pipeline_type == 'basic':
                # Simple generation using the LM directly
                try:
                    response = self.dspy_lm(query)
                except Exception:
                    # Fallback to basic predict
                    class BasicSignature(dspy.Signature):
                        """Generate a response to the input."""
                        input = dspy.InputField()
                        output = dspy.OutputField()
                    
                    predictor = dspy.Predict(BasicSignature)
                    result = predictor(input=query)
                    response = result.output
                    
            elif pipeline_type == 'qa':
                # Question-answering pipeline
                class QASignature(dspy.Signature):
                    """Answer questions based on context."""
                    context = dspy.InputField()
                    question = dspy.InputField()
                    answer = dspy.OutputField()
                
                qa = dspy.Predict(QASignature)
                result = qa(context=context, question=query)
                response = result.answer
                
            elif pipeline_type == 'cot':
                # Chain of thought
                class CoTSignature(dspy.Signature):
                    """Think step by step to answer the question."""
                    question = dspy.InputField()
                    reasoning = dspy.OutputField(desc="Step-by-step reasoning")
                    answer = dspy.OutputField()
                
                cot = dspy.ChainOfThought(CoTSignature)
                result = cot(question=query)
                response = f"{result.reasoning}\n\nAnswer: {result.answer}"
            else:
                raise ValueError(f"Unsupported pipeline type: {pipeline_type}")
            
            self.send_json_response({
                'response': str(response),
                'pipeline_type': pipeline_type
            })
            
        except Exception as e:
            logger.error(f"Generation error: {e}")
            self.send_json_response({
                'error': str(e)
            }, 500)
    
    def optimize_pipeline(self, data):
        """Optimize DSPy pipeline with examples"""
        if not DSPY_AVAILABLE:
            self.send_json_response({
                'error': 'DSPy not available'
            }, 500)
            return
        
        try:
            examples = data.get('examples', [])
            pipeline_type = data.get('pipeline_type', 'basic')
            
            if len(examples) == 0:
                self.send_json_response({
                    'error': 'No examples provided for optimization'
                }, 400)
                return
            
            # Convert examples to DSPy format
            dspy_examples = []
            for ex in examples:
                dspy_examples.append(dspy.Example(
                    question=ex.get('input', ''),
                    answer=ex.get('output', '')
                ).with_inputs('question'))
            
            # Create pipeline to optimize
            if pipeline_type == 'qa':
                class OptimizeQASignature(dspy.Signature):
                    """Answer questions accurately."""
                    question = dspy.InputField()
                    answer = dspy.OutputField()
                
                pipeline = dspy.Predict(OptimizeQASignature)
            else:
                class OptimizeCoTSignature(dspy.Signature):
                    """Think step by step to answer questions."""
                    question = dspy.InputField()
                    answer = dspy.OutputField()
                
                pipeline = dspy.ChainOfThought(OptimizeCoTSignature)
            
            # Use BootstrapFewShot for optimization
            def validate_answer(example, pred, trace=None):
                return example.answer.strip().lower() in pred.answer.strip().lower()
            
            optimizer = dspy.BootstrapFewShot(metric=validate_answer)
            optimized_pipeline = optimizer.compile(pipeline, trainset=dspy_examples)
            
            # Store the optimized pipeline (in a real implementation, you'd save this)
            self.optimized_pipeline = optimized_pipeline
            
            self.send_json_response({
                'status': 'optimized',
                'pipeline_type': pipeline_type,
                'examples_used': len(examples)
            })
            
        except Exception as e:
            logger.error(f"Optimization error: {e}")
            self.send_json_response({
                'error': str(e)
            }, 500)
    
    def log_message(self, format, *args):
        """Override to customize logging"""
        logger.info(f"{self.address_string()} - {format % args}")

def run_server(port=8765):
    """Run the DSPy service server"""
    server_address = ('localhost', port)
    httpd = HTTPServer(server_address, DSPyHandler)
    
    logger.info(f"DSPy service starting on http://localhost:{port}")
    logger.info(f"DSPy available: {DSPY_AVAILABLE}")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Shutting down DSPy service...")
        httpd.shutdown()

if __name__ == '__main__':
    port = 8765
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            logger.error("Invalid port number")
            sys.exit(1)
    
    run_server(port) 