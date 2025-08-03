import React from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';

const BookmarkedQuestionsCard = ({ bookmarkedQuestions }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const questionTime = new Date(timestamp);
    const diffInHours = Math.floor((now - questionTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Bookmarked Questions</h2>
        <Link 
          to="/bookmarks" 
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {bookmarkedQuestions?.slice(0, 3)?.map((question) => (
          <div key={question?.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                  {question?.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{question?.subject}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(question?.bookmarkedAt)}</span>
                </div>
              </div>
              <button className="text-accent hover:text-accent/80 transition-colors">
                <Icon name="Bookmark" size={16} fill="currentColor" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MessageSquare" size={12} />
                <span>{question?.answerCount} answers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="ThumbsUp" size={12} />
                <span>{question?.upvotes} upvotes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {bookmarkedQuestions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Bookmark" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No bookmarked questions</p>
          <p className="text-xs text-muted-foreground">Save questions for quick access later</p>
        </div>
      )}
    </div>
  );
};

export default BookmarkedQuestionsCard;