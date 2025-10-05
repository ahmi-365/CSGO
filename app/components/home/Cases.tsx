import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import BuyCard from '@/app/components/cases/BuyCard';
import { CaseItem } from '@/app/utilities/Types';
import { JSX } from 'react';

type Props = {
    loginAuth?: boolean;
}

interface SocialItem {
    icon?: JSX.Element | string;
    path?: string;
}

interface ApiCrate {
    id: string;
    name: string;
    image: string;
    price: string;
    rarity?: {
        color: string;
    } | null;
}

const randomColors = [
    '#39FF67', '#FFD700', '#4FC8FF', '#C324E7', '#E94444', 
    '#FF8809', '#347BFF', '#ED164C', '#24E9FF', '#702AEC'
];

const getRandomColor = () => {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
};

export default function Cases({ loginAuth = true }: Props) {
    const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
    const [featuredCase, setFeaturedCase] = useState<CaseItem | null>(null);
    const [loading, setLoading] = useState(true);
    const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await fetch(`${base_url}/api/cases`);
                const data = await response.json();
                
                // Transform API data to match CaseItem type
                const transformedCases: CaseItem[] = data.crates.data.map((crate: ApiCrate) => ({
                    img: crate.image,
                    price: `$${crate.price}`,
                    des: crate.name,
                    color: crate.rarity?.color || getRandomColor(),
                }));
                
                setCaseItems(transformedCases);
                
                // Select a random case for the featured section
                if (transformedCases.length > 0) {
                    const randomIndex = Math.floor(Math.random() * transformedCases.length);
                    setFeaturedCase(transformedCases[randomIndex]);
                }
            } catch (error) {
                console.error('Error fetching cases:', error);
                setCaseItems([]);
                setFeaturedCase(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    const social: SocialItem[] = [
        {
            icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_497)">
                    <path d="M23.0935 9.41355L13.3042 9.41309C12.8719 9.41309 12.5215 9.76343 12.5215 10.1957V13.323C12.5215 13.7552 12.8719 14.1056 13.3041 14.1056H18.8169C18.2132 15.6722 17.0865 16.9842 15.6491 17.8178L17.9997 21.887C21.7704 19.7062 23.9997 15.8799 23.9997 11.5965C23.9997 10.9866 23.9548 10.5506 23.8649 10.0597C23.7965 9.68674 23.4727 9.41355 23.0935 9.41355Z" fill="currentColor" />
                    <path d="M12.0003 18.8043C9.30242 18.8043 6.94723 17.3303 5.68231 15.1491L1.61328 17.4944C3.68398 21.0833 7.56308 23.5 12.0003 23.5C14.177 23.5 16.2309 22.9139 18.0003 21.8926V21.887L15.6496 17.8178C14.5744 18.4414 13.3302 18.8043 12.0003 18.8043Z" fill="currentColor" />
                    <path d="M18 21.8926V21.887L15.6494 17.8178C14.5741 18.4414 13.33 18.8044 12 18.8044V23.5C14.1767 23.5 16.2308 22.9139 18 21.8926Z" fill="currentColor" />
                    <path d="M4.69566 11.5C4.69566 10.1702 5.05856 8.9261 5.68205 7.85093L1.61302 5.50558C0.586031 7.26935 0 9.31769 0 11.5C0 13.6823 0.586031 15.7307 1.61302 17.4944L5.68205 15.1491C5.05856 14.0739 4.69566 12.8298 4.69566 11.5Z" fill="currentColor" />
                    <path d="M12.0003 4.19566C13.7595 4.19566 15.3755 4.82078 16.6377 5.86061C16.9491 6.11711 17.4017 6.09859 17.6869 5.81336L19.9027 3.59758C20.2263 3.27395 20.2032 2.74422 19.8575 2.44431C17.7428 0.609672 14.9912 -0.5 12.0003 -0.5C7.56308 -0.5 3.68398 1.91673 1.61328 5.50558L5.68231 7.85092C6.94723 5.66969 9.30242 4.19566 12.0003 4.19566Z" fill="currentColor" />
                    <path d="M16.6374 5.86061C16.9488 6.11711 17.4015 6.09859 17.6866 5.81336L19.9024 3.59758C20.226 3.27395 20.2029 2.74422 19.8573 2.44431C17.7425 0.609625 14.991 -0.5 12 -0.5V4.19566C13.7592 4.19566 15.3752 4.82078 16.6374 5.86061Z" fill="currentColor" />
                </g>
                <defs>
                    <clipPath id="clip0_0_497">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>),
            path: '/',
        },
        {
            icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_505)">
                    <path d="M12 -0.5C5.37259 -0.5 0 4.87259 0 11.5C0 18.1274 5.37259 23.5 12 23.5C18.6274 23.5 24 18.1274 24 11.5C24 4.87259 18.6274 -0.5 12 -0.5ZM16.094 12.8025L12.0368 15.7347C11.8896 17.3192 10.5344 18.5593 8.90189 18.5593C8.18473 18.5598 7.48877 18.3162 6.92846 17.8685C6.36815 17.4209 5.97686 16.7959 5.81894 16.0964L3.68429 15.2482V11.3041L7.2912 12.7465C7.8541 12.4105 8.4864 12.2599 9.22238 12.3245L11.855 8.58717C11.8723 6.29646 13.7645 4.44069 16.0854 4.44069C18.4192 4.44069 20.3114 6.31802 20.3158 8.61731C20.3157 10.9336 18.4192 12.8025 16.094 12.8025Z" fill="currentColor" />
                    <path d="M8.87717 13.5C8.72259 13.4995 8.56846 13.5158 8.41777 13.5483L9.30095 13.883C9.50591 13.9582 9.693 14.0712 9.85137 14.2152C10.0097 14.3593 10.1363 14.5316 10.2236 14.7222C10.3109 14.9128 10.3572 15.1178 10.36 15.3254C10.3627 15.533 10.3218 15.7391 10.2395 15.9317C10.1562 16.1254 10.0332 16.3018 9.87752 16.4506C9.72188 16.5995 9.53668 16.7178 9.33251 16.799C9.12834 16.8802 8.90922 16.9225 8.6877 16.9236C8.46617 16.9247 8.24659 16.8845 8.04153 16.8054C7.69699 16.679 7.34454 16.5414 7 16.4187C7.17281 16.7342 7.43149 17.0006 7.74946 17.1904C8.06742 17.3802 8.43319 17.4867 8.80917 17.4988C9.18515 17.511 9.55778 17.4284 9.88874 17.2595C10.2197 17.0907 10.4971 16.8416 10.6923 16.538C10.8876 16.2344 10.9937 15.8872 10.9997 15.5321C11.0058 15.177 10.9115 14.8267 10.7267 14.5174C10.5419 14.208 10.2731 13.9507 9.94805 13.7719C9.62299 13.5931 9.25337 13.4993 8.87717 13.5Z" fill="currentColor" />
                    <path d="M16.0069 5.5C14.343 5.5 13 6.84558 13 8.49999C13 10.1635 14.3476 11.5 16.0069 11.5C17.6524 11.5046 19.0048 10.1637 19 8.49999C19 6.84558 17.6525 5.5 16.0069 5.5ZM16 10.3015C15.6483 10.2977 15.3057 10.1888 15.0151 9.9885C14.7245 9.78822 14.4991 9.50552 14.3671 9.17597C14.2351 8.84642 14.2026 8.48477 14.2735 8.13654C14.3444 7.78831 14.5156 7.46907 14.7656 7.21902C15.0156 6.96897 15.3332 6.79928 15.6784 6.73132C16.0236 6.66336 16.3809 6.70016 16.7055 6.8371C17.03 6.97403 17.3072 7.20497 17.5022 7.50085C17.6972 7.79672 17.8012 8.14431 17.8012 8.49984C17.8004 8.73782 17.7531 8.97329 17.662 9.19275C17.571 9.4122 17.438 9.61133 17.2706 9.77871C17.1033 9.94609 16.9049 10.0784 16.6869 10.1681C16.4688 10.2578 16.2354 10.3032 16 10.3015H16Z" fill="currentColor" />
                </g>
                <defs>
                    <clipPath id="clip0_0_505">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>),
            path: '/',
        },
        {
            icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.28765 16.3101C10.5071 18.2894 14.9488 18.6749 19.9822 15.5941C19.9453 15.6479 18.9496 17.0812 16.3313 17.8158C16.8845 18.5504 17.6405 19.3925 17.6405 19.3925C19.3184 19.3925 20.9594 18.9266 22.3792 18.0308C23.4855 17.3141 24.1124 16.0778 23.9833 14.7878C23.762 12.584 23.2273 10.4339 22.3976 8.37351C21.3466 5.68596 18.8205 3.82255 15.8888 3.55378C15.6307 3.53585 15.4463 3.53585 15.3357 3.53585L15.0407 3.8225C18.4149 4.7542 20.0929 6.20548 20.1297 6.25925C14.9484 3.715 8.82688 3.6792 3.60873 6.15176C3.60873 6.15176 5.26821 4.55713 8.93745 3.715L8.7162 3.5C8.32897 3.5 7.96019 3.53585 7.57302 3.58957C4.86254 4.0375 2.59463 5.84713 1.61737 8.33761C0.769182 10.4877 0.21604 12.7452 0.0132303 15.0386C-0.0973981 16.257 0.492638 17.4574 1.52519 18.1562C2.88962 19.0341 4.51221 19.5 6.15324 19.5C6.15324 19.5 6.81701 18.6579 7.48084 17.9054C4.99162 17.1887 3.97751 15.7553 3.95907 15.7015L4.42753 15.934C4.70757 16.073 4.99468 16.199 5.28765 16.3101ZM8.1815 14.752C6.98298 14.7161 6.04261 13.7307 6.07951 12.5481C6.1164 11.4373 7.03832 10.5414 8.1815 10.5056C9.38002 10.5414 10.3204 11.5269 10.2835 12.7094C10.2282 13.8203 9.32468 14.7162 8.1815 14.752ZM15.7044 14.752C14.5059 14.7161 13.5655 13.7307 13.6024 12.5481C13.6393 11.4373 14.5612 10.5414 15.7044 10.5056C16.9029 10.5414 17.8433 11.5269 17.8064 12.7094C17.7696 13.8203 16.8476 14.7162 15.7044 14.752Z" fill="currentColor" />
            </svg>),
            path: '/',
        },
    ]

    // Generate the path for the featured case
    const featuredCasePath = featuredCase 
        ? `/case/${featuredCase.des.toLowerCase().replace(/\s+/g, '-')}`
        : '/login';

    return (
        <>
            <div className="bg-[#1C1E2D] border border-solid border-white/10 rounded-3xl p-8 md:p-12 lg:py-13 lg:px-18 relative z-1 overflow-hidden">
                <div className="absolute top-1/2 -translate-y-1/2 left-[-60%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-30%] lg:bottom-[-50%] right-20 -z-1 bg-[#702AEC] size-30 md:size-50 lg:size-75 rounded-full blur-[100px]"></div>
                <div className="absolute top-1/2 -translate-y-1/2 right-[-62%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
                {loginAuth ?
                    <>
                        <div className="max-w-133 text-center md:text-start">
                            {loading ? (
                                <div className="absolute hidden md:block bottom-0 right-0 md:max-w-80 lg:max-w-100 -z-1 animate-pulse bg-white/10 rounded-lg w-80 h-80"></div>
                            ) : featuredCase ? (
                                <img 
                                    src={featuredCase.img} 
                                    className='absolute hidden md:block bottom-0 right-0 md:max-w-80 lg:max-w-100 -z-1' 
                                    alt={featuredCase.des} 
                                />
                            ) : (
                                <img src="/img/home/img_1.png" className='absolute hidden md:block bottom-0 right-0 md:max-w-80 lg:max-w-100 -z-1' alt="" />
                            )}
                            <h1 className='text-[28px] md:text-3xl lg:text-4xl mb-4 !leading-[130%]'>
                                {loading ? 'Loading...' : featuredCase ? featuredCase.des : 'Our Best-Selling Case'}
                            </h1>
                            <p className='text-base !leading-normal mb-6'>
                                {loading ? 'Fetching our best cases...' : featuredCase ? `Get this amazing case for just ${featuredCase.price}! Right now, around the globe, from busy cities to quiet towns, people are aligning with what truly matters.` : 'Right now, around the globe, from busy cities to quiet towns, people are aligning with what truly matters. Not because it\'s trendy, but because it works. The question is—will you join them?'}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6">
                                <Link 
                                    href={featuredCasePath}
                                    className='grow md:grow-0 min-w-45 gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold'
                                >
                                    <span className='px-5'>
                                        Buy Now
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="max-w-110 text-center md:text-start">
                            {loading ? (
                                <div className="absolute hidden md:block md:bottom-0 xl:-bottom-18 right-0 xl:-right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1 animate-pulse bg-white/10 rounded-lg w-90 h-90"></div>
                            ) : featuredCase ? (
                                <img 
                                    src={featuredCase.img} 
                                    className='absolute hidden md:block md:bottom-0 xl:-bottom-18 right-0 xl:-right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1' 
                                    alt={featuredCase.des} 
                                />
                            ) : (
                                <img src="/img/home/img_2.png" className='absolute hidden md:block md:bottom-0 xl:-bottom-18 right-0 xl:-right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1' alt="" />
                            )}
                            <h1 className='text-[28px] md:text-3xl lg:text-4xl mb-4 !leading-[130%]'>
                                {loading ? 'Loading...' : featuredCase ? `Don't Miss Out on ${featuredCase.des}` : 'Don\'t Miss Out on Our Best-Selling Case'}
                            </h1>
                            <p className='text-base !leading-normal max-w-85 mb-6'>
                                {loading ? 'Fetching our best cases...' : featuredCase ? `${featuredCase.price} - The #1 Pick Everyone's Buying Right Now for Unmatched Value` : 'The #1 Pick Everyone\'s Buying Right Now for Unmatched Value'}
                            </p>
                            <div className="flex flex-wrap flex-col-reverse md:flex-row w-full gap-4">
                                <Link 
                                    href={featuredCasePath}
                                    className='grow md:grow-0 gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold'
                                >
                                    <span className='px-5'>
                                        Get Started - Right Now
                                    </span>
                                </Link>
                                <div className="flex items-center gap-2 mx-auto md:mx-0">
                                    {social.map((item, index) => (
                                        <a href={item.path} target='_blank' className="bg-[#BFC0D8]/8 text-[#6F7083] size-13 rounded-full flex items-center justify-center hover:bg-primary hover:text-white" key={index}>{item.icon}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            <div className="flex flex-col gap-y-5 mt-6 md:mt-8">
                <h4 className='text-2xl'>Regular Cases</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 mb:pb-10">
                    {loading ? (
                        [...Array(10)].map((_, index) => (
                            <div key={index} className="animate-pulse bg-[#1C1E2D]/50 border border-white/10 rounded-2xl h-64"></div>
                        ))
                    ) : caseItems.length > 0 ? (
                        caseItems.map((item, index) => (
                            <BuyCard item={item} key={index} path={`/case/${item.des.toLowerCase().replace(/\s+/g, '-')}`} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No cases available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}