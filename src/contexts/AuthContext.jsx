import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Add initialization check
    if (!supabase?.auth) {
      console.error('Supabase client not properly initialized');
      setError('Authentication service unavailable');
      setLoading(false);
      return;
    }

    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get session');
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser(session?.user);
          fetchUserProfile(session?.user?.id);
        }
        setLoading(false);
      })?.catch((error) => {
        console.error('Session error:', error);
        setError('Failed to get session');
        setLoading(false);
      });

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        try {
          if (session?.user) {
            setUser(session?.user);
            fetchUserProfile(session?.user?.id);  // Fire-and-forget, NO AWAIT
          } else {
            setUser(null);
            setUserProfile(null);
          }
          setLoading(false);
          // Clear any previous auth errors on successful state change
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setError(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setError('Authentication state error');
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = (userId) => {
    if (!supabase?.from) {
      console.error('Supabase client not available for profile fetch');
      return;
    }

    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          console.error('Profile fetch error:', error);
          setError('Failed to fetch user profile');
          return;
        }
        setUserProfile(data);
      })?.catch((error) => {
        console.error('Profile fetch error:', error);
        setError('Failed to fetch user profile');
      });
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate inputs
      if (!email || !password) {
        const errorMessage = 'Email and password are required';
        setError(errorMessage);
        return { error: { message: errorMessage } };
      }

      // Add supabase client check
      if (!supabase?.auth?.signInWithPassword) {
        const errorMessage = 'Authentication service is not available';
        setError(errorMessage);
        return { error: { message: errorMessage } };
      }

      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error?.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error?.message?.includes('Failed to fetch') 
        ? 'Cannot connect to authentication service. Please check your internet connection or try again later.' :'An unexpected error occurred during sign in. Please try again.';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      setError(null);
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'student'
          }
        }
      })
      
      if (error) {
        setError(error?.message);
        return { error }
      }
      
      return { data }
    } catch (error) {
      const errorMessage = error?.message?.includes('Failed to fetch') 
        ? 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.' :'Something went wrong. Please try again.'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      setUser(null)
      setUserProfile(null)
      return { error: null }
    } catch (error) {
      setError('Failed to sign out')
      return { error: { message: 'Failed to sign out' } }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}