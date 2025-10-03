"use client"

import React from "react";
import type { WeaponsCollection as WeaponsCollectionType } from "@/app/utilities/Types";
import { Trash2 } from 'lucide-react'; // <-- Step 1: Icon import karein

// Farz karein ke aapki WeaponsCollectionType aisi dikhti hai (zaroori hai ke ismein 'id' ho)
// File: app/utilities/Types.ts
// export interface WeaponsCollection {
//   id: string;
//   title: string;
//   img: string;
//   price: number;
//   percent: number;
//   color: string;
//   color2: string;
// }

// Step 2: Props mein onDelete function add karein
type Props = {
  className?: string;
  item?: WeaponsCollectionType;
  onDelete?: (id: string) => void; // Optional banaya hai taake kahin aur error na aaye
};

export default function WeaponsCollection({ item, className = "", onDelete }: Props) {
  // Agar item mojood nahi hai, to kuch render na karein
  if (!item) return null;

  return (
    <div
      className={`relative z-1 rounded-xl overflow-hidden group cursor-pointer ${className}`}
      style={{
        border: "double 1px transparent",
        backgroundImage: `linear-gradient(#1C1E2D, #1C1E2D), linear-gradient(${item.color2} 95%, ${item.color} 100%)`,
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
      }}
    >
      {/* --- STEP 3: DELETE BUTTON ADD KAREIN --- */}
      {onDelete && ( // Button sirf tab dikhayein jab onDelete function pass ho
        <button
          onClick={(e) => {
            e.stopPropagation(); // Parent ke click event ko trigger hone se rokein
            onDelete(item.id);
          }}
          className="absolute top-3 right-3 z-30 p-2 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110"
          aria-label="Delete weapon"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Aapka baaqi ka component code waisa hi rahega */}
      <img
        src="/img/cases/card-shape.png"
        className="rounded-t-2xl mix-blend-color-dodge absolute top-0 left-0 w-full h-auto max-h-31 -z-10 opacity-10 transition-all duration-300 group-hover:opacity-100"
        alt=""
      />
      <div className="p-3 flex flex-col items-center">
        <p className="absolute top-2 right-2 bg-white/8 rounded-full text-white/80 text-[10px] h-5 px-2 !leading-[190%]">
          {item.percent}%
        </p>
        <img
          src={item.img}
          alt="Collection"
          className="w-40 h-41 object-contain mx-auto pointer-events-none -mb-7 -mt-4"
        />
        <div className="w-full flex flex-col gap-1.5 text-sm">
          <h4 className="text-sm text-white font-black">{item.title}</h4>
          <div className="flex justify-between items-center">
            <button className="buy-btn rounded-full relative text-xs px-3 py-1 min-w-0 min-h-7 bg-none shadow-none bg-white/8 text-white/80 border-0">
              Common
              <span className="gradient-border-two rounded-full absolute top-0 left-0 size-full -z-10 opacity-0 invisible transition-all duration-300" />
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