"use client";
import { useState } from "react";

export default function ReportAnalysisPage() {
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
      setResult({ error: 'Analysis failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-800">Clinical Report Analysis</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter clinical text or patient notes..."
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        
        <button
          onClick={analyzeText}
          disabled={loading || !text.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-3">Analysis Results:</h3>
            <div className="space-y-2">
              <p><strong className="text-emerald-700">Symptoms:</strong> {result.symptoms?.length ? result.symptoms.join(', ') : 'None detected'}</p>
              <p><strong className="text-emerald-700">Diagnosis:</strong> {result.diagnosis?.length ? result.diagnosis.join(', ') : 'None detected'}</p>
              <p><strong className="text-emerald-700">Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}