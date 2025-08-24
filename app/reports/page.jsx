"use client";
import { useState } from "react";

export default function ReportsPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clinical-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clinical Text Analysis</h1>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter clinical text..."
        className="w-full p-3 border rounded mb-4"
        rows={4}
      />
      
      <button
        onClick={analyzeText}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Results:</h3>
          <p><strong>Symptoms:</strong> {result.symptoms.join(', ')}</p>
          <p><strong>Diagnosis:</strong> {result.diagnosis.join(', ')}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
}