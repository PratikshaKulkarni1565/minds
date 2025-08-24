from clinical_bert_analyzer import analyze_clinical_text
import json

# Test with sample text
result = analyze_clinical_text("The patient experienced seizures and memory loss.")
print(json.dumps(result, indent=2))

# Additional test
result2 = analyze_clinical_text("Patient has chest pain and shortness of breath.")
print(json.dumps(result2, indent=2))