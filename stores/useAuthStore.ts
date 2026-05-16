import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  signInWithGitHub: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/my-blog` },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initialize: () => {
    // 초기 세션 로드
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });

    // 세션 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });

    // useEffect 클린업용 unsubscribe 반환
    return () => subscription.unsubscribe();
  },
}));
