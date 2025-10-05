"use client";

import WeaponsCollection from "@/app/components/dashboard/WeaponsCollection";
import Dropdown from "@/app/components/ui/Dropdown";
import Input from "@/app/components/ui/Input";
import React, { useState, useEffect } from "react";
import { Filter, Plus } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

type Props = {};

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

interface CardData {
  id: string;
  title: string;
  img: string;
  price: number;
  percent: number;
  color: string;
  color2: string;
}

interface NewCaseItem {
  name: string;
  price: string;
  description: string;
  probability: string;
  rarity: string;
  image: string;
}

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

export default function Page({}: Props) {
  // --- States ---
  const [weapons, setWeapons] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCaseItems, setNewCaseItems] = useState<NewCaseItem[]>([
    {
      name: "",
      price: "",
      description: "",
      probability: "",
      rarity: "Common",
      image: "",
    },
  ]);
  const [search, setSearch] = useState("");

  const fetchWeapons = async () => {
    try {
      setIsLoading(true);
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) throw new Error("Authorization token not found.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/weapons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data.");

      const result = await response.json();
      const weaponsArray = result.data.data;

      const defaultColors = [
        { color: "#FB8609", color2: "#4A3426" },
        { color: "#236DFF", color2: "#203057" },
        { color: "#C324E7", color2: "#3D2053" },
        { color: "#4FC8FF", color2: "#29455C" },
        { color: "#97F506", color2: "#354A26" },
        { color: "#702AEC", color2: "#2D2154" },
      ];

      const formattedData: CardData[] = weaponsArray.map(
        (weapon: ApiWeapon, index: number) => ({
          id: weapon.id,
          title: weapon.name,
          img: weapon.image,
          price: parseFloat(weapon.price) || 0,
          percent: weapon.probability ? weapon.probability * 100 : 0,
          ...defaultColors[index % defaultColors.length],
        })
      );

      setWeapons(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeapons();
  }, []);

  const handleDeleteWeapon = async (weaponId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1C1E2D",
      color: "#FFFFFF",
    });

    if (result.isConfirmed) {
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) {
        Swal.fire({
          title: "Error!",
          text: "Authentication error. Please log in again.",
          icon: "error",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/weapons/${weaponId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete the weapon.");
        }
        const deleteResult = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: deleteResult.message || "The weapon has been deleted.",
          icon: "success",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
        setWeapons((prevWeapons) =>
          prevWeapons.filter((weapon) => weapon.id !== weaponId)
        );
      } catch (err: any) {
        console.error("Deletion failed:", err);
        Swal.fire({
          title: "Error!",
          text: `Failed to delete: ${err.message}`,
          icon: "error",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
      }
    }
  };

  const handleCaseItemChange = (
    index: number,
    field: keyof NewCaseItem,
    value: any
  ) => {
    const updatedItems = [...newCaseItems];
    (updatedItems[index][field] as any) = value;
    setNewCaseItems(updatedItems);
  };

  const addNewCaseForm = () => {
    setNewCaseItems([
      ...newCaseItems,
      {
        name: "",
        price: "",
        description: "",
        probability: "",
        rarity: "Common",
        image: "",
      },
    ]);
  };

  const handlePublish = async () => {
    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    setIsSubmitting(true);

    const submissionPromises = newCaseItems.map((item) => {
      if (!item.name || !item.price || !item.image) {
        return Promise.resolve(null);
      }

      const numericPrice = parseFloat(item.price.replace("$", ""));
      const numericProb = parseFloat(item.probability.replace("%", "")) / 100;

      const payload = {
        name: item.name,
        description: item.description,
        price: isNaN(numericPrice) ? 0 : numericPrice,
        probability: isNaN(numericProb) ? null : numericProb,
        image: item.image,
        rarity: item.rarity,
      };

      return fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/weapons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    });

    try {
      const responses = await Promise.all(submissionPromises);
      let successCount = 0;
      let errorMessages = [];
      for (const response of responses) {
        if (response && response.ok) {
          successCount++;
        } else if (response && response.status === 422) {
          const errorData = await response.json();
          const fieldErrors = Object.values(errorData.errors).flat().join("\n");
          errorMessages.push(fieldErrors);
        }
      }

      if (successCount > 0) {
        Swal.fire(
          "Success!",
          `${successCount} weapon(s) created successfully!`,
          "success"
        );
        setNewCaseItems([
          {
            name: "",
            price: "",
            description: "",
            probability: "",
            rarity: "Common",
            image: "",
          },
        ]);
        fetchWeapons();
      }

      if (errorMessages.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          text: "Failed to create some weapons:\n" + errorMessages.join("\n\n"),
        });
      }
    } catch (error) {
      console.error("Error creating weapon:", error);
      Swal.fire(
        "Error!",
        "An error occurred. Check the console for details.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5 xl:gap-6">
      <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
          <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
            Weapons Database
          </h3>
          <span className="text-sm text-[#6F7083]">
            {weapons.length} Weapons
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 relative z-10">
          <Input
            type="search"
            placeholder="Search"
            className="md-col-span-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dropdown
            btnClass="md:col-span-1"
            placeholder="All Rarities"
            items={[{ name: "All Rarities" }]}
            leftIcon={<Filter color="white" size={20} strokeWidth={1.5} />}
          />
        </div>

        {isLoading ? (
          <p className="text-white text-center">Loading weapons...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-4">
            {weapons.map((item) => (
              <Link href={`/dashboard/weapons/${item.id}`} key={item.id}>
                <WeaponsCollection item={item} onDelete={handleDeleteWeapon} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="">
        <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
            <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
              Create New Case
            </h3>
            <span className="text-sm text-[#6F7083]">
              <span className="text-primary">0.00%</span> total
            </span>
          </div>
          <div className="flex flex-col gap-y-6 mb-3 md:mb-4 xl:mb-5">
            {newCaseItems.map((item, index) => (
              <div className="flex flex-col gap-y-4" key={index}>
                <Input
                  value={item.image}
                  onChange={(e) =>
                    handleCaseItemChange(index, "image", e.target.value)
                  }
                  inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                  type="text"
                  labelClass="!mb-2 !text-[#BFC0D8]"
                  label="Image URL"
                  placeholder="https://example.com/image.png"
                />
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-7 md:col-span-8">
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        handleCaseItemChange(index, "name", e.target.value)
                      }
                      inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                      type="text"
                      labelClass="!mb-2 !text-[#BFC0D8]"
                      label="Product Title"
                      placeholder="P250 Sand Dune"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-4">
                    <Input
                      value={item.price}
                      onChange={(e) =>
                        handleCaseItemChange(index, "price", e.target.value)
                      }
                      inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                      type="text"
                      labelClass="!mb-2 !text-[#BFC0D8]"
                      label="Price"
                      placeholder="11.50"
                    />
                  </div>
                  <div className="col-span-7 md:col-span-8">
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        handleCaseItemChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                      type="text"
                      labelClass="!mb-2 !text-[#BFC0D8]"
                      label="Sub Title (Description)"
                      placeholder="Spectrum Case"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-4">
                    <Input
                      value={item.probability}
                      onChange={(e) =>
                        handleCaseItemChange(
                          index,
                          "probability",
                          e.target.value
                        )
                      }
                      inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                      type="text"
                      labelClass="!mb-2 !text-[#BFC0D8]"
                      label="Probability"
                      placeholder="25%"
                    />
                  </div>
                </div>
                <Dropdown
                  btnClass="md:col-span-1"
                  placeholder={item.rarity}
                  onSelect={(selectedItem) =>
                    handleCaseItemChange(index, "rarity", selectedItem.name)
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
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={addNewCaseForm}
              className="w-full gap-1 px-1 font-normal md:font-semibold btn text-sm md:text-base bg-none min-h-11 md:min-h-13 shadow-none bg-primary rounded-xl !border-t !border-white/25 border-0"
            >
              <Plus color="white" size={21} strokeWidth={2} />
              Add Case Items
            </button>
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-11 md:min-h-13 flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
