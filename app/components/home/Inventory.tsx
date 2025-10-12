"use client";

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

const DEFAULT_CASE_IMAGE = "/img/default_case_placeholder.png";

type Props = {
  loginAuth?: boolean;
  baseUrl?: string;
};

// Interface for User's Personal Inventory Items
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
  base_weapon: {
    id: string;
    name: string;
    description: string;
    image: string;
    rarity: string | null;
    price: string;
  } | null;
  crate_open: {
    weapon: {
      id: string;
      name: string;
      description: string;
      image: string;
      rarity: string | null;
      price: string;
    };
  } | null;
}

interface InventoryApiResponse {
  status: boolean;
  message: string;
  data: InventoryItem[];
}

// Interface for All Available Cases
interface Crate {
  id: string;
  name: string;
  image: string | null;
  price: string;
  rarity: {
    name: string;
    color: string;
  } | null;
}

interface CratesApiResponse {
  crates: {
    data: Crate[];
  };
}

export default function Inventory({
  loginAuth,
  baseUrl = "https://backend.bismeel.com",
}: Props) {
  // States for User's Personal Inventory
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All Rarities");
  const [sortBy, setSortBy] = useState("Sort by");
  const [stats, setStats] = useState({
    totalItems: 0,
    avgValue: 0,
    legendaryPlus: 0,
    highestValue: 0,
  });

  // States for All Available Cases
  const [allCases, setAllCases] = useState<Crate[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);

  useEffect(() => {
    if (loginAuth) {
      fetchInventory();
    } else {
      setInventoryLoading(false);
    }
  }, [currentPage, loginAuth]);

  useEffect(() => {
    calculateStats();
  }, [inventoryData]);

  useEffect(() => {
    fetchAllCases();
  }, []);

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    const authData = localStorage.getItem("auth");
    if (!authData) return null;
    try {
      return JSON.parse(authData).token;
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

  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);
      const response = await fetch(`${baseUrl}/api/inventory`, {
        headers: getHeaders(),
      });
      const data: InventoryApiResponse = await response.json();
      if (data.status && data.data) {
        setInventoryData(data.data);
      } else {
        setInventoryData([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryData([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  const fetchAllCases = async () => {
    try {
      setCasesLoading(true);
      const response = await fetch(`${baseUrl}/api/cases`);
      const data: CratesApiResponse = await response.json();
      if (data.crates && data.crates.data) {
        setAllCases(data.crates.data);
      } else {
        setAllCases([]);
      }
    } catch (error) {
      console.error("Error fetching all cases:", error);
      setAllCases([]);
    } finally {
      setCasesLoading(false);
    }
  };

  const calculateStats = () => {
    if (inventoryData.length === 0) {
      setStats({
        totalItems: 0,
        avgValue: 0,
        legendaryPlus: 0,
        highestValue: 0,
      });
      return;
    }
    const totalItems = inventoryData.length;
    const totalValue = inventoryData.reduce((sum, item) => {
      const weapon = item.base_weapon || item.crate_open?.weapon;
      return sum + parseFloat(weapon?.price || "0");
    }, 0);
    const avgValue = totalItems > 0 ? totalValue / totalItems : 0;
    const legendaryPlus = inventoryData.filter((item) => {
      const weapon = item.base_weapon || item.crate_open?.weapon;
      return weapon?.rarity === "Legendary" || weapon?.rarity === "Mythical";
    }).length;
    const highestValue = Math.max(
      0,
      ...inventoryData.map((item) => {
        const weapon = item.base_weapon || item.crate_open?.weapon;
        return parseFloat(weapon?.price || "0");
      })
    );
    setStats({
      totalItems,
      avgValue: parseFloat(avgValue.toFixed(2)),
      legendaryPlus,
      highestValue: parseFloat(highestValue.toFixed(2)),
    });
  };

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

  const getRarityColor = (rarity: string | null): string => {
    const rarityColors: { [key: string]: string } = {
      Common: "#BFC0D8",
      Uncommon: "#39FF67",
      Rare: "#4FC8FF",
      Mythical: "#C324E7",
      Legendary: "#E94444",
    };
    return rarityColors[rarity || "Common"] || "#BFC0D8";
  };

  const getRarityColorForCrate = (rarity: Crate["rarity"]): string => {
    return rarity?.color || "#BFC0D8";
  };

  const getWeaponData = (item: InventoryItem) =>
    item.base_weapon || item.crate_open?.weapon;

  const getFilteredData = () => {
    let filtered = [...inventoryData];
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        getWeaponData(item)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    if (selectedRarity !== "All Rarities") {
      filtered = filtered.filter(
        (item) => getWeaponData(item)?.rarity === selectedRarity
      );
    }
    if (sortBy === "Sort Price") {
      filtered.sort(
        (a, b) =>
          parseFloat(getWeaponData(b)?.price || "0") -
          parseFloat(getWeaponData(a)?.price || "0")
      );
    } else if (sortBy === "Sort Date") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "Sort Name") {
      filtered.sort((a, b) =>
        (getWeaponData(a)?.name || "").localeCompare(
          getWeaponData(b)?.name || ""
        )
      );
    }
    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* --- Banner Section (UI Restored) --- */}
      <div className="bg-[#1C1E2D] border border-solid border-white/10 rounded-3xl p-6 md:p-8 lg:py-11 lg:px-13 relative z-1 overflow-hidden mb-4 md:mb-5 lg:mb-6">
        {!loginAuth ? (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-[-10%] -z-1 bg-[#51FF2D] size-70 lg:size-92 rounded-full blur-[200px]"></div>
            <div className="absolute top-1/2 -translate-y-4 right-[-12%] -z-1 bg-[#51FF2D] size-70 lg:size-92 rounded-full blur-[200px]"></div>
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
              <h1 className="text-4xl !leading-[130%] mb-2">Inventory</h1>
              <h4 className="text-base text-white font-bold">
                CleanCase Inventory
              </h4>
              <div className="border border-solid border-white/16 my-3 max-w-84"></div>
              <p className="text-base !leading-normal max-w-85 mb-6">
                Play lotteries online and hit the jackpot! Great Bonus For Every
                Deposit
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Link
                  href="/login"
                  className="grow gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold"
                >
                  <span className="px-5 md:px-7 lg:px-9 xl:px-13">
                    Play Now
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="grow border border-solid border-white/10 rounded-full p-px overflow-hidden bg-[#1719253D] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold hover:bg-[#51FF2D]/30"
                >
                  <span className="px-5 md:px-7 lg:px-9 xl:px-13">
                    How to Play
                  </span>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-[-60%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-30%] lg:bottom-[-50%] right-20 -z-1 bg-[#702AEC] size-30 md:size-50 lg:size-75 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[-62%] -z-1 bg-[#702AEC] size-70 md:size-150 lg:size-215 rounded-full blur-[150px]"></div>
            <div className="max-w-133 text-center md:text-start">
              <img
                src="/img/home/img_1.png"
                className="absolute hidden md:block bottom-0 right-0 md:max-w-80 lg:max-w-100 -z-1"
                alt=""
              />
              <h1 className="text-3xl md:text-4xl mb-4 !leading-[130%]">
                Earn rewards and cash out instantly fast & easy
              </h1>
              <p className="text-base !leading-normal mb-6">
                Earn real rewards by completing simple tasks, playing exciting
                games, and inviting your friends to join the fun.
              </p>
              <Link
                href="/login"
                className="min-w-45 max-w-full md:w-max gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 flex items-center justify-center text-white font-bold"
              >
                <span className="px-5">Buy Now</span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* --- User's Personal Inventory Section --- */}
      {loginAuth && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {userInfo.map((item, index) => (
              <InfoCard2
                key={index}
                labelClass="justify-center md:justify-between"
                item={item}
              />
            ))}
          </div>
          <div className="flex flex-col gap-y-5 mt-6 md:mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
              <Input
                type="text"
                placeholder="Search your items"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-8 pd:10">
              {inventoryLoading ? (
                <div className="col-span-full text-center py-20 text-white">
                  Loading your inventory...
                </div>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => {
                  const weapon = getWeaponData(item);
                  if (!weapon) return null;
                  return (
                    <BuyCard
                      item={{
                        id: item.id.toString(),
                        img: weapon.image,
                        price: `$${parseFloat(weapon.price).toFixed(2)}`,
                        des: weapon.name,
                        color: getRarityColor(weapon.rarity),
                        btn: "Sell Now",
                      }}
                      key={item.id}
                      path={`/inventory/${item.id}`}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20 text-white/60">
                  Your inventory is empty.
                </div>
              )}
            </div>
            {totalPages > 1 && !inventoryLoading && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {/* Pagination UI yahan aayega */}
              </div>
            )}
          </div>
        </>
      )}

      {/* --- NAYA SECTION: All Available Cases --- */}
      <div className="mt-12 md:mt-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          Explore Our Cases
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {casesLoading ? (
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-[#1C1E2D]/50 border border-white/10 rounded-2xl h-64"
              ></div>
            ))
          ) : allCases.length > 0 ? (
            allCases.map((crate) => (
              <BuyCard
                key={crate.id}
                item={{
                  id: crate.id,
                  img: crate.image || DEFAULT_CASE_IMAGE,
                  price: `$${parseFloat(crate.price).toFixed(2)}`,
                  des: crate.name,
                  color: getRarityColorForCrate(crate.rarity),
                  btn: "View Case",
                }}
                path={`/case/${crate.id}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-white/60">
              No cases available at the moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
