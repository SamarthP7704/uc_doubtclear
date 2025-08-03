import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { geminiService } from '../../../services/geminiService';

const AIAnswerGenerator = ({ question, onGeneratedAnswer }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateAnswer = async () => {
    if (!geminiService?.isConfigured()) {
      setError('AI answer generation is not available. Please configure your Gemini API key.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStreamingText('');
    setShowPreview(true);

    try {
      await geminiService?.streamAnswer(
        question?.title || '',
        question?.content || '',
        question?.course_name || question?.course?.name || '',
        (chunk) => {
          setStreamingText(prev => prev + chunk);
        }
      );
    } catch (error) {
      console.error('Error generating AI answer:', error);
      setError('Failed to generate AI answer. Please try again.');
      setStreamingText('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseAnswer = () => {
    if (streamingText && onGeneratedAnswer) {
      onGeneratedAnswer(streamingText);
      setStreamingText('');
      setShowPreview(false);
    }
  };

  const handleDiscard = () => {
    setStreamingText('');
    setShowPreview(false);
    setError('');
  };

  if (!geminiService?.isConfigured()) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-amber-800">
          <Icon name="Zap" size={16} />
          <span className="text-sm">AI Answer Generator is not configured</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg mb-6">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <h3 className="font-medium text-foreground">AI Answer Generator</h3>
          </div>
          <Button
            onClick={handleGenerateAnswer}
            disabled={isGenerating}
            size="sm"
            variant="outline"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Icon name="Sparkles" size={16} />
                <span>Generate AI Answer</span>
              </div>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Get an AI-generated answer as a starting point for your response
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Streaming Preview */}
      {showPreview && (
        <div className="p-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">AI Generated Answer Preview</h4>
              {isGenerating && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Loader2" size={14} className="animate-spin" />
                  <span className="text-xs">Generating...</span>
                </div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none text-foreground min-h-[100px] max-h-[400px] overflow-y-auto">
              {streamingText ? (
                <div className="whitespace-pre-wrap">{streamingText}</div>
              ) : isGenerating ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>AI is analyzing the question and generating an answer...</span>
                </div>
              ) : (
                <div className="text-muted-foreground">No content generated yet</div>
              )}
              
              {isGenerating && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1">|</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {streamingText && !isGenerating && (
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleUseAnswer}
                size="sm"
                className="flex-1"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} />
                  <span>Use This Answer</span>
                </div>
              </Button>
              <Button
                onClick={handleDiscard}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="X" size={16} />
                  <span>Discard</span>
                </div>
              </Button>
              <Button
                onClick={handleGenerateAnswer}
                size="sm"
                variant="ghost"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="RefreshCw" size={16} />
                  <span>Regenerate</span>
                </div>
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> This is an AI-generated answer. Please review, verify, and personalize 
                it before submitting. Add your own insights and ensure accuracy for the specific context.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {!showPreview && (
        <div className="p-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <strong>Tips for better AI answers:</strong>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• AI works better with detailed questions</li>
                  <li>• Always review and personalize AI-generated content</li>
                  <li>• Add your own examples and insights</li>
                  <li>• Verify accuracy before submitting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnswerGenerator;