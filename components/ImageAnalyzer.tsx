import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';
import { PhotoIcon, DocumentArrowUpIcon } from './common/Icons';

const ImageAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ file: File; preview: string; base64: string; } | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image size should be less than 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage({
          file,
          preview: URL.createObjectURL(file),
          base64: base64String,
        });
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !image) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    try {
      const response = await analyzeImage(prompt, image.base64, image.file.type);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#101232]/60 rounded-lg p-6 shadow-lg backdrop-blur-md border border-[#3a2d5e]">
      <h2 className="text-2xl font-bold mb-4 text-white">Image Inspector</h2>
      <p className="text-slate-400 mb-6">Upload an image and ask a question about it. Powered by Gemini 2.5 Flash for quick visual understanding.</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#3a2d5e] rounded-lg text-center cursor-pointer hover:border-teal-500 hover:bg-[#101232] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={isLoading}
          />
          {image ? (
            <img src={image.preview} alt="Preview" className="max-h-48 rounded-md object-contain" />
          ) : (
            <>
              <DocumentArrowUpIcon className="w-12 h-12 text-slate-500" />
              <p className="mt-2 text-sm text-slate-400">
                <span className="font-semibold text-teal-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 4MB</p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What is in this image? Describe the main subject."
            className="w-full h-40 md:h-full p-3 bg-[#0a0a2a] border border-[#3a2d5e] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim() || !image}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-[#0a0a2a] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <LoadingSpinner /> : <><PhotoIcon className="w-5 h-5 mr-2" /> Analyze Image</>}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-900/30 text-red-400 border border-red-800 rounded-md">{error}</div>}

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Analysis:</h3>
          <div className="p-4 bg-[#0a0a2a] rounded-md border border-[#3a2d5e] prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;