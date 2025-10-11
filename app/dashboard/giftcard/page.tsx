"use client";

import WeaponsCollection from "@/app/components/dashboard/WeaponsCollection";
import Input from "@/app/components/ui/Input";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

type Props = {};

// --- Interfaces ---
interface ApiGiftCard {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  first_sale_date: string;
  market_hash_name: string;
  rental: number;
  model_player: string;
  loot_name: string;
  loot_footer: string;
  loot_image: string;
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

interface NewGiftCardItem {
  name: string;
  price: string;
  description: string;
  image: string;
  first_sale_date: string;
  market_hash_name: string;
  rental: string;
  model_player: string;
  loot_name: string;
  loot_footer: string;
  loot_image: string;
}

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

export default function Page({}: Props) {
  // --- States ---
  const [giftCards, setGiftCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGiftCardItems, setNewGiftCardItems] = useState<NewGiftCardItem[]>([
    {
      name: "",
      price: "",
      description: "",
      image: "",
      first_sale_date: "",
      market_hash_name: "",
      rental: "false",
      model_player: "default",
      loot_name: "",
      loot_footer: "",
      loot_image: "",
    },
  ]);
  const [search, setSearch] = useState("");
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter gift cards based on search
  const filteredGiftCards = giftCards.filter((giftCard) =>
    giftCard.title.toLowerCase().includes(search.toLowerCase())
  );

  const fetchGiftCards = async () => {
    try {
      setIsLoading(true);
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) throw new Error("Authorization token not found.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/gift-cards`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data.");

      const result = await response.json();
      const giftCardsArray = result.data.data;

      const defaultColors = [
        { color: "#FB8609", color2: "#4A3426" },
        { color: "#236DFF", color2: "#203057" },
        { color: "#C324E7", color2: "#3D2053" },
        { color: "#4FC8FF", color2: "#29455C" },
        { color: "#97F506", color2: "#354A26" },
        { color: "#702AEC", color2: "#2D2154" },
      ];

      const formattedData: CardData[] = giftCardsArray.map(
        (giftCard: ApiGiftCard, index: number) => ({
          id: giftCard.id,
          title: giftCard.name,
          img: giftCard.image,
          price: parseFloat(giftCard.price) || 0,
          percent: 0, // Gift cards don't have probability
          ...defaultColors[index % defaultColors.length],
        })
      );

      setGiftCards(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const handleDeleteGiftCard = async (giftCardId: string) => {
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/gift-cards/${giftCardId}`,
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
          throw new Error(errorData.message || "Failed to delete the gift card.");
        }
        const deleteResult = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: deleteResult.message || "The gift card has been deleted.",
          icon: "success",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
        setGiftCards((prevGiftCards) =>
          prevGiftCards.filter((giftCard) => giftCard.id !== giftCardId)
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

  const handleGiftCardItemChange = (
    index: number,
    field: keyof NewGiftCardItem,
    value: any
  ) => {
    const updatedItems = [...newGiftCardItems];
    (updatedItems[index][field] as any) = value;
    setNewGiftCardItems(updatedItems);
  };

  const addNewGiftCardForm = () => {
    setEditingCard(null);
    setNewGiftCardItems([
      ...newGiftCardItems,
      {
        name: "",
        price: "",
        description: "",
        image: "",
        first_sale_date: "",
        market_hash_name: "",
        rental: "false",
        model_player: "default",
        loot_name: "",
        loot_footer: "",
        loot_image: "",
      },
    ]);
  };

  const handleCardClick = async (cardId: string) => {
    try {
      const authData = getAuthData();
      const token = authData?.token;
      if (!token) throw new Error("Authorization token not found.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/gift-cards`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data.");

      const result = await response.json();
      const giftCard = result.data.data.find((gc: ApiGiftCard) => gc.id === cardId);
      
      if (giftCard) {
        setEditingCard({
          id: giftCard.id,
          title: giftCard.name,
          img: giftCard.image,
          price: parseFloat(giftCard.price) || 0,
          percent: 0,
          color: "",
          color2: "",
        });
        
        setNewGiftCardItems([{
          name: giftCard.name,
          price: giftCard.price,
          description: giftCard.description || "",
          image: giftCard.image,
          first_sale_date: giftCard.first_sale_date || "",
          market_hash_name: giftCard.market_hash_name || "",
          rental: giftCard.rental ? "true" : "false",
          model_player: giftCard.model_player || "default",
          loot_name: giftCard.loot_name || "",
          loot_footer: giftCard.loot_footer || "",
          loot_image: giftCard.loot_image || "",
        }]);
      }
    } catch (err: any) {
      console.error("Error fetching gift card details:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editingCard) return;
    
    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    const item = newGiftCardItems[0];
    
    if (!item.name || !item.price || !item.image) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields (Name, Price, and Image).",
        icon: "warning",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
      return;
    }

    setIsUpdating(true);

    const numericPrice = parseFloat(item.price.replace("$", ""));

    const payload = {
      name: item.name,
      description: item.description,
      price: isNaN(numericPrice) ? 0 : numericPrice,
      image: item.image,
      first_sale_date: item.first_sale_date || new Date().toISOString().split('T')[0],
      market_hash_name: item.market_hash_name,
      rental: item.rental === "true",
      model_player: item.model_player || "default",
      loot_name: item.loot_name,
      loot_footer: item.loot_footer,
      loot_image: item.loot_image,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/gift-cards/${editingCard.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Gift card updated successfully!",
          icon: "success",
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
        setEditingCard(null);
        setNewGiftCardItems([{
          name: "",
          price: "",
          description: "",
          image: "",
          first_sale_date: "",
          market_hash_name: "",
          rental: "false",
          model_player: "default",
          loot_name: "",
          loot_footer: "",
          loot_image: "",
        }]);
        fetchGiftCards();
      } else {
        const errorData = await response.json();
        let errorMessage = "Failed to update gift card.";
        if (response.status === 422 && errorData.errors) {
          const fieldErrors = Object.values(errorData.errors).flat().join("\n");
          errorMessage = fieldErrors;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorMessage,
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
      }
    } catch (error) {
      console.error("Error updating gift card:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Check the console for details.",
        icon: "error",
        background: "#1C1E2D",
        color: "#FFFFFF",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePublish = async () => {
    const authData = getAuthData();
    const token = authData?.token;
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    // Validate all items have required fields
    const invalidItems = newGiftCardItems.filter(
      item => !item.name || !item.price || !item.image
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

    const submissionPromises = newGiftCardItems.map((item) => {
      if (!item.name || !item.price || !item.image) {
        return Promise.resolve(null);
      }

      const numericPrice = parseFloat(item.price.replace("$", ""));

      const payload = {
        name: item.name,
        description: item.description,
        price: isNaN(numericPrice) ? 0 : numericPrice,
        image: item.image,
        first_sale_date: item.first_sale_date || new Date().toISOString().split('T')[0],
        market_hash_name: item.market_hash_name,
        rental: item.rental === "true",
        model_player: item.model_player || "default",
        loot_name: item.loot_name,
        loot_footer: item.loot_footer,
        loot_image: item.loot_image,
      };

      console.log("Sending payload to API:", payload);

      return fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/gift-cards`,
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
      let errorMessages: string[] = [];
      for (const response of responses) {
        if (response && response.ok) {
          successCount++;
        } else if (response) {
            const errorData = await response.json();
            if (response.status === 422 && errorData.errors) {
              const fieldErrors = Object.values(errorData.errors).flat().join("\n");
              errorMessages.push(fieldErrors);
            } else if (errorData.message) {
              errorMessages.push(errorData.message);
            }
        }
      }

      if (successCount > 0) {
        Swal.fire({
            title: "Success!",
            text: `${successCount} gift card(s) created successfully!`,
            icon: "success",
            background: "#1C1E2D",
            color: "#FFFFFF",
        });
        setNewGiftCardItems([
          {
            name: "",
            price: "",
            description: "",
            image: "",
            first_sale_date: "",
            market_hash_name: "",
            rental: "false",
            model_player: "default",
            loot_name: "",
            loot_footer: "",
            loot_image: "",
          },
        ]);
        fetchGiftCards();
      }

      if (errorMessages.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          text: "Failed to create some gift cards:\n" + errorMessages.join("\n\n"),
          background: "#1C1E2D",
          color: "#FFFFFF",
        });
      }
    } catch (error) {
      console.error("Error creating gift card:", error);
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5 xl:gap-6">
      <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
          <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
            Gift Cards Database
          </h3>
          <span className="text-sm text-[#6F7083]">
            {filteredGiftCards.length} Gift Cards
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-4 relative z-10">
          <Input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="text-white text-center">Loading gift cards...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-4">
            {filteredGiftCards.length > 0 ? (
              filteredGiftCards.map((item) => (
                <div key={item.id} onClick={() => handleCardClick(item.id)} className="cursor-pointer">
<WeaponsCollection item={item} onDelete={handleDeleteGiftCard} hideEditButton={true} />                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-white/60">No gift cards found matching "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="">
        <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
            <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
              {editingCard ? "Update Gift Card" : "Create New Gift Card"}
            </h3>
            {editingCard && (
              <button
                onClick={() => {
                  setEditingCard(null);
                  setNewGiftCardItems([{
                    name: "",
                    price: "",
                    description: "",
                    image: "",
                    first_sale_date: "",
                    market_hash_name: "",
                    rental: "false",
                    model_player: "default",
                    loot_name: "",
                    loot_footer: "",
                    loot_image: "",
                  }]);
                }}
                className="text-sm text-[#6F7083] hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          <div className="flex flex-col gap-y-6 mb-3 md:mb-4 xl:mb-5 max-h-[600px] overflow-y-auto pr-2">
            {newGiftCardItems.map((item, index) => (
              <div key={index}>
                {index > 0 && (
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <span className="text-white/40 text-sm font-medium">Item {index + 1}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                )}
                <div className="flex flex-col gap-y-4">
                  <Input
                    value={item.image}
                    onChange={(e) =>
                      handleGiftCardItemChange(index, "image", e.target.value)
                    }
                    inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                    type="text"
                    labelClass="!mb-2 !text-[#BFC0D8]"
                    label="Image URL *"
                    placeholder="https://example.com/image.png"
                  />
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-7 md:col-span-8">
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          handleGiftCardItemChange(index, "name", e.target.value)
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Gift Card Name *"
                        placeholder="Amazon Gift Card - $50"
                      />
                    </div>
                    <div className="col-span-5 md:col-span-4">
                      <Input
                        value={item.price}
                        onChange={(e) =>
                          handleGiftCardItemChange(index, "price", e.target.value)
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Price *"
                        placeholder="50.00"
                      />
                    </div>
                    <div className="col-span-12">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          handleGiftCardItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Description"
                        placeholder="Get $50 worth of Amazon credits instantly."
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        value={item.market_hash_name}
                        onChange={(e) =>
                          handleGiftCardItemChange(
                            index,
                            "market_hash_name",
                            e.target.value
                          )
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Market Hash Name"
                        placeholder="amazon_gift_50"
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        value={item.first_sale_date}
                        onChange={(e) =>
                          handleGiftCardItemChange(
                            index,
                            "first_sale_date",
                            e.target.value
                          )
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="date"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="First Sale Date"
                      />
                    </div>
                    <div className="col-span-12">
                      <Input
                        value={item.loot_name}
                        onChange={(e) =>
                          handleGiftCardItemChange(
                            index,
                            "loot_name",
                            e.target.value
                          )
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Loot Name"
                        placeholder="Amazon Wallet"
                      />
                    </div>
                    <div className="col-span-12">
                      <Input
                        value={item.loot_footer}
                        onChange={(e) =>
                          handleGiftCardItemChange(
                            index,
                            "loot_footer",
                            e.target.value
                          )
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Loot Footer"
                        placeholder="Redeem your code at Amazon.com"
                      />
                    </div>
                    <div className="col-span-12">
                      <Input
                        value={item.loot_image}
                        onChange={(e) =>
                          handleGiftCardItemChange(
                            index,
                            "loot_image",
                            e.target.value
                          )
                        }
                        inputClass="!text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-transparent focus:border-[#C8D0FF]"
                        type="text"
                        labelClass="!mb-2 !text-[#BFC0D8]"
                        label="Loot Image URL"
                        placeholder="https://example.com/images/footer.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {!editingCard && (
              <button
                onClick={addNewGiftCardForm}
                className="w-full gap-1 px-1 font-normal md:font-semibold btn text-sm md:text-base bg-none min-h-11 md:min-h-13 shadow-none bg-primary rounded-xl !border-t !border-white/25 border-0"
              >
                <Plus color="white" size={21} strokeWidth={2} />
                Add More Items
              </button>
            )}
            <button
              onClick={editingCard ? handleUpdate : handlePublish}
              disabled={editingCard ? isUpdating : isSubmitting}
              className="w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-11 md:min-h-13 flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingCard 
                ? (isUpdating ? "Updating..." : "Update Now")
                : (isSubmitting ? "Publishing..." : "Publish Now")
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}