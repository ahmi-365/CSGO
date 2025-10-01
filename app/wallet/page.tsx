"use client"
import React from 'react'
import { Suspense } from 'react'
import WalletContent from './components/WalletContent'

type Props = {}

export default function page({ }: Props) {
    return (
        <Suspense fallback={<div>Loading wallet...</div>}>
            <WalletContent />
        </Suspense>
    )
}