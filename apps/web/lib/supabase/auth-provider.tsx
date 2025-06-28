"use client";

import { createContext, useContext, useEffect } from 'react';
import { useSupabaseAuth } from './auth-hook';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSession, logout } from '@/lib/features/auth/auth-slice';

interface AuthContextType {
  user: ReturnType<typeof useSupabaseAuth>['user'];
  loading: boolean;
  supabase: ReturnType<typeof useSupabaseAuth>['supabase'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode; }) {
  const { user, loading, supabase } = useSupabaseAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setSession({ user, token: null }));
    } else if (!loading) {
      dispatch(logout());
    }
  }, [user, loading, dispatch]);

  return (
    <AuthContext.Provider value={{ user, loading, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 