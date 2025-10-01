'use client'

// import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function notFound() {
    // const searchParams = useSearchParams()
    // const type = searchParams.get('type')
    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-900 text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-0 text-lg">This page could not be found.</p>
            <Link href="/" className="btn min-w-40 min-h-12 text-base">
                Return Home
            </Link>
        </div>
    )
}
