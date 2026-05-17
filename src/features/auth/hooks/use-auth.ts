"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService, {
  LoginPayload,
  RegisterPayload,
} from "../services/auth.service";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const router = useRouter();
  const {
    setUser,
    setToken,
    logout: storeLogout,
    isLoading,
    setIsLoading,
  } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(payload);

      // Lưu vào store
      setUser(response.user);
      setToken(response.token);

      // Lưu token vào localStorage (hoặc HttpOnly cookie)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.token);
      }

      router.push("/dashboard"); // Redirect
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register(payload);

      // Tự động login sau khi register
      setUser(response.user);
      setToken(response.token);

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.token);
      }

      router.push("/dashboard");
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    storeLogout();
    router.push("/");
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
