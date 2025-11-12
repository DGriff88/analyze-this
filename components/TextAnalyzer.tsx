import React, { useState } from 'react';
import { analyzeText } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';
import { SparklesIcon } from './common/Icons';

const TextAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    try {
      const response = await analyzeText(prompt);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg backdrop-blur-md border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Text Genius</h2>
      <p className="text-slate-400 mb-6">Enter any request or text to analyze, summarize, translate, or more. Powered by Gemini 2.5 Pro for complex reasoning.</p>
      
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Summarize the following article for a 5th grader..."
          className="w-full h-40 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <LoadingSpinner /> : <><SparklesIcon className="w-5 h-5 mr-2" /> Generate</>}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Result:</h3>
          <div className="p-4 bg-slate-900 rounded-md border border-slate-700 prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;
