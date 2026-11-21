import api from "./api";

export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

// POST /auth/signup: server đọc đúng 5 thuộc tính trong req.body và trả HTTP 204.
export const signUp = async (body: SignUpRequest): Promise<void> => {
  await api.post("/auth/signup", body);
};

// POST /auth/signin: server đọc username + password và trả { accessToken }.
// Refresh token được server đặt trong cookie HttpOnly.
export const signIn = async (body: SignInRequest): Promise<string> => {
  const response = await api.post<{ accessToken: string }>("/auth/signin", body);
  return response.data.accessToken;
};

// POST /auth/refresh: không cần body; cookie refreshToken được gửi tự động nhờ withCredentials.
export const refreshAccessToken = async (): Promise<string> => {
  const response = await api.post<{ accessToken: string }>("/auth/refresh");
  return response.data.accessToken;
};

// GET /users/me: api interceptor tự gắn Authorization: Bearer <accessToken>.
export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data.user;
};

// POST /auth/signout: server đọc refreshToken từ cookie và trả HTTP 204.
export const signOut = async (): Promise<void> => {
  await api.post("/auth/signout");
};
