import pandas as pd
import numpy as np
import random

# Career categories matching the roadmaps
CAREERS = [
    "Science",
    "Medical",
    "Engineering",
    "Hospitality",
    "Business & Finance",
    "Information Technology",
    "Agriculture",
    "Creative",
    "Architecture",
    "Community & Social Services",
    "Education"
]

# Answer patterns for each career (questions 4-23, 20 behavioral questions)
# Each career has preferred answers for behavioral questions
CAREER_PROFILES = {
    "Science": {
        "patterns": {
            4: 0, 5: 0, 6: 0, 7: 0, 8: 2, 9: 1, 10: 0, 11: 0, 12: 1, 13: 0,
            14: 0, 15: 0, 16: 1, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 2
        },
        "academic_requirements": {
            24: 3, 25: 3, 26: 2, 27: 1, 28: 2, 29: 1, 30: 2
        }
    },
    "Medical": {
        "patterns": {
            4: 1, 5: 1, 6: 1, 7: 0, 8: 1, 9: 1, 10: 0, 11: 1, 12: 0, 13: 1,
            14: 1, 15: 1, 16: 0, 17: 1, 18: 1, 19: 3, 20: 1, 21: 1, 22: 1, 23: 0
        },
        "academic_requirements": {
            24: 3, 25: 3, 26: 3, 27: 1, 28: 1, 29: 1, 30: 2
        }
    },
    "Engineering": {
        "patterns": {
            4: 0, 5: 2, 6: 0, 7: 0, 8: 2, 9: 0, 10: 1, 11: 0, 12: 3, 13: 3,
            14: 1, 15: 2, 16: 1, 17: 0, 18: 2, 19: 0, 20: 0, 21: 0, 22: 0, 23: 1
        },
        "academic_requirements": {
            24: 3, 25: 3, 26: 1, 27: 1, 28: 2, 29: 1, 30: 1
        }
    },
    "Hospitality": {
        "patterns": {
            4: 3, 5: 3, 6: 3, 7: 1, 8: 3, 9: 2, 10: 3, 11: 3, 12: 1, 13: 3,
            14: 2, 15: 1, 16: 2, 17: 2, 18: 3, 19: 3, 20: 3, 21: 1, 22: 3, 23: 0
        },
        "academic_requirements": {
            24: 1, 25: 1, 26: 1, 27: 2, 28: 1, 29: 1, 30: 2
        }
    },
    "Business & Finance": {
        "patterns": {
            4: 0, 5: 3, 6: 3, 7: 3, 8: 0, 9: 1, 10: 3, 11: 0, 12: 1, 13: 3,
            14: 0, 15: 3, 16: 1, 17: 2, 18: 2, 19: 2, 20: 3, 21: 0, 22: 3, 23: 0
        },
        "academic_requirements": {
            24: 3, 25: 1, 26: 1, 27: 3, 28: 2, 29: 1, 30: 2
        }
    },
    "Information Technology": {
        "patterns": {
            4: 0, 5: 3, 6: 0, 7: 1, 8: 2, 9: 0, 10: 1, 11: 0, 12: 3, 13: 0,
            14: 0, 15: 2, 16: 3, 17: 0, 18: 0, 19: 0, 20: 2, 21: 0, 22: 0, 23: 1
        },
        "academic_requirements": {
            24: 3, 25: 1, 26: 1, 27: 1, 28: 3, 29: 1, 30: 1
        }
    },
    "Agriculture": {
        "patterns": {
            4: 1, 5: 2, 6: 3, 7: 1, 8: 1, 9: 3, 10: 3, 11: 2, 12: 0, 13: 3,
            14: 2, 15: 1, 16: 1, 17: 1, 18: 3, 19: 2, 20: 1, 21: 3, 22: 1, 23: 2
        },
        "academic_requirements": {
            24: 1, 25: 2, 26: 2, 27: 1, 28: 1, 29: 1, 30: 1
        }
    },
    "Creative": {
        "patterns": {
            4: 2, 5: 3, 6: 1, 7: 1, 8: 3, 9: 1, 10: 2, 11: 2, 12: 2, 13: 2,
            14: 1, 15: 2, 16: 2, 17: 3, 18: 1, 19: 1, 20: 2, 21: 2, 22: 1, 23: 3
        },
        "academic_requirements": {
            24: 1, 25: 1, 26: 1, 27: 1, 28: 1, 29: 3, 30: 2
        }
    },
    "Architecture": {
        "patterns": {
            4: 0, 5: 2, 6: 0, 7: 2, 8: 2, 9: 1, 10: 1, 11: 0, 12: 1, 13: 3,
            14: 0, 15: 2, 16: 1, 17: 2, 18: 0, 19: 1, 20: 2, 21: 2, 22: 0, 23: 3
        },
        "academic_requirements": {
            24: 3, 25: 2, 26: 1, 27: 1, 28: 2, 29: 3, 30: 1
        }
    },
    "Community & Social Services": {
        "patterns": {
            4: 3, 5: 1, 6: 1, 7: 3, 8: 3, 9: 2, 10: 3, 11: 3, 12: 1, 13: 1,
            14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 3, 20: 1, 21: 1, 22: 1, 23: 1
        },
        "academic_requirements": {
            24: 1, 25: 1, 26: 2, 27: 1, 28: 1, 29: 1, 30: 3
        }
    },
    "Education": {
        "patterns": {
            4: 3, 5: 3, 6: 2, 7: 2, 8: 3, 9: 1, 10: 3, 11: 1, 12: 1, 13: 1,
            14: 1, 15: 1, 16: 0, 17: 1, 18: 3, 19: 3, 20: 1, 21: 1, 22: 1, 23: 2
        },
        "academic_requirements": {
            24: 2, 25: 1, 26: 1, 27: 1, 28: 1, 29: 2, 30: 3
        }
    }
}

