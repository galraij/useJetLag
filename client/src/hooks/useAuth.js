import { useAuthStore } from '../store/authStore';
import * as authApi from '../api/auth.api';

export default function useAuth() {
  const { user, token, setAuth, logout } = useAuthStore();

  async function loginUser(email, password) {
    const { data } = await authApi.login({ email, password });
    setAuth(data.user, data.token);
    return data;
  }

  async function registerUser(email, password, name) {
    const { data } = await authApi.register({ email, password, name });
    setAuth(data.user, data.token);
    return data;
  }

  return { user, token, isLoggedIn: !!token, loginUser, registerUser, logout };
}
