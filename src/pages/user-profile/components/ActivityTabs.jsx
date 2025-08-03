import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const ActivityTabs = ({
  activeTab,
  onTabChange,
  userQuestions = [],
  userAnswers = [],
  userStats,
  loading = false
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'questions', label: 'Questions', icon: 'HelpCircle', count: userQuestions?.length },
    { id: 'answers', label: 'Answers', icon: 'MessageCircle', count: userAnswers?.length },
    { id: 'achievements', label: 'Achievements', icon: 'Award' }
  ];

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'ai_assisted':
        return 'info';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        
        {loading ? (
          <div className="space-y-3">
            {Array?.from({ length: 3 })?.map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : userQuestions?.length > 0 ? (
          <div className="space-y-3">
            {userQuestions?.slice(0, 5)?.map((question) => (
              <div key={question?.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/questions/${question?.id}`}
                    className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                  >
                    {question?.title}
                  </Link>
                  <div className="flex items-center space-x-2 mt-1">
                    <StatusIndicator 
                      status={question?.status}
                      variant={getStatusColor(question?.status)}
                      size="xs"
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(question?.created_at)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {question?.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {userQuestions?.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange('questions')}
                className="w-full mt-3"
              >
                View All Questions ({userQuestions?.length})
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icon name="HelpCircle" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent activity</p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mt-3"
            >
              <Link to="/ask-question">Ask Your First Question</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Weekly Progress */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">This Week's Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-foreground">{userStats?.weeklyGrowth || 0}</p>
            <p className="text-sm text-muted-foreground">Points Earned</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {userQuestions?.filter(q => {
                const questionDate = new Date(q?.created_at);
                const weekAgo = new Date();
                weekAgo?.setDate(weekAgo?.getDate() - 7);
                return questionDate > weekAgo;
              })?.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">Questions Asked</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {Array?.from({ length: 5 })?.map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-3"></div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-12"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : userQuestions?.length > 0 ? (
        userQuestions?.map((question) => (
          <div key={question?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <Link
                to={`/questions/${question?.id}`}
                className="text-lg font-semibold text-foreground hover:text-primary line-clamp-2 flex-1"
              >
                {question?.title}
              </Link>
              <StatusIndicator 
                status={question?.status}
                variant={getStatusColor(question?.status)}
                size="sm"
                className="ml-3"
              />
            </div>
            <p className="text-muted-foreground line-clamp-2 mb-3">
              {question?.content}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>{formatDate(question?.created_at)}</span>
                <span>{question?.views || 0} views</span>
                {question?.courses && (
                  <span className="inline-flex items-center space-x-1">
                    <Icon name="BookOpen" size={12} />
                    <span>{question?.courses?.code}</span>
                  </span>
                )}
              </div>
              {question?.is_urgent && (
                <span className="inline-flex items-center space-x-1 text-error">
                  <Icon name="AlertTriangle" size={12} />
                  <span className="text-xs font-medium">Urgent</span>
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <Icon name="HelpCircle" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No questions yet</h3>
          <p className="text-muted-foreground mb-6">
            Start your learning journey by asking your first question
          </p>
          <Button asChild iconName="Plus">
            <Link to="/ask-question">Ask a Question</Link>
          </Button>
        </div>
      )}
    </div>
  );

  const renderAnswers = () => (
    <div className="text-center py-12">
      <Icon name="MessageCircle" size={64} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">No answers yet</h3>
      <p className="text-muted-foreground mb-6">
        Help other students by answering their questions
      </p>
      <Button asChild iconName="Search">
        <Link to="/browse-questions">Browse Questions</Link>
      </Button>
    </div>
  );

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sample achievements */}
      {[
        {
          title: 'First Answer',
          description: 'Answered your first question',
          icon: 'Award',
          color: 'bg-warning/10 text-warning',
          earned: true,
          date: '2 days ago'
        },
        {
          title: 'Helpful Contributor',
          description: 'Received 10+ upvotes on answers',
          icon: 'ThumbsUp',
          color: 'bg-success/10 text-success',
          earned: true,
          date: '1 week ago'
        },
        {
          title: 'Community Member',
          description: 'Active member for 30+ days',
          icon: 'Users',
          color: 'bg-primary/10 text-primary',
          earned: true,
          date: '2 weeks ago'
        },
        {
          title: 'Top Contributor',
          description: 'Be in top 10% of contributors',
          icon: 'Trophy',
          color: 'bg-muted text-muted-foreground',
          earned: false,
          progress: '7/10 answers needed'
        }
      ]?.map((achievement, index) => (
        <div key={index} className={`bg-card border border-border rounded-lg p-4 ${!achievement?.earned && 'opacity-60'}`}>
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${achievement?.color}`}>
              <Icon name={achievement?.icon} size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{achievement?.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{achievement?.description}</p>
              <div className="mt-2">
                {achievement?.earned ? (
                  <span className="inline-flex items-center space-x-1 text-xs text-success">
                    <Icon name="Check" size={12} />
                    <span>Earned {achievement?.date}</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {achievement?.progress}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'questions':
        return renderQuestions();
      case 'answers':
        return renderAnswers();
      case 'achievements':
        return renderAchievements();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border-hover'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.count !== undefined && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ActivityTabs;