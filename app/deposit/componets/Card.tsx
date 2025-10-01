import { StremItem } from '@/app/utilities/Types';
import React from 'react';

type Props = {
    className?: string;
    item: StremItem
};

export default function Card({ item, className = '' }: Props) {
    return (
        <div className={` relative z-1 rounded-xl overflow-hidden cursor-pointer group ${className}`} style={{ border: "double 1px transparent", backgroundImage: `linear-gradient(#1C1E2D, #1C1E2D), linear-gradient(${item?.color2} 95%, ${item?.color} 100%)`, backgroundOrigin: "border-box", backgroundClip: "content-box, border-box" }}>
            <img src="/img/cases/card-shape.png" className='rounded-t-2xl mix-blend-color-dodge absolute top-0 left-0 w-full h-auto max-h-31 -z-10 opacity-10 transition-all duration-300 group-hover:opacity-100' alt="" />
            <div className="py-4 px-3 flex flex-col items-center md:max-w-45 mx-auto">
                <img src={item?.img} alt="Collection" className="w-40 h-25 md:h-36.5 object-contain mx-auto pointer-events-none" />
                <div className="text-center -mt-3">
                    <h4 className='text-sm text-white/80 font-satoshi font-medium !leading-[130%] mb-2'>{item?.name}</h4>
                    <p className='text-sm text-white font-satoshi font-medium !leading-[130%]'>{item?.price}</p>
                </div>
            </div>
            <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 w-21.5 h-14.5 rounded-full -z-1 blur-2xl ' style={{ backgroundColor: item?.color }} />
        </div>
    );
}