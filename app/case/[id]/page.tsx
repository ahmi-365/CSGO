"use client";

import React, { JSX, useState, useEffect } from "react";
import PageContainer from "@/app/components/PageContainer";
import { CaseItem, StremItem } from "@/app/utilities/Types";
import BuyCard from "@/app/components/cases/BuyCard";
import Card from "@/app/deposit/componets/Card";
import { motion, useAnimation } from "framer-motion";
import { Crosshair, Layers, Sparkles, Rocket } from "lucide-react";
import { useToast } from "@/app/contexts/ToastContext";

// --- Interfaces ---
interface IncreamentCoutItem {
  count: number;
  color?: string;
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

interface SpinIconItem {
  icon: JSX.Element | string;
  bgColor: string;
  textColor: string | null;
}

// Inventory Item Interface
interface InventoryItem {
  id: number;
  user_id: number;
  base_weapon_id: string | null;
  acquired_at: string;
  is_sold: boolean;
  price: string | null;
  base_weapon: {
    id: string;
    name: string;
    description: string;
    image: string;
    rarity: string | null;
    price: string;
    probability: number | null;
  } | null;
  crate_open: {
    id: number;
    crate_id: string;
    price_paid: string;
    created_at: string;
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

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [crateId, setCrateId] = useState<string>("");
  const [crateData, setCrateData] = useState<CrateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const controls = useAnimation();

  const [activeIncrementCount, setActiveIncrementCount] = useState(1);
  const [selectedSpins, setSelectedSpins] = useState<number[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { showToast } = useToast();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [spinnerItems, setSpinnerItems] = useState<StremItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "YOUR_BASE_URL_HERE";

  // Resolve the params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCrateId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setInventoryLoading(true);
        const authData = getAuthData();
        const token = authData?.token;

        if (!token) {
          throw new Error("You must be logged in to view inventory");
        }

        const response = await fetch(`${BASE_URL}/api/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch inventory");
        const data = await response.json();

        if (data.status && data.data) {
          // Filter out items that are sold or don't have base_weapon data
          const validItems = data.data.filter(
            (item: InventoryItem) => !item.is_sold && item.base_weapon !== null
          );
          setInventoryItems(validItems);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load inventory"
        );
      } finally {
        setInventoryLoading(false);
      }
    };

    fetchInventory();
  }, [BASE_URL]);
  // Fetch crate data for the spinner
  useEffect(() => {
    if (!crateId) return;

    const fetchCrateData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/case/${crateId}`);
        if (!response.ok) throw new Error("Failed to fetch crate data");
        const data = await response.json();
        setCrateData(data.crate);

        let items = data.crate.items.map((item: CrateItem) => ({
          img: item.image,
          price: `${parseFloat(item.price).toFixed(3)}`,
          name: item.name,
          color: getRarityColor(item.rarity),
          color2: getRarityColor2(item.rarity),
          isReal: true,
          id: item.id,
        }));

        // Add static items if less than 5
        const MIN_ITEMS = 10; // Increased for better visual
        // if (items.length < MIN_ITEMS) {
        //   const staticItems = [
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_ak47_png.png",
        //       price: "150.00",
        //       name: "AK-47",
        //       color: "#4FC8FF",
        //       color2: "#1D2E58",
        //       isReal: false,
        //       id: "static-1"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_m4a1_png.png",
        //       price: "120.00",
        //       name: "M4A4",
        //       color: "#C324E7",
        //       color2: "#3E1F53",
        //       isReal: false,
        //       id: "static-2"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_awp_png.png",
        //       price: "200.00",
        //       name: "AWP",
        //       color: "#FFD700",
        //       color2: "#4A3B26",
        //       isReal: false,
        //       id: "static-3"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_deagle_png.png",
        //       price: "80.00",
        //       name: "Desert Eagle",
        //       color: "#39FF67",
        //       color2: "#1D5830",
        //       isReal: false,
        //       id: "static-4"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_knife_png.png",
        //       price: "500.00",
        //       name: "Karambit",
        //       color: "#E94444",
        //       color2: "#4A1F1F",
        //       isReal: false,
        //       id: "static-5"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_glock_png.png",
        //       price: "50.00",
        //       name: "Glock-18",
        //       color: "#BFC0D8",
        //       color2: "#3E3F4F",
        //       isReal: false,
        //       id: "static-6"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_usp_silencer_png.png",
        //       price: "60.00",
        //       name: "USP-S",
        //       color: "#4FC8FF",
        //       color2: "#1D2E58",
        //       isReal: false,
        //       id: "static-7"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_famas_png.png",
        //       price: "90.00",
        //       name: "FAMAS",
        //       color: "#39FF67",
        //       color2: "#1D5830",
        //       isReal: false,
        //       id: "static-8"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_aug_png.png",
        //       price: "100.00",
        //       name: "AUG",
        //       color: "#C324E7",
        //       color2: "#3E1F53",
        //       isReal: false,
        //       id: "static-9"
        //     },
        //     {
        //       img: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapons/base_weapons/weapon_ssg08_png.png",
        //       price: "130.00",
        //       name: "SSG 08",
        //       color: "#FFD700",
        //       color2: "#4A3B26",
        //       isReal: false,
        //       id: "static-10"
        //     }
        //   ];

        //   const itemsNeeded = MIN_ITEMS - items.length;
        //   items = [...items, ...staticItems.slice(0, itemsNeeded)];
        // }

        setSpinnerItems(items);
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
    showToast({
      type: 'error',
      title: 'Error',
      message: 'Authentication token not found. Please log in again.',
      duration: 4000
    });
    return;
  }

  try {
    // Show loading state in a toast
    showToast({
      type: 'info',
      title: 'Verifying...',
      message: 'Please wait while we verify the result.',
      duration: 2000
    });

    const response = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    
    if (!response.ok) throw new Error("Verification failed.");

    const verificationData = await response.json();

    // Show verification result in a custom toast
    showToast({
      duration: 0,
      customContent: (
        <div className="text-center w-full mx-auto px-4" style={{ maxWidth: "500px" }}>
          <h2 className="text-white text-xl font-bold mb-3">
            Provably Fair Verification
          </h2>
          
          <div className="bg-[#1E202C]/80 rounded-xl p-4 border border-white/20 text-left">
            <div className="space-y-3 font-mono text-xs">
              {/* Result Roll */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/50 text-[10px] mb-1">Result Roll</p>
                <p className="text-[#39FF67] font-bold text-lg">
                  {(verificationData.verification.roll * 100).toFixed(2)}%
                </p>
              </div>

              {/* Nonce */}
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-2 border border-white/10">
                <span className="text-white/50">Nonce:</span>
                <span className="text-white font-semibold">
                  {verificationData.verification.nonce}
                </span>
              </div>

              {/* Client Seed */}
              <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                <p className="text-white/50 mb-1 text-[10px]">Client Seed:</p>
                <p className="text-white/80 break-all text-[10px]">
                  {verificationData.verification.client_seed}
                </p>
              </div>

              {/* Server Seed Hashed */}
              <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                <p className="text-white/50 mb-1 text-[10px]">Server Seed (Hashed):</p>
                <p className="text-white/80 break-all text-[10px]">
                  {verificationData.verification.server_seed_hash}
                </p>
              </div>

              {/* Server Seed Revealed */}
              <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                <p className="text-white/50 mb-1 text-[10px]">Server Seed (Revealed):</p>
                <p className="text-white/80 break-all text-[10px]">
                  {verificationData.verification.server_seed}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              // Close the toast (you'll need to add a close function to your toast context)
              window.location.reload();
            }}
            className="w-full btn gradient-border shadow-[0_2px_4px_rgba(59,188,254,0.32)] h-10 mt-4 text-sm"
          >
            Close
          </button>
        </div>
      )
    });

  } catch (err: any) {
    showToast({
      type: 'error',
      title: 'Error',
      message: err.message || 'Could not verify the result.',
      duration: 4000
    });
  }
};
  const handleOpenCrate = async () => {
    if (spinning) return;
    setSpinning(true);

    // Reset spinner to initial position
    setCurrentPosition(0);
    await controls.start({ x: 0, transition: { duration: 0 } });

    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      showToast({
        type: "error",
        title: "Authentication Error",
        message: "You must be logged in to open a case.",
        duration: 4000,
      });
      setSpinning(false);
      return;
    }

