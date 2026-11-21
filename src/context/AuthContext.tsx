import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, refreshAccessToken, signIn, signOut, signUp } from "../services/authService";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  register: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, avatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = "anilume-access-token";

function mapUser(data: any): User {
  return {
    id: data._id || data.id,
    name: data.displayName || data.username || "Người dùng",
    username: data.username,
    email: data.email,
    avatar: data.avatarUrl || "",
    createdAt: data.createdAt,
    role: data.role,
    status: data.status,
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    try {
      let token = localStorage.getItem(TOKEN_KEY);

      // Access token chưa có thì xin cấp mới bằng refresh token trong HttpOnly cookie.
      if (!token) {
        token = await refreshAccessToken();
        localStorage.setItem(TOKEN_KEY, token);
      }

      const currentUser = await getCurrentUser();
      setUser(mapUser(currentUser));
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const normalizedUsername = username.trim().toLowerCase();

    // Backend signUp yêu cầu đủ 5 trường: username, password, email, firstName, lastName.
    await signUp({
      username: normalizedUsername,
      password,
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    // Signup trả HTTP 204, vì vậy cần gọi signin riêng để nhận access token.
    await login(normalizedUsername, password);
  };

  const login = async (username: string, password: string) => {
    const accessToken = await signIn({
      username: username.trim().toLowerCase(),
      password,
    });

    localStorage.setItem(TOKEN_KEY, accessToken);

    // /users/me cần header Authorization: Bearer <accessToken>.
    const currentUser = await getCurrentUser();
    setUser(mapUser(currentUser));
  };

  const logout = () => {
    signOut().catch((error) => console.error("Lỗi đăng xuất:", error));
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = (_name: string, _avatar: string) => {
    // Backend hiện chưa có endpoint cập nhật hồ sơ; không giả lập lưu thành công.
    console.warn("Backend chưa hỗ trợ API cập nhật hồ sơ người dùng.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }

  return context;
}
