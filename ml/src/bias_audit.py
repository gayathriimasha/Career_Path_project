"""
Bias auditing framework for career prediction model
Analyzes predictions for fairness and potential biases
"""
import pandas as pd
import numpy as np
import joblib
import os
from collections import defaultdict
import json
from datetime import datetime
import sys

# Import preprocessing functions from train.py
sys.path.append('ml/src')
from train import load_and_preprocess, engineer_latent_traits

def load_models():
    """Load trained models"""
    model_dir = "ml/models"
    models = {}
    models['scaler_A'] = joblib.load(f"{model_dir}/scalerA.joblib")
    models['scaler_B'] = joblib.load(f"{model_dir}/scalerB.joblib")
    models['centroids'] = joblib.load(f"{model_dir}/centroids.pkl")
    models['main_classifier'] = joblib.load(f"{model_dir}/main_lgbm.pkl")
    models['feature_names'] = joblib.load(f"{model_dir}/feature_names.pkl")
    return models

def predict_career(row, models, all_features):
    """Predict career for a single row"""
    X = row[all_features].fillna(0).values.reshape(1, -1)

    # Get classifier prediction
    probs = models['main_classifier'].predict_proba(X)[0]
    classes = models['main_classifier'].classes_
    top_idx = np.argmax(probs)
    predicted_career = classes[top_idx]
    confidence = probs[top_idx]

    return predicted_career, confidence

