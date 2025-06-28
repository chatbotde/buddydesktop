#!/usr/bin/env python3
"""
Setup script for DSPy integration with Buddy Desktop
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        print(f"Error: {e.stderr.strip()}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required for DSPy")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def main():
    print("🚀 Setting up DSPy for Buddy Desktop")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install DSPy
    success = run_command(
        "python -m pip install -U dspy-ai",
        "Installing DSPy"
    )
    
    if not success:
        print("\n❌ Failed to install DSPy. Please check your Python environment.")
        sys.exit(1)
    
    # Install additional dependencies that might be useful
    additional_deps = [
        "requests",
        "openai",
        "anthropic",
        "google-generativeai"
    ]
    
    for dep in additional_deps:
        run_command(
            f"python -m pip install -U {dep}",
            f"Installing {dep}"
        )
    
    # Test DSPy installation
    print("\n🧪 Testing DSPy installation...")
    try:
        import dspy
        print("✅ DSPy imported successfully")
        print(f"DSPy version: {dspy.__version__ if hasattr(dspy, '__version__') else 'Unknown'}")
    except ImportError as e:
        print(f"❌ Failed to import DSPy: {e}")
        sys.exit(1)
    
    print("\n🎉 DSPy setup completed successfully!")
    print("\nNext steps:")
    print("1. Start the DSPy service: python src/dspy-service.py")
    print("2. Start Buddy Desktop: npm run start")
    print("3. Select 'DSPy (Optimized)' as your provider")
    print("4. Choose a DSPy model and enter your API key")
    
    print("\n📚 DSPy Documentation: https://dspy-docs.vercel.app/")

if __name__ == "__main__":
    main() 