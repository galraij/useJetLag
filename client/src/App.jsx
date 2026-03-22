import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar         from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import FeedPage     from './pages/FeedPage';
import MyFeedPage   from './pages/MyFeedPage';
import UploadPage   from './pages/UploadPage';
import PostPage     from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage    from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<FeedPage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />

        {/* Logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-feed"        element={<MyFeedPage />} />
          <Route path="/upload"         element={<UploadPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
