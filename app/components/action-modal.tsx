import React from 'react'
import { delelte, pencil, eye } from '@/app/utilities/Icons'; // Assuming 'eye' icon exists

type Props = {
    className?: string;
    viewAction?: () => void; // New prop for viewing details
    editAction?: () => void;
    deleteAction?: () => void;
}

export default function ActionModal({ className = "", viewAction, editAction, deleteAction }: Props) {
    const items = [
        {
            name: 'View Details',
            icon: eye,
            action: viewAction
        },
        {
            name: 'Edit',
            icon: pencil,
            action: editAction
        },
        {
            name: 'Delete',
            icon: delelte,
            action: deleteAction
        }
    ];

    return (
        <div className={`${className} transition-all duration-300 min-w-44 p-1 absolute top-0 right-full bg-white/10 border border-solid border-white/10 rounded-xl flex flex-col gap-y-0.5 backdrop-blur-lg shadow-[0px_8px_34px_rgba(0,0,0,.25)]`}>
            {items?.map((item, index) => (
                item.action && ( // Only render if an action is provided
                    <button
                        key={index}
                        onClick={item.action}
                        className='flex items-center gap-2 min-h-11 px-3 font-satoshi font-medium text-sm text-white hover:bg-[#171925]/16 rounded-2xl'
                    >
                        {item.icon} {item.name}
                    </button>
                )
            ))}
        </div>
    );
}