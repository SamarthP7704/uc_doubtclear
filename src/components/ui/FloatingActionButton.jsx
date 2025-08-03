import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/user-registration' || location.pathname === '/student-login';
  const isAskQuestionPage = location.pathname === '/ask-question';

  if (isAuthPage || isAskQuestionPage) {
    return null;
  }

  const handleClick = () => {
    navigate('/ask-question');
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 z-102 md:hidden">
        <Button
          onClick={handleClick}
          className="w-14 h-14 rounded-full shadow-floating backdrop-blur-soft bg-primary hover:bg-primary/90 text-primary-foreground border-0"
          aria-label="Ask a question"
        >
          <Icon name="Plus" size={24} strokeWidth={2.5} />
        </Button>
      </div>

      {/* Desktop Expanded FAB */}
      <div className="hidden md:block fixed bottom-6 right-6 z-102">
        <Button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`
            h-14 rounded-full shadow-floating backdrop-blur-soft bg-primary hover:bg-primary/90 text-primary-foreground border-0 transition-all duration-300 ease-out
            ${isExpanded ? 'px-6' : 'w-14 px-0'}
          `}
          aria-label="Ask a question"
        >
          <Icon name="Plus" size={24} strokeWidth={2.5} />
          <span 
            className={`
              ml-2 font-medium whitespace-nowrap transition-all duration-300 ease-out
              ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 ml-0'}
            `}
          >
            Ask Question
          </span>
        </Button>
      </div>
    </>
  );
};

export default FloatingActionButton;