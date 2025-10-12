'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');
    const isAdmin = searchParams.get('isAdmin');

    if (token && userString) {
      try {
        console.log("✅ Authentication successful. Saving token and user data...");

        // Store token
        localStorage.setItem('token', token);

        // Decode and save user data
        const user = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem('user', JSON.stringify(user));

        if (isAdmin) {
          localStorage.setItem('isAdmin', isAdmin);
        }

        // Set cookie for login session
        document.cookie = "auth=true; path=/; max-age=" + 3600 * 24 * 30;

        // Redirect and reload to rehydrate context
        window.location.href = '/';
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        router.push('/?error=auth_failed');
      }
    } else {
      console.error("⚠️ No token or user data found in callback URL");
      router.push('/?error=login_failed');
    }
  }, [router, searchParams]);

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
