-- Migration to fix RLS policy for AI-generated answers
-- This allows AI answers to be inserted with null user_id

-- Drop the existing overly restrictive policy
DROP POLICY IF EXISTS "users_manage_own_answers" ON public.answers;

-- Create separate policies for different operations
-- Allow users to manage their own answers
CREATE POLICY "users_manage_own_answers"
ON public.answers
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow AI system to create answers with null user_id
CREATE POLICY "allow_ai_generated_answers"
ON public.answers
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL AND is_ai_generated = true);

-- Allow AI answers to be updated (for voting/status changes)
CREATE POLICY "allow_ai_answer_updates"
ON public.answers
FOR UPDATE
TO authenticated
USING (user_id IS NULL AND is_ai_generated = true)
WITH CHECK (user_id IS NULL AND is_ai_generated = true);

-- Ensure the existing public read policy is still in place
-- (This should already exist, but let's make sure)
DROP POLICY IF EXISTS "public_can_read_answers" ON public.answers;
CREATE POLICY "public_can_read_answers"
ON public.answers
FOR SELECT
TO public
USING (true);