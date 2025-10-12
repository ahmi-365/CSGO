import React, { useEffect, useState } from "react";
import Link from "next/link";
import BuyCard from "@/app/components/cases/BuyCard";
import { CaseItem } from "@/app/utilities/Types";
import { JSX } from "react";

type Props = {
  loginAuth?: boolean;
};

// Updated interface to include an optional onClick handler
interface SocialItem {
  icon?: JSX.Element | string;
  path?: string;
  onClick?: () => void;
}

interface ApiCrate {
  id: string; // Ensure the API crate also has an ID
  name: string;
  image: string;
  price: string;
  rarity?: {
    color: string;
  } | null;
}

const randomColors = [
  "#39FF67",
  "#FFD700",
  "#4FC8FF",
  "#C324E7",
  "#E94444",
  "#FF8809",
  "#347BFF",
  "#ED164C",
  "#24E9FF",
  "#702AEC",
];

const getRandomColor = () => {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
};

export default function Cases({ loginAuth = true }: Props) {
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [featuredCase, setFeaturedCase] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${base_url}/api/cases`);
        const data = await response.json();

        // Transform API data to match CaseItem type
        const transformedCases: CaseItem[] = data.crates.data.map(
          (crate: ApiCrate) => ({
            id: crate.id, // Assign the ID from the API response
            img: crate.image,
            price: `$${crate.price}`,
            des: crate.name,
            color: crate.rarity?.color || getRandomColor(),
          })
        );

        setCaseItems(transformedCases);

        // Select a random case for the featured section
        if (transformedCases.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * transformedCases.length
          );
          setFeaturedCase(transformedCases[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
        setCaseItems([]);
        setFeaturedCase(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [base_url]); // Added base_url to dependency array

  // --- NEW: Function to handle Google Login ---
  const handleGoogleLogin = async () => {
    try {
      console.log(
        "Attempting to get Google redirect URL from:",
        `${base_url}/api/google/redirect`
      );
      const response = await fetch(`${base_url}/api/google/redirect`);

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.status === true && data.url) {
        // If the API returns a valid URL, redirect the user
        window.location.href = data.url;
      } else {
        // Handle cases where the API response is not as expected
        console.error("Failed to get Google login URL:", data);
      }
    } catch (error) {
      console.error(
        "An error occurred during the Google login process:",
        error
      );
    }
  };

  // --- UPDATED: Social array with onClick handler for Google ---
  const social: SocialItem[] = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG paths for Google icon */}
          <g clipPath="url(#clip0_0_497)">
            <path
              d="M23.0935 9.41355L13.3042 9.41309C12.8719 9.41309 12.5215 9.76343 12.5215 10.1957V13.323C12.5215 13.7552 12.8719 14.1056 13.3041 14.1056H18.8169C18.2132 15.6722 17.0865 16.9842 15.6491 17.8178L17.9997 21.887C21.7704 19.7062 23.9997 15.8799 23.9997 11.5965C23.9997 10.9866 23.9548 10.5506 23.8649 10.0597C23.7965 9.68674 23.4727 9.41355 23.0935 9.41355Z"
              fill="currentColor"
            />
            <path
              d="M12.0003 18.8043C9.30242 18.8043 6.94723 17.3303 5.68231 15.1491L1.61328 17.4944C3.68398 21.0833 7.56308 23.5 12.0003 23.5C14.177 23.5 16.2309 22.9139 18.0003 21.8926V21.887L15.6496 17.8178C14.5744 18.4414 13.3302 18.8043 12.0003 18.8043Z"
              fill="currentColor"
            />
            <path
              d="M18 21.8926V21.887L15.6494 17.8178C14.5741 18.4414 13.33 18.8044 12 18.8044V23.5C14.1767 23.5 16.2308 22.9139 18 21.8926Z"
              fill="currentColor"
            />
            <path
              d="M4.69566 11.5C4.69566 10.1702 5.05856 8.9261 5.68205 7.85093L1.61302 5.50558C0.586031 7.26935 0 9.31769 0 11.5C0 13.6823 0.586031 15.7307 1.61302 17.4944L5.68205 15.1491C5.05856 14.0739 4.69566 12.8298 4.69566 11.5Z"
              fill="currentColor"
            />
            <path
              d="M12.0003 4.19566C13.7595 4.19566 15.3755 4.82078 16.6377 5.86061C16.9491 6.11711 17.4017 6.09859 17.6869 5.81336L19.9027 3.59758C20.2263 3.27395 20.2032 2.74422 19.8575 2.44431C17.7428 0.609672 14.9912 -0.5 12.0003 -0.5C7.56308 -0.5 3.68398 1.91673 1.61328 5.50558L5.68231 7.85092C6.94723 5.66969 9.30242 4.19566 12.0003 4.19566Z"
              fill="currentColor"
            />
            <path
              d="M16.6374 5.86061C16.9488 6.11711 17.4015 6.09859 17.6866 5.81336L19.9024 3.59758C20.226 3.27395 20.2029 2.74422 19.8573 2.44431C17.7425 0.609625 14.991 -0.5 12 -0.5V4.19566C13.7592 4.19566 15.3752 4.82078 16.6374 5.86061Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_0_497">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
      path: "#", // Changed from "/" to "#"
      onClick: handleGoogleLogin, // Added onClick handler
    },
    
  ];

  // Generate the path for the featured case using its ID
  const featuredCasePath = featuredCase ? `/case/${featuredCase.id}` : "/"; // Fallback to home if no featured case

  return (
    <>
      <div className="bg-[#1C1E2D] border border-solid border-white/10 rounded-3xl p-8 md:p-12 lg:py-13 lg:px-18 relative z-1 overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 left-[-60%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-30%] lg:bottom-[-50%] right-20 -z-1 bg-[#702AEC] size-30 md:size-50 lg:size-75 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -translate-y-1/2 right-[-62%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
        {loginAuth ? (
          <>{/* Logged in view */}</>
        ) : (
          <>
            <div className="max-w-110 text-center md:text-start">
              {loading ? (
                <div className="absolute hidden md:block md:bottom-0 xl:-bottom-18 right-0 xl:-right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1 animate-pulse bg-white/10 rounded-lg w-90 h-90"></div>
              ) : featuredCase ? (
                <img
                  src={featuredCase.img}
                  className="absolute hidden md:block md:bottom-0 xl:-bottom-18 right-0 xl:-right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1"
                  alt={featuredCase.des}
                />
              ) : (
                <img
                  src="/img/home/img_2.png"
                  className="absolute hidden md:block md:bottom-0 xl:-bottom-18 right-0 xl:-right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1"
                  alt=""
                />
              )}
              <h1 className="text-[28px] md:text-3xl lg:text-4xl mb-4 !leading-[130%]">
                {loading
                  ? "Loading..."
                  : featuredCase
                  ? `Don't Miss Out on ${featuredCase.des}`
                  : "Don't Miss Out on Our Best-Selling Case"}
              </h1>
              <p className="text-base !leading-normal max-w-85 mb-6">
                {loading
                  ? "Fetching our best cases..."
                  : featuredCase
                  ? `${featuredCase.price} - The #1 Pick Everyone's Buying Right Now for Unmatched Value`
                  : "The #1 Pick Everyone's Buying Right Now for Unmatched Value"}
              </p>
              <div className="flex flex-wrap flex-col-reverse md:flex-row w-full gap-4">
                <Link
                  href={featuredCasePath} // This uses the ID for navigation
                  className="grow md:grow-0 gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold"
                >
                  <span className="px-5">Get Started - Right Now</span>
                </Link>
                <div className="flex items-center gap-2 mx-auto md:mx-0">
                  {/* --- UPDATED: Rendering logic for social icons --- */}
                  {social.map((item, index) => (
                    <a
                      href={item.path}
                      onClick={(e) => {
                        // If an onClick function is provided, prevent default link behavior and call the function
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                      // Open in new tab only if it's a regular link, not an action
                      target={!item.onClick ? "_blank" : "_self"}
                      rel={!item.onClick ? "noopener noreferrer" : ""}
                      className="bg-[#BFC0D8]/8 text-[#6F7083] size-13 rounded-full flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer"
                      key={index}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-y-5 mt-6 md:mt-8">
        <h4 className="text-2xl">Regular Cases</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 mb:pb-10">
          {loading ? (
            [...Array(10)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-[#1C1E2D]/50 border border-white/10 rounded-2xl h-64"
              ></div>
            ))
          ) : caseItems.length > 0 ? (
            caseItems.map((item, index) => (
              <BuyCard item={item} key={index} path={`/case/${item.id}`} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              No cases available at the moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
