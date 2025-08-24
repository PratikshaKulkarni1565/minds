import warnings
warnings.filterwarnings('ignore')
from transformers import AutoTokenizer, AutoModel, pipeline
import torch
import json
import re

# Global model instance
_model = None
_tokenizer = None
_ner_pipeline = None

def _load_model():
    global _model, _tokenizer, _ner_pipeline
    if _model is None:
        _tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        _model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        _ner_pipeline = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")

def analyze_clinical_text(text: str) -> dict:
    _load_model()
    
    # Extract entities using biomedical NER
    entities = _ner_pipeline(text)
    
    symptoms = []
    diagnoses = []
    
    # Extract symptoms and diagnoses from entities
    for entity in entities:
        word = entity['word'].replace('##', '').strip()
        if entity['entity_group'] in ['DISEASE', 'SYMPTOM'] and word:
            if any(s in word.lower() for s in ['pain', 'ache', 'seizure', 'loss', 'fever', 'nausea']):
                symptoms.append(word)
            else:
                diagnoses.append(word)
    
    # Regex fallback for common symptoms
    symptom_matches = re.findall(r'\b(seizures?|memory loss|headaches?|pain|nausea|fatigue)\b', text.lower())
    symptoms.extend([s for s in symptom_matches if s not in symptoms])
    
    # Calculate confidence
    confidence = sum(e['score'] for e in entities) / len(entities) if entities else 0.0
    
    return {
        "symptoms": list(set(symptoms)),
        "diagnosis": list(set(diagnoses)),
        "confidence": float(round(confidence, 3))
    }

if __name__ == "__main__":
    result = analyze_clinical_text("The patient experienced seizures and memory loss.")
    print(json.dumps(result, indent=2))