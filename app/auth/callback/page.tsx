import { Suspense } from "react";
import AuthCallbackPage from "./AuthCallbackPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1C1E2D',
        color: 'white',
        fontFamily: 'sans-serif'
      }}>
        <p>Processing login...</p>
      </div>
    }>
      <AuthCallbackPage />
    </Suspense>
  );
}
