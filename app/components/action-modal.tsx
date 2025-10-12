import React from 'react';
import { Eye, Pencil, Trash2, Sword,Star } from 'lucide-react'; // Lucide icons

type Props = {
  className?: string;
  viewAction?: () => void;
  editAction?: () => void;
  deleteAction?: () => void;
  manageWeaponsAction?: () => void;
   toggleTopAction?: () => void;  // Add this
  isTop?: boolean; 
};

export default function ActionModal({
  className = "",
  viewAction,
  editAction,
  deleteAction,
   toggleTopAction,  // Add this
  isTop,
  manageWeaponsAction
}: Props) {
  const items = [
    { name: 'View Details', icon: <Eye size={18} />, action: viewAction },
    { name: 'Edit', icon: <Pencil size={18} />, action: editAction },
    { name: 'Delete', icon: <Trash2 size={18} />, action: deleteAction },
     { 
      name: isTop ? 'Remove from Top' : 'Set as Top', 
      icon: <Star size={18} fill={isTop ? "currentColor" : "none"} />, 
      action: toggleTopAction,
      className: isTop ? 'text-yellow-400' : ''  // Highlight if it's top
    },
    { name: 'Manage Weapons', icon: <Sword size={18} />, action: manageWeaponsAction },
  ];

  return (
    <div className={`${className} transition-all duration-300 min-w-44 p-1 absolute top-0 right-full bg-white/10 border border-solid border-white/10 rounded-xl flex flex-col gap-y-0.5 backdrop-blur-lg shadow-[0px_8px_34px_rgba(0,0,0,.25)]`}>
     {items.map(
    (item, index) =>
      item.action && (
        <button
          key={index}
          onClick={item.action}
          className={`flex items-center gap-2 min-h-11 px-3 font-satoshi font-medium text-sm text-white hover:bg-[#171925]/16 rounded-2xl ${item.className || ''}`}  // ✅ ADD ${item.className || ''}
        >
          {item.icon} {item.name}
        </button>
      )
  )}
    </div>
  );
}
