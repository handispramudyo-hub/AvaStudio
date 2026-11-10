import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("ava_admin_token");
    const savedUser = localStorage.getItem("ava_admin_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("ava_admin_token");
        localStorage.removeItem("ava_admin_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("ava_admin_token", newToken);
    localStorage.setItem("ava_admin_user", JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/admin/logout");
      }
    } catch (e) {
      // Ignore API logout failure on client
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("ava_admin_token");
      localStorage.removeItem("ava_admin_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
