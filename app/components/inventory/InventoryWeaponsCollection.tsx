import React from 'react';
import type { WeaponsCollection as WeaponsCollectionType } from '@/app/utilities/Types';

type Props = {
    className?: string;
    item?: WeaponsCollectionType;
};

export default function WeaponsCollection({ item, className = '' }: Props) {

    return (
        <div className={`relative z-1 rounded-xl overflow-hidden group cursor-pointer ${className}`} style={{ border: "double 1px transparent", backgroundImage: `linear-gradient(#1C1E2D, #1C1E2D), linear-gradient(${item?.color2} 95%, ${item?.color} 100%)`, backgroundOrigin: "border-box", backgroundClip: "content-box, border-box" }}>
            <img src="/img/cases/card-shape.png" className='rounded-t-2xl  mix-blend-color-dodge absolute top-0 left-0 w-full h-auto max-h-31 -z-10 opacity-10 transition-all duration-300 group-hover:opacity-100' alt="" />
            <div className="pt-5 md:pt-7.5 pb-4 px-5 flex flex-col items-center gap-5 md:gap-9">
                <img src={item?.img} alt="Collection" className="w-51 h-24 md:h-35 object-contain mx-auto pointer-events-none" />
                <div className="w-full text-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className='text-sm text-white font-bold line-clamp-1'>{item?.title}</h4>
                        <span className="text-white text-lg font-black !leading-normal">${typeof item?.price === 'number' ? item?.price.toFixed(2) : item?.price}</span>
                    </div>
                    <button className='buy-btn relative rounded-full w-full mb-2 text-xs px-3 py-1 min-w-0 min-h-10 bg-none shadow-none bg-white/8 text-white/80 border-white/8'>
                        Common
                        <span className='gradient-border-two rounded-full  absolute top-0 left-0 size-full -z-10 opacity-0 invisible transition-all duration-300' />
                    </button>
                    <span className='block text-center text-white text-[10px] font-bold !leading-[1]'>Chance: {item?.Chance}</span>
                </div>
            </div>
            <div className='absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-40 rounded-[100%] -z-1 blur-[80px]' style={{ backgroundColor: item?.color }} />
        </div>
    );
}