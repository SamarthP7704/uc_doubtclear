import { supabase } from '../lib/supabase';

// User and profile related service functions
export const userService = {
  // Get user statistics
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('points, rank, weekly_growth')?.eq('id', userId)?.single();
      
      if (error) {
        return { data: null, error };
      }
      
      // Get additional stats from related tables
      const [questionsResult, answersResult] = await Promise.all([
        supabase?.from('questions')?.select('id', { count: 'exact' })?.eq('user_id', userId),
        supabase?.from('answers')?.select('id', { count: 'exact' })?.eq('user_id', userId)
      ]);
      
      const stats = {
        points: data?.points || 0,
        rank: data?.rank || 0,
        weeklyGrowth: data?.weekly_growth || 0,
        questionsAsked: questionsResult?.count || 0,
        answersGiven: answersResult?.count || 0
      };
      
      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to fetch user stats' } 
      };
    }
  },

  // Get leaderboard
  async getLeaderboard(filters = {}) {
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          points,
          rank,
          weekly_growth,
          role,
          created_at,
          answers:answers(count),
          questions:questions(count),
          accepted_answers:answers!inner(count)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters?.search) {
        query = query.ilike('full_name', `%${filters.search}%`);
      }

      if (filters?.period === 'weekly') {
        query = query.order('weekly_growth', { ascending: false });
      } else {
        query = query.order('points', { ascending: false });
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process data to include counts
      const processedData = data?.map(user => ({
        ...user,
        answers_count: user?.answers?.[0]?.count || 0,
        questions_count: user?.questions?.[0]?.count || 0,
        accepted_answers_count: user?.accepted_answers?.[0]?.count || 0
      }));

      return { data: { users: processedData }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Get user activities for activity feed
  async getUserActivities(userId, limit = 20) {
    try {
      const { data, error } = await supabase?.from('user_activities')?.select(`
          *,
          related_user:user_profiles!user_activities_related_user_id_fkey(id, full_name, avatar_url),
          related_question:questions(id, title)
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch user activities' } 
      };
    }
  },

  // Get user's enrolled courses
  async getUserCourses(userId) {
    try {
      const { data, error } = await supabase?.from('user_courses')?.select(`
          *,
          courses(id, code, name, description)
        `)?.eq('user_id', userId)?.order('enrolled_at', { ascending: false });
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: data?.map(enrollment => enrollment?.courses) || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch user courses' } 
      };
    }
  },

  // Enroll user in a course
  async enrollInCourse(userId, courseId) {
    try {
      const { data, error } = await supabase?.from('user_courses')?.insert([{ user_id: userId, course_id: courseId }])?.select(`
          *,
          courses(id, code, name, description)
        `)?.single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to enroll in course' } 
      };
    }
  },

  // Get all available courses
  async getAllCourses() {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          instructor:user_profiles!courses_instructor_id_fkey(id, full_name)
        `)?.eq('is_active', true)?.order('code');
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Failed to fetch courses' } 
      };
    }
  },

  // Create user activity (for tracking points and notifications)
  async createActivity(activityData) {
    try {
      const { data, error } = await supabase?.from('user_activities')?.insert([activityData])?.select()?.single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to create activity' } 
      };
    }
  },

  async getCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name, code')
        .order('code');

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          answers:answers(count),
          questions:questions(count),
          accepted_answers:answers!inner(count)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Process counts
      const processedData = {
        ...data,
        answers_count: data?.answers?.[0]?.count || 0,
        questions_count: data?.questions?.[0]?.count || 0,
        accepted_answers_count: data?.accepted_answers?.[0]?.count || 0
      };

      return { data: processedData, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }
};