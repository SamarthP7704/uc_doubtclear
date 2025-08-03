import React from 'react';

const QuestionSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="space-y-3">
        {/* Title and content */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>

        {/* Meta information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>

            {/* Course */}
            <div className="h-4 bg-muted rounded w-12"></div>

            {/* Date */}
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>

          {/* Status */}
          <div className="h-5 bg-muted rounded w-16"></div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-muted rounded w-8"></div>
            <div className="h-4 bg-muted rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSkeleton;