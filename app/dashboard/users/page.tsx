"use client"
import { UserInfoItem, UserItem } from '@/app/utilities/Types';
import InfoCard from '@/app/components/dashboard/InfoCard';
import Dropdown from '@/app/components/ui/Dropdown';
import Input from '@/app/components/ui/Input';
import ActionModal from '@/app/components/action-modal';
import { useEffect, useRef, useState } from 'react';

export default function UsersTable() {
  const users: UserItem[] = [
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#FF6F91',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#6A89CC',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#FF6F91',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#6A89CC',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#00FF00',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#FFA500',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#A259FF',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#FF3D00',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#FFA500',
      status: 'Banned',
      statusColor: 'bg-red-600',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: false,
    },
    {
      name: 'SkinHunter2024',
      email: 'skinhunter@example.com',
      avatarColor: '#00FFFF',
      status: 'Active',
      balance: 1250.75,
      casesOpened: 45,
      totalSpend: 2340.5,
      lastLogin: '12/15/2024',
      active: true,
    },
  ];

  const userInfo: UserInfoItem[] = [
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M27.1333 8.94662C27.133 10.0002 26.7948 11.0259 26.1684 11.8731C25.5421 12.7202 24.6605 13.3442 23.6533 13.6533C23.884 12.9016 24.0008 12.1196 24 11.3333C24.0001 9.94829 23.64 8.58705 22.9551 7.38323C22.2702 6.1794 21.284 5.17438 20.0933 4.46681C20.7534 4.16038 21.4723 4.0011 22.2 4C23.51 4.00229 24.7655 4.52461 25.6906 5.45216C26.6156 6.37972 27.1346 7.63662 27.1333 8.94662ZM26.1333 15.0667C25.5732 14.9098 24.9737 14.9818 24.4667 15.2668C23.8966 15.5829 23.2638 15.7694 22.6134 15.8132C22.3441 16.2237 22.0312 16.6037 21.68 16.9468C22.9396 17.3612 24.0611 18.114 24.9217 19.1228C25.7824 20.1316 26.3491 21.3576 26.56 22.6668H27.48C27.7755 22.6709 28.0666 22.595 28.3225 22.4472C28.5783 22.2993 28.7894 22.085 28.9334 21.8269C29.1981 21.3304 29.3355 20.776 29.3334 20.2133V19.2666C29.3333 17.2799 28.0134 15.5599 26.1333 15.0667ZM11.9067 4.46681C11.2466 4.16038 10.5278 4.0011 9.80002 4C8.6187 4.00082 7.47684 4.42524 6.58176 5.19619C5.68669 5.96714 5.09775 7.03351 4.9219 8.20167C4.74604 9.36983 4.99491 10.5623 5.62333 11.5626C6.25175 12.5629 7.21805 13.3047 8.34677 13.6533C8.11611 12.9016 7.99923 12.1196 8.00002 11.3333C7.99995 9.94829 8.36005 8.58705 9.04496 7.38323C9.72988 6.1794 10.7161 5.17438 11.9067 4.46681ZM10.32 16.9466C9.96889 16.6036 9.65594 16.2235 9.38665 15.8131C8.73625 15.7693 8.1035 15.5827 7.5334 15.2666C7.02632 14.9816 6.42682 14.9097 5.86671 15.0666C3.98665 15.5597 2.66671 17.2798 2.66671 19.2666V20.2132C2.66457 20.7759 2.80201 21.3303 3.06671 21.8268C3.20913 22.0833 3.41803 22.2966 3.67144 22.4444C3.92486 22.5922 4.21342 22.669 4.50677 22.6667H5.44002C5.65093 21.3575 6.21769 20.1315 7.07834 19.1227C7.939 18.1139 9.06042 17.3611 10.32 16.9466ZM20.7734 18.7601C20.5422 18.702 20.305 18.6706 20.0667 18.6667C19.6043 18.6677 19.1499 18.787 18.7467 19.0134C17.9055 19.477 16.9606 19.7201 16 19.7201C15.0395 19.7201 14.0946 19.477 13.2533 19.0134C12.8502 18.787 12.3958 18.6677 11.9334 18.6667C11.695 18.6706 11.4579 18.702 11.2266 18.7601C10.1061 19.0639 9.11716 19.729 8.41321 20.6523C7.70927 21.5756 7.32968 22.7053 7.33334 23.8663V25.0264C7.33378 25.7062 7.50333 26.3752 7.82671 26.9731C8.16002 27.613 8.82671 27.9998 9.57334 27.9998H22.4267C23.1733 27.9998 23.84 27.613 24.1733 26.9731C24.4967 26.3752 24.6663 25.7062 24.6667 25.0264V23.8666C24.6704 22.7055 24.2909 21.5757 23.5869 20.6524C22.883 19.7291 21.894 19.0639 20.7734 18.7601ZM22 11.3333C22 10.1466 21.6481 8.98659 20.9888 7.99989C20.3296 7.0132 19.3925 6.24416 18.2961 5.79004C17.1998 5.33591 15.9934 5.21709 14.8295 5.4486C13.6656 5.68011 12.5965 6.25156 11.7574 7.09067C10.9183 7.92979 10.3468 8.99888 10.1153 10.1628C9.8838 11.3267 10.0026 12.5331 10.4567 13.6294C10.9109 14.7258 11.6799 15.6628 12.6666 16.3221C13.6533 16.9814 14.8133 17.3333 16 17.3333C17.5913 17.3333 19.1174 16.7012 20.2427 15.576C21.3679 14.4507 22 12.9246 22 11.3333Z" fill="#24E9FF" />
      </svg>),
      value: "5.2 M+",
      label: "Total Users",
      color: "#24E9FF"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M15.3333 16.3254C19.3834 16.3254 22.6667 13.0421 22.6667 8.99202C22.6667 4.94194 19.3834 1.65869 15.3333 1.65869C11.2832 1.65869 8 4.94194 8 8.99202C8 13.0421 11.2832 16.3254 15.3333 16.3254Z" fill="#347BFF" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.2334 29.0079C15.848 27.5199 15 25.5253 15 23.3333C15 21.0893 15.8894 19.0506 17.3347 17.5519C16.6814 17.5013 16.0134 17.4746 15.3334 17.4746C10.904 17.4746 6.98269 18.5826 4.54802 20.2426C2.69069 21.5093 1.66669 23.1186 1.66669 24.8079V26.7413C1.66669 27.3426 1.90535 27.9199 2.33069 28.3439C2.75602 28.7693 3.33202 29.0079 3.93335 29.0079H17.2334Z" fill="#347BFF" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23.3334 16.3335C19.4694 16.3335 16.3334 19.4695 16.3334 23.3335C16.3334 27.1975 19.4694 30.3335 23.3334 30.3335C27.1974 30.3335 30.3334 27.1975 30.3334 23.3335C30.3334 19.4695 27.1974 16.3335 23.3334 16.3335ZM20.112 24.4988L22.112 25.8322C22.508 26.0962 23.0374 26.0442 23.3734 25.7068L26.7067 22.3735C27.0974 21.9842 27.0974 21.3495 26.7067 20.9602C26.3174 20.5695 25.6827 20.5695 25.2934 20.9602L22.5387 23.7135L21.2214 22.8348C20.7627 22.5282 20.1414 22.6535 19.8347 23.1122C19.528 23.5708 19.6534 24.1922 20.112 24.4988Z" fill="#347BFF" />
      </svg>),
      value: "3.5 M+",
      label: "Active Users",
      color: "#347BFF"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8.01204 8.66683C8.01204 7.612 8.32484 6.58085 8.91087 5.70379C9.4969 4.82673 10.3299 4.14314 11.3044 3.73947C12.2789 3.33581 13.3513 3.23019 14.3859 3.43598C15.4204 3.64176 16.3707 4.14972 17.1166 4.8956C17.8625 5.64148 18.3704 6.59178 18.5762 7.62635C18.782 8.66092 18.6764 9.73327 18.2727 10.7078C17.8691 11.6824 17.1855 12.5153 16.3084 13.1013C15.4314 13.6874 14.4002 14.0002 13.3454 14.0002C11.9309 14.0002 10.5743 13.4383 9.57414 12.4381C8.57394 11.4379 8.01204 10.0813 8.01204 8.66683ZM15.6667 24.0002C15.6648 22.7881 15.9288 21.5903 16.4403 20.4914C16.9517 19.3925 17.6981 18.4192 18.6267 17.6402C18.7007 17.5654 18.7435 17.4653 18.7467 17.3602C18.7467 17.0935 18.4107 16.9775 18.3467 16.9602C17.5807 16.76 16.7917 16.6614 16 16.6668H10.6667C5.25337 16.6668 3.33337 20.6268 3.33337 24.0268C3.33337 27.0668 4.94671 28.6668 8.00004 28.6668H16.3867C16.4943 28.6683 16.5981 28.627 16.6754 28.552C16.7526 28.477 16.797 28.3745 16.7987 28.2668C16.8024 28.2057 16.789 28.1448 16.76 28.0908C16.0454 26.8458 15.6685 25.4357 15.6667 24.0002ZM30.3334 24.0002C30.3334 25.2528 29.9619 26.4773 29.266 27.5188C28.5701 28.5603 27.581 29.372 26.4237 29.8514C25.2664 30.3308 23.993 30.4562 22.7645 30.2118C21.5359 29.9674 20.4074 29.3642 19.5217 28.4785C18.636 27.5928 18.0328 26.4643 17.7884 25.2357C17.544 24.0072 17.6694 22.7338 18.1488 21.5765C18.6282 20.4192 19.4399 19.4301 20.4814 18.7342C21.5229 18.0383 22.7474 17.6668 24 17.6668C25.6791 17.6689 27.2888 18.3369 28.476 19.5242C29.6633 20.7114 30.3313 22.3211 30.3334 24.0002ZM20.3227 26.2668L26.2667 20.3228C25.4398 19.8027 24.4607 19.5789 23.4899 19.688C22.5192 19.7972 21.6142 20.2328 20.9235 20.9236C20.2327 21.6144 19.797 22.5193 19.6879 23.4901C19.5787 24.4608 19.8026 25.4399 20.3227 26.2668ZM28.3334 24.0002C28.3312 23.1981 28.1039 22.4127 27.6774 21.7335L21.7334 27.6775C22.3875 28.0875 23.1398 28.3144 23.9116 28.3343C24.6834 28.3542 25.4464 28.1664 26.1209 27.7907C26.7953 27.4149 27.3565 26.8649 27.7457 26.1981C28.1349 25.5313 28.3378 24.7722 28.3334 24.0002Z" fill="#FF3063" />
      </svg>),
      value: "40.8 K+",
      label: "Banned Users",
      color: "#FF3063"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M29.3333 15.9998C29.3333 14.5871 27.6419 13.0493 25.9635 11.8735C26.3177 9.8553 26.4283 7.57145 25.4283 6.57145C24.4297 5.57145 22.1458 5.67953 20.1263 6.03629C18.9505 4.3579 17.4127 2.6665 16 2.6665C14.5872 2.6665 13.0494 4.3579 11.8737 6.03629C9.85542 5.68082 7.57027 5.57014 6.57157 6.57145C5.57157 7.57145 5.68224 9.8553 6.03641 11.8735C4.35803 13.0493 2.66663 14.5871 2.66663 15.9998C2.66663 17.4126 4.35803 18.9504 6.03641 20.1261C5.68225 22.1444 5.57157 24.4282 6.57157 25.4282C7.56897 26.4282 9.85413 26.3189 11.8737 25.9634C13.0494 27.6418 14.5872 29.3332 16 29.3332C17.4127 29.3332 18.9505 27.6418 20.1263 25.9634C22.1445 26.3201 24.4296 26.4295 25.4283 25.4282C26.4283 24.4282 26.3177 22.1444 25.9635 20.1261C27.6419 18.9504 29.3333 17.4126 29.3333 15.9998ZM21.6093 14.2758L16.276 19.6092C16.1522 19.733 16.0052 19.8312 15.8435 19.8983C15.6817 19.9653 15.5083 19.9998 15.3333 19.9998C15.1582 19.9998 14.9848 19.9653 14.823 19.8983C14.6613 19.8312 14.5143 19.733 14.3905 19.6092L11.7239 16.9425C11.4765 16.6919 11.3382 16.3537 11.3393 16.0015C11.3405 15.6494 11.4808 15.312 11.7298 15.063C11.9788 14.8141 12.3162 14.6737 12.6684 14.6726C13.0205 14.6715 13.3587 14.8097 13.6093 15.0572L15.3333 16.7812L19.724 12.3905C19.9747 12.1442 20.3126 12.0069 20.6641 12.0085C21.0156 12.0101 21.3522 12.1505 21.6008 12.399C21.8493 12.6475 21.9897 12.9842 21.9913 13.3357C21.9929 13.6872 21.8556 14.0251 21.6093 14.2758Z" fill="#97F506" />
      </svg>),
      value: "2.4 M+",
      label: "Verified Users",
      color: "#97F506"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <g clipPath="url(#clip0_0_2960)">
          <path d="M30.336 12.6721L28.288 12.2881C28.032 11.5201 27.776 10.7521 27.264 9.98414L28.544 8.32014C28.928 7.80814 28.8 7.16814 28.416 6.65614L25.472 3.71214C25.088 3.32814 24.32 3.20014 23.808 3.58414L22.144 4.73614C21.376 4.35214 20.48 3.96814 19.584 3.71214L19.2 1.66414C19.072 1.02414 18.56 0.640137 17.92 0.640137H13.696C13.056 0.640137 12.544 1.15214 12.416 1.66414L12.16 3.71214C11.392 3.84014 10.496 4.22414 9.72801 4.73614L8.19201 3.58414C7.68001 3.20014 7.04001 3.20014 6.52801 3.71214L3.58401 6.65614C3.20001 7.04014 3.07201 7.80814 3.45601 8.32014L4.60801 9.85614C4.09601 10.6241 3.84001 11.5201 3.58401 12.4161L1.66401 12.6721C1.02401 12.8001 0.640015 13.3121 0.640015 13.9521V18.1761C0.640015 18.8161 1.15201 19.3281 1.66401 19.4561L3.58401 19.7121C3.84001 20.6081 4.22401 21.3761 4.60801 22.2721L3.58401 23.8081C3.20001 24.3201 3.20001 24.9601 3.71201 25.4721L6.65601 28.4161C7.04001 28.8001 7.80801 28.9281 8.32001 28.5441L9.85601 27.3921C10.624 27.7761 11.392 28.1601 12.16 28.4161L12.416 30.3361C12.544 30.9761 13.056 31.3601 13.696 31.3601H17.92C18.56 31.3601 19.072 30.8481 19.2 30.3361L19.456 28.4161C20.352 28.1601 21.12 27.7761 21.888 27.3921L23.552 28.5441C24.064 28.9281 24.832 28.8001 25.216 28.4161L28.16 25.4721C28.544 25.0881 28.672 24.3201 28.288 23.8081L27.136 22.1441C27.52 21.3761 27.904 20.6081 28.16 19.8401L30.208 19.4561C30.848 19.3281 31.232 18.8161 31.232 18.1761V13.9521C31.36 13.3121 30.848 12.8001 30.336 12.6721ZM23.424 22.0161C22.272 20.6081 20.864 19.5841 19.072 18.9441C18.816 18.8161 18.56 18.9441 18.432 18.9441C17.664 19.2001 16.896 19.4561 16.128 19.4561C15.36 19.4561 14.464 19.3281 13.824 18.9441C13.568 18.8161 13.312 18.8161 13.184 18.9441C11.392 19.5841 9.85601 20.6081 8.83202 22.0161C7.55201 20.3521 6.78401 18.3041 6.78401 16.1281C6.78401 10.8801 11.008 6.52814 16.384 6.52814C21.632 6.52814 25.856 10.7521 25.856 16.1281C25.472 18.3041 24.704 20.3521 23.424 22.0161Z" fill="#AB35FF" />
          <path d="M16 9.72803C13.824 9.72803 12.16 11.52 12.16 13.568C12.16 15.744 13.824 17.408 16 17.408C18.048 17.408 19.84 15.744 19.84 13.568C19.84 11.392 18.176 9.72803 16 9.72803Z" fill="#AB35FF" />
        </g>
        <defs>
          <clipPath id="clip0_0_2960">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>),
      value: "20 K+",
      label: "Admins",
      color: "#AB35FF"
    },
  ];

  const [action_modal, set_action_modal] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleButton = (index: number) => {
    set_action_modal(action_modal === index ? null : index);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRefs.current.every(
          (ref) => ref && !ref.contains(e.target as Node)
        )
      ) {
        set_action_modal(null);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  return (
    <div className="">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {userInfo.map((info, index) => (
          <InfoCard key={index} labelClass='justify-center md:justify-between' icon={info.icon} value={info.value} label={info.label} color={info.color} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-between my-6 pb-0.5">
        <Input type='search' placeholder='Search' className='max-w-[180px] md:min-w-[340px]' />
        <Dropdown btnClass='md:min-w-[190px] h-12' placeholder="All Rarities" items={[{ name: 'All Rarities' }, { name: 'Active' }, { name: 'Banned' }]} leftIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 15H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        } />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left font-satoshi">
          <thead className="bg-white/8 text-[#8B8898] text-xs">
            <tr>
              <th className="px-6 text-nowrap py-4 font-medium">User</th>
              <th className="px-6 text-nowrap py-4 font-medium">Status</th>
              <th className="px-6 text-nowrap py-4 font-medium">Balance</th>
              <th className="px-6 text-nowrap py-4 font-medium">Cases Opened</th>
              <th className="px-6 text-nowrap py-4 font-medium">Total Spend</th>
              <th className="px-6 text-nowrap py-4 font-medium">Last Login</th>
              <th className="px-6 text-nowrap py-4 font-medium">Active</th>
            </tr>
          </thead>
          <tbody className="">
            {users.map((user, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-[#1E202C]/8' : 'bg-white/6'} transition-all duration-500 `}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <span className="size-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: user.avatarColor }}>
                    {user.name.substring(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <div className="font-semibold text-base text-white flex items-center gap-2">{user.name}
                      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8334 6.96309V7.49976C12.8326 8.75767 12.4253 9.98165 11.6721 10.9892C10.919 11.9967 9.86027 12.7337 8.65398 13.0904C7.44769 13.447 6.15842 13.4042 4.97846 12.9683C3.7985 12.5323 2.79107 11.7266 2.10641 10.6714C1.42176 9.61611 1.09657 8.3678 1.17933 7.11261C1.2621 5.85742 1.74839 4.66262 2.56568 3.70638C3.38298 2.75015 4.48748 2.08373 5.71446 1.80651C6.94145 1.52929 8.22518 1.65612 9.37419 2.16809" stroke="#39FF67" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.8333 2.8335L7 8.67266L5.25 6.92266" stroke="#39FF67" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-xs text-[#BFC0D8]/60">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1 rounded-full min-h-[33px] inline-flex items-center gap-1 ${user.status === 'Active' ? 'bg-[#39FF67]/10 text-[#39FF67]' : 'bg-[#FF3063]/10 text-[#FF3063]'}`}>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.2857 13.6429V12.5001C10.2857 11.8939 10.0289 11.3125 9.57164 10.8838C9.11441 10.4552 8.49427 10.2144 7.84764 10.2144H3.58098C2.93436 10.2144 2.31422 10.4552 1.85698 10.8838C1.39975 11.3125 1.14288 11.8939 1.14288 12.5001V13.6429" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.7143 7.92836C6.97667 7.92836 8.00002 6.90501 8.00002 5.64265C8.00002 4.38028 6.97667 3.35693 5.7143 3.35693C4.45194 3.35693 3.42859 4.38028 3.42859 5.64265C3.42859 6.90501 4.45194 7.92836 5.7143 7.92836Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11.4286 7.9285L12.5714 9.07136L14.8572 6.78564" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-white font-medium">${user.balance.toFixed(2)}</td>
                <td className="px-6 py-4 text-white">{user.casesOpened}</td>
                <td className="px-6 py-4 text-[#FF8809] font-semibold">${user.totalSpend.toFixed(2)}</td>
                <td className="px-6 py-4">{user.lastLogin}</td>
                <td className="px-6 py-4">
                    <div ref={(el) => { dropdownRefs.current[index] = el; }} className="relative z-1">
                    <button onClick={() => toggleButton(index)} className={`hover:bg-white/10 backdrop:blur-[1px] text-white size-10 flex items-center justify-center rounded-2xl ${index === action_modal ? 'bg-white/10' : ''}`}>
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99996 11.3332C10.4602 11.3332 10.8333 10.9601 10.8333 10.4998C10.8333 10.0396 10.4602 9.6665 9.99996 9.6665C9.53972 9.6665 9.16663 10.0396 9.16663 10.4998C9.16663 10.9601 9.53972 11.3332 9.99996 11.3332Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.99996 5.50016C10.4602 5.50016 10.8333 5.12707 10.8333 4.66683C10.8333 4.20659 10.4602 3.8335 9.99996 3.8335C9.53972 3.8335 9.16663 4.20659 9.16663 4.66683C9.16663 5.12707 9.53972 5.50016 9.99996 5.50016Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.99996 17.1667C10.4602 17.1667 10.8333 16.7936 10.8333 16.3333C10.8333 15.8731 10.4602 15.5 9.99996 15.5C9.53972 15.5 9.16663 15.8731 9.16663 16.3333C9.16663 16.7936 9.53972 17.1667 9.99996 17.1667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <ActionModal className={`${index === action_modal ? 'opacity-100 visible scale-100 translate-x-2' : 'opacity-0 invisible scale-95 translate-x-0'} ${index === users.length - 1 ? 'top-auto bottom-0' : ''}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}