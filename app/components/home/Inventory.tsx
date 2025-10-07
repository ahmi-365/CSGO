import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Gem, TrendingUp, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import BuyCard from '@/app/components/cases/BuyCard';
import { CaseItem, UserInfoItem } from '@/app/utilities/Types';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import InfoCard2 from '@/app/components/home/InfoCard2';

type Props = {
    loginAuth?: boolean;
    baseUrl?: string;
}

interface HistoryItem {
    id: number;
    crate: {
        id: string;
        name: string;
        image: string;
        price: string;
    };
    weapon: {
        id: string;
        name: string;
        image: string;
        price: string;
        rarity: string | null;
    };
    created_at: string;
}

interface ApiResponse {
    history: {
        current_page: number;
        data: HistoryItem[];
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

export default function Inventory({ loginAuth, baseUrl = 'https://backend.bismeel.com' }: Props) {
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRarity, setSelectedRarity] = useState('All Rarities');
    const [sortBy, setSortBy] = useState('Sort by');
    const [stats, setStats] = useState({
        totalItems: 0,
        avgValue: 0,
        legendaryPlus: 0,
        highestValue: 0
    });

    useEffect(() => {
        fetchHistory();
    }, [currentPage]);

    useEffect(() => {
        calculateStats();
    }, [historyData]);
   const getAuthToken = () => {
        if (typeof window === 'undefined') return null;
        const authData = localStorage.getItem('auth');
        if (!authData) return null;
        try {
            const parsed = JSON.parse(authData);
            return parsed.token;
        } catch {
            return null;
        }
    };

    // Get headers with auth token
    const getHeaders = () => {
        const token = getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/crates/history?page=${currentPage}`,{
                headers: getHeaders()
            });
            const data: ApiResponse = await response.json();
            
            setHistoryData(data.history.data);
            setTotalPages(data.history.last_page);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        if (historyData.length === 0) return;

        const totalItems = historyData.length;
        const avgValue = historyData.reduce((sum, item) => 
            sum + parseFloat(item.weapon.price || '0'), 0) / totalItems;
        const legendaryPlus = historyData.filter(item => 
            item.weapon.rarity === 'Legendary' || item.weapon.rarity === 'Mythical').length;
        const highestValue = Math.max(...historyData.map(item => 
            parseFloat(item.weapon.price || '0')));

        setStats({
            totalItems,
            avgValue: parseFloat(avgValue.toFixed(2)),
            legendaryPlus,
            highestValue
        });
    };

    const userInfo: UserInfoItem[] = [
        {
            icon: <FileText className="w-8 h-8" color="#1FFF33" />,
            value: stats.totalItems.toString().padStart(2, '0'),
            label: "Items",
            color: "#1FFF33",
        },
        {
            icon: <DollarSign className="w-8 h-8" color="#FFFFFF" />,
            value: `$${stats.avgValue.toFixed(2)}`,
            label: "Avg. Value",
            color: "#FFFFFF",
        },
        {
            icon: <Gem className="w-8 h-8" color="#62FFB9" />,
            value: stats.legendaryPlus.toString().padStart(2, '0'),
            label: "Legendary+",
            color: "#62FFB9",
        },
        {
            icon: <TrendingUp className="w-8 h-8" color="#51FF2D" />,
            value: `$${stats.highestValue.toFixed(2)}`,
            label: "Highest Value",
            color: "#1FFF33",
        },
    ];

    // Get rarity color
    const getRarityColor = (rarity: string | null): string => {
        const rarityColors: { [key: string]: string } = {
            'Common': '#39FF67',
            'Uncommon': '#FFD700',
            'Rare': '#4FC8FF',
            'Mythical': '#C324E7',
            'Legendary': '#E94444',
            'Ancient': '#FF8809',
        };
        return rarityColors[rarity || 'Common'] || '#39FF67';
    };

    // Filter and sort data
    const getFilteredData = () => {
        let filtered = [...historyData];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.weapon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.crate.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Rarity filter
        if (selectedRarity !== 'All Rarities') {
            filtered = filtered.filter(item => item.weapon.rarity === selectedRarity);
        }

        // Sort
        if (sortBy === 'Sort Price') {
            filtered.sort((a, b) => parseFloat(b.weapon.price) - parseFloat(a.weapon.price));
        } else if (sortBy === 'Sort Date') {
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortBy === 'Sort Name') {
            filtered.sort((a, b) => a.weapon.name.localeCompare(b.weapon.name));
        }

        return filtered;
    };

    const filteredData = getFilteredData();

    return (
        <>
            <div className="bg-[#1C1E2D] border border-solid border-white/10 rounded-3xl p-6 md:p-8 lg:py-11 lg:px-13 relative z-1 overflow-hidden mb-4 md:mb-5 lg:mb-6" >
                {!loginAuth ?
                    <>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[-10%] -z-1 bg-[#51FF2D] size-70 lg:size-92 rounded-full blur-[200px]"></div>
                        <div className="absolute top-1/2 -translate-y-4 right-[-12%] -z-1 bg-[#51FF2D] size-70 lg:size-92 rounded-full blur-[200px]"></div>
                    </>
                    :
                    <>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[-60%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
                        <div className="absolute bottom-[-30%] lg:bottom-[-50%] right-20 -z-1 bg-[#702AEC] size-30 md:size-50 lg:size-75 rounded-full blur-[100px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-[-62%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
                    </>
                }
                {!loginAuth ?
                    <div className="max-w-98 text-center md:text-start">
                        <img src="/img/inventor/img.png" className='absolute hidden md:block bottom-2 right-0 -z-1 mix-blend-color-dodge h-full object-cover opacity-6' alt="" />
                        <img src="/img/inventor/img_1.png" className='absolute hidden md:block bottom-2 right-0 -z-1 h-full object-cover' alt="" />
                        <img src="/img/inventor/img_2.png" className='absolute hidden md:block bottom-2 right-30 h-full object-cover z-5' alt="" />
                        <h1 className='text-4xl !leading-[130%] mb-2'>Inventory</h1>
                        <h4 className='text-base text-white font-bold'>CleanCase Inventory</h4>
                        <div className="border border-solid border-white/16 my-3 max-w-84"></div>
                        <p className='text-base !leading-normal max-w-85 mb-6'>Play lotteries online and hit the jackpot! Great Bonus For Every Deposit</p>
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <Link href='/login' className='grow gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold'>
                                <span className='px-5 md:px-7 lg:px-9 xl:px-13'>
                                    Play Now
                                </span>
                            </Link>
                            <Link href='/login' className='grow border border-solid border-white/10 rounded-full p-px overflow-hidden bg-[#1719253D] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold hover:bg-[#51FF2D]/30'>
                                <span className='px-5 md:px-7 lg:px-9 xl:px-13'>
                                    How to Play
                                </span>
                            </Link>
                        </div>
                    </div>
                    :
                    <div className="max-w-133 text-center md:text-start">
                        <img src="/img/home/img_1.png" className='absolute hidden md:block bottom-0 right-0 md:max-w-80 lg:max-w-100 -z-1' alt="" />
                        <h1 className='text-3xl md:text-4xl mb-4 !leading-[130%]'>Earn rewards and cash out instantly fast & easy</h1>
                        <p className='text-base !leading-normal mb-6'>Earn real rewards by completing simple tasks, playing exciting games, and inviting your friends to join the fun.</p>
                        <Link href='/login' className='min-w-45 max-w-full md:w-max gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold'>
                            <span className='px-5'>
                                Buy Now
                            </span>
                        </Link>
                    </div>
                }
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {userInfo.map((item, index) => (
                    <InfoCard2 key={index}
                        labelClass='justify-center md:justify-between'
                        item={item}
                    />
                ))}
            </div>

            <div className="flex flex-col gap-y-5 mt-6 md:mt-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
                    <Input 
                        type='text' 
                        placeholder='Search' 
                        className='min-w-full xl:min-w-80.5' 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <Dropdown 
                            btnClass='!min-w-42.5 xl:!min-w-48.5' 
                            placeholder={selectedRarity} 
                            items={[
                                { name: 'All Rarities' }, 
                                { name: 'Common' }, 
                                { name: 'Uncommon' },
                                { name: 'Rare' },
                                { name: 'Mythical' },
                                { name: 'Legendary' }
                            ]} 
                            onSelect={(item) => setSelectedRarity(item.name)}
                            leftIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3 5H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 15H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            } 
                        />
                        <Dropdown 
                            btnClass='!min-w-42.5 xl:!min-w-48.5' 
                            placeholder={sortBy} 
                            items={[
                                { name: 'Sort by' },
                                { name: 'Sort Price' }, 
                                { name: 'Sort Date' }, 
                                { name: 'Sort Name' }
                            ]} 
                            onSelect={(item) => setSortBy(item.name)}
                            leftIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3 5H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 15H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            } 
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 pd:10">
                    {loading ? (
                        <div className="col-span-full text-center py-20 text-white">
                            Loading...
                        </div>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <BuyCard 
                                item={{
                                    id: item.id.toString(),
                                    img: item.weapon.image,
                                    price: `$${parseFloat(item.weapon.price).toFixed(2)}`,
                                    des: item.weapon.name,
                                    color: getRarityColor(item.weapon.rarity),
                                    btn: 'Sell Now',
                                }} 
                                key={item.id} 
                                path={`/inventory/${item.id}`} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-white/60">
                            No items found
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && !loading && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-lg border border-white/10 transition-colors ${
                                        currentPage === page 
                                            ? 'bg-[#51FF2D] text-black font-bold' 
                                            : 'bg-white/5 text-white hover:bg-white/10'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}