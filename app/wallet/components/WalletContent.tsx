"use client"

import React, { JSX, useState, useEffect } from 'react'
import PageContainer from '@/app/components/PageContainer'
import { useSearchParams } from 'next/navigation';
import Deposit from '@/app/wallet/components/Deposit'
import Withdraw from '@/app/wallet/components/Withdraw'
import History from '@/app/wallet/components/History'

// --- Interfaces for our data structures ---
interface CryptoItem {
    icon: string;
    name: string;
    currency: string;
    value: string;
    share_percent: string;
}

interface WalletItem {
    name: string;
    icon: JSX.Element;
    crypto: CryptoItem[];
}

// --- API Response Type ---
interface ApiPrice {
    symbol: string;
    price: number;
    timestamp: number;
}

interface ApiPricesData {
    [key: string]: ApiPrice;
}

interface ApiResponse {
    status: boolean;
    prices: {
        status: boolean;
        data: ApiPricesData;
    };
}

// --- Static Data Mapping ---
const cryptoDetailsMap: { [key: string]: { name: string; icon: string } } = {
    'BTC': { name: 'Bitcoin', icon: '/img/wallet/1.svg' },
    'ETH': { name: 'Ethereum', icon: '/img/wallet/6.svg' },
    'LTC': { name: 'Litecoin', icon: '/img/wallet/7.svg' },
    'BCH': { name: 'Bitcoin Cash', icon: '/img/wallet/4.svg' },
    'DOGE': { name: 'Dogecoin', icon: '/img/wallet/5.svg' },
    'ADA': { name: 'Cardano', icon: '/img/wallet/3.svg' },
    'DOT': { name: 'Polkadot', icon: '/img/wallet/8.svg' },
    'USDT': { name: 'Tether', icon: '/img/wallet/9.svg' },
    'BUSD': { name: 'Binance', icon: '/img/wallet/2.svg' },
    'XRP': { name: 'XRP', icon: '/img/wallet/xrp.svg' },
    'MATIC': { name: 'Polygon', icon: '/img/wallet/matic.svg' },
    'SOL': { name: 'Solana', icon: '/img/wallet/sol.svg' },
};

// --- Initial state for Wallet Tabs ---
const initialWalletItems: WalletItem[] = [
    {
        name: 'Deposit',
        icon: (<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.89107 5.44194C4.64699 5.19786 4.64699 4.80214 4.89107 4.55806C5.13514 4.31398 5.53087 4.31398 5.77495 4.55806L11.583 10.3661L14.8911 7.05806C15.0698 6.87931 15.3386 6.82584 15.5722 6.92257C15.8057 7.01931 15.958 7.24721 15.958 7.5V15C15.958 15.3452 15.6782 15.625 15.333 15.625L7.83301 15.625C7.58022 15.625 7.35232 15.4727 7.25558 15.2392C7.15885 15.0056 7.21232 14.7368 7.39107 14.5581L10.6991 11.25L4.89107 5.44194Z" fill="currentColor" />
        </svg>),
        crypto: []
    },
    {
        name: 'Withdraw',
        icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.55806 14.5581C4.31398 14.8021 4.31398 15.1979 4.55806 15.4419C4.80214 15.686 5.19786 15.686 5.44194 15.4419L11.25 9.63388L14.5581 12.9419C14.7368 13.1207 15.0056 13.1742 15.2392 13.0774C15.4727 12.9807 15.625 12.7528 15.625 12.5V5C15.625 4.65482 15.3452 4.375 15 4.375L7.5 4.375C7.24721 4.375 7.01931 4.52728 6.92258 4.76082C6.82584 4.99437 6.87931 5.26319 7.05806 5.44194L10.3661 8.75L4.55806 14.5581Z" fill="currentColor" />
        </svg>),
        crypto: []
    },
    {
        name: 'History',
        icon: (<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.166 6.66667V10L12.2493 12.0833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.83613 4.67019L4.3058 4.13986L4.3058 4.13986L4.83613 4.67019ZM3.78082 5.72551L3.03083 5.72928C3.03289 6.14055 3.36578 6.47343 3.77705 6.4755L3.78082 5.72551ZM5.89834 6.48616C6.31255 6.48824 6.65002 6.15415 6.6521 5.73994C6.65418 5.32573 6.32009 4.98826 5.90588 4.98618L5.90211 5.73617L5.89834 6.48616ZM4.52015 3.60045C4.51806 3.18624 4.1806 2.85215 3.76639 2.85423C3.35218 2.85631 3.01808 3.19378 3.02017 3.60799L3.77016 3.60422L4.52015 3.60045ZM3.4787 9.00448C3.53495 8.59411 3.24787 8.21583 2.83749 8.15958C2.42712 8.10333 2.04884 8.39041 1.99259 8.80079L2.73564 8.90263L3.4787 9.00448ZM15.4426 4.72349L15.9729 4.19316C12.7415 0.961694 7.51789 0.92778 4.3058 4.13986L4.83613 4.67019L5.36646 5.20052C7.98273 2.58425 12.2565 2.59807 14.9123 5.25382L15.4426 4.72349ZM4.88943 15.2767L4.3591 15.807C7.59057 19.0385 12.8141 19.0724 16.0262 15.8603L15.4959 15.33L14.9656 14.7996C12.3493 17.4159 8.07552 17.4021 5.41976 14.7463L4.88943 15.2767ZM15.4959 15.33L16.0262 15.8603C19.2383 12.6482 19.2044 7.42463 15.9729 4.19316L15.4426 4.72349L14.9123 5.25382C17.568 7.90958 17.5818 12.1834 14.9656 14.7996L15.4959 15.33ZM4.83613 4.67019L4.3058 4.13986L3.25049 5.19518L3.78082 5.72551L4.31115 6.25584L5.36646 5.20052L4.83613 4.67019ZM3.78082 5.72551L3.77705 6.4755L5.89834 6.48616L5.90211 5.73617L5.90588 4.98618L3.78459 4.97552L3.78082 5.72551ZM3.78082 5.72551L4.53081 5.72174L4.52015 3.60045L3.77016 3.60422L3.02017 3.60799L3.03083 5.72928L3.78082 5.72551ZM2.73564 8.90263L1.99259 8.80079C1.65294 11.2787 2.44395 13.8918 4.3591 15.807L4.88943 15.2767L5.41976 14.7463C3.84789 13.1745 3.20051 11.034 3.4787 9.00448L2.73564 8.90263Z" fill="currentColor" />
        </svg>),
        crypto: []
    },
];

