// app/services/api.ts

import axios from 'axios';

// Interfaces
interface User { id: number; name: string; email: string; }
interface LoginResponse { user: User; isAdmin: boolean; token?: string; }

// Axios client
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g. http://127.0.0.1:8000
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // ✅ allow cookies
});

// Step 1: Fetch CSRF cookie
export const getCsrfCookie = async () => {
  try {
    await apiClient.get('/sanctum/csrf-cookie');
    console.log("✅ CSRF cookie has been set successfully.");
  } catch (error) {
    console.error("❌ Could not get CSRF cookie.", error);
    throw new Error("Security token initialization failed.");
  }
};

// Step 2: Login function
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // Get CSRF token first
    await getCsrfCookie();

    // Now login (⚡ FIX: removed extra /api here)
    const response = await apiClient.post<LoginResponse>('/api/login', {
      email,
      password,
    });

    console.log("✅ Login successful:", response.data);
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ API Login Error:', error.response.data);

      if (error.response.status === 419) {
        throw new Error("CSRF token mismatch. Check CORS or Sanctum setup.");
      }

      throw new Error(error.response.data.message || 'Invalid email or password.');
    } else {
      console.error('❌ Unexpected error during login:', error);
      throw error;
    }
  }
};