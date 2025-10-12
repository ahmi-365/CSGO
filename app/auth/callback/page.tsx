"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * This page handles the callback from the backend after a successful social login (e.g., Google).
 * It receives the JWT token and user data as URL query parameters.
 * Its job is to:
 * 1. Read the token and user data from the URL.
 * 2. Store them in localStorage.
 * 3. Set an 'auth' cookie to mimic the manual login flow.
 * 4. Redirect the user to the homepage, effectively logging them in.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the token and user data from the URL query parameters
    const token = searchParams.get('token');
    const userString = searchParams.get('user'); // User data will be an encoded JSON string
    const isAdmin = searchParams.get('isAdmin');

    // Check if the token exists. This is the most crucial part.
    if (token && userString) {
      try {
        console.log("Authentication successful. Storing token and user data.");

        // 1. Store the token in localStorage
        localStorage.setItem('token', token);

        // 2. Decode and store the user data in localStorage
        const user = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem('user', JSON.stringify(user));
        
        if (isAdmin) {
          localStorage.setItem('isAdmin', isAdmin);
        }

        // 3. Set the 'auth' cookie to persist login state, making authentication consistent
        document.cookie = "auth=true; path=/; max-age=" + 3600 * 24 * 30; // 30 days

        // 4. Redirect to the homepage with a full page reload to ensure all components
        // re-render with the new authentication state.
        window.location.href = '/';

      } catch (error) {
        console.error("Failed to parse user data or complete login:", error);
        router.push('/?error=auth_failed');
      }
    } else {
      console.error("Authentication callback received without a token.");
      router.push('/?error=login_failed');
    }
  }, [router, searchParams]);

  // Render a loading state while the effect is running
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1C1E2D',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <p>Finalizing login, please wait...</p>
    </div>
  );
}