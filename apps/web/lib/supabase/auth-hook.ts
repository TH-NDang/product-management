import { useEffect, useState } from 'react';
import { createClient } from './client';
import type { User } from '@supabase/supabase-js';
import type { User as AppUser } from '@/lib/types';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Lấy user hiện tại
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Lắng nghe thay đổi authentication
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Chuyển đổi Supabase User sang App User
  const appUser: AppUser | null = user ? {
    name: user.user_metadata?.full_name || user.user_metadata?.name || '',
    email: user.email || '',
    image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  } : null;

  return {
    user: appUser,
    supabaseUser: user,
    loading,
    supabase,
  };
} 