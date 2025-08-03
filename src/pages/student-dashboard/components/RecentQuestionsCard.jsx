import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { questionService } from '../../../services/questionService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentQuestionsCard = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRecentQuestions();
    }
  }, [user]);

  const loadRecentQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await questionService?.getQuestions({
        userId: user?.id,
        limit: 5
      });
      
      if (error) {
        setError('Failed to load your questions');
        return;
      }
      
      setQuestions(data || []);
    } catch (error) {
      setError('Failed to load your questions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return { icon: 'CheckCircle', color: 'text-green-500' };
      case 'ai_assisted':
        return { icon: 'Bot', color: 'text-blue-500' };
      case 'pending':
        return { icon: 'Clock', color: 'text-orange-500' };
      default:
        return { icon: 'HelpCircle', color: 'text-gray-500' };
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date?.toLocaleDateString();
  };

  const handleQuestionClick = (questionId) => {
    // Navigate to question detail
    window.location.href = `/questions/${questionId}`;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Recent Questions</h2>
          <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Your Recent Questions</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadRecentQuestions}
          disabled={loading}
        >
          <Icon name="RefreshCw" size={16} />
        </Button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}
      {questions?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="HelpCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No questions yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by asking your first question to get help from the community.
          </p>
          <Button
            onClick={() => window.location.href = '/ask-question'}
            className="mx-auto"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Ask Your First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions?.map((question) => {
            const statusInfo = getStatusIcon(question?.status);
            const answersCount = question?.answers?.length || 0;
            
            return (
              <div
                key={question?.id}
                onClick={() => handleQuestionClick(question?.id)}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={statusInfo?.icon} 
                      size={16} 
                      className={statusInfo?.color} 
                    />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {question?.status?.replace('_', ' ')}
                    </span>
                    {question?.is_urgent && (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(question?.created_at)}
                  </span>
                </div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {question?.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={14} />
                      <span>{answersCount} answer{answersCount !== 1 ? 's' : ''}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Eye" size={14} />
                      <span>{question?.views || 0}</span>
                    </span>
                    {question?.courses && (
                      <span className="bg-muted px-2 py-1 rounded text-xs">
                        {question?.courses?.code}
                      </span>
                    )}
                  </div>
                  
                  {question?.hasNewActivity && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      New Activity
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/my-questions'}
              className="w-full"
            >
              View All Your Questions
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentQuestionsCard;