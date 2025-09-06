import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
}

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { 
      user: data.user ? { id: data.user.id, email: data.user.email! } : null, 
      error: null 
    };
  } catch (error) {
    return { user: null, error: 'Network error' };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { 
      user: data.user ? { id: data.user.id, email: data.user.email! } : null, 
      error: null 
    };
  } catch (error) {
    return { user: null, error: 'Network error' };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, skipping auth check');
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    
    // Handle network errors gracefully
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('Network error connecting to Supabase. Please check your internet connection and Supabase configuration.');
      return null;
    }
    
    // Handle invalid refresh token error by clearing stale session
    if (error instanceof Error && error.message.includes('Invalid Refresh Token')) {
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Error signing out after invalid refresh token:', signOutError);
      }
    }
    
    return null;
  }
};