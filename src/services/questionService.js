import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

// Question and Q&A related service functions
export const questionService = {
  // Create a new question
  async createQuestion(questionData) {
    try {
      const { data, error } = await supabase?.from('questions')?.insert([questionData])?.select(`
          *,
          user_profiles!inner(id, full_name, avatar_url),
          courses(id, code, name)
        `)?.single();
      
      if (error) {
        return { data: null, error };
      }
      
      // Schedule AI fallback answer for this question
      this.scheduleAIFallback(data?.id);
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to create question' } 
      };
    }
  },

  // Get questions with optional filters
  async getQuestions(filters = {}) {
    try {
      let query = supabase?.from('questions')?.select(`
          *,
          user_profiles!inner(id, full_name, avatar_url),
          courses(id, code, name),
          answers(count)
        `)?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.courseId) {
        query = query?.eq('course_id', filters?.courseId);
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.userId) {
        query = query?.eq('user_id', filters?.userId);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch questions' } 
      };
    }
  },

  // Get single question with details
  async getQuestionById(questionId) {
    try {
      const { data, error } = await supabase?.from('questions')?.select(`
          *,
          user_profiles!inner(id, full_name, avatar_url),
          courses(id, code, name),
          answers(
            *,
            user_profiles!inner(id, full_name, avatar_url)
          )
        `)?.eq('id', questionId)?.single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to fetch question details' } 
      };
    }
  },

  // Get trending questions
  async getTrendingQuestions(limit = 10) {
    try {
      const { data, error } = await supabase?.from('questions')?.select(`
          *,
          user_profiles!inner(id, full_name, avatar_url),
          courses(id, code, name),
          answers(count)
        `)?.order('views', { ascending: false })?.order('created_at', { ascending: false })?.limit(limit);
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch trending questions' } 
      };
    }
  },

  // Get user's bookmarked questions
  async getBookmarkedQuestions(userId) {
    try {
      const { data, error } = await supabase?.from('question_bookmarks')?.select(`
          *,
          questions(
            *,
            user_profiles!inner(id, full_name, avatar_url),
            courses(id, code, name),
            answers(count)
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: data?.map(bookmark => bookmark?.questions) || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch bookmarked questions' } 
      };
    }
  },

  // Toggle bookmark on a question
  async toggleBookmark(userId, questionId) {
    try {
      // Check if bookmark exists
      const { data: existingBookmark, error: checkError } = await supabase?.from('question_bookmarks')?.select('id')?.eq('user_id', userId)?.eq('question_id', questionId)?.single();
      
      if (checkError && checkError?.code !== 'PGRST116') {
        return { data: null, error: checkError };
      }
      
      if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase?.from('question_bookmarks')?.delete()?.eq('user_id', userId)?.eq('question_id', questionId);
        
        return { data: { bookmarked: false }, error };
      } else {
        // Add bookmark
        const { data, error } = await supabase?.from('question_bookmarks')?.insert([{ user_id: userId, question_id: questionId }])?.select()?.single();
        
        return { data: { bookmarked: true }, error };
      }
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to toggle bookmark' } 
      };
    }
  },

  // Create an answer
  async createAnswer(answerData) {
    try {
      const { data, error } = await supabase?.from('answers')?.insert([answerData])?.select(`
          *,
          user_profiles!inner(id, full_name, avatar_url)
        `)?.single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to create answer' } 
      };
    }
  },

  // Vote on an answer
  async voteAnswer(userId, answerId, voteType) {
    try {
      // Check if vote exists
      const { data: existingVote, error: checkError } = await supabase?.from('answer_votes')?.select('*')?.eq('user_id', userId)?.eq('answer_id', answerId)?.single();
      
      if (checkError && checkError?.code !== 'PGRST116') {
        return { data: null, error: checkError };
      }
      
      if (existingVote) {
        if (existingVote?.vote_type === voteType) {
          // Remove vote if same type
          const { error } = await supabase?.from('answer_votes')?.delete()?.eq('user_id', userId)?.eq('answer_id', answerId);
          
          return { data: { voted: false, voteType: null }, error };
        } else {
          // Update vote type
          const { data, error } = await supabase?.from('answer_votes')?.update({ vote_type: voteType })?.eq('user_id', userId)?.eq('answer_id', answerId)?.select()?.single();
          
          return { data: { voted: true, voteType }, error };
        }
      } else {
        // Create new vote
        const { data, error } = await supabase?.from('answer_votes')?.insert([{ user_id: userId, answer_id: answerId, vote_type: voteType }])?.select()?.single();
        
        return { data: { voted: true, voteType }, error };
      }
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to vote on answer' } 
      };
    }
  },

  // Update question views
  async incrementViews(questionId) {
    try {
      const { error } = await supabase?.rpc('increment_question_views', {
        question_id: questionId
      });
      
      return { error };
    } catch (error) {
      // Fallback to regular update if RPC function doesn't exist
      try {
        const { error: updateError } = await supabase?.from('questions')?.update({ views: supabase?.raw('views + 1') })?.eq('id', questionId);
        
        return { error: updateError };
      } catch (fallbackError) {
        return { error: { message: 'Failed to update views' } };
      }
    }
  },

  // Get questions needing AI fallback answers (older than 15 minutes with no answers)
  async getUnansweredQuestions() {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)?.toISOString();
      
      const { data, error } = await supabase?.from('questions')?.select(`
          *,
          courses(id, code, name),
          answers(count)
        `)
        ?.eq('status', 'pending')
        ?.lt('created_at', fifteenMinutesAgo)
        ?.limit(10);
      
      if (error) {
        return { data: [], error };
      }
      
      // Filter questions that have no answers
      const unansweredQuestions = data?.filter(question => 
        !question?.answers || question?.answers?.length === 0
      ) || [];
      
      return { data: unansweredQuestions, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch unanswered questions' } 
      };
    }
  },

  // Generate AI answer for a question
  async generateAIAnswer(questionId) {
    try {
      // Get question details
      const { data: question, error: questionError } = await this.getQuestionById(questionId);
      
      if (questionError || !question) {
        return { data: null, error: questionError || { message: 'Question not found' } };
      }
      
      // Check if question already has answers
      if (question?.answers && question?.answers?.length > 0) {
        return { data: null, error: { message: 'Question already has answers' } };
      }
      
      // Generate AI answer using Gemini
      const aiAnswer = await geminiService?.generateAnswer(
        question?.title,
        question?.content,
        question?.courses?.name || 'General Studies'
      );
      
      if (!aiAnswer) {
        return { data: null, error: { message: 'Failed to generate AI answer' } };
      }
      
      // Create AI answer in database
      const answerData = {
        content: aiAnswer,
        question_id: questionId,
        user_id: null, // AI answers don't have a user_idis_ai_generated: true,status: 'helpful'
      };
      
      const { data: createdAnswer, error: answerError } = await this.createAnswer(answerData);
      
      if (answerError) {
        return { data: null, error: answerError };
      }
      
      // Update question status to 'ai_assisted'
      const { error: updateError } = await supabase?.from('questions')
        ?.update({ status: 'ai_assisted' })
        ?.eq('id', questionId);
      
      if (updateError) {
        console.warn('Failed to update question status:', updateError);
      }
      
      return { data: createdAnswer, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to generate AI answer' } 
      };
    }
  },

  // Process AI fallback for unanswered questions
  async processAIFallbacks() {
    try {
      const { data: unansweredQuestions, error } = await this.getUnansweredQuestions();
      
      if (error || !unansweredQuestions?.length) {
        return { processed: 0, errors: [] };
      }
      
      const results = {
        processed: 0,
        errors: []
      };
      
      // Process each unanswered question
      for (const question of unansweredQuestions) {
        try {
          const { data, error: aiError } = await this.generateAIAnswer(question?.id);
          
          if (aiError) {
            results?.errors?.push({
              questionId: question?.id,
              error: aiError?.message
            });
          } else {
            results.processed++;
            console.log(`AI answer generated for question: ${question?.title}`);
          }
        } catch (err) {
          results?.errors?.push({
            questionId: question?.id,
            error: err?.message || 'Unknown error'
          });
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return results;
    } catch (error) {
      return {
        processed: 0,
        errors: [{ error: error?.message || 'Failed to process AI fallbacks' }]
      };
    }
  },

  // Schedule AI fallback (placeholder for future implementation)
  scheduleAIFallback(questionId) {
    // This is a placeholder for scheduling mechanism
    // In a production environment, this would integrate with a job queue or cron system
    console.log(`AI fallback scheduled for question ${questionId} in 15 minutes`);
    
    // For immediate testing purposes, you can uncomment the following line
    // setTimeout(() => this.generateAIAnswer(questionId), 15 * 60 * 1000);
  }
};