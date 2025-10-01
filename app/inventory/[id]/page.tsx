import React from 'react'
import PageContainer from '@/app/components/PageContainer'
import InventoryWeaponsCollection from '@/app/components/inventory/InventoryWeaponsCollection'

interface CardItem {
    title: string;
    img: string;
    price: number;
    color: string
    color2: string
    Chance: string;
}
type Props = {}

export default function page({ }: Props) {
    return (
        <PageContainer>
            <div className="min-h-[calc(100vh-65px)] w-full  flex-col flex items-center justify-center">
                <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-5 xl:gap-20 max-w-298 w-full">
                    <div className="max-w-150 w-full">
                        <div className={`relative z-1 rounded-3xl overflow-hidden group cursor-pointer w-full`} style={{ border: "double 1px transparent", backgroundImage: `linear-gradient(#12141E, #12141E), linear-gradient(#4A3426  95%,#FB8609 100%)`, backgroundOrigin: "border-box", backgroundClip: "content-box, border-box" }}>
                            <img src="/img/cases/card-shape.png" className='rounded-t-2xl  mix-blend-color-dodge absolute top-0 left-0 w-full h-auto max-h-31 -z-10 opacity-10 transition-all duration-300 group-hover:opacity-100' alt="" />
                            <div className="pt-5 pb-10 flex flex-col items-center">
                                <img src="/img/inventor/inventory-1.png" alt="Collection" className="size-70 lg:w-95 lg:h-96.5 object-contain mx-auto pointer-events-none" />
                            </div>
                            <div className='absolute -bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-14 rounded-[100%] -z-1 blur-[32px]' style={{ backgroundColor: '#FF8809' }} />
                            <div className='absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-40 rounded-[100%] -z-1 blur-[80px]' style={{ backgroundColor: '#FB8609' }} />
                        </div>
                    </div>
                    <div className="max-w-128 w-full pt-8 md:pt-17.5">
                        <h4 className='text-white text-xl md:text-2xl xl:text-3xl 2xl:text-[32px] font-bold !leading-[120%] mb-2 md:mb-3'>Spectrum Case</h4>
                        <p className='text-base font-medium text-[#6F7083]/80 !leading-[160%] mb-4 md:mb-8'>Confirm sale of this item</p>
                        <ul className='flex flex-col gap-3 mb-2 md:mb-3'>
                            <li className='text-sm font-medium !leading-[110%] bg-white/8 rounded-full py-3.5 md:py-4.5 px-5 flex items-center justify-between'>
                                <p className='text-white'>Market Value:</p>
                                <span className='text-white'>$0.06</span>
                            </li>
                            <li className='text-sm font-medium !leading-[110%] bg-[#39FF67]/10 border border-[#39FF67]/10 rounded-full py-3.5 md:py-4.5 px-5 flex items-center justify-between'>
                                <p className='text-[#39FF67]'>Market Value:</p>
                                <span className='text-[#39FF67]'>$0.06</span>
                            </li>
                        </ul>
                        <span className='block text-center text-[#6F7083] text-xs font-normal !leading-[160%] mb-2 md:mb-3'>15% marketplace fee applies</span>
                        <div className="flex items-center gap-3">
                            <button className='grow-1 min-h-12 md:min-h-13 btn text-sm font-bold bg-none shadow-none bg-white/8 text-white/80 border-0'>Cancel</button>
                            <button className='grow-1 min-h-12 md:min-h-13 rounded-full text-sm font-bold gradient-border-two shadow-[0_2px_8px_0_rgba(59,188,254,0.32)] text-white'>Confirm Sale</button>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer >
    )
}