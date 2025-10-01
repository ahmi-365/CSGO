"use client"

import React, { useEffect, useState, Suspense } from 'react'
import Left from './Left'
import { useSearchParams } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        const currentParams = searchParams.get('mobile_menu')
        setIsMobile(currentParams === 'true')
    }, [searchParams])

    return (
        <div className="flex flex-wrap gap-0">
            <Left className={`w-full max-w-80 md:w-64 ${!isMobile ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`} />
            <div className="w-full lg:max-w-[calc(100%-256px)] 3xl:max-w-328 mx-auto px-5 py-6 md:py-8 lg:py-10">
                {children}
            </div>
        </div>
    )
}
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LayoutContent>{children}</LayoutContent>
        </Suspense>
    )
}
