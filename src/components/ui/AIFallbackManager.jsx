import React, { useState, useEffect } from 'react';
import { Bot, PlayCircle, Pause, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAIFallback } from '../../hooks/useAIFallback';

/**
 * AI Fallback Manager Component
 * For development/testing purposes - allows manual triggering of AI fallback processing
 * In production, this would be replaced by a proper background job system
 */
const AIFallbackManager = ({ className = "" }) => {
  const { processing, stats, lastProcessed, processAIFallbacks } = useAIFallback();
  const [isVisible, setIsVisible] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  // Auto-process interval for demo purposes
  useEffect(() => {
    if (!autoMode) return;

    const interval = setInterval(() => {
      if (!processing) {
        processAIFallbacks();
      }
    }, 30000); // Check every 30 seconds in auto mode

    return () => clearInterval(interval);
  }, [autoMode, processing, processAIFallbacks]);

  // Only show in development environment
  if (import.meta.env?.MODE === 'production') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors mb-2"
        title="AI Fallback Manager"
      >
        <Bot className="h-6 w-6" />
      </button>
      {/* Manager Panel */}
      {isVisible && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>AI Fallback Manager</span>
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Processed:</span>
              <span className="font-medium">
                {lastProcessed ? lastProcessed?.toLocaleTimeString() : 'Never'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Questions Processed:</span>
              <span className="font-medium text-green-600">
                {stats?.processed || 0}
              </span>
            </div>

            {stats?.errors?.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Errors:</span>
                <span className="font-medium text-red-600">
                  {stats?.errors?.length}
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Manual Process Button */}
            <button
              onClick={processAIFallbacks}
              disabled={processing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
            >
              {processing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  <span>Process Now</span>
                </>
              )}
            </button>

            {/* Auto Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto Mode:</span>
              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                  autoMode 
                    ? 'bg-green-100 text-green-700' :'bg-gray-100 text-gray-600'
                }`}
              >
                {autoMode ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Errors Display */}
          {stats?.errors?.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Recent Errors:</span>
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {stats?.errors?.slice(0, 3)?.map((error, index) => (
                  <div key={index} className="text-xs text-red-700">
                    {error?.error || 'Unknown error'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Development Tool:</span> This panel helps test AI fallback 
              functionality. In production, use proper background job processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFallbackManager;