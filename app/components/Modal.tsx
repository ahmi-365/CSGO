"use client"
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
    title?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    onClick: () => void;
};

export default function Modal({ title = "", children, onClick, icon }: Props) {
    return (
        <div className='fixed top-0 overflow-y-auto left-0 z-20 size-full bg-[#171925]/50 backdrop-blur-[15px] flex items-center justify-center'>
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className='w-full mx-4 max-w-110 rounded-2xl md:rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-[20px] p-4 md:p-5 xl:p-6'>
                    <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-3 text-white">
                            {icon && icon}
                            <p className='text-base lg:text-lg font-bold !leading-[120%]'>{title}</p>
                        </div>
                        <button className='' onClick={onClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}