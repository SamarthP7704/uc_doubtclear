import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const QuestionCard = ({ question, onBookmark, isAuthenticated = false }) => {
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmark = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!isAuthenticated || isBookmarking) return;
    
    setIsBookmarking(true);
    try {
      await onBookmark?.(question?.id);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (navigator?.share) {
      try {
        await navigator?.share({
          title: question?.title,
          text: question?.content?.substring(0, 100) + '...',
          url: window?.location?.origin + `/questions/${question?.id}`
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      const url = window?.location?.origin + `/questions/${question?.id}`;
      await navigator?.clipboard?.writeText(url);
      // You could show a toast notification here
    }
  };

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

  const answersCount = question?.answers?.length || 0;

  return (
    <Link
      to={`/questions/${question?.id}`}
      className="block bg-card border border-border rounded-lg p-4 hover:border-border-hover transition-all duration-200 group"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {question?.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {question?.content}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                disabled={isBookmarking}
                className="h-8 w-8"
              >
                <Icon 
                  name={question?.isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                  size={16}
                  className={question?.isBookmarked ? "text-primary" : ""}
                />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8"
            >
              <Icon name="Share2" size={16} />
            </Button>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                {question?.user_profiles?.avatar_url ? (
                  <img
                    src={question?.user_profiles?.avatar_url}
                    alt={question?.user_profiles?.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={12} className="text-muted-foreground" />
                )}
              </div>
              <span className="text-muted-foreground font-medium">
                {question?.user_profiles?.full_name || 'Anonymous'}
              </span>
            </div>

            {/* Course */}
            {question?.courses && (
              <div className="flex items-center space-x-1">
                <Icon name="BookOpen" size={14} className="text-muted-foreground" />
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

          {/* Status */}
          <StatusIndicator 
            status={question?.status}
            variant={getStatusColor(question?.status)}
            size="sm"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {/* Views */}
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} />
              <span>{question?.views || 0}</span>
            </div>

            {/* Answers */}
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={14} />
              <span>{answersCount}</span>
            </div>

            {/* Urgent indicator */}
            {question?.is_urgent && (
              <div className="flex items-center space-x-1 text-error">
                <Icon name="AlertTriangle" size={14} />
                <span className="font-medium">Urgent</span>
              </div>
            )}
          </div>

          {/* Course badge for mobile */}
          {question?.courses && (
            <div className="sm:hidden">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {question?.courses?.code}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;