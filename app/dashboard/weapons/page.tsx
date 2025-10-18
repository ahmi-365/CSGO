"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, GripVertical, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import  Input from "@/app/components/ui/Input";

// --- Interfaces ---
interface ApiWeapon {
  id: string;
  name: string;
  description: string;
  image: string;
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

interface NewItem {
  name: string;
  price: string;
  description: string;
  probability: string;
  image: string;
  type: string;
  rarity_id: string;
}

interface DroppedWeapon extends CardData {
  dropProbability?: number;
}

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

export default function Page() {
  // --- States ---
  const [weapons, setWeapons] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItems, setNewItems] = useState<NewItem[]>([
    {
      name: "",
      price: "",
      description: "",
      probability: "",
      image: "",
      type: "weapon",
      rarity_id: "",
    },
  ]);
  const [search, setSearch] = useState("");
  const [rarities, setRarities] = useState<any[]>([]);
  
  // Case creation states
  const [showDropZone, setShowDropZone] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [createdCaseName, setCreatedCaseName] = useState<string>("");
  const [droppedWeapons, setDroppedWeapons] = useState<DroppedWeapon[]>([]);
  const [draggedWeapon, setDraggedWeapon] = useState<CardData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Filter weapons based on search
  const filteredWeapons = weapons.filter((weapon) =>
    weapon.title.toLowerCase().includes(search.toLowerCase())
  );

  const fetchWeapons = async () => {
    try {
      setIsLoading(true);
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) throw new Error("Authorization token not found.");

      const response = await fetch(`${baseUrl}/api/admin/weapons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const fetchRarities = async () => {
    try {
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) return;

      const response = await fetch(`${baseUrl}/api/admin/rarities`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRarities(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching rarities:", err);
    }
  };

  useEffect(() => {
    fetchWeapons();
    fetchRarities();
  }, []);

  const handleItemChange = (
    index: number,
    field: keyof NewItem,
    value: any
  ) => {
    const updatedItems = [...newItems];
    (updatedItems[index][field] as any) = value;
    setNewItems(updatedItems);
  };

  const addNewItemForm = () => {
    setNewItems([
      ...newItems,
      {
        name: "",
        price: "",
        description: "",
        probability: "",
        image: "",
        type: "weapon",
        rarity_id: "",
      },
    ]);
  };

  const handlePublish = async () => {
    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "You are not logged in.",
        icon: "error",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
      return;
    }

    // Check if any item is a case
    const caseItems = newItems.filter(item => item.type === "case");
    const weaponItems = newItems.filter(item => item.type === "weapon");

    // Validate
    const invalidItems = newItems.filter(
      (item) => !item.name || !item.price || !item.image
    );

    if (invalidItems.length > 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields (Name, Price, and Image) for all items.",
        icon: "warning",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let successCount = 0;
      let errorMessages: string[] = [];

      // Create weapons
      for (const item of weaponItems) {
        const numericPrice = parseFloat(item.price.replace("$", ""));
        const numericProb = parseFloat(item.probability.replace("%", "")) / 100;

        const payload = {
          name: item.name,
          description: item.description,
          price: isNaN(numericPrice) ? 0 : numericPrice,
          probability: isNaN(numericProb) ? null : numericProb,
          image: item.image,
        };

        const response = await fetch(`${baseUrl}/api/admin/weapons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          if (response.status === 422 && errorData.errors) {
            const fieldErrors = Object.values(errorData.errors)
              .flat()
              .join("\n");
            errorMessages.push(fieldErrors);
          } else if (errorData.message) {
            errorMessages.push(errorData.message);
          }
        }
      }

