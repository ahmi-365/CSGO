import React from 'react';
import { Eye, Pencil, Trash2, Sword, Star } from 'lucide-react';

type Props = {
  className?: string;
  viewAction?: () => void;
  editAction?: () => void;
  deleteAction?: () => void;
  manageWeaponsAction?: () => void;
  toggleTopAction?: () => void;
  isTop?: boolean; 
};

export default function ActionModal({
  className = "",
  viewAction,
  editAction,
  deleteAction,
  toggleTopAction,
  isTop,
  manageWeaponsAction
}: Props) {
  const items = [
    { name: 'View Details', icon: <Eye className="size-4 md:size-5" />, action: viewAction },
    { name: 'Edit', icon: <Pencil className="size-4 md:size-5" />, action: editAction },
    { name: 'Delete', icon: <Trash2 className="size-4 md:size-5" />, action: deleteAction },
    { 
      name: isTop ? 'Remove from Top' : 'Set as Top', 
      icon: <Star className="size-4 md:size-5" fill={isTop ? "currentColor" : "none"} />, 
      action: toggleTopAction,
      className: isTop ? 'text-yellow-400' : ''
    },
    { name: 'Manage Weapons', icon: <Sword className="size-4 md:size-5" />, action: manageWeaponsAction },
  ];

  return (
    <div className={`${className} transition-all duration-300 min-w-36 md:min-w-44 p-1 absolute top-full mb-10 right-0 md:top-0 md:mt-0 md:right-full md:mr-2 bg-white/10 border border-solid border-white/10 rounded-xl flex flex-col gap-y-0.5 backdrop-blur-lg shadow-[0px_8px_34px_rgba(0,0,0,.25)] z-[60]`}>
      {items.map(
        (item, index) =>
          item.action && (
            <button
              key={index}
              onClick={item.action}
              className={`flex items-center gap-1.5 md:gap-2 min-h-9 md:min-h-11 px-2 md:px-3 font-satoshi font-medium text-xs md:text-sm text-white hover:bg-[#171925]/16 rounded-lg md:rounded-2xl whitespace-nowrap ${item.className || ''}`}
            >
              {item.icon} {item.name}
            </button>
          )
      )}
    </div>
  );
}