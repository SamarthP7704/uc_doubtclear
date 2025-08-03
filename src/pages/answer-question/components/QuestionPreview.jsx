import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const QuestionPreview = ({ question }) => {
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'ai_assisted':
        return 'info';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {question?.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {question?.content}
          </p>
        </div>
        
        <StatusIndicator 
          status={question?.status}
          variant={getStatusColor(question?.status)}
          size="sm"
        />
      </div>

      {/* Meta Information */}
      <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
        <div className="flex items-center space-x-4">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
              {question?.user_profiles?.avatar_url ? (
                <img
                  src={question?.user_profiles?.avatar_url}
                  alt={question?.user_profiles?.full_name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <Icon name="User" size={10} className="text-muted-foreground" />
              )}
            </div>
            <span className="text-muted-foreground font-medium">
              {question?.user_profiles?.full_name || 'Anonymous'}
            </span>
          </div>

          {/* Course */}
          {question?.courses && (
            <div className="flex items-center space-x-1">
              <Icon name="BookOpen" size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {question?.courses?.code}
              </span>
            </div>
          )}

          {/* Date */}
          <span className="text-muted-foreground">
            {formatDate(question?.created_at)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={12} />
            <span>{question?.views || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MessageCircle" size={12} />
            <span>{question?.answers?.length || 0}</span>
          </div>
          {question?.is_urgent && (
            <div className="flex items-center space-x-1 text-error">
              <Icon name="AlertTriangle" size={12} />
              <span className="font-medium text-xs">Urgent</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick action */}
      <div className="mt-3 pt-3 border-t border-border">
        <Link
          to={`/questions/${question?.id}`}
          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
        >
          <Icon name="ArrowLeft" size={14} className="mr-1" />
          View full question
        </Link>
      </div>
    </div>
  );
};

export default QuestionPreview;