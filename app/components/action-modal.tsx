import React from 'react'
import { delelte, pencil } from '@/app/utilities/Icons';

type Props = {
    className?: string;
    editAction?: () => void;
    deleteAction?: () => void;
}

export default function ActionModal({ className = "", editAction, deleteAction }: Props) {
    const items = [
        {
            name: 'Edit',
            icon: pencil,
        },
        {
            name: 'Delete',
            icon: delelte,
        }
    ]
    return (
        <div className={`${className} transition-all duration-300 min-w-44 p-1 absolute top-0 right-full bg-white/10 border border-solid border-white/10 rounded-xl flex flex-col gap-y-0.5 backdrop-blur-lg shadow-[0px_8px_34px_rgba(0,0,0,.25)]`}>
            {items?.map((item, index) => (
                <button key={index} className='flex items-center gap-2 min-h-11 px-3 font-satoshi font-medium text-sm text-white hover:bg-[#171925]/16 rounded-2xl'>
                    {item.icon} {item.name}
                </button>
            ))}
        </div>
    )
}