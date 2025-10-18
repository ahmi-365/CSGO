"use client"

import React, { useEffect, useState, Suspense } from 'react';
import PageContainer from '@/app/components/PageContainer';
import Cases from '@/app/components/home/Cases';
import Inventory from '@/app/components/home/Inventory';
import { useSearchParams } from 'next/navigation';
import Footer from '@/app/components/Footer';
import Preloader from '@/app/components/Preloader';

type Props = {}

export default function Page({ }: Props) {
  return (
    <>
      <PageContainer>
        <Suspense fallback={'Loading component...'}>
          <ClientContent />
        </Suspense>
      </PageContainer>
      <Footer />
    </>
  );
}

// Client component that uses useSearchParams
function ClientContent() {
  const searchParams = useSearchParams();
  const currentParams = searchParams.get("type");
  const [activeHeaderTab, setActiveHeaderTab] = useState<string>('cases');
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setActiveHeaderTab(currentParams?.toLowerCase() || 'cases');
  }, [currentParams]);

  useEffect(() => {
    const handleCookieChange = (event: any) => {
      const changed = event.changed.find((c: any) => c.name === 'auth');
      const deleted = event.deleted.find((c: any) => c.name === 'auth');

      if (changed) {
        setIsAuth(changed.value === 'true');
      } else if (deleted) {
        setIsAuth(false);
      }
    };

    if ('cookieStore' in window) {
      window.cookieStore.addEventListener('change', handleCookieChange);
      window.cookieStore.get('auth').then(cookie => {
        setIsAuth(cookie?.value === 'true');
      });
    } else {
      setIsAuth(document.cookie.includes('auth=true'));
    }

    return () => {
      if ('cookieStore' in window) {
        window.cookieStore.removeEventListener('change', handleCookieChange);
      }
    };
  }, []);

  const [preloading, setPreloading] = useState(true)
  useEffect(() => {
    setInterval(() => { setPreloading(false) }, 3000)
  }, [])
  return (
    <>
      {activeHeaderTab === 'cases' && <Cases loginAuth={isAuth} />}
      {activeHeaderTab === 'inventory' && <Inventory  />}
      {preloading &&
        <Preloader />
      }
    </>
  );
}
