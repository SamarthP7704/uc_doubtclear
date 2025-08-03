import React from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';

const TrendingQuestionsCard = ({ trendingQuestions }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const questionTime = new Date(timestamp);
    const diffInHours = Math.floor((now - questionTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getTrendingIcon = (trend) => {
    if (trend === 'hot') return { icon: 'Flame', color: 'text-error' };
    if (trend === 'rising') return { icon: 'TrendingUp', color: 'text-success' };
    return { icon: 'Eye', color: 'text-primary' };
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Trending in Your Courses</h2>
        <Link 
          to="/browse" 
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Browse More
        </Link>
      </div>
      <div className="space-y-3">
        {trendingQuestions?.map((question, index) => {
          const trendingConfig = getTrendingIcon(question?.trend);
          
          return (
            <div key={question?.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                      {question?.title}
                    </h3>
                    <div className={`flex-shrink-0 ml-2 ${trendingConfig?.color}`}>
                      <Icon name={trendingConfig?.icon} size={16} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                    <span>{question?.course}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(question?.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="MessageSquare" size={12} />
                        <span>{question?.answerCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Eye" size={12} />
                        <span>{question?.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="ThumbsUp" size={12} />
                        <span>{question?.upvotes}</span>
                      </div>
                    </div>
                    
                    {question?.isUrgent && (
                      <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                        <Icon name="AlertCircle" size={10} />
                        <span>Urgent</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {trendingQuestions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No trending questions</p>
          <p className="text-xs text-muted-foreground">Check back later for popular discussions</p>
        </div>
      )}
    </div>
  );
};

export default TrendingQuestionsCard;