type Props = {}

// --- NEW: Helper function to get auth token from localStorage ---
const getAuthToken = () => {
    // This check ensures the code only runs on the client-side
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsed = JSON.parse(auth);
          return parsed.token; // Return the token property from the parsed object
        } catch (e) {
          console.error('Error parsing auth data from localStorage:', e);
        }
      }
    }
    return null; // Return null if no token is found
};

export default function WalletContent({ }: Props) {
    const searchParams = useSearchParams();
    const currentType = searchParams.get('type');

    // --- State Management ---
    const [walletItems, setWalletItems] = useState<WalletItem[]>(initialWalletItems);
    const [activeWallet, setActiveWallet] = useState<WalletItem>(initialWalletItems[0]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- Effect for fetching data from API on component mount ---
    useEffect(() => {
        const fetchCryptoPrices = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // --- UPDATED: Use the new getAuthToken helper function ---
                const token = getAuthToken();

                if (!token) {
                    throw new Error('Authentication token not found. Please log in.');
                }

                const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/list/prices`;
                
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                };

                const response = await fetch(apiUrl, { headers: headers });

                if (response.status === 401) {
                    throw new Error('Unauthorized. Your session may have expired.');
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server.');
                }

                const result: ApiResponse = await response.json();

                if (!result.status || !result.prices.status || !result.prices.data) {
                    throw new Error('Invalid data format received from the API.');
                }
                
                const pricesData = result.prices.data;

                const formattedCryptoList: CryptoItem[] = Object.values(pricesData)
                    .map((apiCrypto: ApiPrice) => {
                        const details = cryptoDetailsMap[apiCrypto.symbol];
                        if (!details) {
                            return null;
                        }
                        return {
                            currency: apiCrypto.symbol,
                            name: details.name,
                            icon: details.icon,
                            value: apiCrypto.price.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }),
                            share_percent: '0.00%', 
                        };
                    })
                    .filter((item): item is CryptoItem => item !== null);

                const updatedWalletItems = initialWalletItems.map(item => ({
                    ...item,
                    crypto: formattedCryptoList
                }));

                setWalletItems(updatedWalletItems);

            } catch (err: any) {
                console.error("API Fetch Error:", err);
                setError(err.message || 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoPrices();
    }, []);

    // --- Effect to update the active tab based on URL search param ---
    useEffect(() => {
        if (currentType) {
            const found = walletItems.find(item => item.name.toLowerCase() === currentType.toLowerCase());
            setActiveWallet(found || walletItems[0]);
        } else {
            setActiveWallet(walletItems[0]);
        }
    }, [currentType, walletItems]);


    return (
        <PageContainer className='mt-6 mb-8'>
            <h4 className='text-2xl !leading-[130%] mb-4'>My Wallet</h4>
            <div className="flex flex-wrap gap-6">
                <div className="flex flex-col gap-y-4 md:gap-y-5 lg:gap-y-6 w-full lg:w-112.5">
                    <div className="flex items-center gap-1 p-1 bg-[#1E202C] rounded-2xl">
                        {walletItems.map((item, index) => (
                            <button key={index} onClick={() => setActiveWallet(item)} className={`grow px-3 md:px-4 min-h-10 lg:min-h-12.5 flex items-center justify-center gap-2 capitalize text-base font-medium rounded-xl hover:text-white ${activeWallet.name === item.name ? 'bg-white/10 text-white' : 'bg-transparent text-[#6F7083]'}`}>
                                {item.icon} {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white/5 rounded-[20px] p-5">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 md:mb-4 lg:mb-5">
                            <h4 className='text-lg md:text-xl xl:text-[22px] !leading-[130%]'>Select Cryptocurrency</h4>
                            <div className="flex items-center gap-1">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="5" cy="5" r="4.5" fill="#39FF67" stroke="#171925" />
                                </svg>
                                <p className='text-base text-[#6F7083] font-satoshi font-medium !leading-[100%]'>Live</p>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-155 -mr-3 pr-3">
                            {loading && <p className="text-center p-4 text-[#6F7083]">Loading prices...</p>}
                            {error && <p className="text-center p-4 text-red-500">Error: {error}</p>}
                            {!loading && !error && activeWallet?.crypto?.length === 0 && (
                                <p className="text-center p-4 text-[#6F7083]">No cryptocurrency data available.</p>
                            )}
                            {!loading && !error && activeWallet?.crypto?.map((item, index) => (
                                <div className="flex items-center justify-between p-3 md:p-4 bg-white/4 rounded-xl border border-solid border-transparent cursor-pointer hover:border-[#F7931A]/10 mb-2 hover:bg-[#F7931A]/20 transition-all duration-400" key={index}>
                                    <div className="flex items-center gap-3">
                                        <img src={item.icon} className='size-10 rounded-full object-cover' alt={item.name} />
                                        <div className="">
                                            <h3 className='text-sm md:text-base xl:text-lg text-white font-satoshi font-bold !leading-[120%] mb-2'>{item.name}</h3>
                                            <h4 className='text-xs text-[#6F7083] font-satoshi font-medium !leading-[100%]'>{item.currency}</h4>
                                        </div>
                                    </div>
                                    <div className="">
                                        <span className='mb-sm md:text-base lg:text-lg block text-white font-satoshi font-bold !leading-[120%] mb-2'>${item.value}</span>
                                        <div className="flex items-center gap-2">
                                            <svg className='flex-none' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.4449 4.66666C10.4449 4.39051 10.6688 4.16666 10.9449 4.16666H14.6663C14.9425 4.16666 15.1663 4.39051 15.1663 4.66666V8.36388C15.1663 8.64002 14.9425 8.86388 14.6663 8.86388C14.3902 8.86388 14.1663 8.64002 14.1663 8.36388V5.86856L10.0758 9.93419C9.76314 10.245 9.49367 10.5128 9.24895 10.6985C8.98662 10.8975 8.69515 11.048 8.33635 11.048C7.97755 11.0479 7.68611 10.8973 7.42383 10.6983C7.17916 10.5125 6.90976 10.2446 6.5972 9.93381L6.41436 9.75199C6.07159 9.41116 5.84935 9.19167 5.66431 9.05123C5.49082 8.91957 5.40972 8.90488 5.356 8.9049C5.30229 8.90492 5.22119 8.91967 5.0478 9.05146C4.86286 9.19203 4.64079 9.41168 4.29827 9.75277L1.68582 12.3543C1.49015 12.5491 1.17357 12.5485 0.978714 12.3528C0.783862 12.1571 0.784525 11.8405 0.980196 11.6457L3.6159 9.02102C3.92851 8.70968 4.19795 8.44133 4.44269 8.25532C4.70502 8.05593 4.99658 7.90503 5.35564 7.9049C5.7147 7.90477 6.00636 8.05546 6.26884 8.25465C6.51371 8.44049 6.78334 8.70863 7.09618 9.01974L7.27903 9.20156C7.6215 9.5421 7.84353 9.76138 8.02841 9.9017C8.20173 10.0333 8.28278 10.048 8.33647 10.048C8.39016 10.048 8.47121 10.0333 8.64456 9.90178C8.82947 9.7615 9.05155 9.54226 9.3941 9.2018L13.454 5.16666H10.9449C10.6688 5.16666 10.4449 4.9428 10.4449 4.66666Z" fill="#39FF67" />
                                            </svg>
                                            <h4 className='text-xs text-[#39FF67] font-satoshi font-medium !leading-[100%]'>{item.share_percent}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[calc(100%-475px)]">
                    <div className="h-full rounded-[20px] bg-white/[6%] border border-solid border-white/15 w-full p-4 md:p-6">
                        {activeWallet?.name?.toLowerCase() === 'deposit' && <Deposit />}
                        {activeWallet?.name?.toLowerCase() === 'withdraw' && <Withdraw />}
                        {activeWallet?.name?.toLowerCase() === 'history' && <History />}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}