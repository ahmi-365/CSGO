'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.group("🔁 OAuth Callback Debug Log");

    const token = searchParams.get('token');
    const userString = searchParams.get('user');
    const isAdmin = searchParams.get('isAdmin');

    console.log("📩 Query Parameters Received:");
    console.log("→ token:", token ? token.substring(0, 20) + "..." : "❌ Missing");
    console.log("→ user (encoded):", userString ? userString.substring(0, 50) + "..." : "❌ Missing");
    console.log("→ isAdmin:", isAdmin ?? "❌ Missing");

    if (token && userString) {
      try {
        console.log("✅ Valid parameters found, starting authentication process...");

        let user: any;
        try {
          // Try JSON directly first
          user = JSON.parse(userString);
          console.log("🧩 Parsed user as direct JSON:", user);
        } catch {
          // If that fails, assume Base64 encoded JSON
          const decoded = atob(userString);
          user = JSON.parse(decoded);
          console.log("🧩 Parsed user after Base64 decode:", user);
        }

        const auth = {
          token,
          user,
          isAdmin: isAdmin === 'true' || isAdmin === '1',
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem('auth', JSON.stringify(auth));
        console.log("💾 Stored successfully in localStorage under key 'auth':", auth);

        document.cookie = "auth=true; path=/; max-age=" + 3600 * 24 * 30;
        console.log("🍪 Auth cookie set for 30 days.");

        if (window.opener) {
          console.log("🪟 Popup detected — notifying parent and closing.");
          window.opener.postMessage({ type: "OAUTH_SUCCESS", auth }, "*");
          window.close();
        } else {
          console.log("➡️ Redirecting to home page...");
          window.location.href = '/';
        }
      } catch (error) {
        console.error("❌ Error during login process:", error);
        router.push('/?error=auth_failed');
      }
    } else {
      console.warn("⚠️ Missing token or user data in callback URL.");
      router.push('/?error=login_failed');
    }

    console.groupEnd();
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
