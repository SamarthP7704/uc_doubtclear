import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const QuestionContent = ({ question, isBookmarked, onBookmarkToggle }) => {
  if (!question) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      answered: 'bg-green-100 text-green-800 border-green-200',
      ai_assisted: 'bg-blue-100 text-blue-800 border-blue-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      answered: 'Answered',
      ai_assisted: 'AI Assisted',
      closed: 'Closed'
    };
    return texts?.[status] || 'Pending';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(question?.status)}`}>
              {getStatusText(question?.status)}
            </span>
            {question?.is_urgent && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                Urgent
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            {question?.title}
          </h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onBookmarkToggle}
          className={`ml-4 ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <Icon name={isBookmarked ? "BookmarkCheck" : "Bookmark"} size={20} />
        </Button>
      </div>

      {/* Question Meta */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="User" size={16} />
          <span>{question?.user_profiles?.full_name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Icon name="Clock" size={16} />
          <span>{formatDistanceToNow(new Date(question?.created_at))} ago</span>
        </div>
        
        {question?.courses && (
          <div className="flex items-center gap-2">
            <Icon name="BookOpen" size={16} />
            <span className="text-primary font-medium">
              {question?.courses?.code} - {question?.courses?.name}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Icon name="Eye" size={16} />
          <span>{question?.views || 0} views</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="prose prose-sm max-w-none text-foreground">
        <div className="whitespace-pre-wrap">
          {question?.content}
        </div>
      </div>

      {/* Tags/Topics */}
      {question?.topics && question?.topics?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
          {question?.topics?.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionContent;