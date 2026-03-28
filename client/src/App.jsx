import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
//import HomeImage from './components/layout/HomeImage';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import MyFeedPage from './pages/MyFeedPage';
import UploadPage from './pages/UploadPage';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ExplorePage from './pages/ExplorePage';
import GetStartedUploadPage from './pages/GetStartedUploadPage';
import TripPage from './pages/TripPage';
import TripsPage from './pages/TripsPage';
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import { supabase } from './lib/supabaseClient';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { setAuth, logout, setInitialized } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function syncProfile(session) {
      if (!session) {
        logout();
        if (mounted) setInitialized(true);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (mounted) {
          if (profile) {
            setAuth(profile, session.access_token);
          } else {
            setAuth({ id: session.user.id, email: session.user.email, role: 'user' }, session.access_token);
          }
        }
      } catch (err) {
        console.error("Profile sync failed:", err);
        if (mounted) setAuth({ id: session.user.id, email: session.user.email, role: 'user' }, session.access_token);
      } finally {
        if (mounted) setInitialized(true);
      }
    }

    // 1. Check for initial session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) syncProfile(session);
    });

    // 2. Listen for all auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) syncProfile(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setAuth, logout, setInitialized]);

  return (
    <BrowserRouter>

      <Navbar />
      {/* <HomeImage /> */}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-feed" element={<MyFeedPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/explore" element={<Explore/>} />

<Route path="/dashboard" element={<Dashboard />} />
        <Route path="/get-started-upload" element={<GetStartedUploadPage />} />
        <Route path="/trip/:slug" element={<TripPage />} />
        <Route path="/trip" element={<TripsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </BrowserRouter>
  );
}
