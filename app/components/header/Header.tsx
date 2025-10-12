"use client"

import React, { JSX, useEffect, useRef, useState } from 'react'
import { Suspense } from 'react';
import Link from 'next/link';
import { 
  User, 
  Download, 
  ArrowUpDown, 
  History, 
  Settings, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Check,
  Bolt,
  Plus
} from 'lucide-react';

import { logo, favicon, wallet } from '@/app/utilities/Icons'
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

interface UserData {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  details: {
    id: number;
    user_id: number;
    balance: string;
    total_spent: string;
    total_won: string;
  };
  isAdmin: boolean;
  token: string;
}

interface WalletResponse {
  status: boolean;
  user_id: number;
  total_balance: number;
  message: string;
}

type Props = {}

export default function Header({ }: Props) {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  const loginInfo: LoginItem[] = [
    {
      icon: <User size={20} />,
      name: 'My Profile',
      path: '/customer-profile',
    },
    {
      icon: <Download size={20} />,
      name: 'Withdraw',
      path: '/wallet?type=withdraw',
    },
    {
      icon: <ArrowUpDown size={20} />,
      name: 'Transactions',
      path: '/wallet?type=transactions',
    },
    {
      icon: <History size={20} />,
      name: 'History',
      path: '/wallet?type=history',
    },
    {
      icon: <Settings size={20} />,
      name: 'Settings',
      path: '/settings',
    },
    {
      icon: <LayoutDashboard size={20} />,
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

  // Fetch user data from localStorage and wallet balance
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData: UserData = JSON.parse(storedAuth);
        
        // Ensure isAdmin is correctly set
        if (typeof authData.isAdmin !== 'boolean') {
          authData.isAdmin = false;
        }
        
        setUserData(authData);
        setIsAuth(!!authData.user);
        
        // Fetch wallet balance from API
        fetchWalletBalance(authData);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        setUserData(null);
        setIsAuth(false);
      }
    } else {
      setIsAuth(false);
    }
  }, []);

  // Function to fetch wallet balance from API
  const fetchWalletBalance = async (authData?: UserData) => {
    if (isLoadingWallet) return;
    
    setIsLoadingWallet(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      // Use provided authData or get from state
      const userAuthData = authData || userData;
      if (!userAuthData) {
        console.error('No user data available');
        setWalletBalance(0);
        return;
      }

      // Extract token from auth data
      const token = userAuthData.token;
      if (!token) {
        console.error('No token found in auth data');
        setWalletBalance(0);
        return;
      }

      // Get user ID from auth data
      const userId = userAuthData.user?.id || userAuthData.details?.user_id || 1;
      
      const response = await fetch(`${baseUrl}/api/wallet/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const walletData: WalletResponse = await response.json();
        if (walletData.status) {
          setWalletBalance(walletData.total_balance || 0);
        } else {
          console.warn('Wallet API returned false status:', walletData.message);
          setWalletBalance(0);
        }
      } else {
        console.error('Failed to fetch wallet balance:', response.status);
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  // Refresh wallet balance when dropdown is opened
  useEffect(() => {
    if (isInfoModal && isAuth && userData) {
      fetchWalletBalance();
    }
  }, [isInfoModal, isAuth, userData]);

  const signOut = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = userData?.token;
      
      if (token) {
        const response = await fetch(`${baseUrl}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        // We don't need to wait for the response to clear local storage
      }

      // Clear local storage
      localStorage.removeItem('auth');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');

      // Clear cookies
      if ('cookieStore' in window) {
        try {
          // @ts-ignore
          await window.cookieStore.delete('auth');
        } catch (err) {
          console.error("Failed to delete auth cookie:", err);
        }
      } else {
        document.cookie = "auth=; path=/; max-age=0; SameSite=Lax";
      }

      // Update state
      setIsAuth(false);
      setUserData(null);
      setIsInfoModal(false);
      setWalletBalance(0);

      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear everything even if API fails
      localStorage.removeItem('auth');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      
      setIsAuth(false);
      setUserData(null);
      setIsInfoModal(false);
      setWalletBalance(0);
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

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
  
  // Dynamic values with fallbacks
  const cc_rate = 6.395;
  const avatar = userData?.user?.avatar || '/img/login-user.png';
  const userName = userData?.user?.name || 'User';

  // Filter Admin Panel link based on user admin status
  const filteredLoginInfo = loginInfo.filter(item => {
    if (item.name === 'Admin Panel' && (!userData || !userData.isAdmin)) {
      return false;
    }
    return true; 
  });

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
              <Plus size={20} />
              <span className='block font-bold text-sm text-white'>Deposit</span>
            </Link>
            <Link href={'/deposit'} className='flex items-center justify-center gap-2 rounded-full bg-white/[6%] size-10 hover:bg-primary/20'>
              <Bolt size={20} />
            </Link>
            <div ref={dropdownRef} className="relative z-1">
              <button onClick={() => setIsInfoModal((prev) => !prev)} className='flex items-center justify-center gap-2 p-2 rounded-full bg-white/[6%] size-10 overflow-hidden relative z-1'>
                <img className='absolute top-0 left-0 w-full min-h-full h-auto object-cover' src={avatar} alt={userName} />
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
        {filteredLoginInfo?.map((item, index) => (
          <React.Fragment key={index}>
            {item.name === 'Withdraw' ?
              <div className="bg-white/4 border border-solid border-white/4 rounded-xl flex items-center gap-2 p-3">
                <div className="size-9 flex-none bg-[#171925] flex items-center justify-center overflow-hidden rounded-full">
                  <img src="/img/favicon.svg" alt="" />
                </div>
                <div className="grow flex flex-col gap-y-1.5">
                  <span className='block text-white/60 text-xs font-medium !leading-[120%]'>Balance</span>
                  <div className="flex items-center gap-2">
                    <button className='grow px-2.5 py-1 min-h-7 text-xs font-satoshi text-white bg-white/10 rounded-full flex items-center justify-center uppercase'>
                      {isLoadingWallet ? 'Loading...' : `${walletBalance.toFixed(2)} USD`}
                    </button>
                    <button className='grow gradient-border-two min-h-7 text-xs font-satoshi text-white rounded-full flex items-center justify-center uppercase [--bg-color:#4B4172]'>
                      <span className='px-2.5 py-1 block size-full'>
                        {isLoadingWallet ? '...' : `${(walletBalance / cc_rate).toFixed(3)} CC`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              :
              <Link onClick={() => setIsInfoModal(false)} href={item.path} className={loginInfoLinkStyle}>
                {item.icon} {item.name}
                <span className='ml-auto'>
                  <ChevronRight size={20} />
                </span>
              </Link>
            }
          </React.Fragment>
        ))}
        <button 
          onClick={() => { setIsInfoModal(false); signOut() }} 
          className={`${loginInfoLinkStyle} !text-[#E94444]`}
          disabled={isLoggingOut}
        >
          <LogOut size={20} />
          <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          <Check className='ml-auto' size={20} />
        </button>
      </div>
    </>
  )
}