import React from 'react'
import { CaseItem } from '@/app/utilities/Types';
import Link from 'next/link';
type Props = {
    className?: string;
    path?: string;
    item: CaseItem;
}

export default function BuyCard({ className = "", item, path = '/' }: Props) {
    return (
        <Link href={path}
            style={{
                "--gradient-color": item.color,
            } as React.CSSProperties}
            className={`case-item block bg-gradient-to-t to-95% hover:to-0% to-[var(--gradient-color)]/20 hover:to-[var(--gradient-color)]/40 from-[var(--gradient-color)] rounded-2xl p-px overflow-hidden`}
        >
            <div className="p-3 md:p-4 rounded-2xl bg-[#1C1E2D] text-center relative z-1 group cursor-pointer">
                <img src="/img/cases/card-shape.png" className='rounded-t-2xl  mix-blend-color-dodge absolute top-0 left-0 w-full h-auto max-h-31 -z-10 opacity-10 transition-all duration-300 group-hover:opacity-100' alt="" />
                <div style={{ backgroundColor: item.color }} className={`w-48 h-31 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 -mb-10 -z-20 blur-[100px]`}></div>
                <div style={{ backgroundColor: item.color }} className={`w-30 h-17 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 -mb-4 -z-10 blur-2xl`}></div>
                <div className="md:mt-2 mb-5.5">
                    <img src={item?.img} className='max-h-35 mx-auto object-contain transition-all duration-300 group-hover:scale-105' alt="" />
                </div>
                <h4 className='font-black italic text-lg !leadig-tight mb-2'>{item?.price}</h4>
                <p className='font-bold text-white text-sm mb-3 md:mb-4'>{item?.des}</p>
                <button className='buy-btn group relative flex items-center justify-center w-full rounded-full min-h-8.5 md:min-h-10 lg:min-h-12 bg-white/10 border border-solid border-white/10 text-sm font-bold text-white'>
                    {item.btn || 'Buy Now'}
                    {/* <span className='gradient-border-two rounded-full  absolute top-0 left-0 size-full -z-10 opacity-0 invisible transition-all duration-300'></span> */}

                    <svg className='absolute top-0 left-0 w-full h-auto -z-10 opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible' viewBox="0 0 211 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <foreignObject x="-12" y="-12" width="235" height="72">
                            <div style={{ backdropFilter: 'blur(6px)', clipPath: 'url(#bgblur_0_289_1487_clip_path)', height: '100%', width: '100%' }}></div>
                        </foreignObject>
                        <g data-figma-bg-blur-radius="12">
                            <rect x="0.5" y="0.5" width="210" height="47" rx="23.5" fill="currentColor" fillOpacity="0.20" />
                            <rect x="0.5" y="0.5" width="210" height="47" rx="23.5" stroke="url(#paint0_linear_289_1487)" />
                        </g>
                        <defs>
                            <clipPath id="bgblur_0_289_1487_clip_path" transform="translate(12 12)">
                                <rect x="0.5" y="0.5" width="210" height="47" rx="23.5" />
                            </clipPath>
                            <linearGradient id="paint0_linear_289_1487" x1="23.9778" y1="0" x2="41.4752" y2="80.2741" gradientUnits="userSpaceOnUse">
                                <stop offset="0.117811" stopColor="#FCC811" />
                                <stop offset="0.40485" stopColor="#F85D36" />
                                <stop offset="0.564146" stopColor="#EF5180" />
                                <stop offset="0.857068" stopColor="#4B71FF" />
                                <stop offset="1" stopColor="#34DDFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </button>
            </div>
        </Link>
    )
}