import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { questionService } from '../../services/questionService';
import { useAuth } from '../../contexts/AuthContext';
import { useAIFallback } from '../../hooks/useAIFallback';
import Header from '../../components/ui/Header';
import QuestionContent from './components/QuestionContent';
import AnswersList from './components/AnswersList';
import AnswerForm from './components/AnswerForm';
import RelatedQuestions from './components/RelatedQuestions';
import QuestionActions from './components/QuestionActions';
import AIFallbackIndicator from './components/AIFallbackIndicator';

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { generateAIAnswerForQuestion } = useAIFallback();
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuestionDetails();
      incrementViews();
      loadRelatedQuestions();
    }
  }, [id]);

  useEffect(() => {
    if (question && user) {
      checkBookmarkStatus();
    }
  }, [question, user]);

  const loadQuestionDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await questionService?.getQuestionById(id);
      
      if (error) {
        setError('Failed to load question details');
        return;
      }
      
      if (!data) {
        setError('Question not found');
        return;
      }
      
      setQuestion(data);
      setAnswers(data?.answers || []);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await questionService?.incrementViews(id);
    } catch (err) {
      // Silent fail for view counting
      console.warn('Failed to increment views:', err);
    }
  };

  const loadRelatedQuestions = async () => {
    try {
      const { data } = await questionService?.getQuestions({ 
        limit: 5,
        courseId: question?.course_id 
      });
      
      if (data) {
        const filtered = data?.filter(q => q?.id !== id);
        setRelatedQuestions(filtered?.slice(0, 4));
      }
    } catch (err) {
      console.warn('Failed to load related questions:', err);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const { data } = await questionService?.getBookmarkedQuestions(user?.id);
      const isBookmarked = data?.some(q => q?.id === id);
      setIsBookmarked(isBookmarked);
    } catch (err) {
      console.warn('Failed to check bookmark status:', err);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate('/student-login');
      return;
    }

    try {
      const { data, error } = await questionService?.toggleBookmark(user?.id, id);
      
      if (error) {
        console.error('Failed to toggle bookmark:', error);
        return;
      }
      
      setIsBookmarked(data?.bookmarked);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleAddAnswer = async (answerData) => {
    if (!user) {
      navigate('/student-login');
      return;
    }

    try {
      const { data, error } = await questionService?.createAnswer({
        ...answerData,
        question_id: id,
        user_id: user?.id
      });
      
      if (error) {
        throw new Error(error?.message || 'Failed to create answer');
      }
      
      setAnswers(prev => [data, ...prev]);
      setShowAnswerForm(false);
      
      // Reload question to get updated status
      await loadQuestionDetails();
      
      return { success: true };
    } catch (err) {
      return { error: err?.message || 'Failed to create answer' };
    }
  };

  const handleAnswerVote = async (answerId, voteType) => {
    if (!user) {
      navigate('/student-login');
      return;
    }

    try {
      const { data, error } = await questionService?.voteAnswer(user?.id, answerId, voteType);
      
      if (error) {
        console.error('Failed to vote:', error);
        return;
      }
      
      // Update the answers list with new vote data
      setAnswers(prev => prev?.map(answer => 
        answer?.id === answerId 
          ? { ...answer, user_vote: data?.voted ? { vote_type: data?.voteType } : null }
          : answer
      ));
      
      // Reload to get updated vote counts
      await loadQuestionDetails();
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleGenerateAIAnswer = async () => {
    try {
      setGeneratingAI(true);
      await generateAIAnswerForQuestion(id);
      
      // Reload question details to show the new AI answer
      await loadQuestionDetails();
    } catch (err) {
      console.error('Failed to generate AI answer:', err);
      // You could show a toast notification here
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3]?.map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              {error}
            </h1>
            <button
              onClick={() => navigate('/browse-questions')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Back to Browse Questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{question?.title} - UC DoubtClear</title>
        <meta name="description" content={question?.content?.substring(0, 160)} />
      </Helmet>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Content */}
            <QuestionContent 
              question={question}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
            />
            
            {/* AI Fallback Indicator */}
            <AIFallbackIndicator 
              question={question}
              onGenerateAI={handleGenerateAIAnswer}
              generating={generatingAI}
            />
            
            {/* Question Actions */}
            <QuestionActions 
              question={question}
              onAnswerClick={() => setShowAnswerForm(true)}
              currentUser={user}
            />
            
            {/* Answer Form */}
            {showAnswerForm && (
              <AnswerForm 
                onSubmit={handleAddAnswer}
                onCancel={() => setShowAnswerForm(false)}
                loading={false}
              />
            )}
            
            {/* Answers List */}
            <AnswersList 
              answers={answers}
              currentUser={user}
              onVote={handleAnswerVote}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RelatedQuestions 
              questions={relatedQuestions}
              currentQuestionId={id}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionDetails;