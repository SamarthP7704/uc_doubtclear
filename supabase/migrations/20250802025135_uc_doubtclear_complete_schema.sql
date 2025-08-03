-- Location: supabase/migrations/20250802025135_uc_doubtclear_complete_schema.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema for UC DoubtClear Q&A platform
-- Dependencies: New auth-enabled system

-- 1. TYPES AND ENUMS
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE public.question_status AS ENUM ('pending', 'answered', 'ai_assisted', 'closed');
CREATE TYPE public.answer_status AS ENUM ('pending', 'accepted', 'helpful', 'flagged');
CREATE TYPE public.notification_type AS ENUM ('question_answered', 'answer_upvoted', 'question_bookmarked', 'rank_improved', 'badge_earned');

-- 2. CORE TABLES
-- User profiles table (critical intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'student'::public.user_role,
    points INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    weekly_growth INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- e.g., "CS 2028", "MATH 2076"
    name TEXT NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User course enrollments
CREATE TABLE public.user_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Questions table
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status public.question_status DEFAULT 'pending'::public.question_status,
    views INTEGER DEFAULT 0,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Answers table
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status public.answer_status DEFAULT 'pending'::public.answer_status,
    upvotes INTEGER DEFAULT 0,
    is_ai_generated BOOLEAN DEFAULT false,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Question bookmarks
CREATE TABLE public.question_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- Answer votes
CREATE TABLE public.answer_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE,
    vote_type INTEGER CHECK (vote_type IN (-1, 1)), -- -1 downvote, 1 upvote
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, answer_id)
);

-- User activities for activity feed
CREATE TABLE public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type public.notification_type,
    description TEXT NOT NULL,
    related_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    related_question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    related_answer_id UUID REFERENCES public.answers(id) ON DELETE SET NULL,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. ESSENTIAL INDEXES
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_points ON public.user_profiles(points DESC);
CREATE INDEX idx_courses_code ON public.courses(code);
CREATE INDEX idx_user_courses_user_id ON public.user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON public.user_courses(course_id);
CREATE INDEX idx_questions_user_id ON public.questions(user_id);
CREATE INDEX idx_questions_course_id ON public.questions(course_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_user_id ON public.answers(user_id);
CREATE INDEX idx_question_bookmarks_user_id ON public.question_bookmarks(user_id);
CREATE INDEX idx_answer_votes_answer_id ON public.answer_votes(answer_id);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);

-- 4. FUNCTIONS FOR AUTOMATIC PROFILE CREATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to update user points and rank
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update total points based on activities
    UPDATE public.user_profiles 
    SET points = (
        SELECT COALESCE(SUM(points_earned), 0) 
        FROM public.user_activities 
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    
    -- Update ranks based on points (simple ranking)
    WITH ranked_users AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC) as new_rank
        FROM public.user_profiles
        WHERE is_active = true
    )
    UPDATE public.user_profiles up
    SET rank = ru.new_rank
    FROM ranked_users ru
    WHERE up.id = ru.id;
    
    RETURN NEW;
END;
$$;

-- 5. TRIGGERS
-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update stats when activities are added
CREATE TRIGGER on_activity_added
  AFTER INSERT ON public.user_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- 6. ENABLE RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Public read access for user profiles (needed for leaderboards, etc.)
CREATE POLICY "public_can_read_user_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (true);

-- Pattern 4: Public read, instructor manage for courses
CREATE POLICY "public_can_read_courses"
ON public.courses
FOR SELECT
TO public
USING (true);

CREATE POLICY "instructors_manage_courses"
ON public.courses
FOR ALL
TO authenticated
USING (instructor_id = auth.uid())
WITH CHECK (instructor_id = auth.uid());

