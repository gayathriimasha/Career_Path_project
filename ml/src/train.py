import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import xgboost as xgb
import joblib
from preprocess import extract_features
import json

def train_model():
    """
    Train career prediction model using XGBoost with academic weighting
    """
    print("="*60)
    print("CAREER PREDICTION MODEL TRAINING")
    print("="*60)

    # Load data
    print("\n[1/7] Loading training data...")
    df = pd.read_csv("ml/data/training_data.csv")
    print(f"Loaded {len(df)} samples across {df['career'].nunique()} careers")

    # Extract features
    print("\n[2/7] Extracting features...")
    X = extract_features(df)
    y = df['career']

    # Load label encoder
    le = joblib.load('ml/models/label_encoder.pkl')
    y_encoded = le.transform(y)

    print(f"Feature matrix shape: {X.shape}")
    print(f"Target classes: {list(le.classes_)}")

    # Split data
    print("\n[3/7] Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")

    # Configure XGBoost model
    print("\n[4/7] Configuring model...")
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        objective='multi:softprob',
        eval_metric='mlogloss',
        random_state=42,
        tree_method='hist'
    )

    # Train model
    print("\n[5/7] Training model...")
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False
    )
    print("Training complete!")

    # Evaluate model
    print("\n[6/7] Evaluating model...")
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nTest Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    print(f"Cross-validation Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    # Detailed classification report
    print("\n" + "="*60)
    print("CLASSIFICATION REPORT")
    print("="*60)
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\n" + "="*60)
    print("TOP 10 MOST IMPORTANT FEATURES")
    print("="*60)
    print(feature_importance.head(10).to_string(index=False))

    # Save model
    print("\n[7/7] Saving model...")
    model_path = "ml/models/career_model.pkl"
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")

    # Save feature names
    feature_names_path = "ml/models/feature_names.json"
    with open(feature_names_path, 'w') as f:
        json.dump(list(X.columns), f)
    print(f"Feature names saved to: {feature_names_path}")

    # Save model metadata
    metadata = {
        "accuracy": float(accuracy),
        "cv_mean": float(cv_scores.mean()),
        "cv_std": float(cv_scores.std()),
        "n_samples": len(df),
        "n_features": X.shape[1],
        "classes": list(le.classes_),
        "model_type": "XGBoost",
        "version": "2.0"
    }

    metadata_path = "ml/models/model_metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {metadata_path}")

    print("\n" + "="*60)
    print("MODEL TRAINING COMPLETE!")
    print("="*60)
    print(f"[OK] Model accuracy: {accuracy*100:.2f}%")
    print(f"[OK] Model type: XGBoost with {model.n_estimators} estimators")
    print(f"[OK] Ready for deployment")
    print("="*60)

    return model, le, accuracy

if __name__ == "__main__":
    train_model()
