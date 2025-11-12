import React, { useState, useMemo } from 'react';
import TextAnalyzer from './components/TextAnalyzer';
import ImageAnalyzer from './components/ImageAnalyzer';
import WebSearch from './components/WebSearch';
import { SparklesIcon, PhotoIcon, MagnifyingGlassIcon } from './components/common/Icons';

type Tab = 'text' | 'image' | 'search';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('text');

  const renderContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextAnalyzer />;
      case 'image':
        return <ImageAnalyzer />;
      case 'search':
        return <WebSearch />;
      default:
        return null;
    }
  };
  
  const tabs = useMemo(() => [
    { id: 'text' as Tab, label: 'Text Genius', icon: <SparklesIcon className="w-5 h-5 mr-2" /> },
    { id: 'image' as Tab, label: 'Image Inspector', icon: <PhotoIcon className="w-5 h-5 mr-2" /> },
    { id: 'search' as Tab, label: 'Web Search', icon: <MagnifyingGlassIcon className="w-5 h-5 mr-2" /> },
  ], []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Intelligent Assistant</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                  } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