-- Pattern 2: Simple user ownership for user_courses
CREATE POLICY "users_manage_own_user_courses"
ON public.user_courses
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, private write for questions
CREATE POLICY "public_can_read_questions"
ON public.questions
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_questions"
ON public.questions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, private write for answers
CREATE POLICY "public_can_read_answers"
ON public.answers
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_answers"
ON public.answers
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for bookmarks
CREATE POLICY "users_manage_own_question_bookmarks"
ON public.question_bookmarks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for votes
CREATE POLICY "users_manage_own_answer_votes"
ON public.answer_votes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for activities
CREATE POLICY "users_manage_own_user_activities"
ON public.user_activities
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. COMPLETE MOCK DATA
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    instructor_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    student3_uuid UUID := gen_random_uuid();
    cs_course_id UUID := gen_random_uuid();
    math_course_id UUID := gen_random_uuid();
    phys_course_id UUID := gen_random_uuid();
    question1_id UUID := gen_random_uuid();
    question2_id UUID := gen_random_uuid();
    question3_id UUID := gen_random_uuid();
    answer1_id UUID := gen_random_uuid();
    answer2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@mail.uc.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (instructor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'prof.smith@mail.uc.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Prof. John Smith", "role": "instructor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.johnson@mail.uc.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'michael.chen@mail.uc.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Chen", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'emily.rodriguez@mail.uc.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emily Rodriguez", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create courses
    INSERT INTO public.courses (id, code, name, description, instructor_id) VALUES
        (cs_course_id, 'CS 2028', 'Data Structures & Algorithms', 'Fundamental concepts of computer science including data structures, algorithms, and complexity analysis.', instructor_uuid),
        (math_course_id, 'MATH 2076', 'Calculus II', 'Continuation of calculus including integration techniques, series, and differential equations.', instructor_uuid),
        (phys_course_id, 'PHYS 2001', 'College Physics I', 'Introduction to mechanics, waves, and thermodynamics with emphasis on problem-solving.', instructor_uuid);

    -- Enroll students in courses
    INSERT INTO public.user_courses (user_id, course_id) VALUES
        (student1_uuid, cs_course_id),
        (student1_uuid, math_course_id),
        (student1_uuid, phys_course_id),
        (student2_uuid, cs_course_id),
        (student2_uuid, math_course_id),
        (student3_uuid, math_course_id),
        (student3_uuid, phys_course_id);

    -- Create questions
    INSERT INTO public.questions (id, user_id, course_id, title, content, status, views, is_urgent) VALUES
        (question1_id, student1_uuid, cs_course_id, 'How to implement binary search tree traversal in Java?', 'I am struggling with understanding how to implement inorder, preorder, and postorder traversal for binary search trees. Can someone explain the recursive approach with examples?', 'answered'::public.question_status, 127, false),
        (question2_id, student1_uuid, math_course_id, 'What is the difference between integration by parts and substitution?', 'I keep getting confused about when to use integration by parts versus u-substitution. Are there specific patterns I should look for?', 'pending'::public.question_status, 45, false),
        (question3_id, student2_uuid, phys_course_id, 'Explain Newton''s second law with real-world examples', 'I understand F=ma mathematically, but I need help connecting it to real-world scenarios. Can someone provide practical examples?', 'ai_assisted'::public.question_status, 89, true);

    -- Create answers
    INSERT INTO public.answers (id, question_id, user_id, content, status, upvotes, is_accepted) VALUES
        (answer1_id, question1_id, student2_uuid, 'For binary search tree traversal, here are the three main approaches:\n\n**Inorder Traversal (Left, Root, Right):**\n```java\nvoid inorder(Node root) {\n    if (root != null) {\n        inorder(root.left);\n        System.out.print(root.data + " ");\n        inorder(root.right);\n    }\n}\n```\n\nThis gives you elements in sorted order for a BST. The other traversals follow similar recursive patterns.', 'accepted'::public.answer_status, 12, true),
        (answer2_id, question3_id, student3_uuid, 'Newton''s second law (F=ma) shows up everywhere in daily life:\n\n1. **Car acceleration**: More force (gas pedal) = more acceleration\n2. **Lifting weights**: Heavier weight needs more force to lift\n3. **Throwing a ball**: Light ball travels faster than heavy ball with same force\n\nThe key insight is that acceleration is directly proportional to force and inversely proportional to mass.', 'helpful'::public.answer_status, 8, false);

    -- Create bookmarks
    INSERT INTO public.question_bookmarks (user_id, question_id) VALUES
        (student2_uuid, question1_id),
        (student3_uuid, question1_id),
        (student1_uuid, question3_id);

    -- Create answer votes
    INSERT INTO public.answer_votes (user_id, answer_id, vote_type) VALUES
        (student1_uuid, answer1_id, 1),
        (student3_uuid, answer1_id, 1),
        (student1_uuid, answer2_id, 1),
        (student2_uuid, answer2_id, 1);

    -- Create user activities
    INSERT INTO public.user_activities (user_id, activity_type, description, related_user_id, related_question_id, points_earned) VALUES
        (student1_uuid, 'question_answered'::public.notification_type, 'Your question about binary search trees received a new answer', student2_uuid, question1_id, 10),
        (student1_uuid, 'answer_upvoted'::public.notification_type, 'Your answer about calculus integration was upvoted', null, null, 5),
        (student1_uuid, 'rank_improved'::public.notification_type, 'You moved up to rank #8 in the leaderboard!', null, null, 25),
        (student2_uuid, 'question_bookmarked'::public.notification_type, 'Someone bookmarked your physics question', student3_uuid, question3_id, 3);

    -- Update user profile stats (points will be auto-calculated by trigger)
    UPDATE public.user_profiles SET 
        points = 1250, 
        rank = 8, 
        weekly_growth = 85,
        avatar_url = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    WHERE id = student1_uuid;

    UPDATE public.user_profiles SET 
        points = 2340, 
        rank = 1, 
        weekly_growth = 120,
        avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    WHERE id = student2_uuid;

    UPDATE public.user_profiles SET 
        points = 2180, 
        rank = 2, 
        weekly_growth = 95,
        avatar_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    WHERE id = student3_uuid;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;