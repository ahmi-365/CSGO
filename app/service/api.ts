// app/services/api.ts
import axios from "axios";

// Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  isAdmin: boolean;
  token?: string;
}

export interface RegisterResponse {
  user: User;
  token?: string;
  message?: string;
}

// 🌍 Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("🌍 API Base URL:", BASE_URL);

// LocalStorage Helpers
export const saveAuthData = (data: { user: User; token?: string; isAdmin?: boolean }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth", JSON.stringify(data));
  }
};

export const getAuthData = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth");
  }
};

// Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ Allow cookies (for Sanctum / sessions)
});

// 🔒 Axios interceptor to auto attach token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authData = getAuthData();
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
  }
  return config;
});

// 🔑 Login
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/api/login", {
      email,
      password,
    });

    console.log("✅ Login successful:", response.data);

    // Save user + token
    saveAuthData(response.data);

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ API Login Error:", error.response.data);

      if (error.response.status === 419) {
        throw new Error("CSRF token mismatch. Check SESSION_DOMAIN or CORS.");
      }

      throw new Error(error.response.data.message || "Invalid email or password.");
    } else {
      console.error("❌ Unexpected error during login:", error);
      throw error;
    }
  }
};

// 📝 Register
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  password_confirmation: string,
  code?: string // optional
): Promise<RegisterResponse> => {
  try {
    const payload: any = {
      username,
      email,
      password,
      password_confirmation,
    };

    if (code) {
      payload.code = code;
    }

    const response = await apiClient.post<RegisterResponse>("/api/register", payload);

    console.log("✅ Registration successful:", response.data);

    // Save user + token
    saveAuthData(response.data);

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ API Register Error:", error.response.data);

      throw new Error(error.response.data.message || "Registration failed. Try again.");
    } else {
      console.error("❌ Unexpected error during register:", error);
      throw error;
    }
  }
};

// 🚪 Logout
export const logoutUser = async () => {
  try {
    await apiClient.post("/api/logout");
    clearAuthData(); // remove from localStorage
    console.log("✅ Logged out successfully");
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw error;
  }
};

export default apiClient;
