import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionActions = ({ question, onAnswerClick, currentUser }) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: question?.title,
        text: question?.content?.substring(0, 100) + '...',
        url: window.location?.href,
      });
    } catch (err) {
      // Fallback to copying to clipboard
      await navigator.clipboard?.writeText(window.location?.href);
      // Could show a toast notification here
    }
  };

  const handleReport = () => {
    // Implement report functionality
    console.log('Report question:', question?.id);
  };

  const handleFollow = () => {
    // Implement follow functionality
    console.log('Follow question:', question?.id);
  };

  const canAnswer = currentUser && question?.status !== 'closed';

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {canAnswer && (
            <Button
              onClick={onAnswerClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Write Answer
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleFollow}
          >
            <Icon name="Bell" size={16} className="mr-2" />
            Follow
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            <Icon name="Share2" size={16} className="mr-2" />
            Share
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            className="text-muted-foreground hover:text-destructive"
          >
            <Icon name="Flag" size={16} className="mr-2" />
            Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionActions;