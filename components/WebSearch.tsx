import React, { useState } from 'react';
import { searchWeb } from '../services/geminiService';
import type { GroundingChunk } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import { MagnifyingGlassIcon } from './common/Icons';

const WebSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: GroundingChunk[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await searchWeb(query);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg backdrop-blur-md border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Web Search</h2>
      <p className="text-slate-400 mb-6">Ask questions about recent events or anything that requires up-to-date information. Powered by Gemini 2.5 Flash with Google Search grounding.</p>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
          placeholder="e.g., What are the latest AI developments this month?"
          className="flex-grow p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !query.trim()}
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <LoadingSpinner /> : <MagnifyingGlassIcon className="w-5 h-5" />}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Answer:</h3>
          <div className="p-4 bg-slate-900 rounded-md border border-slate-700 prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
            {result.text}
          </div>
          {result.sources && result.sources.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-slate-300">Sources:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.web?.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      {source.web?.title || source.web?.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebSearch;
