"use client"
import React, { useState, useEffect } from 'react'
import PageContainer from '@/app/components/PageContainer'
import Input from '@/app/components/ui/Input'
import Toster from '@/app/components/Toster'

type Props = {}

export default function page({ }: Props) {
  const [success, setSuccess] = useState(false)


  useEffect(() => {
    setInterval(() => {
      setSuccess(false)
    }, 6000)
  }, [])
  return (
    <PageContainer>
      <div className="max-w-157.5 mx-auto">
        <h4 className='text-2xl text-white font-satoshi font-bold leading-[130%] mb-4 md:mb-5'>Support</h4>
        <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/6 border border-solid border-white/25 flex flex-col gap-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:gap-4">
            <Input className='mb-0' inputClass='!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]' type='text' labelClass='!font-medium' label='First Name' placeholder='Johan' value="" onChange={() => {}} />
            <Input className='mb-0' inputClass='!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]' type='text' labelClass='!font-medium' label='Last Name' placeholder='Smith' value="" onChange={() => {}} />
          </div>
          <Input className='mb-0' inputClass='!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]' type='email' labelClass='!font-medium' label='Email' placeholder='johansmith_100@gmail.com' value="" onChange={() => {}} />
          <Input className='!mb-0' type='textarea' label='Message' inputClass='w-full bg-[#171925]/16 border border-white/12 rounded-xl py-3 px-5 h-36 resize-none text-sm md:text-base text-white placeholder:text-white/50 mb-4 md:mb-5' placeholder='Type here...' value="" onChange={() => {}} />
          <button onClick={() => setSuccess(true)} className='w-full gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 md:min-h-15 flex items-center justify-center text-white font-bold'>
            Send Message
          </button>
        </div>
      </div>
      {success &&
        <Toster
          variant='success'
          title="Successful"
          description='Your Crypto deposit Successful!'
          duration={3000}
          onClick={() => setSuccess(false)}
        />
      }
    </PageContainer>
  )
}