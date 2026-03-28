import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabaseClient';

export default function useAuth() {
  const { user, token, isInitialized, setAuth, logout } = useAuthStore();

  async function loginUser(email, password) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw new Error(authError.message);
    

    let userProfile = { id: authData.user.id, email: authData.user.email, role: 'user' };
    try {
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      if (profileData) userProfile = profileData;
    } catch (err) {
      console.warn("Using fallback profile due to sync issue:", err.message);
    }
    
    setAuth(userProfile, authData.session.access_token);
    return { user: userProfile, token: authData.session.access_token };
  }

  async function registerUser(email, password, name) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    
    if (authError) throw new Error(authError.message);

    if (authData.session) {
      let userProfile = { id: authData.user.id, email: authData.user.email, role: 'user', name };
      try {
        await supabase.from('users').update({ name }).eq('id', authData.user.id);
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        if (profileData) userProfile = profileData;
      } catch (err) {
        console.warn("Registration profile sync failed, using session data:", err.message);
      }
      
      setAuth(userProfile, authData.session.access_token);
      return { user: userProfile, token: authData.session.access_token };
    } else {
      throw new Error("Registration complete! Please check your email to verify your account (if enabled) before logging in.");
    }
  }

  async function logoutUser() {
    await supabase.auth.signOut();
    logout(); // Wipe Zustand persist memory natively 
  }

  return { user, token, isLoggedIn: !!token, isInitialized, loginUser, registerUser, logout: logoutUser };
}

