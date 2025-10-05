"use client";

import React, { JSX, useState, useEffect } from "react";
import PageContainer from "@/app/components/PageContainer";
import { CaseItem, StremItem } from "@/app/utilities/Types";
import BuyCard from "@/app/components/cases/BuyCard";
import Card from "@/app/deposit/componets/Card";
import { motion, useAnimation } from "framer-motion";
import Swal from "sweetalert2";
import { Crosshair, Layers, Sparkles, Rocket } from "lucide-react";

// --- Interfaces ---
interface IncreamentCoutItem {
  count: number;
  color?: string;
}

interface SpinIconItem {
  icon: JSX.Element | string;
  bgColor: string;
  textColor: string | null;
}

interface CrateItem {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: string | null;
  price: string;
  probability: number | null;
}

interface CrateData {
  id: string;
  name: string;
  image: string;
  price: string;
  description: string | null;
  items: CrateItem[];
  rarity: {
    name: string;
    color: string;
  } | null;
}

interface FairnessData {
  client_seed: string;
  server_seed_hash: string;
  nonce: number;
  roll: number;
  verify_url: string;
}

type Props = {
  crateId?: string;
};

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

export default function Page({ crateId = "crate-8905" }: Props) {
  const [crateData, setCrateData] = useState<CrateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const controls = useAnimation();

  const [activeIncrementCount, setActiveIncrementCount] = useState(1);
  const [selectedSpins, setSelectedSpins] = useState<number[]>([]);

  const [spinnerItems, setSpinnerItems] = useState<StremItem[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "YOUR_BASE_URL_HERE";

  useEffect(() => {
    const fetchCrateData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/case/${crateId}`);
        if (!response.ok) throw new Error("Failed to fetch crate data");
        const data = await response.json();
        setCrateData(data.crate);

        const items = data.crate.items.map((item: CrateItem) => ({
          img: item.image,
          price: `$${parseFloat(item.price).toFixed(3)}`,
          name: item.name,
          color: getRarityColor(item.rarity),
          color2: getRarityColor2(item.rarity),
        }));
        // Array ko 15 baar repeat karein taake loop bohot smooth lage
        setSpinnerItems(Array(15).fill(items).flat());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCrateData();
  }, [crateId, BASE_URL]);

  function getRarityColor(rarity: string | null): string {
    if (!rarity) return "#BFC0D8";
    const rarityColors: { [key: string]: string } = {
      Common: "#BFC0D8",
      Uncommon: "#39FF67",
      Rare: "#4FC8FF",
      Epic: "#C324E7",
      Legendary: "#FFD700",
    };
    return rarityColors[rarity] || "#236DFF";
  }

  function getRarityColor2(rarity: string | null): string {
    if (!rarity) return "#3E3F4F";
    const rarityColors: { [key: string]: string } = {
      Common: "#3E3F4F",
      Uncommon: "#1D5830",
      Rare: "#1D2E58",
      Epic: "#3E1F53",
      Legendary: "#4A3B26",
    };
    return rarityColors[rarity] || "#1D2E58";
  }

  const handleVerify = async (verifyUrl: string) => {
    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      Swal.fire(
        "Error",
        "Authentication token not found. Please log in again.",
        "error"
      );
      return;
    }

    try {
      Swal.showLoading();
      const response = await fetch(verifyUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Verification failed.");

      const verificationData = await response.json();

      Swal.fire({
        title: "Provably Fair Verification",
        html: `
                    <div style="text-align: left; color: #BFC0D8; font-family: monospace; font-size: 12px; background-color: #2a2d42; padding: 15px; border-radius: 8px;">
                        <p><strong>Result Roll:</strong> <span style="color: #39FF67;">${verificationData.verification.roll}</span></p>
                        <hr style="border-color: #3E3F4F; margin: 10px 0;" />
                        <p><strong>Client Seed:</strong> ${verificationData.verification.client_seed}</p>
                        <p><strong>Server Seed (Hashed):</strong> ${verificationData.verification.server_seed_hash}</p>
                        <p><strong>Server Seed (Revealed):</strong> ${verificationData.verification.server_seed}</p>
                        <p><strong>Nonce:</strong> ${verificationData.verification.nonce}</p>
                    </div>
                `,
        background: "#1C1E2D",
        color: "#FFFFFF",
        confirmButtonText: "Close",
      });
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.message || "Could not verify the result.",
        "error"
      );
    }
  };

 const handleOpenCrate = async () => {
    if (spinning) return;
    setSpinning(true);
    // Spinner ko shuruaati position par reset karein
    await controls.start({ x: 0, transition: { duration: 0 } });

    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      Swal.fire(
        "Authentication Error",
        "You must be logged in to open a case.",
        "error"
      );
      setSpinning(false);
      return;
    }

    const client_seed = `cs-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;

    try {
      const response = await fetch(`${BASE_URL}/api/crate/${crateId}/open`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ client_seed }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to open the crate.");
      }

      const result = await response.json();
      const wonWeapon: CrateItem = result.result.weapon;
      const fairnessData: FairnessData = result.result.fairness;

      // --- YAHAN SE BADLAV SHURU HOTE HAIN ---

      // 1. Backend se 'roll' value lein
      const roll = fairnessData.roll; // Yeh 0 se 1 ke beech ka number hai (e.g., 0.100636)

      // 2. Kuch full spins add karein taaki animation accha lage
      const minFullRevolutions = 4; // Kam se kam 4 baar poora ghumega
      const cardWidthWithGap = 192; // Sunishchit karein ki yeh aapke CSS se match karta hai

      const originalItemsCount = crateData?.items.length || 0;
      if (originalItemsCount === 0)
        throw new Error("Case items not loaded correctly.");

      // Ek poore reel (jismein sabhi original items ek baar aate hain) ki kul chaudai
      const widthOfOneReel = originalItemsCount * cardWidthWithGap;

      // Kam se kam revolutions ke liye doori
      const revolutionsDistance = minFullRevolutions * widthOfOneReel;

      // Roll ke aadhar par aakhri revolution mein tay ki jaane wali doori
      // Hum roll ko ek poore reel ki chaudai se guna karenge taaki woh us reel par sahi jagah ruke
      const finalPositionBasedOnRoll = roll * widthOfOneReel;

      // 3. Screen ke center ke liye adjustment calculate karein
      const screenCenter = window.innerWidth / 2;
      const centerAdjustment = screenCenter - cardWidthWithGap / 2;

      // 4. Kul doori calculate karein
      // Yeh doori = (full revolutions ki doori) + (roll ke aadhar par aakhri doori) - (center mein laane ka adjustment)
      const finalX =
        -(revolutionsDistance + finalPositionBasedOnRoll) + centerAdjustment;

      // --- BADLAV YAHAN KHATAM HOTE HAIN ---

      // Animation ko 7 second ke liye start karein
      controls.start({
        x: finalX,
        transition: { duration: 7, ease: [0.22, 1, 0.36, 1] },
      });

      setTimeout(() => {
        setSpinning(false);
        Swal.fire({
          title: "Congratulations!",
          html: `
                    <div style="text-align: center; color: white;">
                        <p style="margin-bottom: 15px;">You won:</p>
                        <div style="padding: 20px; border-radius: 15px; background: ${getRarityColor2(
                          wonWeapon.rarity
                        )}; border: 1px solid ${getRarityColor(
            wonWeapon.rarity
          )};">
                            <img src="${wonWeapon.image}" alt="${
            wonWeapon.name
          }" style="max-width: 80%; height: auto; margin: 0 auto 15px auto;" />
                            <h2 style="font-size: 1.5rem; font-weight: bold; color: ${getRarityColor(
                              wonWeapon.rarity
                            )}; margin: 0;">
                                ${wonWeapon.name}
                            </h2>
                            <p style="font-size: 1.2rem; font-weight: bold;">$${parseFloat(
                              wonWeapon.price
                            ).toFixed(2)}</p>
                        </div>
                    </div>
                `,
          icon: "success",
          background: "#1C1E2D",
          color: "#FFFFFF",
          confirmButtonText: "Awesome!",
          confirmButtonColor: "#3085d6",

          // --- "VERIFY FAIRNESS" BUTTON KO YAHAN COMMENT KIYA GAYA HAI ---
          // showDenyButton: true,
          // denyButtonText: "Verify Fairness",

        })
        
        // --- "VERIFY FAIRNESS" BUTTON KI FUNCTIONALITY KO YAHAN COMMENT KIYA GAYA HAI ---
        // .then((popupResult) => {
        //   if (popupResult.isDenied) {
        //     handleVerify(fairnessData.verify_url);
        //   }
        // });

      }, 7000);
    } catch (err: any) {
      Swal.fire(
        "Error!",
        err.message || "An unexpected error occurred.",
        "error"
      );
      setSpinning(false);
    }
  };
  const incrementCout: IncreamentCoutItem[] = [
    {
      count: 2,
      color: "linear-gradient(83deg, #AD20FF 10.38%, #7B0FFF 57.75%)",
    },
    {
      count: 3,
      color: "linear-gradient(272deg, #D8026D 1.37%, #FD46AE 88.36%)",
    },
    {
      count: 4,
      color: "linear-gradient(88deg, #FFB923 1.49%, #FF7F16 68.43%)",
    },
  ];

  const spinIcons: SpinIconItem[] = [
    { icon: <Crosshair />, bgColor: "#E94444", textColor: null },
    { icon: <Layers />, bgColor: "#BFC0D8", textColor: "#D9D9D9" },
    { icon: <Sparkles />, bgColor: "#FFD700", textColor: null },
    { icon: <Rocket />, bgColor: "#7436E1", textColor: null },
  ];

  const caseItems: CaseItem[] =
    crateData?.items.map((item) => ({
      img: item.image,
      price: `$${parseFloat(item.price).toFixed(2)}`,
      des: item.name,
      color: getRarityColor(item.rarity),
      btn: item.rarity || "Common",
    })) || [];

  if (loading)
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </PageContainer>
    );
  if (error)
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
      </PageContainer>
    );
  if (!crateData)
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-white text-xl">No data available</p>
        </div>
      </PageContainer>
    );

  return (
    <PageContainer>
      <div className="relative z-1 overflow-hidden flex flex-col gap-y-2.5 py-6 bg-[#C4CEFF]/6 rounded-[20px] mb-5">
        {Array.from({ length: activeIncrementCount }).map((_, index) => (
          <motion.div
            className="flex gap-3 relative -z-10"
            animate={controls}
            key={index}
          >
            {spinnerItems.map((item, idx) => (
              <Card
                className="min-w-45"
                key={`spinner-item-${idx}`}
                item={item}
              />
            ))}
          </motion.div>
        ))}
        <span className="h-full flex items-center justify-center w-full absolute top-1/2 left-1/2 -translate-1/2 ml-4">
          <svg
            className="max-h-100 w-full"
            style={{ maxHeight: `${400 * activeIncrementCount}px` }}
            width="268"
            viewBox="0 0 168 388"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_0_1384)">
              <rect x="77" y="90" width="13" height="207" fill="white" />
            </g>
            <path
              d="M95.425 312.008C96.9566 314.674 95.0316 318 91.9564 318H75.9103C72.8351 318 70.9101 314.674 72.4417 312.008L80.4648 298.039C82.0024 295.362 85.8644 295.362 87.402 298.039L95.425 312.008Z"
              fill="white"
            />
            <g filter="url(#filter1_f_0_1384)">
              <path
                d="M97.5002 75.6246C98.6758 72.9794 96.7396 70 93.845 70H74.155C71.2604 70 69.3242 72.9794 70.4998 75.6246L80.3447 97.7757C81.7524 100.943 86.2476 100.943 87.6552 97.7757L97.5002 75.6246Z"
                fill="white"
              />
            </g>
            <path
              d="M95.425 75.9922C96.9566 73.3256 95.0316 70 91.9564 70H75.9103C72.8351 70 70.9101 73.3256 72.4417 75.9922L80.4648 89.9609C82.0024 92.638 85.8644 92.638 87.402 89.9609L95.425 75.9922Z"
              fill="white"
            />
            <path d="M83.5 94L83.5 294" stroke="white" strokeWidth="1.5" />
            <g filter="url(#filter2_f_0_1384)">
              <path
                d="M97.5002 312.375C98.6758 315.021 96.7396 318 93.845 318H74.155C71.2604 318 69.3242 315.021 70.4998 312.375L80.3447 290.224C81.7524 287.057 86.2476 287.057 87.6552 290.224L97.5002 312.375Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_0_1384"
                x="27"
                y="40"
                width="113"
                height="307"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="25"
                  result="effect1_foregroundBlur_0_1384"
                />
              </filter>
              <filter
                id="filter1_f_0_1384"
                x="0.150635"
                y="0"
                width="167.699"
                height="170.151"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="35"
                  result="effect1_foregroundBlur_0_1384"
                />
              </filter>
              <filter
                id="filter2_f_0_1384"
                x="0.150635"
                y="217.849"
                width="167.699"
                height="170.151"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="35"
                  result="effect1_foregroundBlur_0_1384"
                />
              </filter>
            </defs>
          </svg>
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="hidden md:flex items-center gap-3">
          {spinIcons.map((item, index) => {
            const isActive = selectedSpins.includes(index);
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedSpins((prev) =>
                    prev.includes(index)
                      ? prev.filter((i) => i !== index)
                      : [...prev, index]
                  );
                }}
                className={`size-11 flex items-center justify-center bg-[var(--bg-color)]/10 text-[var(--text-color)] rounded-full border border-solid ${
                  isActive ? "border-[var(--bg-color)]" : "border-transparent"
                }`}
                style={
                  {
                    "--bg-color": item.bgColor,
                    "--text-color": item.textColor || item.bgColor,
                  } as React.CSSProperties
                }
              >
                {item.icon}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {incrementCout.map((item, index) => (
            <button
              onClick={() => setActiveIncrementCount(item.count)}
              key={index}
              className="flex items-center justify-center rounded-full hover:scale-105 text-base text-white uppercase min-w-12 min-h-9 p-px text-shadow-[0_4p_ 4px_rgba(15,16,44,0.12)]"
              style={{
                border: "double 1px transparent",
                backgroundImage: `${item.color}, linear-gradient(180deg,rgba(255, 255, 255, .2) 0%, rgba(255, 255, 255, 0.2) 100%)`,
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              {item.count}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenCrate}
          disabled={spinning}
          className="w-max gradient-border-two rounded-full flex items-center text-white text-sm font-bold min-h-11 shadow-[0_2px_8px_0_rgba(59,188,254,0.32)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="block px-5">
            {spinning ? "Opening..." : `Open for $${crateData.price}`}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-y-5 mt-6">
        <h4 className="text-2xl">{crateData.name} - Collection Items</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {caseItems.map((item, index) => (
            <BuyCard item={item} key={index} path={`/case/${crateData.id}`} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