    const client_seed = `cs-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;

    const CARD_WIDTH = 180;
    const GAP = 12;
    const CARD_WIDTH_WITH_GAP = CARD_WIDTH + GAP;
    const originalItemsCount = spinnerItems.length;
    const oneReelWidth = originalItemsCount * CARD_WIDTH_WITH_GAP;

    // Start initial spin animation
    const initialSpinPromise = controls.start({
      x: -(oneReelWidth * 3),
      transition: {
        duration: 2,
        ease: "linear",
      },
    });

    try {
      const response = await fetch(`${BASE_URL}/api/crate/${crateId}/open`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ client_seed, quantity: selectedQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg =
          errorData.error ||
          errorData.message ||
          "Failed to open the crate. Please try again.";
        throw new Error(msg);
      }

      const result = await response.json();

      // STEP 1: Extract winning weapon ID from backend response
      const wonWeapon = result.result.weapon;
      const wonWeaponId = wonWeapon.id;

      console.log("✅ Backend response received!");
      console.log("Won weapon:", wonWeapon.name, "ID:", wonWeaponId);

      // STEP 2: Find the matching item in spinner items array
      const wonItemIndex = spinnerItems.findIndex(
        (item) => item.id === wonWeaponId
      );

      if (wonItemIndex === -1) {
        console.error("❌ Won weapon not found in spinner!");
        throw new Error("Won item not found in spinner!");
      }

      console.log(
        "✅ Found won item at index:",
        wonItemIndex,
        "Name:",
        wonWeapon.name
      );

      // Wait for initial spin to complete
      await initialSpinPromise;

      // STEP 3: Calculate exact position to land on winning item
      const viewportCenter = window.innerWidth / 2;

      // Position of winning item within one reel
      const winningItemPosition = wonItemIndex * CARD_WIDTH_WITH_GAP;

      // Add extra reels for spinning effect (10 full loops)
      const extraReels = 10;
      const extraDistance = extraReels * oneReelWidth;

      // STEP 4: Calculate final position to center the winning item
      // STEP 4: Calculate final position to center the winning item
      const finalX = -(
        extraDistance +
        winningItemPosition -
        (viewportCenter - CARD_WIDTH / 2)
      );

      // CORRECTION: Adjust by one card width to fix off-by-one error
      const correctedFinalX = finalX + CARD_WIDTH_WITH_GAP;
      console.log("🎯 Landing Calculation:", {
        wonItemIndex,
        wonItemName: wonWeapon.name,
        winningItemPosition: `${winningItemPosition}px`,
        viewportCenter: `${viewportCenter}px`,
        CARD_WIDTH,
        oneReelWidth: `${oneReelWidth}px`,
        extraReels,
        finalX: `${finalX}px`,
      });

      // STEP 5: Animate to final position with deceleration
      await controls.start({
        x: correctedFinalX, // Use corrected value instead of finalX
        transition: {
          duration: 5,
          ease: [0.2, 0.65, 0.3, 0.9], // Smooth deceleration
        },
      });

      console.log("✅ Animation completed! Centered on:", wonWeapon.name);

      // Show success toast
      setTimeout(() => {
        setSpinning(false);

        const fairnessData = result.result.fairness;

        showToast({
  duration: 0,
  customContent: (
    <div
      className="text-center w-full mx-auto px-3 py-2"
      style={{ maxWidth: "480px" }}
    >
      {/* Title */}
      <h2 className="text-white text-xl font-bold mb-2">Congratulations!</h2>
      <p className="text-white/60 text-xs mb-3">
        You’ve unlocked a new reward item!
      </p>

      {/* Weapon Info */}
      <div
        className="p-3 rounded-xl border relative overflow-hidden flex flex-col items-center mb-3"
        style={{
          backgroundColor: getRarityColor2(wonWeapon.rarity),
          borderColor: getRarityColor(wonWeapon.rarity),
        }}
      >
        <div
          className="absolute inset-0 opacity-20 blur-xl"
          style={{ backgroundColor: getRarityColor(wonWeapon.rarity) }}
        />
        <img
          src={wonWeapon.image}
          alt={wonWeapon.name}
          className="max-w-[140px] h-auto mx-auto mb-2 relative z-10 drop-shadow-lg"
        />
        <h3
          className="text-base font-semibold mb-0.5 relative z-10"
          style={{ color: getRarityColor(wonWeapon.rarity) }}
        >
          {wonWeapon.name}
        </h3>
        <p className="text-white text-sm font-bold relative z-10">
          ${parseFloat(wonWeapon.price).toFixed(2)}
        </p>
      </div>

      {/* Balance Info */}
      <div className="bg-white/5 rounded-lg p-2 border border-white/10 mb-2 text-left">
        <p className="text-white/60 text-[10px] mb-0.5">New Balance</p>
        <p className="text-white text-sm font-bold">${result.new_balance}</p>
      </div>

      {/* Fairness Info */}
      <div className="bg-[#1E202C]/50 rounded-lg p-2 border border-white/10 text-left text-xs">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-white font-bold text-[11px]">Provably Fair</h4>
          <button
            onClick={() => handleVerify(fairnessData.verify_url)}
            className="text-[10px] text-blue-400 hover:text-blue-300 underline"
          >
            Verify
          </button>
        </div>

        <div className="space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-white/50">Roll:</span>
            <span className="text-[#39FF67] font-bold">
              {(fairnessData.roll * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Nonce:</span>
            <span className="text-white">{fairnessData.nonce}</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => window.location.reload()}
        className="w-full btn gradient-border shadow-[0_2px_4px_rgba(59,188,254,0.32)] h-9 mt-3 text-sm"
      >
        Awesome! View Inventory
      </button>
    </div>
  ),
});

      }, 500);
    } catch (err: any) {
      console.error("❌ Error opening crate:", err);

      showToast({
        type: "error",
        title: "Error!",
        message: err.message || "An unexpected error occurred.",
        duration: 4000,
      });
      setSpinning(false);

      // Reset spinner on error
      await controls.start({
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      });
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
      {/* Spinner Container */}
      <div className="relative z-1 overflow-hidden flex flex-col gap-y-2.5 py-6 bg-[#C4CEFF]/6 rounded-[20px] mb-5">
        {Array.from({ length: activeIncrementCount }).map((_, index) => (
          <motion.div
            className="flex justify-center gap-3 relative"
            animate={controls}
            key={index}
            style={{ willChange: "transform" }}
          >
            {/*
            Create seamless infinite scroll by repeating items 5 times
            This ensures there's always content visible during the entire animation
          */}
            {Array.from({ length: 20 }).flatMap((_, repeatIndex) =>
              spinnerItems.map((item, idx) => (
                <Card
                  className="min-w-45"
                  key={`spinner-${index}-repeat-${repeatIndex}-item-${idx}`}
                  item={item}
                />
              ))
            )}
          </motion.div>
        ))}

        {/* Center Indicator - stays fixed in the middle */}
        <span className="h-full flex items-center justify-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
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

      {/* Controls Section */}
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
              key={index}
              onClick={() => setSelectedQuantity(item.count)}
              className={`flex items-center justify-center rounded-full hover:scale-105 text-base text-white uppercase min-w-12 min-h-9 p-px text-shadow-[0_4p_ 4px_rgba(15,16,44,0.12)] transition-all ${
                selectedQuantity === item.count
                  ? "scale-110 ring-2 ring-white"
                  : ""
              }`}
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
            {spinning
              ? "Opening..."
              : `Open for $${(
                  parseFloat(crateData.price) * selectedQuantity
                ).toFixed(2)}`}{" "}
          </span>
        </button>
      </div>

      {/* Inventory Section */}
      <div className="flex flex-col gap-y-5 mt-6">
        <h4 className="text-2xl">Your Inventory</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 pd:10">
          {inventoryLoading ? (
            <div className="col-span-full text-center py-20 text-white">
              Loading inventory...
            </div>
          ) : inventoryItems.length > 0 ? (
            inventoryItems.map((item) => {
              const weapon = item.base_weapon;
              if (!weapon) return null;

              return (
                <BuyCard
                  item={{
                    id: item.id.toString(),
                    img: weapon.image,
                    price: `$${parseFloat(weapon.price).toFixed(2)}`,
                    des: weapon.name,
                    color: getRarityColor(weapon.rarity),
                    btn: item.is_sold ? "Sold" : "Sell Now",
                  }}
                  key={item.id}
                  path={`/inventory/${item.id}`}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-white/60">
              {inventoryItems.length === 0
                ? "Your inventory is empty. Start opening cases to collect items!"
                : "No items match your search criteria"}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
