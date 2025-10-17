import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Gem,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BuyCard from "@/app/components/cases/BuyCard";
import { UserInfoItem } from "@/app/utilities/Types";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import InfoCard2 from "@/app/components/home/InfoCard2";
import { getAuthData } from "@/app/service/api"; // Assuming getAuthData is correctly implemented here

type Props = {
  //  ?: boolean;
  baseUrl?: string;
};

// Top Crate Types
interface TopCrateData {
  id: string;
  rarity_id: string;
  name: string;
  image: string;
  price: string;
  description: string | null;
  type: string;
  first_sale_date: string;
  market_hash_name: string;
  rental: boolean;
  model_player: string;
  loot_name: string | null;
  loot_footer: string | null;
  loot_image: string | null;
  top: boolean;
  created_at: string;
  updated_at: string;
}

interface TopCrateApiResponse {
  status: boolean;
  data: TopCrateData;
}

// Inventory Types
interface WeaponData {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: string | null;
  price: string;
  probability: number;
  created_at: string;
  updated_at: string;
}

interface CrateOpenData {
  id: number;
  user_id: number;
  crate_id: string;
  weapon_id: string;
  client_seed: string;
  server_seed: string;
  server_seed_hash: string;
  nonce: number;
  probability_used: number;
  price_paid: string;
  created_at: string;
  updated_at: string;
  weapon: WeaponData;
}

interface InventoryItem {
  id: number;
  user_id: number;
  crate_open_id: number;
  base_weapon_id: string | null;
  acquired_at: string;
  crate_id: string | null;
  weapon_id: string | null;
  condition: string | null;
  wear: string | null;
  is_sold: boolean;
  price: string | null;
  trade_locked_until: string | null;
  added_at: string;
  created_at: string;
  updated_at: string;
  base_weapon: WeaponData | null;
  crate_open: CrateOpenData | null;
}

interface InventoryApiResponse {
  status: boolean;
  message: string;
  data: InventoryItem[];
}