def generate_sample(career, noise_level=0.2):
    """Generate a single realistic sample for a given career"""
    profile = CAREER_PROFILES[career]
    sample = {}

    # Generate behavioral questions (4-23) with some noise
    for q_id in range(4, 24):
        preferred_answer = profile["patterns"][q_id]
        if random.random() < noise_level:
            # Add noise: pick different answer
            sample[f"q{q_id}"] = random.randint(0, 3)
        else:
            # Pick preferred or adjacent answer
            if random.random() < 0.8:
                sample[f"q{q_id}"] = preferred_answer
            else:
                # Pick adjacent answer
                sample[f"q{q_id}"] = max(0, min(3, preferred_answer + random.choice([-1, 1])))

    # Generate academic scores (24-30) based on requirements
    for q_id in range(24, 31):
        required_level = profile["academic_requirements"][q_id]
        if required_level == 3:  # High requirement (75-100)
            if random.random() < 0.8:
                sample[f"q{q_id}"] = 3  # 75-100
            else:
                sample[f"q{q_id}"] = 2  # 55-75
        elif required_level == 2:  # Medium requirement (55-75)
            sample[f"q{q_id}"] = random.choice([1, 2, 3])
        else:  # Low requirement (any score)
            sample[f"q{q_id}"] = random.randint(0, 3)

    sample["career"] = career
    return sample

def generate_dataset(samples_per_career=200):
    """Generate complete training dataset"""
    data = []
    for career in CAREERS:
        for _ in range(samples_per_career):
            # Vary noise level for realism
            noise = random.uniform(0.1, 0.3)
            sample = generate_sample(career, noise_level=noise)
            data.append(sample)

    df = pd.DataFrame(data)

    # Shuffle the dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    return df

if __name__ == "__main__":
    print("Generating training dataset...")
    df = generate_dataset(samples_per_career=200)

    output_path = "ml/data/training_data.csv"
    df.to_csv(output_path, index=False)

    print(f"Dataset generated: {len(df)} samples")
    print(f"Saved to: {output_path}")
    print(f"\nCareer distribution:")
    print(df["career"].value_counts().sort_index())
    print(f"\nSample row:")
    print(df.head(1).to_dict('records'))
