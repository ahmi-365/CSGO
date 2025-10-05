"use client";

import React from "react";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";

interface CardData {
  id: string;
  title: string;
  img: string;
  price: number;
  percent: number;
  color: string;
  color2: string;
}

type Props = {
  className?: string;
  item?: CardData;
  onDelete?: (id: string) => void;
};

export default function WeaponsCollection({
  item,
  className = "",
  onDelete,
}: Props) {
  if (!item) return null;

  return (
    <div
      className={`relative z-1 rounded-xl overflow-hidden group cursor-pointer h-full ${className}`}
      style={{
        border: "double 1px transparent",
        backgroundImage: `linear-gradient(#1C1E2D, #1C1E2D), linear-gradient(${item.color2} 95%, ${item.color} 100%)`,
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
      }}
    >
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Link
          href={`/dashboard/weapons/${item.id}`}
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-blue-600/80 text-white rounded-full hover:bg-blue-500 hover:scale-110"
          aria-label="Edit weapon"
        >
          <Edit size={16} />
        </Link>
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 bg-red-600/80 text-white rounded-full hover:bg-red-500 hover:scale-110"
            aria-label="Delete weapon"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="p-3 flex flex-col items-center">
        <p className="absolute top-2 left-2 bg-white/8 rounded-full text-white/80 text-[10px] h-5 px-2 !leading-[190%]">
          {item.percent.toFixed(2)}%
        </p>
        <img
          src={item.img}
          alt={item.title}
          className="w-40 h-41 object-contain mx-auto pointer-events-none -mb-7 -mt-4"
        />
        <div className="w-full flex flex-col gap-1.5 text-sm">
          <h4 className="text-sm text-white font-black truncate">
            {item.title}
          </h4>
          <div className="flex justify-between items-center">
            <button className="buy-btn rounded-full relative text-xs px-3 py-1 min-w-0 min-h-7 bg-none shadow-none bg-white/8 text-white/80 border-0">
              Common
            </button>
            <span className="text-white font-bold !leading-normal">
              $
              {typeof item.price === "number"
                ? item.price.toFixed(2)
                : item.price}
            </span>
          </div>
        </div>
      </div>
      <div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-40 rounded-[100%] -z-1 blur-[80px]"
        style={{ backgroundColor: item.color }}
      />
    </div>
  );
}
