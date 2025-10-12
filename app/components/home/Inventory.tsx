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

type Props = {
  loginAuth?: boolean;
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

// Cases Types
interface CrateItem {
  id: string;
  rarity_id: string | null;
  name: string;
  image: string | null;
  price: string;
  description: string | null;
  type: string;
  first_sale_date: string | null;
  market_hash_name: string | null;
  rental: boolean;
  model_player: string | null;
  loot_name: string | null;
  loot_footer: string | null;
  loot_image: string | null;
  top: boolean;
  created_at: string;
  updated_at: string;
  skins: any[];
  keys: any[];
  items: any[];
  weapons: any[];
  rarity: {
    id: string;
    name: string;
    color: string;
    created_at: string | null;
    updated_at: string | null;
  } | null;
}

interface CasesApiResponse {
  crates: {
    current_page: number;
    data: CrateItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export default function Inventory({
  loginAuth,
  baseUrl = "https://backend.bismeel.com",
}: Props) {
  // All States
  const [topCrateData, setTopCrateData] = useState<TopCrateData | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [casesData, setCasesData] = useState<CrateItem[]>([]);
  
  const [topCrateLoading, setTopCrateLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [casesLoading, setCasesLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All Rarities");
  const [sortBy, setSortBy] = useState("Sort by");
  
  // Default tab: logged in users see inventory, others see cases
  const [activeTab, setActiveTab] = useState<"inventory" | "cases">(
    loginAuth ? "inventory" : "cases"
  );

  // Fetch all data on component mount
  useEffect(() => {
    fetchTopCrate();
    fetchCases();
    
    if (loginAuth) {
      fetchInventory();
    }
  }, [loginAuth]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
      const response = await fetch(`${baseUrl}/api/inventory`, {
        headers: getHeaders(),
      });
      
      if (response.status === 401) {
        // Unauthorized - user not logged in
        setInventoryData([]);
        return;
      }
      
      const data: InventoryApiResponse = await response.json();

      if (data.status && data.data) {
        setInventoryData(data.data);
      } else {
        console.error("Error fetching inventory:", data.message);
        setInventoryData([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryData([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  // Fetch Cases (for all users)
  const fetchCases = async () => {
    try {
      setCasesLoading(true);
      const response = await fetch(`${baseUrl}/api/cases`);
      const data: CasesApiResponse = await response.json();

      if (data.crates && data.crates.data) {
        setCasesData(data.crates.data);
      } else {
        console.error("Error fetching cases:", data);
        setCasesData([]);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      setCasesData([]);
    } finally {
      setCasesLoading(false);
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
    const avgValue = inventoryData.reduce((sum, item) => {
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

  // Filter and sort data based on active tab
  const getFilteredData = () => {
    if (activeTab === "inventory" && loginAuth) {
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
    } else {
      // Cases tab (for both logged in and logged out users)
      let filtered = [...casesData];

      // Search filter
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }

      // Rarity filter
      if (selectedRarity !== "All Rarities") {
        filtered = filtered.filter((item) => {
          return item.rarity?.name === selectedRarity;
        });
      }

      // Sort
      if (sortBy === "Sort Price") {
        filtered.sort((a, b) => {
          return parseFloat(b.price || "0") - parseFloat(a.price || "0");
        });
      } else if (sortBy === "Sort Date") {
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "Sort Name") {
        filtered.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }

      return filtered;
    }
  };

  const filteredData = getFilteredData();

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Determine which data to show based on login status
  const showInventory = loginAuth && activeTab === "inventory";
  const showCases = !loginAuth || activeTab === "cases";
  const currentLoading = showInventory ? inventoryLoading : casesLoading;
  const currentData = showInventory ? inventoryData : casesData;

  return (
    <>
      {/* Hero Section with Top Crate */}
      <div className="bg-[#1C1E2D] border border-solid border-white/10 rounded-3xl p-6 md:p-8 lg:py-11 lg:px-13 relative z-1 overflow-hidden mb-4 md:mb-5 lg:mb-6">
        {!loginAuth ? (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-[-10%] -z-1 bg-[#51FF2D] size-70 lg:size-92 rounded-full blur-[200px]"></div>
            <div className="absolute top-1/2 -translate-y-4 right-[-12%] -z-1 bg-[#51FF2D] size-70 lg:size-92 rounded-full blur-[200px]"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-[-60%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-30%] lg:bottom-[-50%] right-20 -z-1 bg-[#702AEC] size-30 md:size-50 lg:size-75 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[-62%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
          </>
        )}
        
        {!loginAuth ? (
          <div className="max-w-98 text-center md:text-start">
            <img
              src="/img/inventor/img.png"
              className="absolute hidden md:block bottom-2 right-0 -z-1 mix-blend-color-dodge h-full object-cover opacity-6"
              alt=""
            />
            <img
              src="/img/inventor/img_1.png"
              className="absolute hidden md:block bottom-2 right-0 -z-1 h-full object-cover"
              alt=""
            />
            <img
              src="/img/inventor/img_2.png"
              className="absolute hidden md:block bottom-2 right-30 h-full object-cover z-5"
              alt=""
            />
            <h1 className="text-4xl !leading-[130%] mb-2">Inventory
</h1>
            <h4 className="text-base text-white font-bold">
              CleanCase Collection
            </h4>
            <div className="border border-solid border-white/16 my-3 max-w-84"></div>
            <p className="text-base !leading-normal max-w-85 mb-6">
              Play lotteries online and hit the jackpot! Great Bonus For Every Deposit

            </p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Link
                href="/"
                className="grow gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold"
              >
                <span className="px-5 md:px-7 lg:px-9 xl:px-13">Play Now</span>
              </Link>
              <Link
                href="/"
                className="grow border border-solid border-white/10 rounded-full p-px overflow-hidden bg-[#1719253D] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold hover:bg-[#51FF2D]/30"
              >
                <span className="px-5 md:px-7 lg:px-9 xl:px-13">
                  How to Play
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-133 text-center md:text-start">
            {/* Display top crate data when available */}
            {topCrateData && !topCrateLoading && (
              <>
                <img
                  src={topCrateData.image}
                  className="absolute hidden md:block bottom-0 right-0 md:max-w-80 lg:max-w-100 -z-1"
                  alt={topCrateData.name}
                />
                <h1 className="text-3xl md:text-4xl mb-4 !leading-[130%]">
                  {topCrateData.name}
                </h1>
                <p className="text-base !leading-normal mb-6">
                  {topCrateData.description || "Featured case with exclusive items and rare rewards"}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#51FF2D] font-bold text-xl">
                    ${parseFloat(topCrateData.price).toFixed(2)}
                  </span>
                  <span className="text-white/70">Type: {topCrateData.type}</span>
                  <span className="text-white/70">
                    {activeTab === "inventory" 
                      ? `${inventoryData.length} Items in Inventory` 
                      : `${casesData.length} Cases Available`
                    }
                  </span>
                </div>
                <Link
                  href={`/cases/${topCrateData.id}`}
                  className="min-w-45 max-w-full md:w-max gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold"
                >
                  <span className="px-5">Open Case</span>
                </Link>
              </>
            )}
            {topCrateLoading && (
              <div className="text-white text-center py-8">Loading featured case...</div>
            )}
          </div>
        )}
      </div>

      {/* Tabs for Inventory and Cases (only show for logged in users) */}
      {loginAuth && (
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-3 font-bold text-lg transition-colors ${
              activeTab === "inventory"
                ? "text-[#51FF2D] border-b-2 border-[#51FF2D]"
                : "text-white/60 hover:text-white"
            }`}
          >
            My Inventory ({inventoryData.length})
          </button>
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-6 py-3 font-bold text-lg transition-colors ${
              activeTab === "cases"
                ? "text-[#51FF2D] border-b-2 border-[#51FF2D]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Available Cases ({casesData.length})
          </button>
        </div>
      )}

      {/* Stats only for Inventory tab (only for logged in users) */}
      {loginAuth && activeTab === "inventory" && (
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
            placeholder={
              loginAuth && activeTab === "inventory" 
                ? "Search your inventory..." 
                : "Search cases..."
            }
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
        
        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 pd:10">
          {currentLoading ? (
            <div className="col-span-full text-center py-20 text-white">
              Loading {loginAuth && activeTab === "inventory" ? "inventory" : "cases"}...
            </div>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item) => {
              if (showInventory) {
                const weapon = getWeaponData(item as InventoryItem);
                if (!weapon) return null;

                return (
                  <BuyCard
                    item={{
                      id: (item as InventoryItem).id.toString(),
                      img: weapon.image,
                      price: `$${parseFloat(weapon.price).toFixed(2)}`,
                      des: weapon.name,
                      color: getRarityColor(weapon.rarity),
                      btn: (item as InventoryItem).is_sold ? "Sold" : "Sell Now",
                    }}
                    key={(item as InventoryItem).id}
                    path={`/inventory/${(item as InventoryItem).id}`}
                  />
                );
              } else {
                const crate = item as CrateItem;
                return (
                  <BuyCard
                    item={{
                      id: crate.id,
                      img: crate.image || "/img/default-case.png",
                      price: `$${parseFloat(crate.price).toFixed(2)}`,
                      des: crate.name,
                      color: getRarityColor(crate.rarity?.name || null),
                      btn: "Buy Now",
                    }}
                    key={crate.id}
                    path={`/cases/${crate.id}`}
                  />
                );
              }
            })
          ) : (
            <div className="col-span-full text-center py-20 text-white/60">
              {showInventory
                ? (inventoryData.length === 0 
                    ? "Your inventory is empty. Start opening cases to collect items!"
                    : "No items match your search criteria"
                  )
                : (casesData.length === 0
                    ? "No cases available at the moment."
                    : "No cases match your search criteria"
                  )
              }
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !currentLoading && (
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