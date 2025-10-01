"use client"

import WeaponsCollection from '@/app/components/dashboard/WeaponsCollection'
import Dropdown from '@/app/components/ui/Dropdown'
import Input from '@/app/components/ui/Input'
import React, { useState } from 'react'

type Props = {}

export default function page({ }: Props) {

  const card = [
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-1.png",
      price: 0.03,
      percent: 25.98,
      color: '#FB8609',
      color2: '#4A3426',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-2.png",
      price: 0.03,
      percent: 25.98,
      color: '#236DFF',
      color2: '#203057',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-3.png",
      price: 0.03,
      percent: 25.98,
      color: '#C324E7',
      color2: '#3D2053',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-4.png",
      price: 0.03,
      percent: 25.98,
      color: '#4FC8FF',
      color2: '#29455C',
    },

    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-5.png",
      price: 0.03,
      percent: 25.98,
      color: '#FB8609',
      color2: '#4A3426',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-6.png",
      price: 0.03,
      percent: 25.98,

      color: '#97F506',
      color2: '#354A26',
    },

    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-5.png",
      price: 0.03,
      percent: 25.98,
      color: '#FB8609',
      color2: '#4A3426',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-3.png",
      price: 0.03,
      percent: 25.98,

      color: '#C324E7',
      color2: '#3D2053',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-7.png",
      price: 0.03,
      percent: 25.98,
      color: '#702AEC',
      color2: '#2D2154',
    },


    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-4.png",
      price: 0.03,
      percent: 25.98,
      color: '#4FC8FF',
      color2: '#29455C',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-5.png",
      price: 0.03,
      percent: 25.98,
      color: '#FB8609',
      color2: '#4A3426',
    },
    {
      title: "P250 Sand Dune",
      img: "/img/dashboard/weapons-2.png",
      price: 0.03,
      percent: 25.98,
      color: '#236DFF',
      color2: '#203057',
    },
  ]

  const [addNewCase, setAddNewCase] = useState(1);
  const [addStatus, setAddStatus] = useState(false)

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5 xl:gap-6'>
      <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
          <h3 className='text-white text-base md:text-lg font-bold !leading-[130%]'>Upload File</h3>
          <span className='text-sm text-[#6F7083]'>{card.length} Weapons</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 relative z-10">
          <Input type='search' placeholder='Search' className='md:col-span-2' />
          <Dropdown btnClass='md:col-span-1' placeholder="All Rarities" items={[{ name: 'All Rarities' }, { name: 'Active' }, { name: 'Banned' }]} leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 15H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-4">
          {card.map((item, index) => (
            <WeaponsCollection key={index} item={item} />
          ))}
        </div>
      </div>
      <div className="">
        <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
            <h3 className='text-white text-base md:text-lg font-bold !leading-[130%]'>Upload File</h3>
            <span className='text-sm text-[#6F7083]'><span className='text-primary'>0.00%</span> total</span>
          </div>
          <div className="flex flex-col gap-y-6 mb-3 md:mb-4 xl:mb-5">
            {Array.from({ length: addNewCase }).map((_, index) => (
              <div className='flex flex-col gap-y-4' key={index}>
                <label key={index} htmlFor={`add_item_${index}`} className="min-h-50 md:min-h-70 px-4 cursor-pointer rounded-[20px] bg-[#347BFF]/6 border-[#347BFF] border-dashed border flex items-center justify-center">
                  <input onChange={() => setAddStatus(true)} type="file" id={`add_item_${index}`} className='hidden' />
                  <div className="max-w-max text-center mx-auto">
                    <svg className='mb-3 mx-auto' xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M26.6667 26.6667L20 20L13.3334 26.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 20V35" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M33.9834 30.6498C35.609 29.7636 36.8931 28.3613 37.6332 26.6642C38.3733 24.9671 38.5271 23.0719 38.0704 21.2776C37.6137 19.4834 36.5725 17.8923 35.1112 16.7556C33.6498 15.6188 31.8515 15.001 30.0001 14.9998H27.9001C27.3956 13.0485 26.4553 11.237 25.15 9.70147C23.8446 8.1659 22.2081 6.94623 20.3636 6.13416C18.519 5.32208 16.5143 4.93874 14.5003 5.01295C12.4862 5.08715 10.5152 5.61698 8.73535 6.56259C6.95553 7.5082 5.41324 8.84498 4.22443 10.4724C3.03561 12.0999 2.23121 13.9757 1.87169 15.9588C1.51217 17.9419 1.6069 19.9807 2.14874 21.9219C2.69059 23.8631 3.66546 25.6563 5.00006 27.1665" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M26.6667 26.6667L20 20L13.3334 26.6667" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className='text-white text-sm !leading-[130%] mb-2'>Drag & Drop Weapons</p>
                    <p className='text-white/50 text-sm !leading-[160%]'>Drag weapons from the database to add them to this case</p>
                  </div>
                </label>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-7 md:col-span-8">
                    <Input inputClass='!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]' type="text" labelClass='!mb-2 !text-[#BFC0D8]' label='Product Title' placeholder='P250 Sand Dune' />
                  </div>
                  <div className="col-span-5 md:col-span-4">
                    <Input inputClass='!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]' type="text" labelClass='!mb-2 !text-[#BFC0D8]' label='Price' placeholder='$0.03' />
                  </div>
                  <div className="col-span-7 md:col-span-8">
                    <Input inputClass='!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]' type="text" labelClass='!mb-2 !text-[#BFC0D8]' label='Sub Title' placeholder='Spectrum Case' /></div>
                  <div className="col-span-5 md:col-span-4">
                    <Input inputClass='!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]' type="text" labelClass='!mb-2 !text-[#BFC0D8]' label='Probability' placeholder='25.98%' /></div>
                </div>
                <Dropdown btnClass='md:col-span-1' placeholder="Common" items={[
                  { name: 'Common', color: '#C0C4CE' },
                  { name: 'Uncommon', color: '#39FF67' },
                  { name: 'Rare', color: '#236DFF' },
                  { name: 'Epic', color: '#702AEC' },
                  { name: 'Legendary', color: '#FF8809' }
                ]} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setAddNewCase(addNewCase + 1)} className='w-full gap-1 px-1 font-normal md:font-semibold btn text-sm md:text-base bg-none min-h-11 md:min-h-13 shadow-none bg-primary rounded-xl !border-t !border-white/25 border-0'>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.75V16.25M16.75 10H4.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Case Items
            </button>
            <button className='w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-11 md:min-h-13 flex items-center justify-center text-white font-bold'>
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}