def audit_bias(dataset_path="ml/data/student-scores-transformed.csv"):
    """Run comprehensive bias audit"""
    print("=" * 70)
    print("Career Prediction Model - Bias Audit Report")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    # Load data and models
    print("\n[1/5] Loading data and models...")
    df = load_and_preprocess(dataset_path)
    models = load_models()
    all_features = models['feature_names']['all']
    print(f"   Loaded {len(df)} samples")

    # Generate predictions
    print("\n[2/5] Generating predictions for all samples...")
    predictions = []
    confidences = []
    for idx, row in df.iterrows():
        pred, conf = predict_career(row, models, all_features)
        predictions.append(pred)
        confidences.append(conf)

    df['predicted_career'] = predictions
    df['confidence'] = confidences

    print(f"   Generated {len(predictions)} predictions")
    print(f"   Average confidence: {np.mean(confidences):.3f}")

    # Analyze overall distribution
    print("\n[3/5] Analyzing prediction distribution...")
    pred_dist = df['predicted_career'].value_counts()
    label_dist = df['label_main'].value_counts()

    print("\n   Predicted vs. True Distribution:")
    print(f"   {'Career':<40} {'Predicted':>10} {'Actual':>10} {'Diff':>10}")
    print("   " + "-" * 70)

    all_careers = set(pred_dist.index) | set(label_dist.index)
    for career in sorted(all_careers):
        pred_count = pred_dist.get(career, 0)
        label_count = label_dist.get(career, 0)
        diff = pred_count - label_count
        print(f"   {career:<40} {pred_count:>10} {label_count:>10} {diff:>+10}")

    # Analyze by academic score ranges
    print("\n[4/5] Analyzing bias by academic performance...")

    # Create score bins
    df['math_mid'] = df['math_score_bin'].map({
        "0–35": 17.5, "35–55": 45.0, "55–75": 65.0, "75–100": 87.5
    })
    df['computing_mid'] = df['computing_score_bin'].map({
        "0–35": 17.5, "35–55": 45.0, "55–75": 65.0, "75–100": 87.5
    })

    # Check for STEM bias
    stem_careers = ['Software Engineering', 'Data & AI', 'Core Engineering']
    high_math = df['math_mid'] >= 65
    high_computing = df['computing_mid'] >= 65

    print("\n   STEM Career Prediction Analysis:")
    print(f"   High math (>=65) students: {high_math.sum()}")
    print(f"      Predicted STEM: {df[high_math]['predicted_career'].isin(stem_careers).sum()} ({df[high_math]['predicted_career'].isin(stem_careers).mean()*100:.1f}%)")

    print(f"\n   Low math (<65) students: {(~high_math).sum()}")
    print(f"      Predicted STEM: {df[~high_math]['predicted_career'].isin(stem_careers).sum()} ({df[~high_math]['predicted_career'].isin(stem_careers).mean()*100:.1f}%)")

    # Check confidence by career
    print("\n   Average Confidence by Career:")
    career_conf = df.groupby('predicted_career')['confidence'].agg(['mean', 'std', 'count'])
    career_conf = career_conf.sort_values('mean', ascending=False)

    print(f"   {'Career':<40} {'Avg Conf':>10} {'Std':>8} {'Count':>8}")
    print("   " + "-" * 70)
    for career, row in career_conf.iterrows():
        print(f"   {career:<40} {row['mean']:>10.3f} {row['std']:>8.3f} {int(row['count']):>8}")

    # Check for over/under-representation
    print("\n[5/5] Identifying potential biases...")

    biases_found = []

    # Check 1: Is any career predicted much more/less than actual?
    for career in all_careers:
        pred_pct = pred_dist.get(career, 0) / len(df) * 100
        label_pct = label_dist.get(career, 0) / len(df) * 100
        diff_pct = pred_pct - label_pct

        if abs(diff_pct) > 3:  # More than 3% difference
            biases_found.append({
                'type': 'Distribution imbalance',
                'career': career,
                'description': f"Predicted {pred_pct:.1f}% vs actual {label_pct:.1f}% ({diff_pct:+.1f}% diff)",
                'severity': 'HIGH' if abs(diff_pct) > 5 else 'MEDIUM'
            })

    # Check 2: Confidence disparity
    conf_mean = career_conf['mean'].mean()
    conf_std = career_conf['mean'].std()
    for career, row in career_conf.iterrows():
        if row['count'] >= 20:  # Only check careers with enough samples
            z_score = (row['mean'] - conf_mean) / conf_std
            if abs(z_score) > 1.5:
                biases_found.append({
                    'type': 'Confidence disparity',
                    'career': career,
                    'description': f"Confidence {row['mean']:.3f} vs avg {conf_mean:.3f} (z={z_score:.2f})",
                    'severity': 'MEDIUM' if abs(z_score) > 2 else 'LOW'
                })

    # Report biases
    print("\n   Potential Biases Detected:")
    if biases_found:
        for i, bias in enumerate(biases_found, 1):
            print(f"\n   [{i}] {bias['type']} - {bias['severity']}")
            print(f"       Career: {bias['career']}")
            print(f"       Details: {bias['description']}")
    else:
        print("   No significant biases detected!")

    # Save audit report
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_samples': len(df),
        'avg_confidence': float(np.mean(confidences)),
        'distribution': {
            'predicted': pred_dist.to_dict(),
            'actual': label_dist.to_dict()
        },
        'biases_found': biases_found
    }

    report_path = "ml/models/bias_audit_report.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)

    print(f"\n   Report saved to: {report_path}")

    # Summary and recommendations
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    print(f"\nBiases detected: {len(biases_found)}")
    high_severity = sum(1 for b in biases_found if b['severity'] == 'HIGH')
    medium_severity = sum(1 for b in biases_found if b['severity'] == 'MEDIUM')
    low_severity = sum(1 for b in biases_found if b['severity'] == 'LOW')

    print(f"   HIGH severity: {high_severity}")
    print(f"   MEDIUM severity: {medium_severity}")
    print(f"   LOW severity: {low_severity}")

    print("\nRECOMMENDATIONS:")
    if high_severity > 0:
        print("   [!] HIGH severity biases found. Immediate action required:")
        print("       - Review training data for label quality")
        print("       - Consider re-balancing classes using SMOTE or class weights")
        print("       - Audit feature engineering for hidden proxies")

    if medium_severity > 0:
        print("   [!] MEDIUM severity biases found. Monitor and improve:")
        print("       - Track prediction distributions over time")
        print("       - Gather more diverse training data")
        print("       - Consider ensemble methods to reduce variance")

    print("\n   [*] Regular monitoring recommended:")
    print("       - Run this audit monthly")
    print("       - Compare with user feedback")
    print("       - Track prediction impact on user decisions")

    print("\n" + "=" * 70)
    print("Audit complete!")
    print("=" * 70)

    return report

if __name__ == "__main__":
    audit_bias()
