"use client"
import React, { JSX } from "react"

interface History {
    icon?: string | JSX.Element;
    title?: string;
    crypto_name?: string;
    date?: string;
    balance?: string;
    amount?: string;
    deposit?: any;
    status?: string;
    address: string;
    confirmations?: string;
    transaction: string;
}

type Props = {}

export default function Bitcoin({ }: Props) {

    const history: History[] = [
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_1976)">
                    <path d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_0_1976">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>),
            title: 'Deposit',
            crypto_name: 'BTC',
            date: '26/07/2025, 18:21:18',
            balance: '+0.0023 BTC',
            amount: '$99.48 USD',
            status: 'Completed',
            address: 'bclqxy2k... fjhx0wlh',
            confirmations: '6/3',
            transaction: '4yxg1v68a7bu1vkbbmacdbbbhbp3p5p5upprzkywubuv',

        },
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_1976)">
                    <path d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_0_1976">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>),
            title: 'History',
            crypto_name: 'ETH',
            date: '26/07/2025, 18:21:18',
            balance: '+0.0023 BTC',
            amount: '$99.48 USD',
            status: 'Completed',
            address: 'bclqxy2k... fjhx0wlh',
            confirmations: '6/3',
            transaction: '4yxg1v68a7bu1vkbbmacdbbbhbp3p5p5upprzkywubuv',

        },
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_1976)">
                    <path d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_0_1976">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>),
            title: 'Withdraw',
            crypto_name: 'SOL',
            date: '26/07/2025, 18:21:18',
            balance: '+0.0023 BTC',
            amount: '$99.48 USD',
            status: 'Completed',
            address: 'bclqxy2k... fjhx0wlh',
            confirmations: '6/3',
            transaction: '4yxg1v68a7bu1vkbbmacdbbbhbp3p5p5upprzkywubuv',

        },
        {
            icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_1976)">
                    <path d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#39FF67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_0_1976">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>),
            title: 'History',
            crypto_name: 'SOL',
            date: '26/07/2025, 18:21:18',
            balance: '+0.0023 BTC',
            amount: '$99.48 USD',
            status: 'Completed',
            address: 'bclqxy2k... fjhx0wlh',
            confirmations: '6/3',
            transaction: '4yxg1v68a7bu1vkbbmacdbbbhbp3p5p5upprzkywubuv',

        },
    ]

    const copyClipBoard = (e: string) => {
        navigator.clipboard.writeText(e).then(() => alert(`Copied Successful: ${e}`))
    }

    return (
        <div>
            <h3 className='text-xl md:text-[22px] text-white font-satoshi font-bold !leading-[120%] mb-3 md:mb-5'>Transaction History</h3>
            <div className="overflow-y-auto max-h-173 pr-4 -mr-4">
                {history.map((item, index) => (
                    <div className="flex flex-col p-4 md:p-5 xl:p-6 bg-white/4 rounded-xl gap-y-2 md:gap-y-3 mb-3" key={index}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <span className="bg-[#39FF67]/8 size-10 flex items-center justify-center rounded-xl">{item.icon}</span>
                                <div className="flex flex-col gap-y-2">
                                    <h4 className="text-base md:text-lg text-white font-satoshi font-bold !leading-[110%]">{item.title} <span className="text-[#702AEC]">{item.crypto_name}</span></h4>
                                    <p className="text-xs text-[#6F7083] font-satoshi font-medium !leading-none">{item.date}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <h4 className="text-base md:text-lg text-white font-satoshi font-bold !leading-[110%]">{item.balance}</h4>
                                <p className="text-xs text-[#6F7083] font-satoshi font-medium !leading-none text-right">{item.amount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-y-3 justify-between flex-wrap">
                            <h4 className="text-base text-[currentColor] font-satoshi font-medium !leading-[140%]">Status:</h4>
                            <p className={`text-sm md:text-base ${item.status === 'Completed' ? 'text-[#39FF67]' : 'text-white'} flex items-center gap-2`}>{item.status}</p>
                        </div>

                        <div className="flex items-center gap-y-3 justify-between flex-wrap">
                            <h4 className="text-base text-[currentColor] font-satoshi font-medium !leading-[140%]">Address:</h4>
                            <p className={`text-sm md:text-base text-[#C3C4CC] flex items-center gap-2`}>
                                {item.address?.substring(0, 8)}...{item.address?.substring(item.address.length - 8)}
                                <button className="text-[#767884] hover:text-white" onClick={() => copyClipBoard(item.address)}>
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

                        <div className="flex items-center gap-y-3 justify-between flex-wrap">
                            <h4 className="text-base text-[currentColor] font-satoshi font-medium !leading-[140%]">Confirmations:</h4>
                            <p className={`text-sm md:text-base text-white flex items-center gap-2`}>6/3 </p>
                        </div>

                        <div className="flex items-center gap-y-3 justify-between flex-wrap">
                            <h4 className="text-base text-[currentColor] font-satoshi font-medium !leading-[140%]">Transaction:</h4>
                            <p className={`text-sm md:text-base text-[#C3C4CC] flex items-center gap-2`}>
                                {item.transaction?.substring(0, 8)}...{item.transaction?.substring(item.transaction.length - 8)}
                                <button className="text-[#767884] hover:text-white" onClick={() => copyClipBoard(item.transaction)}>
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
                                <a target="_blank" className="text-[#767884] hover:text-white" href={`https://dexscreener.com/solana/${item.transaction}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M13.5 9.75V14.25C13.5 14.6478 13.342 15.0294 13.0607 15.3107C12.7794 15.592 12.3978 15.75 12 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V6C2.25 5.60218 2.40804 5.22064 2.68934 4.93934C2.97064 4.65804 3.35218 4.5 3.75 4.5H8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M11.25 2.25H15.75V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7.5 10.5L15.75 2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}