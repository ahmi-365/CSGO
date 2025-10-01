import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface HomeTab {
    name?: string;
}

export default function HeaderLeft({ className }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const homeTab: HomeTab[] = [
        { name: 'Cases' }, { name: 'Inventory' }
    ]
    const [activeTab, setActiveTab] = useState(homeTab[0])
    const setParam = (tab: HomeTab) => {
        const params = new URLSearchParams(searchParams.toString());
        if (tab.name) {
            params.set("type", tab.name.toLowerCase());
            router.push(`/?${params.toString()}`);
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        if (pathname === '/') {
            router.push(`?type=${activeTab.name?.toLowerCase()}`)
        }
    }, [pathname, activeTab, router])

    useEffect(() => {
        const currentType = searchParams.get('type');
        const found = homeTab.find(item => item.name?.toLowerCase() === currentType?.toLowerCase()) || homeTab[0];
        setActiveTab(found)
    }, [])

    return (
        <div className={className}>
            <div className="w-px h-6 bg-white/10" />
            <div className="rounded-full bg-white/[3%] flex items-center gap-0">
                {homeTab.map((item, index) => (
                    <button onClick={() => { setParam(item) }} key={index} className={`min-h-10 min-w-28 overflow-hidden rounded-full flex items-center justify-center text-sm hover:text-white ${item.name === activeTab.name ? 'text-white font-bold primary-bg hover:opacity-80' : 'font-medium text-white/50'}`}>{item.name}</button>
                ))}
            </div>
        </div>
    )
}