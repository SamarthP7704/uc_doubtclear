import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, Bot, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AnswersList = ({ answers = [], currentUser, onVote }) => {
  const [votingStates, setVotingStates] = useState({});

  const handleVote = async (answerId, voteType) => {
    if (!currentUser) return;

    setVotingStates(prev => ({ ...prev, [answerId]: true }));
    
    try {
      await onVote?.(answerId, voteType);
    } finally {
      setVotingStates(prev => ({ ...prev, [answerId]: false }));
    }
  };

  if (!answers?.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
          <p className="text-gray-600 mb-4">
            Be the first to help by sharing your knowledge!
          </p>
        </div>
      </div>
    );
  }

  const sortedAnswers = [...answers]?.sort((a, b) => {
    // Sort by: accepted answers first, then by upvotes, then by creation date
    if (a?.is_accepted && !b?.is_accepted) return -1;
    if (!a?.is_accepted && b?.is_accepted) return 1;
    if (a?.upvotes !== b?.upvotes) return (b?.upvotes || 0) - (a?.upvotes || 0);
    return new Date(b?.created_at) - new Date(a?.created_at);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {answers?.length} Answer{answers?.length !== 1 ? 's' : ''}
        </h2>
      </div>
      <div className="space-y-4">
        {sortedAnswers?.map((answer) => (
          <div 
            key={answer?.id}
            className={`bg-white rounded-lg border ${
              answer?.is_accepted ? 'border-green-200 bg-green-50' : 'border-gray-200'
            } p-6 transition-all hover:shadow-sm`}
          >
            {/* Answer Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {answer?.is_ai_generated ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {answer?.is_ai_generated ? (
                        <span className="flex items-center space-x-1">
                          <span>AI Assistant</span>
                          <Bot className="h-4 w-4 text-blue-600" />
                        </span>
                      ) : (
                        answer?.user_profiles?.full_name || 'Anonymous'
                      )}
                    </span>
                    
                    {answer?.is_accepted && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Accepted Answer</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {answer?.created_at && formatDistanceToNow(new Date(answer?.created_at), { addSuffix: true })}
                    </span>
                    {answer?.is_ai_generated && (
                      <span className="text-blue-600 font-medium">• AI Generated</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vote Controls */}
              {!answer?.is_ai_generated && currentUser && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(answer?.id, 'up')}
                    disabled={votingStates?.[answer?.id]}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                      answer?.user_vote?.vote_type === 'up' ?'bg-blue-100 text-blue-700' :'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{answer?.upvotes || 0}</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(answer?.id, 'down')}
                    disabled={votingStates?.[answer?.id]}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                      answer?.user_vote?.vote_type === 'down'
                        ? 'bg-red-100 text-red-700' :'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Answer Content */}
            <div className="prose max-w-none">
              <div 
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: answer?.content?.replace(/\n/g, '<br>') || ''
                }}
              />
            </div>

            {/* AI Answer Disclaimer */}
            {answer?.is_ai_generated && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">💡 AI-Generated Answer:</span> This answer was automatically 
                  generated to help get you started. While AI answers are usually helpful, always verify 
                  important information and consider waiting for community responses for complex topics.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswersList;