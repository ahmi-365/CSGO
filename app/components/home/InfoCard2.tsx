import { UserInfoItem } from "@/app/utilities/Types";
import React from "react";

type Props = {
    className?: string;
    growthRate?: string;
    labelClass?: string;
    item: UserInfoItem
};

export default function InfoCard({ item, className = "flex-col md:flex-row text-center md:text-start", labelClass = "justify-between" }: Props) {
    return (
        <div className={`rounded-[20px]  p-4 md:p-5 lg:p-6  flex items-center gap-3 md:gap-5 relative z-1 overflow-hidden bg-white/4 border border-solid border-white/4 backdrop-blur-[8px] ${className}`}>
            <div className="rounded-2xl flex-none size-13.5  lg:size-14.5 flex items-center justify-center backdrop-blur-[1px]">
                {item?.icon}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <span className="text-white text-lg md:text-xl xl:text-2xl 2xl:text-[28px] font-bold leading-[100%]">
                    {item?.value}
                </span>
                <div className={`flex items-center w-full ${labelClass}`}>
                    <span className="text-white/60 text-sm md:text-base font-medium !leading-[120%] ">
                        {item?.label}
                    </span>
                </div>
            </div>
            <div className='absolute -top-7 left-14 md:left-7 size-12.5 rounded-full -z-1 blur-lg' style={{ backgroundColor: item?.color }} />
        </div>
    );
}
