"use client"
import React, { useEffect, useState } from "react";

type Props = {};

export default function Preloader({ }: Props) {

    const linearBorder = `rounded-3xl 
             border border-transparent 
             bg-[linear-gradient(#393939,#393939),linear-gradient(136deg,#ACACAC_0%,transparent_60%,#ACACAC_90%,transparent_90%)] 
             [background-origin:border-box] [background-clip:content-box,border-box]`
    const linearBorder2 = `rounded-3xl 
             border border-transparent 
             bg-[linear-gradient(#393939,#393939),linear-gradient(90deg,#ACACAC_0%,transparent_20%,transparent_70%,#ACACAC_100%)] 
             [background-origin:border-box] [background-clip:content-box,border-box]`
    const linearBorder3 = `rounded-3xl 
             border border-transparent 
             bg-[linear-gradient(#393939,#393939),linear-gradient(45deg,#ACACAC_0%,transparent_60%,#ACACAC_90%,transparent_90%)] 
             [background-origin:border-box] [background-clip:content-box,border-box]`

    const [dotCount, setDotCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const animationIcon = [
        <svg className={`${linearBorder}`} width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="70" rx="25.4545" fill="white" fillOpacity="0.1" />
            <path d="M53.4828 32.961C54.0241 32.9615 54.4624 33.4006 54.462 33.9418L54.4493 50.6106C54.447 53.4123 52.1761 55.6816 49.3743 55.6818H20.8596C18.0565 55.6815 15.7848 53.41 15.7846 50.6068V33.9402C15.7846 33.3989 16.2234 32.96 16.7647 32.96H18.5968C19.1382 32.96 19.577 33.3989 19.577 33.9402V50.6068C19.5771 51.3147 20.1517 51.8891 20.8596 51.8894H49.3743C50.0821 51.8892 50.6565 51.3146 50.6569 50.6068L50.6678 33.9386C50.6681 33.3972 51.1075 32.9586 51.6489 32.9591L53.4828 32.961ZM50.276 15.1735C51.711 15.1735 52.9996 16.0522 53.5228 17.3885L56.3599 24.6363C57.0914 26.5059 55.7123 28.5263 53.7046 28.5263H47.7379C47.1966 28.5263 46.7578 28.0875 46.7578 27.5462V25.7122C46.7578 25.1708 47.1966 24.732 47.7379 24.732H52.3225L50.0673 18.9659H19.9235L17.6683 24.732H22.2537C22.7951 24.732 23.2339 25.1708 23.2339 25.7122V27.5462C23.2339 28.0875 22.7951 28.5263 22.2537 28.5263H16.2862C14.2786 28.5263 12.8994 26.5059 13.6309 24.6363L16.468 17.3885C16.9912 16.0523 18.2798 15.1735 19.7148 15.1735H50.276Z" fill="url(#paint0_linear_289_6665)" />
            <path d="M34.1126 23.6448C34.4001 22.8029 35.5908 22.8029 35.8782 23.6448L37.3409 27.9279C37.4342 28.2012 37.6489 28.4159 37.9222 28.5092L42.2053 29.9718C43.0471 30.2593 43.0471 31.4499 42.2053 31.7374L37.9222 33.2C37.6489 33.2934 37.4342 33.5081 37.3409 33.7814L35.8782 38.0645C35.5908 38.9063 34.4001 38.9063 34.1126 38.0645L32.65 33.7814C32.5567 33.5081 32.342 33.2934 32.0687 33.2L27.7856 31.7374C26.9437 31.4499 26.9437 30.2593 27.7856 29.9718L32.0687 28.5092C32.342 28.4159 32.5567 28.2012 32.65 27.9279L34.1126 23.6448Z" fill="white" />
            <path d="M24.5113 40.066C23.7757 40.647 23.5647 41.6859 24.1045 42.4523C25.2705 44.1073 26.6992 45.4863 28.3154 46.5085C30.361 47.8024 32.6444 48.4854 34.9659 48.4978C37.2874 48.5102 39.576 47.8516 41.6314 46.5796C43.2547 45.5751 44.6935 44.2122 45.8718 42.5706C46.4187 41.8087 46.2169 40.7675 45.4864 40.1793C44.5794 39.4488 43.2419 39.7113 42.486 40.5973C41.7396 41.472 40.884 42.2136 39.9455 42.7943C38.415 43.7415 36.7109 44.2319 34.9823 44.2226C33.2538 44.2134 31.5535 43.7048 30.0303 42.7414C29.0941 42.1492 28.2423 41.3963 27.5015 40.5109C26.7556 39.6195 25.4235 39.3456 24.5113 40.066Z" fill="white" />
            <defs>
                <linearGradient id="paint0_linear_289_6665" x1="18.3331" y1="15.1735" x2="53.6189" y2="54.38" gradientUnits="userSpaceOnUse">
                    <stop offset="0.117811" stopColor="#FCC811" />
                    <stop offset="0.40485" stopColor="#F85D36" />
                    <stop offset="0.564146" stopColor="#EF5180" />
                    <stop offset="0.857068" stopColor="#4B71FF" />
                    <stop offset="1" stopColor="#34DDFF" />
                </linearGradient>
            </defs>
        </svg>,

        <svg className={`${linearBorder2}`} xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none">
            <rect width="70" height="70" rx="25.4545" fill="white" fillOpacity="0.1" />
            <path d="M33.1675 19.5093C33.7881 17.692 36.3583 17.692 36.9789 19.5093L40.1362 28.7552C40.3377 29.3452 40.8011 29.8087 41.3912 30.0101L50.637 33.1675C52.4543 33.7881 52.4543 36.3583 50.637 36.9789L41.3912 40.1362C40.8011 40.3377 40.3377 40.8011 40.1362 41.3912L36.9789 50.637C36.3583 52.4543 33.7881 52.4543 33.1675 50.637L30.0101 41.3912C29.8087 40.8011 29.3452 40.3377 28.7552 40.1362L19.5093 36.9789C17.692 36.3583 17.692 33.7881 19.5093 33.1675L28.7552 30.0101C29.3452 29.8087 29.8087 29.3452 30.0101 28.7552L33.1675 19.5093Z" fill="white" />
        </svg>,

        <svg className={`${linearBorder3}`} xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none">
            <rect width="70" height="70" rx="25.4545" fill="white" fillOpacity="0.1" />
            <path d="M36.9789 50.637C36.3583 52.4543 33.7881 52.4543 33.1675 50.637L30.0101 41.3912C29.8086 40.8011 29.3452 40.3377 28.7552 40.1362L19.5093 36.9789C17.692 36.3583 17.692 33.7881 19.5093 33.1675L28.7552 30.0101C29.3452 29.8086 29.8086 29.3452 30.0101 28.7552L33.1675 19.5093C33.7881 17.692 36.3583 17.692 36.9789 19.5093L40.1362 28.7552C40.3377 29.3452 40.8011 29.8086 41.3912 30.0101L50.637 33.1675C52.4543 33.7881 52.4543 36.3583 50.637 36.9789L41.3912 40.1362C40.8011 40.3377 40.3377 40.8011 40.1362 41.3912L36.9789 50.637Z" fill="white" />
        </svg>,
    ];
    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 600);
        return () => clearInterval(dotInterval);
    }, []);

    useEffect(() => {
        const iconInterval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % animationIcon.length);
        }, 2000);
        return () => clearInterval(iconInterval);
    }, [animationIcon.length]);

    return (
        <div className="fixed inset-0 size-full z-20 flex flex-col items-center justify-center bg-[#171925]/10 backdrop-blur-[15px]">
            <div className="relative size-17.5 ">
                {animationIcon.map((item, index) => (
                    <div key={index} className={`rounded-3xl absolute inset-0 transition-all duration-1500 ${index === 2 ? "duration-2500" : ""} ${index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-90  rotate-90"}`}>
                        {item}
                    </div>
                ))}
            </div>
            <div className="mt-3.5 text-white/60 text-base md:text-lg lg:text-xl xl:text-[28px] font-light">
                Loading{".".repeat(dotCount)}
            </div>
        </div>
    );
}
