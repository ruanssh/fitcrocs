import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clearAccessToken, getAccessToken, setAccessToken } from '../api/token';
import {
  getMe,
  login as loginService,
  register as registerService,
  updateMyPhoto as updateMyPhotoService,
} from '../services/auth.service';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateMyPhoto: (photoBase64: string | null) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getMe();
        setToken(accessToken);
        setUser(profile);
      } catch {
        clearAccessToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await loginService(payload);
    setAccessToken(result.access_token);
    setToken(result.access_token);
    setUser(result.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await registerService(payload);
    setAccessToken(result.access_token);
    setToken(result.access_token);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await getMe();
    setUser(profile);
  }, []);

  const updateMyPhoto = useCallback(async (photoBase64: string | null) => {
    const profile = await updateMyPhotoService(photoBase64);
    setUser(profile);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      login,
      register,
      refreshUser,
      updateMyPhoto,
      logout,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      refreshUser,
      updateMyPhoto,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