export default function Inventory({
   
  baseUrl = "https://backend.bismeel.com",
}: Props) {
  console.log("Inventory Component Rendered.  :",  );

  // All States
  const [topCrateData, setTopCrateData] = useState<TopCrateData | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null); // Added error state

  const [topCrateLoading, setTopCrateLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All Rarities");
  const [sortBy, setSortBy] = useState("Sort by");

  // Fetch all data on component mount
  useEffect(() => {
    fetchTopCrate();

      fetchInventory();
    
  }, [ ]); // <--- Added   to dependency array

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    const authData = localStorage.getItem("auth");
    if (!authData) return null;
    try {
      const parsed = JSON.parse(authData);
      return parsed.token;
    } catch {
      return null;
    }
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch Top Crate
  const fetchTopCrate = async () => {
    try {
      setTopCrateLoading(true);
      const response = await fetch(`${baseUrl}/api/crate/top`);
      const data: TopCrateApiResponse = await response.json();

      if (data.status && data.data) {
        setTopCrateData(data.data);
      } else {
        console.error("Error fetching top crate:", data);
        setTopCrateData(null);
      }
    } catch (error) {
      console.error("Error fetching top crate:", error);
      setTopCrateData(null);
    } finally {
      setTopCrateLoading(false);
    }
  };

  // Fetch Inventory (only for logged in users)
  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);
      setError(null); // Clear previous errors
      const authData = getAuthData();
      const token = authData?.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${baseUrl}/api/inventory`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch inventory");
      }
      const data: InventoryApiResponse = await response.json();

      if (data.status && data.data) {
        // Filter out items that are sold or don't have *any* weapon data
        const validItems = data.data.filter(
          (item: InventoryItem) =>
            !item.is_sold && (item.base_weapon !== null || item.crate_open?.weapon !== null) // <--- ADJUSTED FILTER
        );
        setInventoryData(validItems); // <--- CORRECTED STATE SETTER
      } else {
        setError(data.message || "Failed to load inventory");
        setInventoryData([]); // Clear inventory on error/no data
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err instanceof Error ? err.message : "Failed to load inventory");
      setInventoryData([]); // Clear inventory on error
    } finally {
      setInventoryLoading(false);
    }
  };

  // Calculate stats for inventory
  const calculateStats = () => {
    if (inventoryData.length === 0) {
      return {
        totalItems: 0,
        avgValue: 0,
        legendaryPlus: 0,
        highestValue: 0,
      };
    }

    const totalItems = inventoryData.length;
    const avgValue =
      inventoryData.reduce((sum, item) => {
        const weapon = item.base_weapon || item.crate_open?.weapon;
        return sum + parseFloat(weapon?.price || "0");
      }, 0) / totalItems;

    const legendaryPlus = inventoryData.filter((item) => {
      const weapon = item.base_weapon || item.crate_open?.weapon;
      return weapon?.rarity === "Legendary" || weapon?.rarity === "Mythical";
    }).length;

    const highestValue = Math.max(
      ...inventoryData.map((item) => {
        const weapon = item.base_weapon || item.crate_open?.weapon;
        return parseFloat(weapon?.price || "0");
      })
    );

    return {
      totalItems,
      avgValue: parseFloat(avgValue.toFixed(2)),
      legendaryPlus,
      highestValue: parseFloat(highestValue.toFixed(2)),
    };
  };

  const stats = calculateStats();

  const userInfo: UserInfoItem[] = [
    {
      icon: <FileText className="w-8 h-8" color="#1FFF33" />,
      value: stats.totalItems.toString().padStart(2, "0"),
      label: "Items",
      color: "#1FFF33",
    },
    {
      icon: <DollarSign className="w-8 h-8" color="#FFFFFF" />,
      value: `$${stats.avgValue.toFixed(2)}`,
      label: "Avg. Value",
      color: "#FFFFFF",
    },
    {
      icon: <Gem className="w-8 h-8" color="#62FFB9" />,
      value: stats.legendaryPlus.toString().padStart(2, "0"),
      label: "Legendary+",
      color: "#62FFB9",
    },
    {
      icon: <TrendingUp className="w-8 h-8" color="#51FF2D" />,
      value: `$${stats.highestValue.toFixed(2)}`,
      label: "Highest Value",
      color: "#1FFF33",
    },
  ];

  // Get rarity color
  const getRarityColor = (rarity: string | null): string => {
    const rarityColors: { [key: string]: string } = {
      Common: "#39FF67",
      Uncommon: "#FFD700",
      Rare: "#4FC8FF",
      Mythical: "#C324E7",
      Legendary: "#E94444",
      Ancient: "#FF8809",
      "Rare Blue": "#1E90FF",
    };
    return rarityColors[rarity || "Common"] || "#39FF67";
  };

  // Get weapon data from inventory item
  const getWeaponData = (item: InventoryItem): WeaponData | null => {
    return item.base_weapon || item.crate_open?.weapon || null;
  };

  // Filter and sort inventory data
  const getFilteredData = () => {
    let filtered = [...inventoryData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const weapon = getWeaponData(item);
        return weapon?.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Rarity filter
    if (selectedRarity !== "All Rarities") {
      filtered = filtered.filter((item) => {
        const weapon = getWeaponData(item);
        return weapon?.rarity === selectedRarity;
      });
    }

    // Sort
    if (sortBy === "Sort Price") {
      filtered.sort((a, b) => {
        const weaponA = getWeaponData(a);
        const weaponB = getWeaponData(b);
        return (
          parseFloat(weaponB?.price || "0") - parseFloat(weaponA?.price || "0")
        );
      });
    } else if (sortBy === "Sort Date") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "Sort Name") {
      filtered.sort((a, b) => {
        const weaponA = getWeaponData(a);
        const weaponB = getWeaponData(b);
        return (weaponA?.name || "").localeCompare(weaponB?.name || "");
      });
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Hero Section with Top Crate */}
    <div className="bg-[#1C1E2D] border border-solid border-white/10 rounded-3xl p-8 md:p-12 lg:py-13 lg:px-18 relative z-1 overflow-hidden mb-6">
  {/* 💜 Background Glows */}
  <div className="absolute top-1/2 -translate-y-1/2 left-[-60%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
  <div className="absolute bottom-[-30%] lg:bottom-[-50%] right-20 -z-1 bg-[#702AEC] size-30 md:size-50 lg:size-75 rounded-full blur-[100px]"></div>
  <div className="absolute top-1/2 -translate-y-1/2 right-[-62%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>

  {/* 💎 Featured Ribbon */}
  <div className="absolute top-12 -left-12 rotate-[-45deg] bg-gradient-to-r from-[#702AEC] via-[#8A40FF] to-[#702AEC] text-white font-semibold text-[10px] md:text-xs lg:text-sm tracking-wide px-12 py-1 shadow-[0_0_12px_rgba(112,42,236,0.8)] backdrop-blur-sm animate-pulse-glow z-10">
    ★ FEATURED
  </div>

  <div className="max-w-133 text-center md:text-start">
    {topCrateData && !topCrateLoading ? (
      <>
        {/* 🧱 Case Image */}
        <img
          src={topCrateData.image}
          className="absolute hidden md:block md:bottom-0  right-0 xl:right-13 md:max-w-90 lg:max-w-110 xl:max-w-148 -z-1"
          alt={topCrateData.name}
        />

        {/* 🧾 Title */}
        <h1 className="text-[28px] md:text-3xl lg:text-4xl mb-4 !leading-[130%]">
          {topCrateData.name}
        </h1>

        {/* 🧠 Description */}
        <p className="text-base !leading-normal max-w-85 mb-6">
          {topCrateData.description ||
            "Featured case with exclusive items and rare rewards. Open now to get amazing weapons for your collection!"}
        </p>

        {/* 💰 Price and Stats */}
        <div className="flex items-center gap-4 mb-6 flex-wrap justify-center md:justify-start">
          <span className="text-[#51FF2D] font-bold text-xl">
            ${parseFloat(topCrateData.price).toFixed(2)}
          </span>
          <span className="text-white/70">Type: {topCrateData.type}</span>
          <span className="text-white/70">
            {inventoryData?.length || 0} Items in Your Inventory
          </span>
        </div>

        {/* 🧭 Button */}
      <Link
  href={`/cases/${topCrateData.id}`}
  className="gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform w-auto md:w-max"
>
  <span className="px-5 md:px-7 lg:px-9">Open Case Now</span>
</Link>

      </>
    ) : topCrateLoading ? (
      <div className="text-white text-center py-8">Loading featured case...</div>
    ) : (
      <>
        {/* 🧩 Fallback Section */}
        <h1 className="text-4xl !leading-[130%] mb-2">Inventory</h1>
        <h4 className="text-base text-white font-bold">CleanCase Collection</h4>
        <div className="border border-solid border-white/16 my-3 max-w-84"></div>
        <p className="text-base !leading-normal max-w-85 mb-6">
          Discover amazing weapons and build your ultimate collection. Open
          cases to get rare and legendary items!
        </p>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <Link
            href="/cases"
            className="grow gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold"
          >
            <span className="px-5 md:px-7 lg:px-9 xl:px-13">Browse Cases</span>
          </Link>
          <Link
            href="/how-to-play"
            className="grow border border-solid border-white/10 rounded-full p-px overflow-hidden bg-[#1719253D] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold hover:bg-[#51FF2D]/30"
          >
            <span className="px-5 md:px-7 lg:px-9 xl:px-13">How to Play</span>
          </Link>
        </div>
      </>
    )}
  </div>
</div>


      {/* Stats for Inventory - Only show if user is logged in and has items */}
      {   inventoryData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {userInfo.map((item, index) => (
            <InfoCard2
              key={index}
              labelClass="justify-center md:justify-between"
              item={item}
            />
          ))}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-y-5 mt-6 md:mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
          <Input
            type="text"
            placeholder="Search your inventory..."
            className="min-w-full xl:min-w-80.5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Dropdown
              btnClass="!min-w-42.5 xl:!min-w-48.5"
              placeholder={selectedRarity}
              items={[
                { name: "All Rarities" },
                { name: "Common" },
                { name: "Uncommon" },
                { name: "Rare" },
                { name: "Mythical" },
                { name: "Legendary" },
                { name: "Rare Blue" },
              ]}
              onSelect={(item) => setSelectedRarity(item.name as string)}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 5H13.8333"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 10H15.8333"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 15H13.8333"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <Dropdown
              btnClass="!min-w-42.5 xl:!min-w-48.5"
              placeholder={sortBy}
              items={[
                { name: "Sort by" },
                { name: "Sort Price" },
                { name: "Sort Date" },
                { name: "Sort Name" },
              ]}
              onSelect={(item) => setSortBy(item.name as string)}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 5H13.8333"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 10H15.8333"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 15H13.8333"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Inventory Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 pd:10">
          {inventoryLoading ? (
            <div className="col-span-full text-center py-20 text-white">
              Loading inventory...
            </div>
          ) : error ? ( // Display error message if there is an error
            <div className="col-span-full text-center py-20 text-red-500">
              Error: {error}
              <br />
              Please make sure you are logged in and refresh the page.
            </div>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item) => {
              const weapon = getWeaponData(item);
              if (!weapon) return null; // Should not happen with the updated filter, but good for safety

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
              {inventoryData.length === 0
                ?  
                   "Your inventory is empty. Start opening cases to collect items!"
                  : "Please log in to view your inventory"
              }
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !inventoryLoading && !error && ( // Hide pagination if error
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border border-white/10 transition-colors ${
                      currentPage === page
                        ? "bg-[#51FF2D] text-black font-bold"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}