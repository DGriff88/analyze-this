import React, { useState } from 'react';
import { analyzeText } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';
import { SparklesIcon } from './common/Icons';

const TextAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    setHasGenerated(true);
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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Column */}
      <div className="bg-[#101232]/60 rounded-lg p-6 shadow-lg backdrop-blur-md border border-[#3a2d5e] flex flex-col">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-4 text-white">Input</h2>
          <p className="text-slate-400 mb-6">Enter any request or text to analyze, summarize, translate, or more. Powered by Gemini 2.5 Pro for complex reasoning.</p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Summarize the following article for a 5th grader..."
            className="w-full h-48 p-3 bg-[#0a0a2a] border border-[#3a2d5e] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="w-full mt-6 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-[#0a0a2a] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <LoadingSpinner /> : <><SparklesIcon className="w-5 h-5 mr-2" /> Generate</>}
        </button>
      </div>

      {/* Output Column */}
      <div className="bg-[#101232]/60 rounded-lg p-6 shadow-lg backdrop-blur-md border border-[#3a2d5e]">
        <h2 className="text-2xl font-bold mb-4 text-white">Result</h2>
        <div className="bg-[#0a0a2a] rounded-md border border-[#3a2d5e] min-h-[344px] p-4 flex flex-col justify-center transition-all duration-300">
          {isLoading && (
            <div className="m-auto text-center">
              <LoadingSpinner />
              <p className="text-sm text-slate-400 mt-2">Generating...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="m-auto text-center text-red-400 p-4 bg-red-900/30 rounded-md">
              <h3 className="font-bold mb-2">An Error Occurred</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && result && (
            <div className={`transition-opacity duration-700 ease-in-out ${result ? 'opacity-100' : 'opacity-0'} prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap`}>
              {result}
            </div>
          )}
          {!hasGenerated && !isLoading && !error && !result && (
            <div className="m-auto text-center text-slate-500">
              <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
              <p>Your generated text will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextAnalyzer;