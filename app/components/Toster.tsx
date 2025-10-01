"use client"

import React, { ReactNode, useEffect, useState } from 'react'
import { success, warning, information, error, close } from '@/app/utilities/Icons'

type Props = {
    className?: string;
    variant?: "success" | "warning" | "information" | "error"
    title?: string;
    description?: string;
    position?: "top" | "bottom";
    duration: number,
    icon?: ReactNode,
    onClick?: () => void;
}

export default function Toster({ className = '', onClick, variant = "success", title, description, position = 'bottom', duration = 1 }: Props) {
    const [color, setColor] = useState<string>('')
    const [icon, setIcon] = useState<ReactNode>('')
    useEffect(() => {
        // get color
        const colorVariants: Record<string, string> = {
            success: '#39FF67',
            warning: '#FFD500',
            information: '#32A3FF',
            error: '#F23363',
        }
        setColor(colorVariants[variant] || '#FCC811')

        // get icon
        const iconVariants: Record<string, ReactNode> = {
            success: success,
            warning: warning,
            information: information,
            error: error,
        }
        setIcon(iconVariants[variant])
    }, [variant])

    const hexToRgba = (hex: string, alpha = 1) => {
        const sanitized = hex.replace('#', '')
        const bigint = parseInt(sanitized, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const [width, setWidth] = useState<number>(100)
    const interval = 10

    useEffect(() => {
        const decrement = (interval / duration) * 100

        const timer = setInterval(() => {
            setWidth(prev => {
                if (prev <= 0) {
                    clearInterval(timer)
                    return 0
                }
                return prev - decrement
            })
        }, interval)

        return () => clearInterval(timer)
    }, [duration])


    return (
        <div className={`overflow-hidden font-satoshi font-normal text-sm w-full bg-white/12 backdrop-blur-3xl min-h-20 max-w-90 sm:max-w-111 fixed right-0 !ml-0 !mt-0 m-4 md:m-6 lg:m-8 rounded-xl ${position === 'bottom' ? 'bottom-0' : 'top-0'} ${className}`}>
            <div className="flex items-center gap-0 w-full border-b-3 border-solid px-5" style={{ borderColor: hexToRgba(color, .10) }}>
                <div className="flex-none pr-5 min-w-13">
                    {icon}
                </div>
                <div className="min-h-20 w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_0%,#FFF_49.52%,_rgba(255,255,255,0.00)_100%)] opacity-40" />
                <div className="flex items-center justify-between grow">
                    <div className="flex flex-col gap-y-1.5 grow pl-5 text-start">
                        {title &&
                            <h5 className='text-xl font-bold !leading-tight font-satoshi' style={{ color: color }}>{title}</h5>
                        }
                        {description &&
                            <p className='text-sm font-normal font-satoshi text-[#E9FFF1]/80'>{description}</p>
                        }
                    </div>
                    <button onClick={onClick} className='text-white hover:text-white/70'>{close}</button>
                </div>
            </div>
            <div className="w-full h-[3px] absolute left-0 z-3 bottom-0 -mt-0">
                <span className='absolute top-0 w-full bg-white block size-full'
                    style={{
                        width: `${width}%`,
                        transition: `width ${duration}ms linear`,
                    }}
                />
            </div>
            <div className={`absolute pointer-events-none left-0 top-full -mt-2 w-full h-17 rounded-[100%] blur-2xl`} style={{ backgroundColor: color }} />
        </div>
    )
}