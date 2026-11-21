export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  role: "user" | "creator" | "moderator" | "admin";
  status: "active" | "banned";
}
