"use client";
import React, { JSX, useState } from "react";
import Account from "@/app/deposit/componets/Account";
// import Steam from "@/app/deposit/componets/Steam";
// import History from "@/app/deposit/componets/History";

interface AccountItem {
  name?: string;
  icon?: JSX.Element | string;
}

export default function AccountItem({}: {}) {
  // ---- ACCOUNT TABS CONFIGURATION ----
  const accountItems: AccountItem[] = [
    {
      name: "Steam Account",
      icon: (
        <svg
          className="hidden md:block"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 10.8333C9.35788 11.3118 9.81446 11.7076 10.3388 11.9941C10.8631 12.2806 11.4429 12.4509 12.0389 12.4936C12.6348 12.5363 13.233 12.4503 13.7928 12.2415C14.3526 12.0327 14.8609 11.7059 15.2833 11.2833L17.7833 8.78333C18.5423 7.99749 18.9623 6.94498 18.9528 5.85249C18.9433 4.76 18.5051 3.71495 17.7326 2.94242C16.96 2.16989 15.915 1.73168 14.8225 1.72219C13.73 1.71269 12.6775 2.13267 11.8917 2.89166L10.4583 4.31666"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.3338 9.16667C11.9759 8.68823 11.5194 8.29235 10.995 8.00588C10.4707 7.71942 9.8909 7.54907 9.29495 7.50639C8.699 7.46371 8.10084 7.54969 7.54104 7.75851C6.98124 7.96734 6.4729 8.29411 6.05049 8.71667L3.55049 11.2167C2.7915 12.0025 2.37152 13.055 2.38102 14.1475C2.39051 15.24 2.82871 16.285 3.60125 17.0576C4.37378 17.8301 5.41883 18.2683 6.51132 18.2778C7.60381 18.2873 8.65632 17.8673 9.44216 17.1083L10.8672 15.6833"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Withdraw Items",
      icon: (
        <svg
          className="hidden md:block"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.55806 14.5581C4.31398 14.8021 4.31398 15.1979 4.55806 15.4419C4.80214 15.686 5.19786 15.686 5.44194 15.4419L11.25 9.63388L14.5581 12.9419C14.7368 13.1207 15.0056 13.1742 15.2392 13.0774C15.4727 12.9807 15.625 12.7528 15.625 12.5V5C15.625 4.65482 15.3452 4.375 15 4.375L7.5 4.375C7.24721 4.375 7.01931 4.52728 6.92258 4.76082C6.82584 4.99437 6.87931 5.26319 7.05806 5.44194L10.3661 8.75L4.55806 14.5581Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: "Withdrawal History",
      icon: (
        <svg
          className="hidden md:block"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.834 6.66667V10L12.9173 12.0833"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5041 4.67019L4.97377 4.13986L4.97377 4.13986L5.5041 4.67019ZM4.44879 5.72551L3.69879 5.72928C3.70086 6.14055 4.03375 6.47343 4.44502 6.4755L4.44879 5.72551ZM6.56631 6.48616C6.98052 6.48824 7.31799 6.15415 7.32007 5.73994C7.32215 5.32573 6.98806 4.98826 6.57385 4.98618L6.57008 5.73617L6.56631 6.48616ZM5.18812 3.60045C5.18603 3.18624 4.84856 2.85215 4.43436 2.85423C4.02015 2.85631 3.68605 3.19378 3.68813 3.60799L4.43812 3.60422L5.18812 3.60045ZM4.14667 9.00448C4.20292 8.59411 3.91584 8.21583 3.50546 8.15958C3.09509 8.10333 2.71681 8.39041 2.66056 8.80079L3.40361 8.90263L4.14667 9.00448ZM16.1106 4.72349L16.6409 4.19316C13.4094 0.961694 8.18585 0.92778 4.97377 4.13986L5.5041 4.67019L6.03443 5.20052C8.6507 2.58425 12.9245 2.59807 15.5802 5.25382L16.1106 4.72349ZM5.5574 15.2767L5.02707 15.807C8.25854 19.0385 13.4821 19.0724 16.6942 15.8603L16.1639 15.33L15.6335 14.7996C13.0173 17.4159 8.74349 17.4021 6.08773 14.7463L5.5574 15.2767ZM16.1639 15.33L16.6942 15.8603C19.9063 12.6482 19.8724 7.42463 16.6409 4.19316L16.1106 4.72349L15.5802 5.25382C18.236 7.90958 18.2498 12.1834 15.6335 14.7996L16.1639 15.33ZM5.5041 4.67019L4.97377 4.13986L3.91845 5.19518L4.44879 5.72551L4.97912 6.25584L6.03443 5.20052L5.5041 4.67019ZM4.44879 5.72551L4.44502 6.4755L6.56631 6.48616L6.57008 5.73617L6.57385 4.98618L4.45255 4.97552L4.44879 5.72551ZM4.44879 5.72551L5.19878 5.72174L5.18812 3.60045L4.43812 3.60422L3.68813 3.60799L3.69879 5.72928L4.44879 5.72551ZM3.40361 8.90263L2.66056 8.80079C2.32091 11.2787 3.11192 13.8918 5.02707 15.807L5.5574 15.2767L6.08773 14.7463C4.51586 13.1745 3.86848 11.034 4.14667 9.00448L3.40361 8.90263Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  const [activeAccount, setActiveAccount] = useState(accountItems[0]);

  return (
    <div className="max-w-90 md:max-w-174 lg:max-w-201 mx-auto mt-6">
      <h4 className="text-2xl !leading-[130%] mb-4">Steam Integration</h4>

      {/* ---- TAB BUTTONS ---- */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-1.25 p-1 bg-[#1E202C] rounded-xl md:rounded-2xl overflow-auto w-full">
          {accountItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveAccount(item)}
              className={`text-nowrap px-3 md:px-9.5 lg:px-14 min-h-9 md:min-h-11.5 lg:min-h-12.5 flex items-center justify-center gap-2 capitalize text-xs md:text-base font-medium rounded-lg md:rounded-xl hover:text-white ${
                activeAccount.name === item.name
                  ? "bg-white/10 text-white"
                  : "bg-transparent text-[#6F7083]"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>

        {/* ---- CONTENT SECTION ---- */}
        <div className="rounded-[20px] bg-white/[6%] border border-solid border-white/15 w-full p-4 md:p-6 h-full flex items-center justify-center text-center">
          {activeAccount?.name === "Steam Account" &&<p className="text-[#BFC0D8] text-base md:text-lg font-medium">
              Steam Account feature coming soon!
            </p>}

          {/* 🚧 Coming Soon Messages for other sections */}
          {activeAccount?.name === "Withdraw Items" && (
            <p className="text-[#BFC0D8] text-base md:text-lg font-medium">
              💬 Withdraw Items feature coming soon!
            </p>
          )}
          {activeAccount?.name === "Withdrawal History" && (
            <p className="text-[#BFC0D8] text-base md:text-lg font-medium">
              📜 Withdrawal History feature coming soon!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
// "use client"
// import React, { JSX, useState } from 'react'
// import Account from '@/app/deposit/componets/Account'
// import Steam from '@/app/deposit/componets/Steam'
// import History from '@/app/deposit/componets/History'

// interface AccountItem {
//   name?: string;
//   icon?: JSX.Element | string;
// }
// type Props = {}

// export default function AccountItem({ }: Props) {
//   const accountItems: AccountItem[] = [
//     {
//       name: 'Steam Account',
//       icon: (<svg className='hidden md:block' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M9 10.8333C9.35788 11.3118 9.81446 11.7076 10.3388 11.9941C10.8631 12.2806 11.4429 12.4509 12.0389 12.4936C12.6348 12.5363 13.233 12.4503 13.7928 12.2415C14.3526 12.0327 14.8609 11.7059 15.2833 11.2833L17.7833 8.78333C18.5423 7.99749 18.9623 6.94498 18.9528 5.85249C18.9433 4.76 18.5051 3.71495 17.7326 2.94242C16.96 2.16989 15.915 1.73168 14.8225 1.72219C13.73 1.71269 12.6775 2.13267 11.8917 2.89166L10.4583 4.31666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M12.3338 9.16667C11.9759 8.68823 11.5194 8.29235 10.995 8.00588C10.4707 7.71942 9.8909 7.54907 9.29495 7.50639C8.699 7.46371 8.10084 7.54969 7.54104 7.75851C6.98124 7.96734 6.4729 8.29411 6.05049 8.71667L3.55049 11.2167C2.7915 12.0025 2.37152 13.055 2.38102 14.1475C2.39051 15.24 2.82871 16.285 3.60125 17.0576C4.37378 17.8301 5.41883 18.2683 6.51132 18.2778C7.60381 18.2873 8.65632 17.8673 9.44216 17.1083L10.8672 15.6833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>),
//     },
//     {
//       name: 'Withdraw Items',
//       icon: (<svg className='hidden md:block' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M4.55806 14.5581C4.31398 14.8021 4.31398 15.1979 4.55806 15.4419C4.80214 15.686 5.19786 15.686 5.44194 15.4419L11.25 9.63388L14.5581 12.9419C14.7368 13.1207 15.0056 13.1742 15.2392 13.0774C15.4727 12.9807 15.625 12.7528 15.625 12.5V5C15.625 4.65482 15.3452 4.375 15 4.375L7.5 4.375C7.24721 4.375 7.01931 4.52728 6.92258 4.76082C6.82584 4.99437 6.87931 5.26319 7.05806 5.44194L10.3661 8.75L4.55806 14.5581Z" fill="currentColor" />
//       </svg>),
//     },
//     {
//       name: 'Withdrawal History',
//       icon: (<svg className='hidden md:block' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M10.834 6.66667V10L12.9173 12.0833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M5.5041 4.67019L4.97377 4.13986L4.97377 4.13986L5.5041 4.67019ZM4.44879 5.72551L3.69879 5.72928C3.70086 6.14055 4.03375 6.47343 4.44502 6.4755L4.44879 5.72551ZM6.56631 6.48616C6.98052 6.48824 7.31799 6.15415 7.32007 5.73994C7.32215 5.32573 6.98806 4.98826 6.57385 4.98618L6.57008 5.73617L6.56631 6.48616ZM5.18812 3.60045C5.18603 3.18624 4.84856 2.85215 4.43436 2.85423C4.02015 2.85631 3.68605 3.19378 3.68813 3.60799L4.43812 3.60422L5.18812 3.60045ZM4.14667 9.00448C4.20292 8.59411 3.91584 8.21583 3.50546 8.15958C3.09509 8.10333 2.71681 8.39041 2.66056 8.80079L3.40361 8.90263L4.14667 9.00448ZM16.1106 4.72349L16.6409 4.19316C13.4094 0.961694 8.18585 0.92778 4.97377 4.13986L5.5041 4.67019L6.03443 5.20052C8.6507 2.58425 12.9245 2.59807 15.5802 5.25382L16.1106 4.72349ZM5.5574 15.2767L5.02707 15.807C8.25854 19.0385 13.4821 19.0724 16.6942 15.8603L16.1639 15.33L15.6335 14.7996C13.0173 17.4159 8.74349 17.4021 6.08773 14.7463L5.5574 15.2767ZM16.1639 15.33L16.6942 15.8603C19.9063 12.6482 19.8724 7.42463 16.6409 4.19316L16.1106 4.72349L15.5802 5.25382C18.236 7.90958 18.2498 12.1834 15.6335 14.7996L16.1639 15.33ZM5.5041 4.67019L4.97377 4.13986L3.91845 5.19518L4.44879 5.72551L4.97912 6.25584L6.03443 5.20052L5.5041 4.67019ZM4.44879 5.72551L4.44502 6.4755L6.56631 6.48616L6.57008 5.73617L6.57385 4.98618L4.45255 4.97552L4.44879 5.72551ZM4.44879 5.72551L5.19878 5.72174L5.18812 3.60045L4.43812 3.60422L3.68813 3.60799L3.69879 5.72928L4.44879 5.72551ZM3.40361 8.90263L2.66056 8.80079C2.32091 11.2787 3.11192 13.8918 5.02707 15.807L5.5574 15.2767L6.08773 14.7463C4.51586 13.1745 3.86848 11.034 4.14667 9.00448L3.40361 8.90263Z" fill="currentColor" />
//       </svg>),
//     },
//   ]
//   const [activeAccount, setActiveAccount] = useState(accountItems[0]);

//   return (
//     <div className="max-w-90 md:max-w-174 lg:max-w-201 mx-auto mt-6">
//       <h4 className='text-2xl !leading-[130%] mb-4'>Steam Integration</h4>
//       <div className="flex flex-wrap gap-6">
//         <div className="flex items-center gap-1.25 p-1 bg-[#1E202C] rounded-xl md:rounded-2xl overflow-auto w-full">
//           {accountItems.map((item, index) => (
//             <button key={index} onClick={() => setActiveAccount(item)} className={`text-nowrap px-3 md:px-9.5 lg:px-14 min-h-9 md:min-h-11.5 lg:min-h-12.5 flex items-center justify-center gap-2 capitalize text-xs md:text-base font-medium rounded-lg md:rounded-xl hover:text-white ${activeAccount.name === item.name ? 'bg-white/10 text-white' : 'bg-transparent text-[#6F7083]'}`}>
//               {item.icon} {item.name}
//             </button>
//           ))}
//         </div>
//         <div className="rounded-[20px] bg-white/[6%] border border-solid border-white/15 w-full p-4 md:p-6 h-full">
//           {activeAccount?.name === 'Steam Account' && <Account />}
//           {activeAccount.name === 'Withdraw Items' && <Steam />}
//           {activeAccount.name === 'Withdrawal History' && <History />}
//         </div>
//       </div>
//     </div>
//   )
// }