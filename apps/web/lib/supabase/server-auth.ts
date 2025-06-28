import { createClient } from './server';
import type { User as AppUser } from '@/lib/types';

export async function getServerUser(): Promise<AppUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Chuyển đổi Supabase User sang App User
    const appUser: AppUser = {
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      email: user.email || '',
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    };

    return appUser;
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<AppUser> {
  const user = await getServerUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
} 