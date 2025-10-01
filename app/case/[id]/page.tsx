"use client"

import React, { JSX, useState } from 'react'
import PageContainer from '@/app/components/PageContainer'
import { CaseItem, StremItem } from '@/app/utilities/Types';
import BuyCard from '@/app/components/cases/BuyCard';
import Card from '@/app/deposit/componets/Card';
import { motion, useAnimation } from "framer-motion"

interface IncreamentCoutItem {
    count: number;
    color?: string;
}

interface SpinIconItem {
    icon: JSX.Element | string;
    bgColor: string;
    textColor: string | null;
}

type Props = {}

export default function page({ }: Props) {
    const caseItems: CaseItem[] = [
        {
            img: '/img/cases/1.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#39FF67',
            btn: 'Uncommon',
        },
        {
            img: '/img/cases/2.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#FFD700',
            btn: 'Common',
        },
        {
            img: '/img/cases/3.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#4FC8FF',
            btn: 'Uncommon',
        },
        {
            img: '/img/cases/4.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#C324E7',
            btn: 'Common',
        },
        {
            img: '/img/cases/5.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#E94444',
            btn: 'Uncommon',
        },
        {
            img: '/img/cases/6.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#FF8809',
            btn: 'Common',
        },
        {
            img: '/img/cases/7.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#347BFF',
            btn: 'Uncommon',
        },
        {
            img: '/img/cases/8.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#ED164C',
            btn: 'Common',
        },
        {
            img: '/img/cases/9.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#24E9FF',
            btn: 'Uncommon',
        },
        {
            img: '/img/cases/10.png',
            price: '$2.50',
            des: 'Spectrum Case',
            color: '#702AEC',
            btn: 'Common',
        },
    ]

    const incrementCout: IncreamentCoutItem[] = [
        {
            count: 2,
            color: 'linear-gradient(83deg, #AD20FF 10.38%, #7B0FFF 57.75%)',
        },
        {
            count: 3,
            color: 'linear-gradient(272deg, #D8026D 1.37%, #FD46AE 88.36%)',
        },
        {
            count: 4,
            color: 'linear-gradient(88deg, #FFB923 1.49%, #FF7F16 68.43%)',
        },
    ]
    const [activeIncrementCount, setActiveIncrementCount] = useState(1)

    const steamItems: StremItem[] = [
        {
            img: "/img/wallet/img-3.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#236DFF',
            color2: '#1D2E58'
        },
        {
            img: "/img/wallet/img_4.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#C324E7',
            color2: '#3E1F53'
        },
        {
            img: "/img/wallet/img_5.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#FF8809',
            color2: '#4A3426'
        },
        {
            img: "/img/wallet/img-3.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#236DFF',
            color2: '#1D2E58'
        }, {
            img: "/img/wallet/img-3.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#236DFF',
            color2: '#1D2E58'
        },
        {
            img: "/img/wallet/img_4.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#C324E7',
            color2: '#3E1F53'
        },
        {
            img: "/img/wallet/img_5.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#FF8809',
            color2: '#4A3426'
        },
        {
            img: "/img/wallet/img-3.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#236DFF',
            color2: '#1D2E58'
        }, {
            img: "/img/wallet/img-3.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#236DFF',
            color2: '#1D2E58'
        },
        {
            img: "/img/wallet/img_4.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#C324E7',
            color2: '#3E1F53'
        },
        {
            img: "/img/wallet/img_5.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#FF8809',
            color2: '#4A3426'
        },
        {
            img: "/img/wallet/img-3.png",
            price: '$25.700',
            name: "SSG 08 | Turbo Peek",
            color: '#236DFF',
            color2: '#1D2E58'
        },
    ]

    const spinIcons: SpinIconItem[] = [
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.7432 11.938L16.9041 10.3596C16.9899 9.51745 17.0466 8.96135 17.0021 8.61098L17.0176 8.61107C17.7443 8.61107 18.3334 7.98924 18.3334 7.22218C18.3334 6.45512 17.7443 5.83329 17.0176 5.83329C16.2909 5.83329 15.7018 6.45512 15.7018 7.22218C15.7018 7.56909 15.8223 7.88629 16.0215 8.12971C15.7356 8.31604 15.3616 8.70921 14.7988 9.30101L14.7988 9.30102L14.7988 9.30103C14.3652 9.75695 14.1483 9.98491 13.9065 10.0202C13.7725 10.0398 13.6359 10.0197 13.5122 9.96214C13.2888 9.85833 13.1399 9.57652 12.8421 9.01288L11.2724 6.04199C11.0887 5.69429 10.9349 5.40327 10.7963 5.16908C11.365 4.8628 11.7545 4.23865 11.7545 3.51848C11.7545 2.49573 10.969 1.66663 10.0001 1.66663C9.03116 1.66663 8.2457 2.49573 8.2457 3.51848C8.2457 4.23865 8.63515 4.8628 9.20388 5.16908C9.06523 5.40328 8.91149 5.69426 8.72775 6.042L7.15803 9.01289C6.86022 9.57651 6.71132 9.85833 6.48798 9.96214C6.36424 10.0197 6.22769 10.0398 6.09368 10.0202C5.85181 9.98491 5.63501 9.75694 5.20139 9.30102C4.63856 8.70923 4.26461 8.31604 3.97862 8.1297C4.17784 7.88629 4.29833 7.56909 4.29833 7.22218C4.29833 6.45512 3.70923 5.83329 2.98254 5.83329C2.25585 5.83329 1.66675 6.45512 1.66675 7.22218C1.66675 7.98924 2.25585 8.61107 2.98254 8.61107L2.99808 8.61098C2.9536 8.96135 3.01027 9.51745 3.09609 10.3596L3.25692 11.938C3.3462 12.8141 3.42044 13.6478 3.51137 14.3981H16.4888C16.5797 13.6478 16.654 12.8141 16.7432 11.938Z" fill="#E94444" />
                <path d="M9.04575 18.3333H10.9544C13.4421 18.3333 14.6859 18.3333 15.5158 17.5492C15.878 17.2069 16.1074 16.59 16.2729 15.787H3.72724C3.89276 16.59 4.12213 17.2069 4.48436 17.5492C5.31426 18.3333 6.55809 18.3333 9.04575 18.3333Z" fill="#E94444" />
            </svg>),
            bgColor: '#E94444',
            textColor: null,
        },
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18.5V13.4375L10 9.5L17 13.4375V18.5L10 14.5625L3 18.5Z" fill="#D9D9D9" />
                <path d="M3 10.5V5.4375L10 1.5L17 5.4375V10.5L10 6.5625L3 10.5Z" fill="#D9D9D9" />
            </svg>),
            bgColor: '#BFC0D8',
            textColor: '#D9D9D9',
        },
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.72452 8.26193L7.27631 4.8094C8.92577 2.57769 9.75051 1.46183 10.52 1.69764C11.2894 1.93344 11.2894 3.30204 11.2894 6.03922V6.29731C11.2894 7.28455 11.2894 7.77818 11.6049 8.08781L11.6216 8.10384C11.9438 8.40693 12.4576 8.40693 13.4851 8.40693C15.3342 8.40693 16.2587 8.40693 16.5712 8.96772C16.5763 8.977 16.5814 8.98636 16.5863 8.99579C16.8812 9.56526 16.3459 10.2895 15.2753 11.738L12.7235 15.1905C11.074 17.4222 10.2493 18.5381 9.47978 18.3023C8.71032 18.0665 8.71034 16.6979 8.71038 13.9606L8.71038 13.7027C8.7104 12.7154 8.7104 12.2218 8.39495 11.9121L8.37826 11.8961C8.056 11.593 7.54224 11.593 6.51471 11.593C4.66565 11.593 3.74112 11.593 3.42867 11.0322C3.42349 11.0229 3.41846 11.0136 3.41358 11.0042C3.11862 10.4347 3.65392 9.71044 4.72452 8.26193Z" fill="#FFD700" />
            </svg>),
            bgColor: '#FFD700',
            textColor: null,
        },
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.66924 9.76294C1.70035 8.22776 1.71591 7.46017 2.22586 6.80306C2.31893 6.68313 2.4555 6.54062 2.56996 6.44399C3.19707 5.91455 4.02504 5.91455 5.68097 5.91455C6.27258 5.91455 6.56839 5.91455 6.85038 5.83714C6.90897 5.82106 6.96695 5.80251 7.02417 5.78155C7.29954 5.68066 7.54653 5.50701 8.04051 5.15972C9.9894 3.78952 10.9638 3.10443 11.7817 3.40205C11.9385 3.45911 12.0903 3.54147 12.2259 3.64306C12.9329 4.17291 12.9867 5.40567 13.0941 7.87119C13.1339 8.7841 13.161 9.56544 13.161 10C13.161 10.4346 13.1339 11.216 13.0941 12.1289C12.9867 14.5944 12.9329 15.8272 12.2259 16.357C12.0903 16.4586 11.9385 16.541 11.7817 16.598C10.9638 16.8957 9.9894 16.2106 8.04051 14.8404C7.54653 14.4931 7.29954 14.3194 7.02417 14.2185C6.96695 14.1976 6.90897 14.179 6.85038 14.1629C6.56839 14.0855 6.27258 14.0855 5.68097 14.0855C4.02504 14.0855 3.19707 14.0855 2.56996 13.5561C2.4555 13.4595 2.31893 13.317 2.22586 13.197C1.71591 12.5399 1.70035 11.7723 1.66924 10.2371C1.66761 10.1565 1.66675 10.0774 1.66675 10C1.66675 9.92272 1.66761 9.84357 1.66924 9.76294Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2414 4.62687C16.4852 4.41019 16.8476 4.44532 17.0508 4.70533L16.6093 5.09765C17.0508 4.70533 17.0506 4.70505 17.0508 4.70533L17.0517 4.70645L17.0526 4.70772L17.0549 4.71067L17.0607 4.71824C17.065 4.72404 17.0705 4.73134 17.0768 4.74015C17.0896 4.75778 17.1063 4.78148 17.1263 4.81135C17.1664 4.87111 17.2197 4.9556 17.2817 5.06579C17.4057 5.28625 17.5643 5.60914 17.7204 6.04202C18.0332 6.90926 18.3334 8.20951 18.3334 10.0002C18.3334 11.791 18.0332 13.0912 17.7204 13.9584C17.5643 14.3913 17.4057 14.7142 17.2817 14.9347C17.2197 15.0449 17.1664 15.1294 17.1263 15.1891C17.1063 15.219 17.0896 15.2427 17.0768 15.2603C17.0705 15.2691 17.065 15.2764 17.0607 15.2822L17.0549 15.2898L17.0526 15.2928L17.0517 15.294C17.0514 15.2943 17.0508 15.2951 16.6093 14.9028L17.0508 15.2951C16.8476 15.5551 16.4852 15.5903 16.2414 15.3736C15.9987 15.158 15.9649 14.7742 16.1649 14.5142C16.1653 14.5136 16.1662 14.5124 16.1675 14.5106C16.1716 14.505 16.1796 14.4938 16.191 14.4767C16.2138 14.4426 16.2503 14.3854 16.2961 14.3041C16.3875 14.1415 16.5164 13.8823 16.6476 13.5185C16.9095 12.7924 17.184 11.6413 17.184 10.0002C17.184 8.35915 16.9095 7.2081 16.6476 6.482C16.5164 6.11822 16.3875 5.85892 16.2961 5.69638C16.2503 5.61505 16.2138 5.55782 16.191 5.52375C16.1796 5.5067 16.1716 5.49545 16.1675 5.48986C16.1662 5.48805 16.1653 5.48684 16.1649 5.48621C16.1649 5.48621 16.1649 5.48621 16.1649 5.48621" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.7977 7.01333C15.0752 6.84897 15.425 6.95556 15.5792 7.25143L15.0768 7.54904C15.5792 7.25143 15.5791 7.25116 15.5792 7.25143L15.5797 7.2525L15.5803 7.25364L15.5816 7.25613L15.5846 7.26194L15.5919 7.27694C15.5975 7.28843 15.6043 7.30294 15.6122 7.32052C15.6278 7.35567 15.6477 7.40306 15.6703 7.46316C15.7154 7.5834 15.771 7.75413 15.8251 7.97901C15.9333 8.42918 16.0347 9.09326 16.0347 10.0003C16.0347 10.9074 15.9333 11.5715 15.8251 12.0217C15.771 12.2465 15.7154 12.4173 15.6703 12.5375C15.6477 12.5976 15.6278 12.645 15.6122 12.6801C15.6043 12.6977 15.5975 12.7122 15.5919 12.7237L15.5846 12.7387L15.5816 12.7445L15.5803 12.747L15.5797 12.7482C15.5796 12.7484 15.5792 12.7492 15.0768 12.4516L15.5792 12.7492C15.425 13.0451 15.0752 13.1517 14.7977 12.9873C14.5226 12.8244 14.422 12.4562 14.5705 12.1616L14.5744 12.1532C14.5796 12.1414 14.5897 12.118 14.6031 12.0823C14.6298 12.0111 14.67 11.8907 14.7117 11.7172C14.795 11.3707 14.8852 10.8092 14.8852 10.0003C14.8852 9.1915 14.795 8.62993 14.7117 8.28343C14.67 8.10998 14.6298 7.98961 14.6031 7.91835C14.5897 7.88269 14.5796 7.85923 14.5744 7.84746L14.5705 7.8391C14.422 7.54447 14.5226 7.17631 14.7977 7.01333Z" fill="white" />
            </svg>),
            bgColor: '#7436E1',
            textColor: null,
        },
    ]

    const [selectedSpins, setSelectedSpins] = useState<number[]>([])

    const controls = useAnimation()
    const [spinning, setSpinning] = useState(false)

    const handleRandome = async () => {
        if (spinning) return
        setSpinning(true)
        controls.start({
            x: ["0%", "-100%"],
            transition: {
                duration: 2,
                ease: "linear",
                repeat: 2,
            },
        })
        setTimeout(() => {
            controls.stop()
            setSpinning(false)
        }, 3000)
    }


    return (
        <PageContainer>
            <div className="relative z-1 overflow-hidden flex flex-col gap-y-2.5 py-6 bg-[#C4CEFF]/6 rounded-[20px] mb-5">
                {Array.from({ length: activeIncrementCount }).map((_, index) => (
                    <motion.div className="flex gap-3 relative -z-10" animate={controls} key={index}>
                        {steamItems.map((item, index) => (
                            <Card className="min-w-45" key={`first-${index}`} item={item} />
                        ))}
                        {steamItems.map((item, index) => (
                            <Card className="min-w-45" key={`second-${index}`} item={item} />
                        ))}
                    </motion.div>
                ))}
                <span className='h-full flex items-center justify-center w-full absolute top-1/2 left-1/2 -translate-1/2 ml-4'>
                    <svg className='max-h-100 w-full' style={{ maxHeight: `${400 * activeIncrementCount}px` }} width="268" viewBox="0 0 168 388" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_f_0_1384)">
                            <rect x="77" y="90" width="13" height="207" fill="white" />
                        </g>
                        <path d="M95.425 312.008C96.9566 314.674 95.0316 318 91.9564 318H75.9103C72.8351 318 70.9101 314.674 72.4417 312.008L80.4648 298.039C82.0024 295.362 85.8644 295.362 87.402 298.039L95.425 312.008Z" fill="white" />
                        <g filter="url(#filter1_f_0_1384)">
                            <path d="M97.5002 75.6246C98.6758 72.9794 96.7396 70 93.845 70H74.155C71.2604 70 69.3242 72.9794 70.4998 75.6246L80.3447 97.7757C81.7524 100.943 86.2476 100.943 87.6552 97.7757L97.5002 75.6246Z" fill="white" />
                        </g>
                        <path d="M95.425 75.9922C96.9566 73.3256 95.0316 70 91.9564 70H75.9103C72.8351 70 70.9101 73.3256 72.4417 75.9922L80.4648 89.9609C82.0024 92.638 85.8644 92.638 87.402 89.9609L95.425 75.9922Z" fill="white" />
                        <path d="M83.5 94L83.5 294" stroke="white" strokeWidth="1.5" />
                        <g filter="url(#filter2_f_0_1384)">
                            <path d="M97.5002 312.375C98.6758 315.021 96.7396 318 93.845 318H74.155C71.2604 318 69.3242 315.021 70.4998 312.375L80.3447 290.224C81.7524 287.057 86.2476 287.057 87.6552 290.224L97.5002 312.375Z" fill="white" />
                        </g>
                        <defs>
                            <filter id="filter0_f_0_1384" x="27" y="40" width="113" height="307" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_0_1384" />
                            </filter>
                            <filter id="filter1_f_0_1384" x="0.150635" y="0" width="167.699" height="170.151" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="35" result="effect1_foregroundBlur_0_1384" />
                            </filter>
                            <filter id="filter2_f_0_1384" x="0.150635" y="217.849" width="167.699" height="170.151" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="35" result="effect1_foregroundBlur_0_1384" />
                            </filter>
                        </defs>
                    </svg>

                </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-between">
                <div className="hidden md:flex items-center gap-3">
                    {spinIcons.map((item, index) => {
                        const isActive = selectedSpins.includes(index)
                        return (
                            <button key={index} onClick={() => {
                                setSelectedSpins(prev =>
                                    prev.includes(index)
                                        ? prev.filter(i => i !== index)
                                        : [...prev, index]
                                )
                            }}
                                className={`size-11 flex items-center justify-center bg-[var(--bg-color)]/10 text-[var(--text-color)] rounded-full border border-solid ${isActive ? 'border-[var(--bg-color)]' : 'border-transparent'}`}
                                style={{ '--bg-color': item.bgColor, '--text-color': item.textColor || item.bgColor } as React.CSSProperties}
                            >
                                {item.icon}
                            </button>
                        )
                    })}
                </div>
                <button onClick={handleRandome} disabled={spinning} className="w-max gradient-border-two rounded-full flex items-center text-white text-sm font-bold min-h-11 shadow-[0_2px_8px_0_rgba(59,188,254,0.32)]">
                    <span className='block px-5'>Open for $4.99</span>
                </button>
                <div className="flex items-center gap-3">
                    {incrementCout.map((item, index) => (
                        <button onClick={() => setActiveIncrementCount(item.count)} key={index} className='flex items-center justify-center rounded-full hover:scale-105 text-base text-white uppercase min-w-12 min-h-9 p-px text-shadow-[0_4p_ 4px_rgba(15,16,44,0.12)]'
                            style={{
                                border: "double 1px transparent",
                                backgroundImage: `${item.color}, linear-gradient(180deg,rgba(255, 255, 255, .2) 0%, rgba(255, 255, 255, 0.2) 100%)`,
                                backgroundOrigin: "border-box",
                                backgroundClip: "content-box, border-box"
                            }}
                        >
                            {item.count}
                        </button>
                    ))}
                </div>

            </div>

            <div className="flex flex-col gap-y-5 mt-6">
                <h4 className='text-2xl'>Collection Items</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {caseItems.map((item, index) => (
                        <BuyCard item={item} key={index} path={`/case/${index + 1}`} />
                    ))}
                </div>
            </div>
        </PageContainer >
    )
}