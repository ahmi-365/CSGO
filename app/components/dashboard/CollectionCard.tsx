"use client";
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import ActionModal from '@/app/components/action-modal'; // Ensure this path is correct
import { Settings, Trash2, Eye, Weapon } from 'lucide-react'; // Import Lucide icons

type Props = {
    className?: string;
    id: string; // Add id
    img: string;
    price: number;
    items: number; // Represents the count of items inside this specific case
    status: string;
    color: string;
    color2: string;
    onEdit: (id: string) => void; // Expects ID for the action
    onDelete: (id: string) => void; // Expects ID for the action
    onViewDetails: (id: string) => void; // Expects ID for the action
    onManageWeapons: (id: string) => void; // Add this new prop
};

export default function CollectionCard({
    id, img, price, items, status, color, color2,
    onEdit, onDelete, onViewDetails, onManageWeapons, // Destructure new prop
    className = ''
}: Props) {
    const [action_modal_open, set_action_modal_open] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleButton = () => {
        set_action_modal_open(!action_modal_open);
    };

    useEffect(() => {
        const outClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                set_action_modal_open(false);
            }
        };
        window.addEventListener('mousedown', outClick);
        return () => {
            window.removeEventListener('mousedown', outClick);
        };
    }, []);

    return (
        <div
            key={id}
            className={`relative group cursor-pointer z-1 rounded-xl overflow-hidden bg-[#1C1E2D] ${className}`}
            style={{
                border: "double 1px transparent",
                backgroundImage: `linear-gradient(#1C1E2D, #1C1E2D), linear-gradient(${color2 || '#4A3426'} 95%, ${color || '#FB8609'} 100%)`,
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box"
            }}
        >
            <div className="pt-5 p-4 flex flex-col items-center gap-2 xl:gap-4">
                <div ref={dropdownRef} className="absolute top-2.5 right-2.5 z-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleButton();
                        }}
                        className={`text-white text-xl rounded-full size-10 flex items-center justify-center hover:bg-white/10 backdrop-blur-[1px] ${action_modal_open ? 'bg-white/10' : ''}`}
                    >
                        <svg className='size-5 md:size-6' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <ActionModal
                        className={`${action_modal_open ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 translate-y-2'}`}
                        viewAction={() => { onViewDetails(id); toggleButton(); }}
                        editAction={() => { onEdit(id); toggleButton(); }}
                        deleteAction={() => { onDelete(id); toggleButton(); }}
                        manageWeaponsAction={() => { onManageWeapons(id); toggleButton(); }} // Pass new action
                    />
                </div>
                <div onClick={() => onViewDetails(id)} className="w-full h-full flex flex-col items-center gap-2 xl:gap-4 cursor-pointer">
                    <img src={img} alt="Collection" className="group-hover:scale-105 transition-all duration-500 w-53 h-25 md:h-36.5 object-contain mx-auto mb-2 pointer-events-none" />
                    <div className="w-full flex flex-col gap-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-white/60 !leading-normal font-medium">Price:</span>
                            <span className="text-primary font-bold !leading-normal">${price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60 !leading-normal font-medium">Items:</span>
                            <span className="text-white font-bold !leading-normal">{items}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60 !leading-normal font-medium">Status:</span>
                            <span className={`font-bold !leading-normal ${status === 'Active' ? 'text-[#39FF67]' : 'text-[#FF3063]'}`}>{status}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-30 rounded-[100%] -z-1 blur-[100px]' style={{ backgroundColor: color || '#FB8609' }} />
        </div>
    );
}