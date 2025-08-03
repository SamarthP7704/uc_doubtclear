import React from 'react';
import Button from '../../../components/ui/Button';


const LeaderboardTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-border">
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            onClick={() => onTabChange?.(tab?.id)}
            className={`whitespace-nowrap ${
              activeTab === tab?.id 
                ? "border-b-2 border-primary rounded-b-none" :"hover:bg-muted"
            }`}
            iconName={tab?.icon}
          >
            <span className="hidden sm:inline">{tab?.label}</span>
            <span className="sm:hidden">
              {tab?.label?.split(' ')?.[0]}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTabs;