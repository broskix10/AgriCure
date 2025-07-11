import { supabase } from './supabaseClient';
import type { UserProfile } from './supabaseClient';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  farmLocation?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  static async signUp(data: SignUpData) {
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            full_name: data.fullName,
            email: data.email,
            farm_location: data.farmLocation,
          });

        if (profileError) throw profileError;
      }

      return { user: authData.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return { user: authData.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }
}