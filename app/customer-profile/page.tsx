import React from 'react'
import InfoCard from '@/app/components/dashboard/InfoCard'
import { caseInfoItem } from '@/app/utilities/Types';
import PageContainer from '../components/PageContainer';


type Props = {}

type CollectionItem = {
  icon: React.ReactNode;
  title: string;
  des: string;
  price: string;
  date: string;
  color: string;
};

type AchievementsItem = {
  icon: React.ReactNode;
  title: string;
  des: string;
  progress: number; // 0-100
  color: string;
};

export default function page({ }: Props) {
  const casesInfo: caseInfoItem[] = [
    {
      icon: (<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="12.5" stroke="#97F506" strokeWidth="1.5" />
        <path d="M15 21.25V21.875V22.5" stroke="#97F506" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 7.5V8.125V8.75" stroke="#97F506" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18.75 11.875C18.75 10.1491 17.0711 8.75 15 8.75C12.9289 8.75 11.25 10.1491 11.25 11.875C11.25 13.6009 12.9289 15 15 15C17.0711 15 18.75 16.3991 18.75 18.125C18.75 19.8509 17.0711 21.25 15 21.25C12.9289 21.25 11.25 19.8509 11.25 18.125" stroke="#97F506" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      ),
      value: "$0.06",
      label: "Portfolio Value",
      color: "#97F506"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M4.17482 21.2496C7.6266 27.2283 15.2715 29.2767 21.2501 25.825C23.6871 24.418 25.4711 22.3143 26.4958 19.9107C27.9849 16.4176 27.8702 12.2913 25.8255 8.74965C23.7807 5.208 20.2645 3.04552 16.4949 2.5886C13.901 2.27419 11.1871 2.76732 8.75013 4.17433C2.77148 7.62611 0.723037 15.271 4.17482 21.2496Z" stroke="#24E9FF" strokeWidth="1.5" />
        <path d="M19.375 17.8125C19.375 18.6754 18.6754 19.375 17.8125 19.375C16.9496 19.375 16.25 18.6754 16.25 17.8125C16.25 16.9496 16.9496 16.25 17.8125 16.25C18.6754 16.25 19.375 16.9496 19.375 17.8125Z" stroke="#24E9FF" />
        <path d="M19.375 12.1875C19.375 13.0504 18.6754 13.75 17.8125 13.75C16.9496 13.75 16.25 13.0504 16.25 12.1875C16.25 11.3246 16.9496 10.625 17.8125 10.625C18.6754 10.625 19.375 11.3246 19.375 12.1875Z" stroke="#24E9FF" />
        <path d="M13.75 17.8125C13.75 18.6754 13.0504 19.375 12.1875 19.375C11.3246 19.375 10.625 18.6754 10.625 17.8125C10.625 16.9496 11.3246 16.25 12.1875 16.25C13.0504 16.25 13.75 16.9496 13.75 17.8125Z" stroke="#24E9FF" />
        <path d="M13.75 12.1875C13.75 13.0504 13.0504 13.75 12.1875 13.75C11.3246 13.75 10.625 13.0504 10.625 12.1875C10.625 11.3246 11.3246 10.625 12.1875 10.625C13.0504 10.625 13.75 11.3246 13.75 12.1875Z" stroke="#24E9FF" />
        <path d="M18.75 22.8125C18.75 23.3303 18.3303 23.75 17.8125 23.75C17.2947 23.75 16.875 23.3303 16.875 22.8125C16.875 22.2947 17.2947 21.875 17.8125 21.875C18.3303 21.875 18.75 22.2947 18.75 22.8125Z" fill="#24E9FF" />
        <path d="M13.125 22.8125C13.125 23.3303 12.7053 23.75 12.1875 23.75C11.6697 23.75 11.25 23.3303 11.25 22.8125C11.25 22.2947 11.6697 21.875 12.1875 21.875C12.7053 21.875 13.125 22.2947 13.125 22.8125Z" fill="#24E9FF" />
        <path d="M18.75 22.8125C18.75 23.3303 18.3303 23.75 17.8125 23.75C17.2947 23.75 16.875 23.3303 16.875 22.8125C16.875 22.2947 17.2947 21.875 17.8125 21.875C18.3303 21.875 18.75 22.2947 18.75 22.8125Z" fill="#24E9FF" />
        <path d="M18.75 7.1875C18.75 7.70527 18.3303 8.125 17.8125 8.125C17.2947 8.125 16.875 7.70527 16.875 7.1875C16.875 6.66973 17.2947 6.25 17.8125 6.25C18.3303 6.25 18.75 6.66973 18.75 7.1875Z" fill="#24E9FF" />
        <path d="M13.125 22.8125C13.125 23.3303 12.7053 23.75 12.1875 23.75C11.6697 23.75 11.25 23.3303 11.25 22.8125C11.25 22.2947 11.6697 21.875 12.1875 21.875C12.7053 21.875 13.125 22.2947 13.125 22.8125Z" fill="#24E9FF" />
        <path d="M13.125 7.1875C13.125 7.70527 12.7053 8.125 12.1875 8.125C11.6697 8.125 11.25 7.70527 11.25 7.1875C11.25 6.66973 11.6697 6.25 12.1875 6.25C12.7053 6.25 13.125 6.66973 13.125 7.1875Z" fill="#24E9FF" />
        <path d="M22.8125 11.25C23.3303 11.25 23.75 11.6697 23.75 12.1875C23.75 12.7053 23.3303 13.125 22.8125 13.125C22.2947 13.125 21.875 12.7053 21.875 12.1875C21.875 11.6697 22.2947 11.25 22.8125 11.25Z" fill="#24E9FF" />
        <path d="M7.1875 11.25C7.70527 11.25 8.125 11.6697 8.125 12.1875C8.125 12.7053 7.70527 13.125 7.1875 13.125C6.66973 13.125 6.25 12.7053 6.25 12.1875C6.25 11.6697 6.66973 11.25 7.1875 11.25Z" fill="#24E9FF" />
        <path d="M22.8125 16.875C23.3303 16.875 23.75 17.2947 23.75 17.8125C23.75 18.3303 23.3303 18.75 22.8125 18.75C22.2947 18.75 21.875 18.3303 21.875 17.8125C21.875 17.2947 22.2947 16.875 22.8125 16.875Z" fill="#24E9FF" />
        <path d="M7.1875 16.875C7.70527 16.875 8.125 17.2947 8.125 17.8125C8.125 18.3303 7.70527 18.75 7.1875 18.75C6.66973 18.75 6.25 18.3303 6.25 17.8125C6.25 17.2947 6.66973 16.875 7.1875 16.875Z" fill="#24E9FF" />
      </svg>),
      value: "02",
      label: "Cases Opened",
      color: "#24E9FF"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M13.9324 8.77814C14.4074 7.92605 14.6449 7.5 15 7.5C15.3551 7.5 15.5926 7.92605 16.0676 8.77814L16.1904 8.99859C16.3254 9.24073 16.3929 9.36179 16.4981 9.44168C16.6034 9.52156 16.7344 9.55121 16.9965 9.61052L17.2352 9.66451C18.1576 9.87321 18.6187 9.97756 18.7285 10.3304C18.8382 10.6832 18.5238 11.0509 17.895 11.7862L17.7323 11.9765C17.5536 12.1854 17.4642 12.2899 17.4241 12.4191C17.3839 12.5484 17.3974 12.6878 17.4244 12.9666L17.449 13.2204C17.544 14.2015 17.5916 14.692 17.3043 14.9101C17.0171 15.1282 16.5852 14.9293 15.7216 14.5317L15.4982 14.4288C15.2528 14.3158 15.1301 14.2593 15 14.2593C14.8699 14.2593 14.7472 14.3158 14.5018 14.4288L14.2784 14.5317C13.4148 14.9293 12.9829 15.1282 12.6957 14.9101C12.4084 14.692 12.456 14.2015 12.551 13.2204L12.5756 12.9666C12.6026 12.6878 12.6161 12.5484 12.5759 12.4191C12.5358 12.2899 12.4464 12.1854 12.2677 11.9765L12.105 11.7862C11.4762 11.0509 11.1618 10.6832 11.2715 10.3304C11.3813 9.97756 11.8424 9.87321 12.7648 9.66451L13.0035 9.61052C13.2656 9.55121 13.3966 9.52156 13.5019 9.44168C13.6071 9.36179 13.6746 9.24073 13.8096 8.99859L13.9324 8.77814Z" stroke="#FF8809" strokeWidth="1.5" />
        <path d="M23.75 11.25C23.75 16.0825 19.8325 20 15 20C10.1675 20 6.25 16.0825 6.25 11.25C6.25 6.41751 10.1675 2.5 15 2.5C19.8325 2.5 23.75 6.41751 23.75 11.25Z" stroke="#FF8809" strokeWidth="1.5" />
        <path d="M15 20.0848L10.2857 24.966C9.61054 25.6651 9.27296 26.0146 8.98708 26.1355C8.33565 26.4112 7.61303 26.1753 7.27034 25.5752C7.11996 25.3118 7.0731 24.8368 6.97938 23.8868C6.92646 23.3504 6.9 23.0822 6.81969 22.8576C6.63989 22.3547 6.26207 21.9635 5.77638 21.7774C5.55943 21.6942 5.30041 21.6668 4.78236 21.612C3.86484 21.515 3.40607 21.4665 3.15173 21.3108C2.57215 20.9559 2.34435 20.2077 2.61054 19.5332C2.72735 19.2372 3.06492 18.8877 3.74007 18.1887L6.81969 15" stroke="#FF8809" strokeWidth="1.5" />
        <path d="M15 20.0848L19.7143 24.966C20.3895 25.6651 20.727 26.0146 21.0129 26.1355C21.6644 26.4112 22.387 26.1753 22.7297 25.5752C22.88 25.3118 22.9269 24.8368 23.0206 23.8868C23.0735 23.3504 23.1 23.0822 23.1803 22.8576C23.3601 22.3547 23.7379 21.9635 24.2236 21.7774C24.4406 21.6942 24.6996 21.6668 25.2176 21.612C26.1352 21.515 26.5939 21.4665 26.8483 21.3108C27.4279 20.9559 27.6557 20.2077 27.3895 19.5332C27.2726 19.2372 26.9351 18.8877 26.2599 18.1887L23.1803 15" stroke="#FF8809" strokeWidth="1.5" />
      </svg>),
      value: "62",
      label: "Current Level",
      color: "#FF8809"
    }];

  const recentActivity: CollectionItem[] = [
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15.5777 3.38197L17.5777 4.43152C19.7294 5.56066 20.8052 6.12523 21.4026 7.13974C22 8.15425 22 9.41667 22 11.9415V12.0585C22 14.5833 22 15.8458 21.4026 16.8603C20.8052 17.8748 19.7294 18.4393 17.5777 19.5685L15.5777 20.618C13.8221 21.5393 12.9443 22 12 22C11.0557 22 10.1779 21.5393 8.42229 20.618L6.42229 19.5685C4.27063 18.4393 3.19479 17.8748 2.5974 16.8603C2 15.8458 2 14.5833 2 12.0585V11.9415C2 9.41667 2 8.15425 2.5974 7.13974C3.19479 6.12523 4.27063 5.56066 6.42229 4.43152L8.42229 3.38197C10.1779 2.46066 11.0557 2 12 2C12.9443 2 13.8221 2.46066 15.5777 3.38197Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>),
      title: "Opened Spectrum Case",
      des: 'Racetved AK:47| Redine',
      price: "9.4 USD",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#FF8809',
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6" stroke="#39FF67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6H18V18" stroke="#39FF67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: "Sold Item ",
      des: 'M4A4| Redine',
      price: "+5.5 USD",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#39FF67',
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6" stroke="#39FF67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6H18V18" stroke="#39FF67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: "Account Deposit",
      des: 'Racetved AK:47| Redine',
      price: "999",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#39FF67',
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 12H2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 16H6.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 16H10.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: "Opened Chroma Case",
      des: 'Racetved AK:47| Redine',
      price: "15.0 USD",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#FF8809',
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
        <path d="M12 17V17.5V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 6V6.5V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>),
      title: "Opened Spectrum Case",
      des: 'Racetved AK:47| Redine',
      price: "+14.8 USD",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#39FF67',
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18" stroke="#FF3063" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 18H6V6" stroke="#FF3063" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: "Opened Spectrum Case",
      des: 'Racetved AK:47| Redine',
      price: "-10.2 USD",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#FF3063',
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 16V9H19V2H5L19 16H12M5 16L12 23V16M5 16H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: "Opened Spectrum Case",
      des: 'Racetved AK:47| Redine',
      price: "+20.0 USD",
      date: '27 Aug 2025 | 01:30 PM',
      color: '#39FF67',
    },
  ];

  const achievements: AchievementsItem[] = [
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 12V22H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: 'First Steps',
      des: 'Open your first Case',
      progress: 50,
      color: '#D418FF'
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_289_6538)">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_289_6538">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>),
      title: 'Case Collector',
      des: 'Open your first Case',
      progress: 70,
      color: '#FF295F'
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M12.3262 2.2666L2.32617 7.2666L12.3262 12.2666L22.3262 7.2666L12.3262 2.2666Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.32617 17.2666L12.3262 22.2666L22.3262 17.2666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.32617 12.2666L12.3262 17.2666L22.3262 12.2666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: 'Open Case',
      des: 'Open your first Case',
      progress: 10,
      color: '#39FF67'
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 21V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 10V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 21V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 14H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 8H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 16H23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: 'First Steps',
      des: 'Open your first Case',
      progress: 40,
      color: '#8640FF'
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 12V22H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>),
      title: 'Open Case',
      des: 'Open your first Case',
      progress: 60,
      color: '#FF8809'
    }
  ]

  return (
    <PageContainer className='max-w-380' >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        <div className="md:col-span-2">
          <div className="relative z-1 overflow-hidden flex items-center justify-between gap-5 rounded-[20px] p-4 md:p-5 lg:p-6 md:!pr-16.5 bg-[#66697C]/5 border border-white/8">
            <div className="">
              <div className="size-12 rounded-full overflow-hidden">
                <img src="./img/profile/logo.png" alt="" />
              </div>
              <h4 className='text-lg md:text-xl lg:text-2xl my-1 md:my-2'>Johan Smith</h4>
              <div className="flex items-center gap-2 md:gap-4">
                <svg className='max-w-4 md:max-w-5' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.66675 10.0002C1.66675 6.85747 1.66675 5.28612 2.64306 4.30981C3.61937 3.3335 5.19072 3.3335 8.33342 3.3335H11.6667C14.8094 3.3335 16.3808 3.3335 17.3571 4.30981C18.3334 5.28612 18.3334 6.85747 18.3334 10.0002V11.6668C18.3334 14.8095 18.3334 16.3809 17.3571 17.3572C16.3808 18.3335 14.8094 18.3335 11.6667 18.3335H8.33341C5.19072 18.3335 3.61937 18.3335 2.64306 17.3572C1.66675 16.3809 1.66675 14.8095 1.66675 11.6668V10.0002Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
                  <path d="M5.83325 3.3335V2.0835" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14.1667 3.3335V2.0835" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M2.08325 7.5H17.9166" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14.9999 14.1667C14.9999 14.6269 14.6268 15 14.1666 15C13.7063 15 13.3333 14.6269 13.3333 14.1667C13.3333 13.7064 13.7063 13.3333 14.1666 13.3333C14.6268 13.3333 14.9999 13.7064 14.9999 14.1667Z" fill="white" fillOpacity="0.5" />
                  <path d="M14.9999 10.8333C14.9999 11.2936 14.6268 11.6667 14.1666 11.6667C13.7063 11.6667 13.3333 11.2936 13.3333 10.8333C13.3333 10.3731 13.7063 10 14.1666 10C14.6268 10 14.9999 10.3731 14.9999 10.8333Z" fill="white" fillOpacity="0.5" />
                  <path d="M10.8334 14.1667C10.8334 14.6269 10.4603 15 10.0001 15C9.53984 15 9.16675 14.6269 9.16675 14.1667C9.16675 13.7064 9.53984 13.3333 10.0001 13.3333C10.4603 13.3333 10.8334 13.7064 10.8334 14.1667Z" fill="white" fillOpacity="0.5" />
                  <path d="M10.8334 10.8333C10.8334 11.2936 10.4603 11.6667 10.0001 11.6667C9.53984 11.6667 9.16675 11.2936 9.16675 10.8333C9.16675 10.3731 9.53984 10 10.0001 10C10.4603 10 10.8334 10.3731 10.8334 10.8333Z" fill="white" fillOpacity="0.5" />
                  <path d="M6.66667 14.1667C6.66667 14.6269 6.29357 15 5.83333 15C5.3731 15 5 14.6269 5 14.1667C5 13.7064 5.3731 13.3333 5.83333 13.3333C6.29357 13.3333 6.66667 13.7064 6.66667 14.1667Z" fill="white" fillOpacity="0.5" />
                  <path d="M6.66667 10.8333C6.66667 11.2936 6.29357 11.6667 5.83333 11.6667C5.3731 11.6667 5 11.2936 5 10.8333C5 10.3731 5.3731 10 5.83333 10C6.29357 10 6.66667 10.3731 6.66667 10.8333Z" fill="white" fillOpacity="0.5" />
                </svg>
                <span className='text-xs md:text-sm'>Join - 02 / 08 / 2022</span>
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="">
                <p className='text-base lg:text-lg xl:text-xl text-white mb-1.5 font-bold !leading-[1]'>997.50 USD</p>
                <p className='text-sm text-white/50 font-normal !leading-[120%]'>Account Balance</p>
              </div>
              <div className="">
                <p className='text-base lg:text-lg xl:text-xl text-[#39FF67] mb-1.5 font-bold !leading-[1]'>0.06 CC</p>
                <p className='text-sm text-white/50 font-normal !leading-[120%]'>Clean Coin</p>
              </div>
            </div>
            <div className='absolute -z-1 -bottom-20 -left-20 w-81 h-49 rounded-[100%] bg-[linear-gradient(159deg,#FCC811_20.64%,#F85D36_48.42%,#EF5180_63.84%,#4B71FF_92.19%,#34DDFF_106.02%)] blur-[107px] pointer-events-none' />
            <div className='absolute -z-1 -top-11 -right-16 w-81 h-49 rounded-[100%] bg-[linear-gradient(255deg,#FCC811_-7.98%,#F85D36_18.12%,#EF5180_32.61%,#4B71FF_59.25%,#34DDFF_72.25%)] blur-[107px] pointer-events-none' />
          </div>
          <h4 className='text-lg md:text-xl lg:text-2xl my-3 md:my-5 pt-1'>Statistics Overview</h4>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {casesInfo.map((info, index) => (
              <InfoCard key={index} labelClass='justify-center md:justify-between' icon={info.icon} value={info.value} label={info.label} color={info.color} />
            ))}
          </div>
          <h4 className='text-lg md:text-xl lg:text-2xl my-5 pt-1'>Recent Activity</h4>
          <div className="xl:max-h-[calc(100vh-580px)] overflow-y-auto">
            <div className="w-max min-w-full">
              {recentActivity.map((item, index) => (
                <div key={index} className='flex items-center justify-between gap-6 border-y border-white/8 py-3'>
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="size-11 p-3 md:p-0 md:size-12.5 rounded-2xl flex items-center justify-center bg-[#66697C]/10 backdrop-blur-[1px]">
                      {item.icon}
                    </div>
                    <div className="">
                      <h5 className='text-sm md:text-base text-white font-bold !leading-[1] mb-1 md:mb-2'>{item.title} </h5>
                      <p className='text-xs md:text-sm text-white/50 font-medium '>{item.des} </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className='text-base lg:text-lg mb-2.5 font-medium !leading-[1]' style={{ color: item.color }}>{item.price} </p>
                    <p className='text-xs text-white/50 font-normal !leading-[120%]'>{item.date} </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className='text-lg lg:text-xl xl:text-2xl'>Achievements</h4>
            <span className='font-light block'>2/8 Completed</span>
          </div>
          <div className="flex flex-col gap-3 xl:max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className='bg-[#66697c]/5 border border-white/8 rounded-[20px] p-4 lg:p-5 xl:p-6'>
              <div className="flex items-center justify-between pb-4 border-b border-white/8">
                <h5 className='text-base text-white font-bold !leading-[1] mb-2'>Achievements</h5>
                <p>100%</p>
              </div>
              <div className="mt-4">
                <p className='text-right text-xs text-white font-medium !leading-[1] mb-3'>30%</p>
                <div className="w-full h-3 lg:h-4 xl:h-5 rounded-[22px] bg-white/8 relative z-1">
                  <div className='absolute top-0 left-0 rounded-[22px] h-full z-2' style={{ width: `30%`, backgroundColor: "#35CBCD" }} />
                </div>
              </div>
            </div>
            {achievements.map((item, index) => (
              <div className='bg-[#66697c]/5 border border-white/8 rounded-[20px] p-4 lg:p-5 xl:p-6' key={index}>
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className="size-11.5 p-3 md:p-0 md:size-12.5 rounded-2xl flex items-center justify-center bg-[#66697C]/10 backdrop-blur-[1px]">
                    {item.icon}
                  </div>
                  <div className="">
                    <h5 className='text-base text-white font-bold !leading-[1] mb-2'>{item.title} </h5>
                    <p className='text-sm text-white/50 font-medium '>{item.des} </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className='text-right text-xs text-white font-medium !leading-[1] mb-3'>{item.progress}%</p>
                  <div className="w-full h-3 lg:h-4 xl:h-5 rounded-[22px] bg-white/8 relative z-1">
                    <div className='absolute top-0 left-0 rounded-[22px] h-full z-2' style={{ width: `${item.progress}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}