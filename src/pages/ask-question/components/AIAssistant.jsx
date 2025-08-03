import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { geminiService } from '../../../services/geminiService';

const AIAssistant = ({ title, content, course, onSuggestionApply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImproveQuestion = async () => {
    if (!title?.trim() || !content?.trim()) {
      setError('Please enter both a title and description before getting AI suggestions');
      return;
    }

    if (!geminiService?.isConfigured()) {
      setError('AI assistant is not available. Please configure your Gemini API key.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const improvements = await geminiService?.improveQuestion(title, content, course);
      setSuggestions(improvements);
      setIsExpanded(true);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      setError('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyImprovedTitle = () => {
    if (suggestions?.improvedTitle && onSuggestionApply) {
      onSuggestionApply('title', suggestions?.improvedTitle);
    }
  };

  const applySuggestion = (suggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply('content', `${content}\n\n${suggestion}`);
    }
  };

  if (!geminiService?.isConfigured()) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-amber-800">
          <Icon name="Zap" size={16} />
          <span className="text-sm">AI Assistant is not configured</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <h3 className="font-medium text-foreground">AI Question Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Get AI-powered suggestions to improve your question
        </p>
      </div>
      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Action Button */}
          <Button
            onClick={handleImproveQuestion}
            disabled={isLoading || !title?.trim() || !content?.trim()}
            className="w-full mb-4"
            variant="outline"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Analyzing your question...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Icon name="Sparkles" size={16} />
                <span>Get AI Suggestions</span>
              </div>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Suggestions Display */}
          {suggestions && (
            <div className="space-y-4">
              {/* Improved Title */}
              {suggestions?.improvedTitle && suggestions?.improvedTitle !== title && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-green-800 mb-1">
                        Suggested Title Improvement
                      </h4>
                      <p className="text-sm text-green-700 mb-2">
                        {suggestions?.improvedTitle}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={applyImprovedTitle}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}

              {/* Content Suggestions */}
              {suggestions?.suggestions && suggestions?.suggestions?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Content Improvement Suggestions
                  </h4>
                  <div className="space-y-2">
                    {suggestions?.suggestions?.map((suggestion, index) => (
                      <div key={index} className="flex items-start justify-between">
                        <p className="text-sm text-blue-700 flex-1 mr-2">
                          • {suggestion}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => applySuggestion(suggestion)}
                          className="text-blue-700 hover:bg-blue-100 px-2 py-1 h-auto"
                        >
                          <Icon name="Plus" size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Context */}
              {suggestions?.missingContext && suggestions?.missingContext?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    Consider Adding This Context
                  </h4>
                  <div className="space-y-1">
                    {suggestions?.missingContext?.map((context, index) => (
                      <p key={index} className="text-sm text-yellow-700">
                        • {context}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Concepts */}
              {suggestions?.relatedConcepts && suggestions?.relatedConcepts?.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">
                    Related Concepts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions?.relatedConcepts?.map((concept, index) => (
                      <span
                        key={index}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <strong>Tip:</strong> The AI assistant works better with more detailed questions. 
                Include what you've tried, specific examples, and what kind of help you need.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;