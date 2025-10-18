"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Dropdown from "@/app/components/ui/Dropdown";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/app/contexts/ToastContext';
// --- Interfaces ---
interface ApiWeapon {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: string | null;
  price: string;
  probability: number | null;
}

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function WeaponDetailPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
const { showToast } = useToast();
  const [weapon, setWeapon] = useState<ApiWeapon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchWeaponDetails = async () => {
      // ... (Data fetching logic waisi hi rahegi)
      setIsLoading(true);
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) {
        setError("Authentication token not found.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/weapons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch weapon details.");
        const result = await response.json();
        setWeapon(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeaponDetails();
  }, [id]);

  const handleUpdateWeapon = async () => {
    // ... (Update logic waisi hi rahegi)
    if (!weapon) return;
    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
     showToast({
  type: 'error',
  title: 'Error!',
  message: 'Authentication error.'
});
      return;
    }
    setIsUpdating(true);
    const numericProb = weapon.probability
      ? parseFloat(String(weapon.probability).replace("%", "")) / 100
      : null;
    const payload = {
      name: weapon.name,
      description: weapon.description,
      price: parseFloat(weapon.price) || 0,
      probability: numericProb,
      image: weapon.image,
      rarity: weapon.rarity,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/weapons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update weapon.");
      }
      const updateResult = await response.json();
    showToast({
  type: 'success',
  title: 'Success!',
  message: updateResult.message || 'Weapon updated successfully!'
});
// Remove the 'await' keyword since showToast doesn't return a promise
      router.push("/dashboard/weapons");
    } catch (err: any) {
    showToast({
  type: 'error',
  title: 'Error!',
  message: `Update failed: ${err.message}`
});
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: keyof ApiWeapon, value: any) => {
    if (weapon) {
      setWeapon({ ...weapon, [field]: value });
    }
  };

  if (isLoading)
    return (
      <p className="text-white text-center p-10">Loading Weapon Details...</p>
    );
  if (error)
    return <p className="text-red-500 text-center p-10">Error: {error}</p>;
  if (!weapon)
    return <p className="text-white text-center p-10">Weapon not found.</p>;

  // <-- YAHAN SE JSX (DESIGN) MEIN TABDEELI HAI -->
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/weapons"
            className="flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Weapons List
          </Link>
          <h3 className="text-white text-lg md:text-xl font-bold">
            Update Weapon Details
          </h3>
        </div>

        {/* --- NAYA CARD LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* --- LEFT SIDE: IMAGE CARD --- */}
          <div className="lg:col-span-1">
            <div
              className="relative z-1 rounded-xl overflow-hidden group h-full flex flex-col justify-center items-center p-4"
              style={{
                border: "double 1px transparent",
                backgroundImage: `linear-gradient(#1C1E2D, #1C1E2D), linear-gradient(#4A3426 95%, #FB8609 100%)`,
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              <p className="absolute top-4 left-4 bg-white/8 rounded-full text-white/80 text-xs h-6 px-3 flex items-center">
                {weapon.probability
                  ? `${(weapon.probability * 100).toFixed(2)}%`
                  : "N/A"}
              </p>
              <img
                src={weapon.image}
                alt={weapon.name}
                className="w-full h-52 object-contain mx-auto pointer-events-none"
              />
              <div className="w-full flex flex-col items-center gap-1.5 text-sm mt-4">
                <h4 className="text-xl text-white font-black text-center">
                  {weapon.name}
                </h4>
                <span className="text-primary font-bold text-lg">
                  $
                  {typeof weapon.price === "number" ||
                  typeof weapon.price === "string"
                    ? parseFloat(weapon.price).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-40 rounded-[100%] -z-1 blur-[80px]"
                style={{ backgroundColor: "#FB8609" }}
              />
            </div>
          </div>

          {/* --- RIGHT SIDE: UPDATE FORM --- */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="flex flex-col gap-y-4">
              <Input
                value={weapon.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                type="text"
                labelClass="!mb-2 !text-[#BFC0D8]"
                label="Product Title"
              />
              <Input
                value={weapon.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                type="text"
                labelClass="!mb-2 !text-[#BFC0D8]"
                label="Sub Title (Description)"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={weapon.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                  type="text"
                  labelClass="!mb-2 !text-[#BFC0D8]"
                  label="Price"
                />
                <Input
                  value={
                    weapon.probability !== null
                      ? `${weapon.probability * 100}%`
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("probability", e.target.value)
                  }
                  inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                  type="text"
                  labelClass="!mb-2 !text-[#BFC0D8]"
                  label="Probability"
                />
              </div>
              <Input
                value={weapon.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                type="text"
                labelClass="!mb-2 !text-[#BFC0D8]"
                label="Image URL"
              />
              <Dropdown
                btnClass="w-full"
                placeholder={weapon.rarity || "Select Rarity"}
                onSelect={(selectedItem) =>
                  handleInputChange("rarity", selectedItem.name)
                }
                items={[
                  { name: "Common", color: "#C0C4CE" },
                  { name: "Uncommon", color: "#39FF67" },
                  { name: "Rare", color: "#236DFF" },
                  { name: "Epic", color: "#702AEC" },
                  { name: "Legendary", color: "#FF8809" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* --- UPDATE BUTTON AT THE BOTTOM --- */}
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={handleUpdateWeapon}
            disabled={isUpdating}
            className="w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-11 md:min-h-13 flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
