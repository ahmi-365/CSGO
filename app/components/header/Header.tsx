"use client"

import React, { JSX, useEffect, useRef, useState } from 'react'
import { Suspense } from 'react';
import Link from 'next/link';

import { logo, favicon, plus, wallet, bolt } from '@/app/utilities/Icons'
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import HeaderLeft from '@/app/components/header/HeaderLeft';
import ActionBtn from '@/app/components/header/ActionBtn';
import Humberge from './Humberger';
import MenuItem from './MenuItem';
import UserCurrency from './UserCurrency';

interface LoginItem {
  icon?: string | JSX.Element;
  name: string;
  path: string;
}

type Props = {}

export default function Header({ }: Props) {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false)

  const loginInfo: LoginItem[] = [
    {
      icon: (<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="8" r="2.5" stroke="white" strokeWidth="1.5" />
        <circle cx="9.99984" cy="10.5" r="8.33333" stroke="white" strokeWidth="1.5" />
        <path d="M14.9745 17.1667C14.8419 14.7571 14.1042 13 10.0002 13C5.89625 13 5.1585 14.7571 5.02588 17.1667" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>),
      name: 'My Profile',
      path: '/customer-profile',
    },
    {
      icon: (<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.6665 10.5C1.6665 6.57163 1.6665 4.60745 2.88689 3.38706C4.10728 2.16667 6.07147 2.16667 9.99984 2.16667C13.9282 2.16667 15.8924 2.16667 17.1128 3.38706C18.3332 4.60745 18.3332 6.57163 18.3332 10.5" stroke="white" strokeWidth="1.5" />
        <path d="M1.6665 12.1667C1.6665 9.83311 1.6665 8.66634 2.12064 7.77504C2.52012 6.99103 3.15753 6.35361 3.94154 5.95414C4.83284 5.5 5.99962 5.5 8.33317 5.5H11.6665C14.0001 5.5 15.1668 5.5 16.0581 5.95414C16.8421 6.35361 17.4796 6.99103 17.879 7.77504C18.3332 8.66634 18.3332 9.83311 18.3332 12.1667C18.3332 14.5002 18.3332 15.667 17.879 16.5583C17.4796 17.3423 16.8421 17.9797 16.0581 18.3792C15.1668 18.8333 14.0001 18.8333 11.6665 18.8333H8.33317C5.99962 18.8333 4.83284 18.8333 3.94154 18.3792C3.15753 17.9797 2.52012 17.3423 2.12064 16.5583C1.6665 15.667 1.6665 14.5002 1.6665 12.1667Z" stroke="white" strokeWidth="1.5" />
        <path d="M9.99984 14.6667L9.99984 9.66667M9.99984 9.66667L12.0832 11.75M9.99984 9.66667L7.9165 11.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      name: 'Withdraw',
      path: '/wallet?type=withdraw',
    },
    {
      icon: (<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3332 15.5L13.3332 5.5M13.3332 5.5L16.6665 8.9375M13.3332 5.5L9.99984 8.9375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.66667 5.5L6.66667 15.5M6.66667 15.5L10 12.0625M6.66667 15.5L3.33333 12.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      name: 'Transactions',
      path: '/wallet?type=transactions',
    },
    {
      icon: (<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 7.16666V10.5L12.0833 12.5833" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.67012 5.17018L4.13979 4.63985L4.13979 4.63985L4.67012 5.17018ZM3.6148 6.22549L2.86481 6.22926C2.86688 6.64053 3.19976 6.97342 3.61103 6.97549L3.6148 6.22549ZM5.73232 6.98615C6.14653 6.98823 6.484 6.65413 6.48608 6.23992C6.48817 5.82572 6.15407 5.48825 5.73986 5.48616L5.73609 6.23616L5.73232 6.98615ZM4.35413 4.10043C4.35205 3.68622 4.01458 3.35213 3.60037 3.35421C3.18616 3.35629 2.85207 3.69376 2.85415 4.10797L3.60414 4.1042L4.35413 4.10043ZM3.31268 9.50447C3.36893 9.09409 3.08185 8.71582 2.67148 8.65957C2.2611 8.60332 1.88283 8.89039 1.82658 9.30077L2.56963 9.40262L3.31268 9.50447ZM15.2766 5.22348L15.8069 4.69315C12.5754 1.46168 7.35187 1.42777 4.13979 4.63985L4.67012 5.17018L5.20045 5.70051C7.81672 3.08424 12.0905 3.09805 14.7463 5.75381L15.2766 5.22348ZM4.72342 15.7766L4.19309 16.307C7.42455 19.5384 12.6481 19.5724 15.8602 16.3603L15.3299 15.8299L14.7996 15.2996C12.1833 17.9159 7.9095 17.9021 5.25375 15.2463L4.72342 15.7766ZM15.3299 15.8299L15.8602 16.3603C19.0723 13.1482 19.0384 7.92462 15.8069 4.69315L15.2766 5.22348L14.7463 5.75381C17.402 8.40956 17.4158 12.6833 14.7996 15.2996L15.3299 15.8299ZM4.67012 5.17018L4.13979 4.63985L3.08447 5.69516L3.6148 6.22549L4.14513 6.75582L5.20045 5.70051L4.67012 5.17018ZM3.6148 6.22549L3.61103 6.97549L5.73232 6.98615L5.73609 6.23616L5.73986 5.48616L3.61857 5.4755L3.6148 6.22549ZM3.6148 6.22549L4.36479 6.22173L4.35413 4.10043L3.60414 4.1042L2.85415 4.10797L2.86481 6.22926L3.6148 6.22549ZM2.56963 9.40262L1.82658 9.30077C1.48693 11.7787 2.27794 14.3918 4.19309 16.307L4.72342 15.7766L5.25375 15.2463C3.68187 13.6744 3.03449 11.534 3.31268 9.50447L2.56963 9.40262Z" fill="white" />
      </svg>),
      name: 'History',
      path: '/wallet?type=history',
    },
    {
      icon: (<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10.5" r="2.5" stroke="white" strokeWidth="1.5" />
        <path d="M11.471 2.29352C11.1648 2.16666 10.7765 2.16666 9.99991 2.16666C9.22334 2.16666 8.83505 2.16666 8.52877 2.29352C8.12039 2.46268 7.79593 2.78714 7.62678 3.19552C7.54956 3.38194 7.51934 3.59874 7.50751 3.91498C7.49013 4.37972 7.2518 4.8099 6.84904 5.04243C6.44628 5.27496 5.95458 5.26627 5.54341 5.04896C5.26362 4.90107 5.06076 4.81884 4.8607 4.7925C4.42245 4.73481 3.97924 4.85357 3.62855 5.12266C3.36554 5.32447 3.1714 5.66074 2.78311 6.33327C2.39483 7.0058 2.20069 7.34206 2.15741 7.67074C2.09972 8.10899 2.21848 8.55221 2.48757 8.90289C2.61039 9.06295 2.783 9.19751 3.05091 9.36584C3.44475 9.61331 3.69816 10.0349 3.69813 10.5C3.69811 10.9651 3.44471 11.3866 3.05091 11.634C2.78296 11.8024 2.61032 11.937 2.48748 12.097C2.21839 12.4477 2.09964 12.8909 2.15733 13.3292C2.2006 13.6579 2.39475 13.9941 2.78303 14.6667C3.17132 15.3392 3.36546 15.6755 3.62847 15.8773C3.97915 16.1464 4.42237 16.2651 4.86062 16.2074C5.06066 16.1811 5.26352 16.0989 5.54328 15.951C5.95448 15.7337 6.44622 15.725 6.849 15.9575C7.25178 16.1901 7.49013 16.6203 7.50751 17.085C7.51934 17.4013 7.54956 17.618 7.62678 17.8045C7.79593 18.2128 8.12039 18.5373 8.52877 18.7065C8.83505 18.8333 9.22334 18.8333 9.99991 18.8333C10.7765 18.8333 11.1648 18.8333 11.471 18.7065C11.8794 18.5373 12.2039 18.2128 12.373 17.8045C12.4503 17.618 12.4805 17.4012 12.4923 17.085C12.5097 16.6202 12.748 16.1901 13.1507 15.9575C13.5535 15.7249 14.0453 15.7336 14.4565 15.951C14.7362 16.0988 14.9391 16.181 15.1391 16.2074C15.5774 16.2651 16.0206 16.1463 16.3713 15.8772C16.6343 15.6754 16.8284 15.3391 17.2167 14.6666C17.605 13.9941 17.7991 13.6578 17.8424 13.3291C17.9001 12.8909 17.7813 12.4477 17.5123 12.097C17.3894 11.9369 17.2168 11.8023 16.9489 11.634C16.555 11.3865 16.3017 10.965 16.3017 10.4999C16.3017 10.0349 16.5551 9.61339 16.9489 9.36598C17.2168 9.19761 17.3895 9.06304 17.5123 8.90295C17.7814 8.55226 17.9002 8.10905 17.8425 7.6708C17.7992 7.34212 17.6051 7.00585 17.2168 6.33332C16.8285 5.66079 16.6344 5.32453 16.3713 5.12271C16.0207 4.85362 15.5774 4.73486 15.1392 4.79256C14.9392 4.8189 14.7363 4.90112 14.4565 5.04899C14.0453 5.26632 13.5536 5.27501 13.1508 5.04246C12.748 4.80991 12.5097 4.37971 12.4923 3.91494C12.4805 3.59872 12.4503 3.38193 12.373 3.19552C12.2039 2.78714 11.8794 2.46268 11.471 2.29352Z" stroke="white" strokeWidth="1.5" />
      </svg>),
      name: 'Settings',
      path: '/settings',
    },
    {
      icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0835 5.41663H14.5835M14.5835 5.41663H17.0835M14.5835 5.41663V7.91663M14.5835 5.41663V2.91663" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2.0835 5.41671C2.0835 3.84536 2.0835 3.05968 2.57165 2.57153C3.05981 2.08337 3.84548 2.08337 5.41683 2.08337C6.98818 2.08337 7.77385 2.08337 8.26201 2.57153C8.75016 3.05968 8.75016 3.84536 8.75016 5.41671C8.75016 6.98806 8.75016 7.77373 8.26201 8.26189C7.77385 8.75004 6.98818 8.75004 5.41683 8.75004C3.84548 8.75004 3.05981 8.75004 2.57165 8.26189C2.0835 7.77373 2.0835 6.98806 2.0835 5.41671Z" stroke="white" strokeWidth="1.5" />
        <path d="M11.25 14.5833C11.25 13.012 11.25 12.2263 11.7382 11.7382C12.2263 11.25 13.012 11.25 14.5833 11.25C16.1547 11.25 16.9404 11.25 17.4285 11.7382C17.9167 12.2263 17.9167 13.012 17.9167 14.5833C17.9167 16.1547 17.9167 16.9404 17.4285 17.4285C16.9404 17.9167 16.1547 17.9167 14.5833 17.9167C13.012 17.9167 12.2263 17.9167 11.7382 17.4285C11.25 16.9404 11.25 16.1547 11.25 14.5833Z" stroke="white" strokeWidth="1.5" />
        <path d="M2.0835 14.5833C2.0835 13.012 2.0835 12.2263 2.57165 11.7382C3.05981 11.25 3.84548 11.25 5.41683 11.25C6.98818 11.25 7.77385 11.25 8.26201 11.7382C8.75016 12.2263 8.75016 13.012 8.75016 14.5833C8.75016 16.1547 8.75016 16.9404 8.26201 17.4285C7.77385 17.9167 6.98818 17.9167 5.41683 17.9167C3.84548 17.9167 3.05981 17.9167 2.57165 17.4285C2.0835 16.9404 2.0835 16.1547 2.0835 14.5833Z" stroke="white" strokeWidth="1.5" />
      </svg>),
      name: 'Admin Panel',
      path: '/dashboard/cases',
    },
  ]

  const [isInfoModal, setIsInfoModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsInfoModal(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const signOut = async () => {
    setIsAuth(false);
    if ('cookieStore' in window) {
      try {
        await window.cookieStore.delete('auth');
      } catch (err) {
        console.error("Failed to delete auth cookie:", err);
      }
    } else {
      document.cookie = "auth=; path=/; max-age=0; SameSite=Lax";
    }
  };

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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const isScroll = window.scrollY > 0;
      setScrolled(isScroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled, setScrolled]);

  const loginInfoLinkStyle = 'flex items-center gap-3 min-h-11 rounded-xl px-3 font-medium text-white hover:bg-white/10'
  const walletAmount = 24.99;
  const cc_rate = 6.395;

  return (
    <>
      <div className="fixed top-0 right-0 bg-[#702AEC]/40 blur-[250px] size-214 rounded-full -z-10 -mt-40 -mr-35"></div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-[#702AEC]/40 blur-[250px] size-284.5 rounded-full -z-10 -mt-40 -mr-35"></div>
      <header className={`flex items-center justify-between gap-2 py-2.5 px-4 lg:px-6 bg-[#1E202C]/10 border-b border-solid border-white/5 z-3 w-full ${scrolled ? 'sticky top-0 left-0 backdrop-blur-xl' : 'relative'}`}>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href={'/'} className='block'>
            <span className='hidden md:block'>{logo}</span>
            <span className='block md:hidden'>{favicon}</span>
          </Link>
          {(pathname === '/' || pathname.includes('/case/') || pathname.includes('/inventory')) &&
            <Suspense fallback={'Loading header...'}>
              <HeaderLeft className='hidden md:flex items-center gap-4 md:gap-6' />
            </Suspense>
          }
        </div>
        <Suspense fallback={'Loading menu...'}>
          <MenuItem />
        </Suspense>
        {!isAuth ?
          <Suspense fallback={'Loading btn...'}>
            <ActionBtn />
          </Suspense>
          :
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <UserCurrency className='hidden lg:flex' />
            <div className="hidden lg:block w-px h-6 bg-white/10 mx-2" />
            <Link href={'/wallet'} className='btn'>
              {plus}
              <span className='block font-bold text-sm text-white'>Deposit</span>
            </Link>
            <Link href={'/deposit'} className='flex items-center justify-center gap-2 rounded-full bg-white/[6%] size-10 hover:bg-primary/20'>{bolt}</Link>
            <div ref={dropdownRef} className="relative z-1">
              <button onClick={() => setIsInfoModal((prev) => !prev)} className='flex items-center justify-center gap-2 p-2 rounded-full bg-white/[6%] size-10 overflow-hidden relative z-1'>
                <img className='absolute top-0 left-0 w-full min-h-full h-auto object-cover' src="/img/login-user.png" alt="" />
              </button>
            </div>
            {pathname.includes('/dashboard/') &&
              <Suspense fallback={'Loading btn...'}>
                <Humberge />
              </Suspense>
            }
          </div>
        }
        {!pathname.includes('/dashboard/') &&
          <Suspense fallback={'Loading btn...'}>
            <Humberge className='flex xl:hidden' />
          </Suspense>
        }
      </header>


      <div className={`fixed mt-3.5 top-13 right-5 z-10 rounded-2xl bg-[#D7DEFF]/15 border border-solid border-[#D7DEFF]/10 backdrop-blur-[20px] flex flex-col gap-y-1 p-3 w-full max-w-68 transition-all duration-300 ${isInfoModal ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}>
        {loginInfo?.map((item, index) => (
          <React.Fragment key={index}>
            {index === 1 ?
              <div className="bg-white/4 border border-solid border-white/4 rounded-xl flex items-center gap-2 p-3">
                <div className="size-9 flex-none bg-[#171925] flex items-center justify-center overflow-hidden rounded-full"><img src="/img/favicon.svg" alt="" /></div>
                <div className="grow flex flex-col gap-y-1.5">
                  <span className='block text-white/60 text-xs font-medium !leading-[120%]'>Balance</span>
                  <div className="flex items-center gap-2">
                    <button className='grow px-2.5 py-1 min-h-7 text-xs font-satoshi text-white bg-white/10 rounded-full flex items-center justify-center uppercase'>{walletAmount} USD</button>
                    <button className='grow gradient-border-two min-h-7 text-xs font-satoshi text-white rounded-full flex items-center justify-center uppercase [--bg-color:#4B4172]'>
                      <span className='px-2.5 py-1 block size-full'>{(walletAmount / cc_rate).toFixed(3)} CC</span>
                    </button>
                  </div>
                </div>
              </div>
              :
              <Link onClick={() => setIsInfoModal(false)} href={item.path} className={loginInfoLinkStyle}>
                {item.icon} {item.name}
                <span className='ml-auto'>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15.5L12.5 10.5L7.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            }
          </React.Fragment>
        ))}
        <button onClick={() => { setIsInfoModal(false); signOut() }} className={`${loginInfoLinkStyle} !text-[#E94444]`}>
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.9165 8.47297V12.527C2.9165 14.4381 2.9165 15.3937 3.51785 15.9874C4.06417 16.5268 4.91299 16.5761 6.51522 16.5806C6.43055 16.0187 6.41287 15.3473 6.40841 14.5574C6.40652 14.2216 6.68074 13.9478 7.02091 13.946C7.36107 13.9441 7.63837 14.2148 7.64026 14.5507C7.64526 15.4373 7.66858 16.0657 7.75732 16.5427C7.84282 17.0023 7.98012 17.2683 8.18005 17.4657C8.40734 17.6901 8.72646 17.8364 9.32907 17.9164C9.9494 17.9987 10.7716 18 11.9504 18H12.7716C13.9505 18 14.7726 17.9987 15.3929 17.9164C15.9956 17.8364 16.3147 17.6901 16.542 17.4657C16.7693 17.2413 16.9174 16.9262 16.9985 16.3313C17.0819 15.7188 17.0832 14.9071 17.0832 13.7432V7.25676C17.0832 6.09291 17.0819 5.28119 16.9985 4.66875C16.9174 4.07379 16.7693 3.75873 16.542 3.53433C16.3147 3.30993 15.9956 3.16362 15.3929 3.08363C14.7726 3.00129 13.9505 3 12.7716 3H11.9504C10.7716 3 9.9494 3.00129 9.32907 3.08363C8.72646 3.16362 8.40734 3.30993 8.18005 3.53433C7.98012 3.73173 7.84282 3.99773 7.75732 4.45731C7.66858 4.93427 7.64526 5.56271 7.64026 6.44933C7.63837 6.78517 7.36107 7.05591 7.02091 7.05405C6.68074 7.05218 6.40652 6.7784 6.40841 6.44256C6.41287 5.65268 6.43055 4.98131 6.51522 4.41937C4.91299 4.42389 4.06417 4.47324 3.51785 5.01262C2.9165 5.60632 2.9165 6.56187 2.9165 8.47297ZM4.94471 10.93C4.70417 10.6925 4.70417 10.3075 4.94471 10.07L6.5872 8.44838C6.82774 8.2109 7.21773 8.2109 7.45826 8.44838C7.6988 8.68586 7.6988 9.0709 7.45826 9.30838L6.86724 9.89189L12.7715 9.89189C13.1116 9.89189 13.3874 10.1642 13.3874 10.5C13.3874 10.8358 13.1116 11.1081 12.7715 11.1081L6.86724 11.1081L7.45826 11.6916C7.6988 11.9291 7.6988 12.3141 7.45826 12.5516C7.21773 12.7891 6.82774 12.7891 6.5872 12.5516L4.94471 10.93Z" fill="#E94444" />
          </svg>
          <span>Log Out</span>
          <svg className='ml-auto' width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.8335 14.6667L14.1668 6.33334" stroke="#E94444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.8335 6.33334H14.1668V14.6667" stroke="#E94444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  )
}