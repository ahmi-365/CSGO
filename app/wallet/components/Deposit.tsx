"use client"

import Input from '@/app/components/ui/Input'
import { useState } from 'react';

interface Notes {
  des: string;
}

type Props = {}

export default function Bitcoin({ }: Props) {
  const notes: Notes[] = [
    {
      des: 'Only send Bitcoin to this address',
    },
    {
      des: 'Minimum deposit: 0.0001 BTC',
    },
    {
      des: 'Requires 3 network confirmations',
    },
    {
      des: 'Deposits are automatically credited after confirmation',
    },
  ]
  const [is_copied, set_is_copied] = useState(false)
  const handleCopy = (e: string) => {
    navigator.clipboard.writeText(e).then(() => {
      set_is_copied(true);
      setTimeout(() => {
        set_is_copied(false)
      }, 3000)
    })
  }
  return (
    <div>
      <h3 className='text-lg md:text-xl xl:text-[22px] text-white font-satoshi font-bold !leading-[120%] mb-2 md:mb-3'>Deposit Bitcoin</h3>
      <Input className='mb-4 md:mb-5' type='text' label='Amount (BTC)' placeholder='Min: 0.0001 BTC' />
      <div className="px-4 py-3 rounded-xl border border-solid border-[#39FF67]/10 bg-[#39FF67]/10 mb-3 md:mb-4 lg:mb-5">
        <h4 className='text-lg text-white font-satoshi font-bold !leading-[120%] mb-3 md:mb-4'>Market Value</h4>
        <div className="bg-[#171925]/25 px-3 py-4 rounded-xl mb-3 flex items-center justify-between">
          <p className='text-sm text-[#AEB0BDCC]/80 font-satoshi font-medium line-clamp-1 !leading-[110%]'>bclqxy2kgdygj rsqtzq2n@yrf2493p83kkfjhx0wlh</p>
          <button onClick={() => handleCopy('bclqxy2kgdygj rsqtzq2n@yrf2493p83kkfjhx0wlh')} className='text-sm text-white font-satoshi font-bold !leading-[110%]'>{is_copied ? 'Copied' : 'Copy'}</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className='px-3 lg:px-4.5 min-h-8 lg:min-h-10 flex items-center text-nowrap justify-center capitalize bg-white/8 text-xs md:text-sm xl:text-base font-medium !leading-[130%] rounded-lg lg:rounded-xl hover:text-white hover:bg-primary/20'>Show QR</button>
            <h4 className='capitalize text-sm xl:text-base font-medium font-satoshi line-clamp-1 text-white/50 !leading-[130%]'>Min confirmations: 3</h4>
          </div>
          <h4 className='capitalize text-sm xl:text-base font-medium font-satoshi text-[#39FF67] line-clamp-1 !leading-[130%]'>Network: Bitcoin</h4>
        </div>
      </div>
      <div className="py-3 px-4 rounded-xl border border-solid border-[#FF8809]/10 bg-[#FF8809]/10 mb-3 md:mb-4 lg:mb-5">
        <h4 className='flex items-center gap-2 lg:gap-2.5 text-[#FF8809] text-lg font-satoshi font-bold !leading-[110%] mb-2 md:mb-3'>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_0_1619)">
              <path d="M10.0003 18.3334C14.6027 18.3334 18.3337 14.6024 18.3337 10C18.3337 5.39765 14.6027 1.66669 10.0003 1.66669C5.39795 1.66669 1.66699 5.39765 1.66699 10C1.66699 14.6024 5.39795 18.3334 10.0003 18.3334Z" stroke="#FF8809" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 6.66669V10" stroke="#FF8809" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 13.3333H10.01" stroke="#FF8809" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_0_1619">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Important Notes:
        </h4>
        {notes.map((item, index) => (
          <div className="flex items-center gap-2 mb-1" key={index}>
            <div className="bg-[#FF8809] size-2 rounded-full ml-1.5 mt-0.5"></div>
            <p className='text-sm text-[#FF8809] font-satoshi font-medium !leading-[150%]'>{item.des}</p>
          </div>
        ))}
      </div>
      <button className='grow px-4.5 min-h-10 md:min-h-13 flex items-center justify-center capitalize bg-white/8 text-base font-medium !leading-[130%] rounded-xl hover:text-white hover:bg-primary w-full'>Minimum 0.0001 BTC</button>
    </div>
  )
}