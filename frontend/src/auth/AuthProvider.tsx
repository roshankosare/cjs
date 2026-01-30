// src/auth/AuthProvider.tsx

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./types";
import axios, { AxiosError } from "axios";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchFlag, setRefetchFlag] = useState(false);

  // console.log(user);
  const fetchUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5046/api/auth/me",
        {},
        { withCredentials: true }
      );
      setUser(res.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "AuthProvider error:",
          error.response?.data.message || error.message
        );
      }
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };
  useEffect(() => {
    // Example: load user from storage or /me API
    fetchUser();
  }, [refetchFlag]);

  const refetch = () => {
    setIsLoading(true);
    setRefetchFlag((prev) => !prev);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5046/api/auth/signout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      refetch();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "AuthProvider error:",
          error.response?.data.message || error.message
        );
      }
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        refetchUser: refetch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
