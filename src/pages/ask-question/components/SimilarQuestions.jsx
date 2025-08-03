import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionService } from '../../../services/questionService';
import { geminiService } from '../../../services/geminiService';
import Icon from '../../../components/AppIcon';


const SimilarQuestions = ({ currentTitle, currentCourse }) => {
  const navigate = useNavigate();
  const [similarQuestions, setSimilarQuestions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentTitle?.length > 10) {
      loadSimilarQuestions();
      if (geminiService?.isConfigured()) {
        loadAISuggestions();
      }
    }
  }, [currentTitle, currentCourse]);

  const loadSimilarQuestions = async () => {
    if (!currentTitle?.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await questionService?.searchSimilarQuestions(currentTitle, currentCourse);
      
      if (error) {
        setError('Unable to load similar questions');
        return;
      }
      
      setSimilarQuestions(data?.slice(0, 5) || []);
    } catch (error) {
      setError('Failed to load similar questions');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAISuggestions = async () => {
    if (!currentTitle?.trim() || !currentCourse) return;
    
    setIsLoadingAI(true);
    
    try {
      const suggestions = await geminiService?.suggestSimilarQuestions(currentTitle, currentCourse);
      setAiSuggestions(Array.isArray(suggestions) ? suggestions?.slice(0, 3) : []);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
      // Don't show error for AI suggestions - it's not critical
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question-details/${questionId}`);
  };

  if (!currentTitle?.trim() || currentTitle?.length < 10) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Search" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Similar Questions</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          Start typing your question title to see similar questions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Search" size={20} className="text-primary" />
        <h3 className="font-medium text-foreground">Similar Questions</h3>
      </div>
      {/* Database Similar Questions */}
      {isLoading && (
        <div className="flex items-center space-x-2 text-muted-foreground py-4">
          <Icon name="Loader2" size={16} className="animate-spin" />
          <span className="text-sm">Searching for similar questions...</span>
        </div>
      )}
      {!isLoading && similarQuestions?.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-foreground">From the community:</h4>
          {similarQuestions?.map((question) => (
            <button
              key={question?.id}
              onClick={() => handleQuestionClick(question?.id)}
              className="w-full text-left p-3 hover:bg-muted/50 rounded-lg transition-colors border border-border/50"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {question?.title}
                </p>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span>{question?.course_name || question?.course?.name}</span>
                  <span>•</span>
                  <span>{question?.answers_count || 0} answers</span>
                  <span>•</span>
                  <span>{question?.votes_count || 0} votes</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {/* AI-Generated Similar Questions */}
      {geminiService?.isConfigured() && (
        <>
          {isLoadingAI && (
            <div className="flex items-center space-x-2 text-muted-foreground py-4">
              <Icon name="Sparkles" size={16} className="animate-pulse" />
              <span className="text-sm">AI is generating related questions...</span>
            </div>
          )}

          {!isLoadingAI && aiSuggestions?.length > 0 && (
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center space-x-2">
                <Icon name="Sparkles" size={16} className="text-primary" />
                <h4 className="text-sm font-medium text-foreground">AI-suggested related questions:</h4>
              </div>
              {aiSuggestions?.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <p className="text-sm font-medium text-foreground mb-1">
                    {suggestion?.title}
                  </p>
                  {suggestion?.description && (
                    <p className="text-xs text-muted-foreground">
                      {suggestion?.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* Empty State */}
      {!isLoading && !isLoadingAI && similarQuestions?.length === 0 && aiSuggestions?.length === 0 && (
        <div className="text-center py-4">
          <Icon name="FileQuestion" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No similar questions found. Your question might be unique!
          </p>
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}
      {/* AI Not Configured Notice */}
      {!geminiService?.isConfigured() && similarQuestions?.length === 0 && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
          <div className="flex items-start space-x-2">
            <Icon name="Sparkles" size={16} className="text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Tip:</strong> Configure AI features to get intelligent question suggestions 
              and improvements.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimilarQuestions;