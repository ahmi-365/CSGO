import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { RiMenuFold2Line } from "react-icons/ri";

type Props = {
  className?: string;
}

export default function Humberget({ className = "flex lg:hidden" }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const setParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    const currentParams = searchParams.get('mobile_menu')
    if (currentParams === 'true') {
      params.set('mobile_menu', 'false');
    } else {
      params.set('mobile_menu', 'true');
    }
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <button onClick={() => setParams()} className={`size-10 items-center justify-center rounded-lg bg-white/[6%] text-white text-xl ${className}`}><RiMenuFold2Line /></button>
  )
}