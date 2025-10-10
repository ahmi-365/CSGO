'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageContainer from '@/app/components/PageContainer';

interface WeaponDetail {
    id: number;
    user_id: number;
    crate_open_id: number;
    base_weapon_id: string | null;
    acquired_at: string;
    crate_id: string | null;
    weapon_id: string | null;
    condition: string | null;
    wear: string | null;
    is_sold: boolean;
    price: string | null;
    trade_locked_until: string | null;
    added_at: string;
    created_at: string;
    updated_at: string;
    base_weapon: null;
    crate_open: {
        id: number;
        user_id: number;
        crate_id: string;
        weapon_id: string;
        client_seed: string;
        server_seed: string;
        server_seed_hash: string;
        nonce: number;
        probability_used: number;
        price_paid: string;
        created_at: string;
        updated_at: string;
        weapon: {
            id: string;
            name: string;
            description: string;
            image: string;
            rarity: string | null;
            price: string;
            probability: number;
            created_at: string;
            updated_at: string;
        };
    };
}

interface ApiResponse {
    status: boolean;
    message: string;
    data: WeaponDetail;
}

export default function InventoryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [weaponData, setWeaponData] = useState<WeaponDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const baseUrl = 'https://backend.bismeel.com';

    useEffect(() => {
        if (id) {
            fetchWeaponDetail();
        }
    }, [id]);

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

    const getHeaders = () => {
        const token = getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    const fetchWeaponDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/inventory/${id}`, {
                headers: getHeaders()
            });
            const data: ApiResponse = await response.json();
            
            if (data.status && data.data) {
                setWeaponData(data.data);
            } else {
                console.error('Error fetching weapon detail:', data.message);
                setWeaponData(null);
            }
        } catch (error) {
            console.error('Error fetching weapon detail:', error);
            setWeaponData(null);
        } finally {
            setLoading(false);
        }
    };

    const getRarityColor = (rarity: string | null | undefined): string => {
        const rarityColors: Record<string, string> = {
            'Common': '#39FF67',
            'Uncommon': '#FFD700',
            'Rare': '#4FC8FF',
            'Mythical': '#C324E7',
            'Legendary': '#E94444',
            'Ancient': '#FF8809',
        };
        return rarityColors[rarity ?? 'Common'] ?? '#FF8809';
    };

    const getRarityGradient = (rarity: string | null | undefined): string => {
        const color = getRarityColor(rarity);
        return `linear-gradient(#12141E, #12141E), linear-gradient(${color}26 95%, ${color} 100%)`;
    };

    const calculateMarketplaceFee = (price: number): number => {
        return price * 0.15;
    };

    const calculateYouReceive = (price: number): number => {
        return price - calculateMarketplaceFee(price);
    };

    const handleConfirmSale = async () => {
        if (!weaponData) return;
        
        setIsConfirming(true);
        try {
            const response = await fetch(`${baseUrl}/api/inventory/sell`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    item_id: weaponData.id,
                }),
            });

            if (response.ok) {
                router.push('/inventory');
            } else {
                console.error('Failed to sell item');
            }
        } catch (error) {
            console.error('Error confirming sale:', error);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        router.push('/?type=inventory');
    };

    if (loading) {
        return (
            <PageContainer>
                <div className="min-h-[calc(100vh-65px)] w-full flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            </PageContainer>
        );
    }

    if (!weaponData || !weaponData.crate_open?.weapon) {
        return (
            <PageContainer>
                <div className="min-h-[calc(100vh-65px)] w-full flex items-center justify-center">
                    <div className="text-white text-xl">Item not found</div>
                </div>
            </PageContainer>
        );
    }

    const weapon = weaponData.crate_open.weapon;
    const marketValue = parseFloat(weapon.price || '0');
    const youReceive = calculateYouReceive(marketValue);
    const rarityColor = getRarityColor(weapon.rarity);
    
    return (
        <PageContainer>
            <div className="min-h-[calc(100vh-65px)] w-full flex-col flex items-center justify-center py-8">
                <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-5 xl:gap-20 max-w-298 w-full px-4">
                    <div className="max-w-150 w-full">
                        <div 
                            className="relative z-1 rounded-3xl overflow-hidden group cursor-pointer w-full" 
                            style={{ 
                                border: "double 1px transparent", 
                                backgroundImage: getRarityGradient(weapon.rarity), 
                                backgroundOrigin: "border-box", 
                                backgroundClip: "content-box, border-box" 
                            }}
                        >
                            <img 
                                src="/img/cases/card-shape.png" 
                                className='rounded-t-2xl mix-blend-color-dodge absolute top-0 left-0 w-full h-auto max-h-31 -z-10 opacity-10 transition-all duration-300 group-hover:opacity-100' 
                                alt="" 
                            />
                            <div className="pt-5 pb-10 flex flex-col items-center">
                                <img 
                                    src={weapon.image || '/img/inventor/inventory-1.png'} 
                                    alt={weapon.name || 'Weapon'} 
                                    className="size-70 lg:w-95 lg:h-96.5 object-contain mx-auto pointer-events-none" 
                                    onError={(e) => {
                                        e.currentTarget.src = '/img/inventor/inventory-1.png';
                                    }}
                                />
                            </div>
                            <div 
                                className='absolute -bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-14 rounded-[100%] -z-1 blur-[32px]' 
                                style={{ backgroundColor: rarityColor }} 
                            />
                            <div 
                                className='absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-40 rounded-[100%] -z-1 blur-[80px]' 
                                style={{ backgroundColor: rarityColor }} 
                            />
                        </div>
                    </div>
                    <div className="max-w-128 w-full pt-8 md:pt-17.5">
                        <h4 className='text-white text-xl md:text-2xl xl:text-3xl 2xl:text-[32px] font-bold !leading-[120%] mb-2 md:mb-3'>
                            {weapon.name || 'Unknown Weapon'}
                        </h4>
                        <p className='text-base font-medium text-[#6F7083]/80 !leading-[160%] mb-4 md:mb-8'>
                            {weapon.description || 'Confirm sale of this item'}
                        </p>
                        <ul className='flex flex-col gap-3 mb-2 md:mb-3'>
                            <li className='text-sm font-medium !leading-[110%] bg-white/8 rounded-full py-3.5 md:py-4.5 px-5 flex items-center justify-between'>
                                <p className='text-white'>Market Value:</p>
                                <span className='text-white'>${marketValue.toFixed(2)}</span>
                            </li>
                            <li 
                                className='text-sm font-medium !leading-[110%] rounded-full py-3.5 md:py-4.5 px-5 flex items-center justify-between'
                                style={{
                                    backgroundColor: `${rarityColor}10`,
                                    border: `1px solid ${rarityColor}10`
                                }}
                            >
                                <p style={{ color: rarityColor }}>You Receive:</p>
                                <span style={{ color: rarityColor }}>${youReceive.toFixed(2)}</span>
                            </li>
                        </ul>
                        <span className='block text-center text-[#6F7083] text-xs font-normal !leading-[160%] mb-2 md:mb-3'>
                            15% marketplace fee applies (${calculateMarketplaceFee(marketValue).toFixed(2)})
                        </span>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleCancel}
                                disabled={isConfirming}
                                className='grow-1 min-h-12 md:min-h-13 btn text-sm font-bold bg-none shadow-none bg-white/8 text-white/80 border-0 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmSale}
                                disabled={isConfirming}
                                className='grow-1 min-h-12 md:min-h-13 rounded-full text-sm font-bold gradient-border-two shadow-[0_2px_8px_0_rgba(59,188,254,0.32)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isConfirming ? 'Processing...' : 'Confirm Sale'}
                            </button>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between text-white/60">
                                    <span>Rarity:</span>
                                    <span className="font-medium" style={{ color: rarityColor }}>
                                        {weapon.rarity || 'Common'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>From Case:</span>
                                    <span className="font-medium text-white">
                                        {weaponData.crate_open.crate_id || 'Unknown'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Acquired:</span>
                                    <span className="font-medium text-white">
                                        {weaponData.acquired_at ? new Date(weaponData.acquired_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Drop Chance:</span>
                                    <span className="font-medium text-white">
                                        {weapon.probability ? (weapon.probability * 100).toFixed(2) : '0.00'}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Price Paid:</span>
                                    <span className="font-medium text-white">
                                        ${weaponData.crate_open.price_paid || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}