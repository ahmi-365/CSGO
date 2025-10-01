"use client"

import Input from '@/app/components/ui/Input'

interface Notes {
    des: string;
}

interface Summary {
    name: string;
    des: string;
}
type Props = {}

export default function Bitcoin({ }: Props) {
    const summary: Summary[] = [
        {
            name:'Amount:',
            des:'0BTC',
        },
        {
            name:'Network Fee:',
            des:'0.0005 BTC',
        },
        {
            name:'USD Value:',
            des:'$NaN',
        },
        {
            name:"You'll Receive:",
            des:'0BTC',
        },
    ]
    const notes: Notes []= [
        {
            des: 'Double-check the withdrawal address',
        },
        {
            des: 'Withdrawals cannot be reversed',
        },
        {
            des: 'Minimum withdrawal: 0.001 BTC',
        },
        {
            des: 'Processing time: 10-30 minutes',
        },
        {
            des: 'Network fee: 0.0005 BTC',
        },
    ]
    return (
        <div>
           <div className="flex items-center justify-between">
             <h3 className='text-lg md:text-xl lg:text-[22px] text-white font-satoshi font-bold !leading-[120%] mb-2 md:mb-3'>Withdraw Bitcoin</h3>
             <p className='text-base text-[#6F7083] font-satoshi font-medium !leading-[120%]'>($118,169.00)</p>
           </div>
            <Input className='mb-3 md:mb-4 lg:mb-5' type='text' label='Amount (BTC)' placeholder='Min: 0.0001 BTC' />
            <Input className='mb-3 md:mb-4 lg:mb-5' type='text' label='Withdrawal Address' placeholder='Enter Bitcoin address' />
            <div className="px-4 py-3 rounded-xl border border-solid border-[#39FF67]/10 bg-white/4 mb-4 md:mb-5">
                <h4 className='text-lg text-white font-satoshi font-bold !leading-[120%] mb-3 md:mb-4'>Transaction Summary</h4>
               {summary.map((item, index) => (
                <div className={`flex items-center justify-between mb-3 lg:mb-4 last:pt-3 lg:last:pt-4 last:mb-0 last:border-t last:border-t-[#3E404B]`} key={index}>
                    <p className='text-sm xl:text-base text-[#767884] font-satoshi font-medium !leading-[140%]'>{item.name}</p>
                    <p className='text-sm xl:text-base text-white font-satoshi font-medium !leading-[140%]'>{item.des}</p>
                </div>
               ))}
            </div>
             <div className="py-3 px-4 rounded-xl border border-solid border-[#FF7194]/10 bg-[#FF7194]/10 mb-3 md:mb-4 lg:mb-5">
                    <h4 className='flex items-center gap-2 md:gap-2.5 text-[#FF7194] text-lg font-satoshi font-bold !leading-[110%] mb-2 md:mb-3'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_0_1809)">
                                <path d="M10.0003 18.3333C14.6027 18.3333 18.3337 14.6023 18.3337 9.99996C18.3337 5.39759 14.6027 1.66663 10.0003 1.66663C5.39795 1.66663 1.66699 5.39759 1.66699 9.99996C1.66699 14.6023 5.39795 18.3333 10.0003 18.3333Z" stroke="#FF7194" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 6.66663V9.99996" stroke="#FF7194" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 13.3334H10.01" stroke="#FF7194" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_0_1809">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        Important Notes:
                    </h4>
                    {notes.map((item, index) => (
                        <div className="flex items-center gap-2 mb-1" key={index}>
                            <div className="bg-[#FF7194] size-2 rounded-full ml-1.5 mt-0.5"></div>
                            <p className='text-sm text-[#FF7194] font-satoshi font-medium !leading-[150%]'>{item.des}</p>
                        </div>
                    ))}
                </div>
              <button className='grow px-4.5 min-h-10 md:min-h-13 flex items-center justify-center capitalize bg-white/8 text-base font-medium !leading-[130%] rounded-xl hover:text-white hover:bg-primary w-full'>Minimum 0.0001 BTC</button>
        </div>
    )
}