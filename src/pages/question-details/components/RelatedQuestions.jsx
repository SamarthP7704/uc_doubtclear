import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';

const RelatedQuestions = ({ questions, currentQuestionId }) => {
  if (!questions?.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Related Questions
        </h3>
        <p className="text-muted-foreground text-sm">
          No related questions found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Link" size={20} />
        Related Questions
      </h3>
      
      <div className="space-y-4">
        {questions?.map(question => (
          <Link
            key={question?.id}
            to={`/question-details/${question?.id}`}
            className="block group hover:bg-muted/50 -mx-2 px-2 py-2 rounded transition-colors"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                {question?.title}
              </h4>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    question?.status === 'answered' ?'bg-green-100 text-green-700' :'bg-yellow-100 text-yellow-700'
                  }`}>
                    {question?.status === 'answered' ? 'Answered' : 'Pending'}
                  </span>
                  
                  {question?.courses && (
                    <span className="text-primary font-medium">
                      {question?.courses?.code}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>{question?.answers?.length || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    <span>{question?.views || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="User" size={12} />
                <span>{question?.user_profiles?.full_name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(question?.created_at))} ago</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          to="/browse-questions"
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-2"
        >
          <Icon name="Search" size={16} />
          Browse all questions
        </Link>
      </div>
    </div>
  );
};

export default RelatedQuestions;