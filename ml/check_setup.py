#!/usr/bin/env python3
"""
Quick setup checker for ML service
Run: python check_setup.py
"""
import os
import sys

def check_setup():
    print("=" * 60)
    print("ML Service Setup Checker")
    print("=" * 60)

    checks = []

    # Check 1: Dataset exists
    dataset_path = "ml/data/student-scores.csv"
    if os.path.exists(dataset_path):
        checks.append(("✓", f"Dataset found: {dataset_path}"))
    else:
        checks.append(("✗", f"Dataset missing: {dataset_path}"))

    # Check 2: Models directory exists
    models_dir = "ml/models"
    if os.path.exists(models_dir):
        checks.append(("✓", f"Models directory exists: {models_dir}"))

        # Check for trained models
        required_models = [
            "scalerA.joblib",
            "scalerB.joblib",
            "centroids.pkl",
            "main_lgbm.pkl",
            "sub_classifiers.pkl",
            "feature_names.pkl"
        ]

        for model in required_models:
            model_path = os.path.join(models_dir, model)
            if os.path.exists(model_path):
                checks.append(("✓", f"  Model found: {model}"))
            else:
                checks.append(("✗", f"  Model missing: {model}"))
    else:
        checks.append(("✗", f"Models directory missing: {models_dir}"))

    # Check 3: Required packages
    try:
        import pandas
        import numpy
        import sklearn
        import lightgbm
        import fastapi
        import uvicorn
        import joblib
        import scipy
        checks.append(("✓", "All required Python packages installed"))
    except ImportError as e:
        checks.append(("✗", f"Missing package: {str(e)}"))

    # Print results
    print("\nSetup Status:\n")
    for symbol, message in checks:
        print(f"{symbol} {message}")

    # Summary
    all_pass = all(check[0] == "✓" for check in checks)
    print("\n" + "=" * 60)
    if all_pass:
        print("✓ All checks passed! You're ready to train and run the service.")
        print("\nNext steps:")
        print("  1. Train models: python src/train.py")
        print("  2. Start service: uvicorn src.service:app --host 127.0.0.1 --port 8001")
    else:
        print("✗ Some checks failed. Please address the issues above.")
        print("\nCommon fixes:")
        print("  - Install packages: pip install -r requirements.txt")
        print("  - Add dataset: Place student-scores.csv in ml/data/")
        print("  - Train models: python src/train.py")
    print("=" * 60)

    return 0 if all_pass else 1

if __name__ == "__main__":
    sys.exit(check_setup())
