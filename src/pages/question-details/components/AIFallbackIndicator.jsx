import React from 'react';
import { Bot, Clock, Sparkles } from 'lucide-react';

const AIFallbackIndicator = ({ question, onGenerateAI, generating = false }) => {
  if (!question) return null;

  const createdAt = new Date(question?.created_at);
  const now = new Date();
  const minutesElapsed = Math.floor((now - createdAt) / (1000 * 60));
  const hasAnswers = question?.answers && question?.answers?.length > 0;
  const isAIAssisted = question?.status === 'ai_assisted';

  // Don't show if question already has human answers
  if (hasAnswers && !isAIAssisted) return null;

  // Show AI assistance available after 15 minutes
  if (minutesElapsed >= 15 && !hasAnswers && !isAIAssisted) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              AI Assistant Ready
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              This question has been waiting for {minutesElapsed} minutes. Our AI can provide an 
              immediate answer to help you get started while you wait for community responses.
            </p>
            <button
              onClick={onGenerateAI}
              disabled={generating}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              {generating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Generating Answer...</span>
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  <span>Get AI Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show countdown if less than 15 minutes
  if (minutesElapsed < 15 && !hasAnswers) {
    const remainingMinutes = 15 - minutesElapsed;
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">AI Assistant:</span> Will be available in{' '}
              <span className="font-semibold text-blue-600">{remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}</span>
              {' '}if no community answers are provided.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show AI-assisted indicator if question has AI answers
  if (isAIAssisted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Bot className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-green-800">
              <span className="font-medium">AI-Assisted Question:</span> This question received an AI-generated 
              answer to help you get started. Community members can still provide additional answers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AIFallbackIndicator;