import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="GraduationCap" size={32} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Join UC DoubtClear
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Create your account to connect with fellow UC students, get answers to your academic questions, and earn points by helping others.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={16} className="text-primary" />
          <span>Peer Support</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Bot" size={16} className="text-secondary" />
          <span>AI Assistance</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Trophy" size={16} className="text-accent" />
          <span>Earn Points</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;