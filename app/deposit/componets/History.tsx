"use client"
import React from 'react'
import { StremItem } from '@/app/utilities/Types'
import Card from '../componets/Card'

type Props = {}

export default function AccountContent({ }: Props) {
    const steam: StremItem[] = [
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
        },
    ]
    const copyClipBoard = (e: string) => {
        navigator.clipboard.writeText(e).then((data) => alert(`Copied Successful: ${e}`))
    }
    return (
        <div className="">
            <div className='p-2 md:p-4 bg-white/4 rounded-xl mb-3'>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#39FF67]/8 size-10 flex items-center justify-center rounded-xl">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_0_1976)">
                                    <path d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_0_1976">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </span>
                        <div className="">
                            <h4 className='text-lg text-white font-satoshi font-bold !leading-[110%] mb-2'>O Items • $0.00</h4>
                            <p className="text-xs text-[#6F7083] font-satoshi font-medium !leading-none">26/07/2025, 18:21:48</p>
                        </div>
                    </div>
                    <p className='text-base text-[#39FF67] font-satoshi font-medium !leading-[140%]'>Completed</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-3">
                    {steam.map((item, index) => (
                        <Card key={index} item={item} />
                    ))}
                </div>
                <div className="flex items-center gap-y-3 justify-between flex-wrap mt-3">
                    <h4 className="text-base text-[currentColor] font-satoshi font-medium !leading-[140%]">Trade Offer ID:</h4>
                    <p className={`text-sm md:text-base text-[#C3C4CC] flex font-normal items-center gap-2`}>bclqxy2k... fjhx0wlh
                        <button onClick={() => copyClipBoard("bclqxy2k... fjhx0wlh")} className="text-[#767884] hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <g clipPath="url(#clip0_0_1993)">
                                    <path d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_0_1993">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </p>
                </div>
            </div>
            <div className='p-4 bg-white/4 rounded-xl'>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#4486FF]/8 size-10 flex items-center justify-center rounded-xl">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_0_2462)">
                                    <path d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833" stroke="#4486FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#4486FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_0_2462">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </span>
                        <div className="">
                            <h4 className='text-lg text-white font-satoshi font-bold !leading-[110%] mb-2'>O Items • $0.00</h4>
                            <p className="text-xs text-[#6F7083] font-satoshi font-medium !leading-none">26/07/2025, 18:21:48</p>

                        </div>
                    </div>
                    <div className="">
                        <p className='text-base text-[#4486FF] font-satoshi font-medium !leading-[140%] mb-2'>Processing</p>
                        <p className="text-xs text-[#6F7083] font-satoshi font-medium !leading-none">ETA: 19:36:48</p>
                    </div>
                </div>
                <div className="flex items-center gap-y-3 justify-between flex-wrap">
                    <h4 className="text-base text-[currentColor] font-satoshi font-medium !leading-[140%]">Trade Offer ID:</h4>
                    <p className={`text-sm md:text-base text-[#C3C4CC] flex font-normal items-center gap-2`}>bclqxy2k... fjhx0wlh
                        <button onClick={() => copyClipBoard("bclqxy2k... fjhx0wlh")} className="text-[#767884] hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <g clipPath="url(#clip0_0_1993)">
                                    <path d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_0_1993">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </p>
                </div>
            </div>
        </div>

    )
}