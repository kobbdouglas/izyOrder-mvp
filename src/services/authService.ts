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
    return null;
  }
};