      // Create cases
      for (const item of caseItems) {
        const numericPrice = parseFloat(item.price.replace("$", ""));

        const payload = {
          name: item.name,
          description: item.description || null,
          price: isNaN(numericPrice) ? 0 : numericPrice,
          image: item.image,
          type: "Case",
          rarity_id: item.rarity_id,
          first_sale_date: "",
          market_hash_name: "",
          rental: true,
          model_player: "",
          loot_name: null,
          loot_footer: null,
          loot_image: null,
        };

        const response = await fetch(`${baseUrl}/api/admin/crates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          successCount++;
          const caseData = await response.json();
          const newCaseId = caseData.crate?.id || caseData.id;
          
          // Show drop zone for weapon assignment
          setCreatedCaseId(newCaseId);
          setCreatedCaseName(item.name);
          setShowDropZone(true);
        } else {
          const errorData = await response.json();
          if (response.status === 422 && errorData.errors) {
            const fieldErrors = Object.values(errorData.errors)
              .flat()
              .join("\n");
            errorMessages.push(fieldErrors);
          } else if (errorData.message) {
            errorMessages.push(errorData.message);
          }
        }
      }

      if (successCount > 0 && caseItems.length === 0) {
        Swal.fire({
          title: "Success!",
          text: `${successCount} item(s) created successfully!`,
          icon: "success",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
        setNewItems([
          {
            name: "",
            price: "",
            description: "",
            probability: "",
            image: "",
            type: "weapon",
            rarity_id: "",
          },
        ]);
        fetchWeapons();
      }

      if (errorMessages.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          text: "Failed to create some items:\n" + errorMessages.join("\n\n"),
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
      }
    } catch (error) {
      console.error("Error creating item:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Check the console for details.",
        icon: "error",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (weapon: CardData) => {
    setDraggedWeapon(weapon);
  };

  const handleDragEnd = () => {
    setDraggedWeapon(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (draggedWeapon && !droppedWeapons.find((w) => w.id === draggedWeapon.id)) {
      setDroppedWeapons([...droppedWeapons, { ...draggedWeapon, dropProbability: 0 }]);
    }
    setDraggedWeapon(null);
  };

  const handleRemoveWeapon = (weaponId: string) => {
    setDroppedWeapons(droppedWeapons.filter((w) => w.id !== weaponId));
  };

  const handleProbabilityChange = (weaponId: string, value: string) => {
    setDroppedWeapons(
      droppedWeapons.map((w) =>
        w.id === weaponId ? { ...w, dropProbability: parseFloat(value) || 0 } : w
      )
    );
  };

  const handleConfirmWeapons = async () => {
    if (!createdCaseId || droppedWeapons.length === 0) {
      Swal.fire({
        title: "No Weapons",
        text: "Please drag at least one weapon to assign to the case.",
        icon: "warning",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
      return;
    }

    const authData = getAuthData();
    const token = authData?.token;
    if (!token) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/crates/${createdCaseId}/assign-weapons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weapon_ids: droppedWeapons.map((w) => w.id),
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: `Case created successfully with ${droppedWeapons.length} weapon(s) assigned!`,
          icon: "success",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
        
        // Reset everything
        setShowDropZone(false);
        setCreatedCaseId(null);
        setCreatedCaseName("");
        setDroppedWeapons([]);
        setNewItems([
          {
            name: "",
            price: "",
            description: "",
            probability: "",
            image: "",
            type: "weapon",
            rarity_id: "",
          },
        ]);
        fetchWeapons();
      } else {
        throw new Error("Failed to assign weapons");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to assign weapons to the case.",
        icon: "error",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
    }
  };

  const handleSkipWeapons = () => {
    Swal.fire({
      title: "Success!",
      text: "Case created successfully without weapons!",
      icon: "success",
      background: "#1C1E2D",
      color: "#FFFFFF",
    });
    
    setShowDropZone(false);
    setCreatedCaseId(null);
    setCreatedCaseName("");
    setDroppedWeapons([]);
    setNewItems([
      {
        name: "",
        price: "",
        description: "",
        probability: "",
        image: "",
        type: "weapon",
        rarity_id: "",
      },
    ]);
  };

  const totalProbability = droppedWeapons.reduce(
    (sum, w) => sum + (w.dropProbability || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5 xl:gap-6">
      {/* Left Panel - Weapons Database */}
      <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
          <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
            Weapons Database
          </h3>
          <span className="text-sm text-[#6F7083]">
            {filteredWeapons.length} Weapons
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-4 relative z-10">
          < Input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=""
          />
        </div>

        {isLoading ? (
          <p className="text-white text-center">Loading weapons...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-4">
            {filteredWeapons.length > 0 ? (
              filteredWeapons.map((item) => (
                <div
                  key={item.id}
                  draggable={showDropZone}
                  onDragStart={() => handleDragStart(item)}
                  onDragEnd={handleDragEnd}
                  className={`relative rounded-xl overflow-hidden ${
                    showDropZone ? "cursor-move" : ""
                  }`}
                  style={{
                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color2} 100%)`,
                  }}
                >
                  {showDropZone && (
                    <div className="absolute top-2 right-2 z-10">
                      <GripVertical size={16} className="text-white/60" />
                    </div>
                  )}
                  <Link href={`/dashboard/weapons/${item.id}`}>
                    <div className="p-3">
                      <div className="flex justify-center mb-2">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-24 object-contain"
                        />
                      </div>
                      <h4 className="text-white text-sm font-semibold mb-1 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs font-bold">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-white/60 text-xs">
                          {item.percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-white/60">
                  No weapons found matching "{search}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div>
        {!showDropZone ? (
          // Create Form
          <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
              <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
                Create New Item
              </h3>
              <span className="text-sm text-[#6F7083]">
                <span className="text-primary">0.00%</span> total
              </span>
            </div>
            <div className="flex flex-col gap-y-6 mb-3 md:mb-4 xl:mb-5">
              {newItems.map((item, index) => (
                <div className="flex flex-col gap-y-4" key={index}>
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Type
                    </label>
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleItemChange(index, "type", e.target.value)
                      }
                      className="w-full bg-blur border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C8D0FF]"
                    >
                      <option value="weapon" className="text-black">Weapon</option>
                      <option value="case" className="text-black">Case</option>
                    </select>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                      Image URL
                    </label>
                    < Input
                      value={item.image}
                      onChange={(e) =>
                        handleItemChange(index, "image", e.target.value)
                      }
                      className=" "
                      type="text"
                      placeholder="https://example.com/image.png"
                    />
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    {/* Product Title */}
                    <div className="col-span-7 md:col-span-8">
                      <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                        Product Title
                      </label>
                      < Input
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className=" "
                        type="text"
                        placeholder={item.type === "case" ? "Chroma Case" : "P250 Sand Dune"}
                      />
                    </div>

                    {/* Price */}
                    <div className="col-span-5 md:col-span-4">
                      <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                        Price
                      </label>
                      < Input
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        className=" "
                        type="text"
                        placeholder="11.50"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-7 md:col-span-8">
                      <label className="">
                        Sub Title (Description)
                      </label>
                      < Input
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className=""
                        type="text"
                        placeholder="Spectrum Case"
                      />
                    </div>

                    {/* Probability (only for weapons) / Rarity (only for cases) */}
                    <div className="col-span-5 md:col-span-4">
                      {item.type === "weapon" ? (
                        <>
                          <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                            Probability
                          </label>
                          < Input
                            value={item.probability}
                            onChange={(e) =>
                              handleItemChange(index, "probability", e.target.value)
                            }
                            className=" "
                            type="text"
                            placeholder="25%"
                          />
                        </>
                      ) : (
                        <>
                          <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                            Rarity
                          </label>
                          <select
                            value={item.rarity_id}
                            onChange={(e) =>
                              handleItemChange(index, "rarity_id", e.target.value)
                            }
                            className="w-full bg-blur border border-white/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#C8D0FF]"
                          >
                            <option value="">Select</option>
                            {rarities.map((rarity) => (
                              <option key={rarity.id} value={rarity.id}>
                                {rarity.name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={addNewItemForm}
                className="w-full gap-1 px-1 font-normal md:font-semibold btn text-sm md:text-base bg-none min-h-11 md:min-h-13 shadow-none bg-primary rounded-xl !border-t !border-white/25 border-0"
              >
                <Plus color="white" size={21} strokeWidth={2} />
                Add More Items
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
        ) : (
          // Drop Zone for Weapon Assignment
          <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
            <div className="mb-4">
              <h3 className="text-white text-base md:text-lg font-bold mb-2">
                Assign Weapons to: {createdCaseName}
              </h3>
              <p className="text-sm text-[#6F7083]">
                Drag weapons from left and drop them here
              </p>
              <div className="mt-2">
                <span className="text-sm">
                  <span
                    className={
                      totalProbability > 100 ? "text-red-400" : "text-primary"
                    }
                  >
                    {totalProbability.toFixed(2)}%
                  </span>
                  <span className="text-[#6F7083]"> total probability</span>
                </span>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 min-h-[400px] transition-colors mb-4 ${
                isDragOver
                  ? "border-primary bg-primary/10"
                  : "border-white/20 bg-white/5"
              }`}
            >
              {droppedWeapons.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Plus size={32} className="text-white/40" />
                  </div>
                  <p className="text-white/60 text-lg">
                    Drop weapons here to assign
                  </p>
                  <p className="text-white/40 text-sm mt-2">
                    Drag from the left panel
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {droppedWeapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      className="bg-[#1A1D29] rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <img
                          src={weapon.img}
                          alt={weapon.title}
                          className="w-16 h-16 object-contain rounded"
                        />
                        <button
                          onClick={() => handleRemoveWeapon(weapon.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-white mb-1 truncate">
                        {weapon.title}
                      </p>
                      <p className="text-xs text-primary mb-2">
                        ${weapon.price.toFixed(2)}
                      </p>
                      < Input
                        type="number"
                        step="0.01"
                        placeholder="Probability %"
                        value={weapon.dropProbability || ""}
                        onChange={(e) =>
                          handleProbabilityChange(weapon.id, e.target.value)
                        }
                        className="w-full bg-[#0D0F14] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary"
                      /></div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSkipWeapons}
                className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white font-semibold transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleConfirmWeapons}
                className="w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] min-h-[52px] flex items-center justify-center text-white font-bold"
              >
                Confirm & Assign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}