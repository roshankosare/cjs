// src/auth/types.ts

export interface User {
  id: string;
  username: string;
  email: string;
  role?: "USER" | "ADMIN";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => void;
  logout:()=>void;
}
