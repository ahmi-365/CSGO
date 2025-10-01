import React from "react";

type Props = {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    className?: string;
    color?: string;
    text?: string;
    growthRate?: string;
    labelClass?: string;
};

export default function InfoCard({ icon, value, label, className = "flex-col md:flex-row text-center md:text-start", color = "", text = "", growthRate = "", labelClass = "justify-between" }: Props) {
    const styles = {
        border: `1px solid ${color}10`,
        backgroundColor: `${color}10`,
    };

    return (
        <div className={`rounded-[20px]  p-4 md:p-5 lg:p-6  flex items-center gap-3 md:gap-5 ${className}`} style={styles}>
            <div className="rounded-2xl flex-none size-13.5  lg:size-14.5 flex items-center justify-center backdrop-blur-[1px]" style={styles}>
                {icon}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <span className="text-white text-lg md:text-xl xl:text-2xl 2xl:text-[28px] font-bold leading-[100%]">
                    {value}
                </span>
                <div className={`flex items-center w-full  ${labelClass}`}>
                    <span className="text-white/60 text-sm md:text-base font-medium !leading-[120%] ">
                        {label}
                    </span>
                    {text && <span className="text-base font-medium !leading-[120%]" style={{ color: color }}>{text}</span>}
                    {growthRate &&
                        <span className="text-base font-medium !leading-[120%] flex items-center gap-2" style={{ color: color }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M19.1666 5L11.25 12.9167L7.08331 8.75L0.833313 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.1667 5H19.1667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {growthRate}
                        </span>}
                </div>
            </div>
        </div>
    );
}
