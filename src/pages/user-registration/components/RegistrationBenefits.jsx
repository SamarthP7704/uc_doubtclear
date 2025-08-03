import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationBenefits = () => {
  const benefits = [
    {
      icon: 'MessageCircle',
      title: 'Ask Questions',
      description: 'Get help with your coursework from fellow UC students and AI assistance'
    },
    {
      icon: 'Users',
      title: 'Help Others',
      description: 'Share your knowledge and earn brownie points by answering questions'
    },
    {
      icon: 'Trophy',
      title: 'Earn Recognition',
      description: 'Climb the leaderboard and showcase your academic contributions'
    },
    {
      icon: 'BookOpen',
      title: 'Course-Specific',
      description: 'Find questions and answers organized by your specific courses'
    },
    {
      icon: 'Clock',
      title: 'Quick Responses',
      description: 'Get AI-powered answers when peers are not immediately available'
    },
    {
      icon: 'Shield',
      title: 'UC Community',
      description: 'Connect with verified UC students in a secure academic environment'
    }
  ];

  return (
    <div className="hidden lg:block">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Why Join UC DoubtClear?
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover the benefits of our academic community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {benefits?.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg hover:shadow-card transition-shadow"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={benefit?.icon} size={20} className="text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-foreground text-sm">
                  {benefit?.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Quick Start</span>
          </div>
          <p className="text-xs text-muted-foreground">
            After registration, you can immediately start asking questions, browsing existing Q&As, and helping fellow students. Your contributions will be tracked and rewarded with brownie points!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationBenefits;