import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PlatformBenefits = () => {
  const benefits = [
    {
      id: 1,
      icon: 'MessageSquare',
      title: 'Get Quick Answers',
      description: 'Post your academic questions and receive peer answers within minutes',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      icon: 'Users',
      title: 'Collaborative Learning',
      description: 'Connect with fellow UC students and learn together through discussion',
      image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      icon: 'Trophy',
      title: 'Earn Brownie Points',
      description: 'Help others and climb the leaderboard while building your academic reputation',
      image: 'https://images.pixabay.com/photo/2017/06/20/22/14/man-2425121_1280.jpg?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      icon: 'Bot',
      title: 'AI-Powered Support',
      description: 'Get instant AI assistance when peer answers aren\'t available within 15 minutes',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Why Choose UC DoubtClear?
        </h2>
        <p className="text-muted-foreground">
          Join thousands of UC students in our collaborative learning community
        </p>
      </div>
      <div className="space-y-6">
        {benefits?.map((benefit, index) => (
          <div 
            key={benefit?.id} 
            className={`flex items-center space-x-4 ${index % 2 === 1 ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
              <Image 
                src={benefit?.image} 
                alt={benefit?.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={benefit?.icon} size={16} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{benefit?.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{benefit?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Success Stories */}
      <div className="bg-muted/50 rounded-lg p-4 mt-8">
        <div className="flex items-start space-x-3">
          <Icon name="Quote" size={20} className="text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground italic mb-2">
              "UC DoubtClear helped me understand complex calculus concepts through peer explanations. 
              The community is incredibly supportive and the AI fallback ensures I never get stuck!"
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-medium">JD</span>
              </div>
              <span className="text-xs text-muted-foreground">Jessica D., Engineering Student</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformBenefits;