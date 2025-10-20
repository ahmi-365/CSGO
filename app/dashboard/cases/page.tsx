"use client";

import React, { useState, useEffect } from "react";
import CollectionCard from "@/app/components/dashboard/CollectionCard";
import InfoCard from "@/app/components/dashboard/InfoCard";
import { CollectionItem, caseInfoItem } from "@/app/utilities/Types";
import Link from "next/link";
import {
  Layers,
  List,
  DollarSign,
  Settings,
  Plus,
  X,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import Input from "@/app/components/ui/Input";
import { useToast } from "@/app/contexts/ToastContext";
type Props = {};

interface CrateFormData {
  name: string;
  price: string;
  image: string;
  description: string | null;
  type: string;
  first_sale_date: string;
  rental: boolean;
  model_player: string;
  loot_image: string | null;
  rarity_id: string;
}

interface WeaponItem {
  id: string;
  name: string;
  description: string | null;
  image: string;
  rarity: string | null;
  price: string;
  probability: number | null;
}

interface AssignedWeapon extends WeaponItem {
  pivot: {
    crate_id: string;
    base_weapon_id: string;
    probability?: number;
  };
}

export default function Page({}: Props) {
  const [crates, setCrates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [editingCrate, setEditingCrate] = useState<any>(null);
  const [viewingCrate, setViewingCrate] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rarities, setRarities] = useState<any[]>([]);
  const [formData, setFormData] = useState<CrateFormData>({
    name: "",
    price: "",
    image: "",
    description: null,
    type: "Case",
    first_sale_date: "",
    rental: true,
    model_player: "",
    loot_image: null,
    rarity_id: "",
  });
  const { showToast } = useToast();
  // Existing states ke baad yeh add karein
  const [newlyCreatedCaseId, setNewlyCreatedCaseId] = useState<string | null>(
    null
  );
  const [newlyCreatedCaseName, setNewlyCreatedCaseName] = useState<string>("");
  const [selectedWeaponsForNewCase, setSelectedWeaponsForNewCase] = useState<
    WeaponItem[]
  >([]);
  const [draggedWeaponForCase, setDraggedWeaponForCase] =
    useState<WeaponItem | null>(null);
  const [isDragOverForCase, setIsDragOverForCase] = useState(false);
  const [weaponProbabilities, setWeaponProbabilities] = useState<{
    [key: string]: number;
  }>({});
  const [availableWeapons, setAvailableWeapons] = useState<WeaponItem[]>([]);
  const [assignedWeapons, setAssignedWeapons] = useState<AssignedWeapon[]>([]);
  const [selectedWeaponsToAssign, setSelectedWeaponsToAssign] = useState<
    string[]
  >([]);
  const [selectedWeaponsToUnassign, setSelectedWeaponsToUnassign] = useState<
    string[]
  >([]);
  const [weaponSearchQuery, setWeaponSearchQuery] = useState("");
  const baseUrl = "https://backend.bismeel.com";
  // Existing modals ko replace karein with new modal structure
  const [showWeaponAssignModal, setShowWeaponAssignModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const fetchCrates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/api/admin/crates`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crates");
      }

      const data = await response.json();
      const cratesData = data.crates.data || [];
      setCrates(cratesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchRarities = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/rarities`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rarities");
      }

      const data = await response.json();
      setRarities(data.data || []);
    } catch (err) {
      console.error("Error fetching rarities:", err);
    }
  };

  const fetchCrateDetails = async (crateId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/crates/${crateId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crate details");
      }

      const data = await response.json();
      return data.crate || data;
    } catch (err) {
      console.error("Error fetching crate details:", err);
      throw err;
    }
  };

  const fetchAvailableWeapons = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/weapons`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available weapons");
      }

      const data = await response.json();
      console.log("✅ Weapons API Response:", data);
      setAvailableWeapons(data.data?.data || []);
    } catch (err) {
      console.error("🚨 Error fetching available weapons:", err);
    }
  };

  const fetchCrateWeapons = async (crateId: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/crates/${crateId}/weapons`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch crate weapons");
      }

      const data = await response.json();
      console.log("Fetched crate weapons:", data);
      const weaponsData = data.data?.weapons || data.weapons || [];
      setAssignedWeapons(weaponsData);
      return weaponsData;
    } catch (err) {
      console.error("Error fetching crate weapons:", err);
      alert("Failed to load crate weapons.");
      return [];
    }
  };

  const handleAssignWeapon = async () => {
    if (!viewingCrate?.id || selectedWeaponsToAssign.length === 0) {
      alert("Please select at least one weapon");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/crates/${viewingCrate.id}/assign-weapons`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            weapon_ids: selectedWeaponsToAssign,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign weapons");
      }

      await fetchCrateWeapons(viewingCrate.id);
      setSelectedWeaponsToAssign([]);
      setWeaponSearchQuery("");
      alert(
        `${selectedWeaponsToAssign.length} weapon(s) assigned successfully!`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign weapons");
    }
  };

  const handleUnassignWeapons = async () => {
    if (!viewingCrate?.id || selectedWeaponsToUnassign.length === 0) {
      alert("Please select at least one weapon to unassign");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to unassign ${selectedWeaponsToUnassign.length} weapon(s)?`
      )
    )
      return;

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/crates/${viewingCrate.id}/unassign-weapons`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            weapon_ids: selectedWeaponsToUnassign,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unassign weapons");
      }

      await fetchCrateWeapons(viewingCrate.id);
      setSelectedWeaponsToUnassign([]);
      alert(
        `${selectedWeaponsToUnassign.length} weapon(s) unassigned successfully!`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unassign weapons");
    }
  };

  const handleCreate = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.price ||
      !formData.image ||
      !formData.rarity_id
    ) {
      showToast({
        type: "warning",
        title: "Validation Error",
        message:
          "Please fill in all required fields (Name, Price, Image, and Rarity)",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        rental: formData.rental ? 1 : 0,
        price: parseFloat(formData.price),
      };

      const response = await fetch(`${baseUrl}/api/admin/crates`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create crate");
      }

      const result = await response.json();
      const createdCase = result.crate || result;

      // Store created case info for weapon assignment
      setNewlyCreatedCaseId(createdCase.id);
      setNewlyCreatedCaseName(formData.name);

      // Fetch available weapons
      await fetchAvailableWeapons();

      // Show weapon assignment modal
      setShowWeaponAssignModal(true);

      showToast({
        type: "success",
        title: "Success!",
        message: "Case created successfully! Now assign weapons.",
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Error!",
        message: err instanceof Error ? err.message : "Failed to create case",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Drag start handler
  const handleDragStartForCase = (weapon: WeaponItem) => {
    setDraggedWeaponForCase(weapon);
  };

  // Drag end handler
  const handleDragEndForCase = () => {
    setDraggedWeaponForCase(null);
  };

  // Drag over handler
  const handleDragOverForCase = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverForCase(true);
  };

  // Drag leave handler
  const handleDragLeaveForCase = () => {
    setIsDragOverForCase(false);
  };

  // Drop handler
  const handleDropForCase = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverForCase(false);

    if (
      draggedWeaponForCase &&
      !selectedWeaponsForNewCase.find((w) => w.id === draggedWeaponForCase.id)
    ) {
      setSelectedWeaponsForNewCase([
        ...selectedWeaponsForNewCase,
        draggedWeaponForCase,
      ]);
      setWeaponProbabilities({
        ...weaponProbabilities,
        [draggedWeaponForCase.id]: 0,
      });
    }
    setDraggedWeaponForCase(null);
  };

  // Remove weapon from selection
  const handleRemoveWeaponFromCase = (weaponId: string) => {
    setSelectedWeaponsForNewCase(
      selectedWeaponsForNewCase.filter((w) => w.id !== weaponId)
    );
    const newProbabilities = { ...weaponProbabilities };
    delete newProbabilities[weaponId];
    setWeaponProbabilities(newProbabilities);
  };
  // Existing drag handlers ke saath yeh touch handlers add karein

  // Touch start handler
  const handleTouchStartForCase = (e: React.TouchEvent, weapon: WeaponItem) => {
    e.preventDefault();
    setDraggedWeaponForCase(weapon);
  };

  // Touch move handler
  const handleTouchMoveForCase = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // Check if over drop zone
    const dropZone = document.getElementById("weapon-drop-zone");
    if (dropZone && dropZone.contains(element)) {
      setIsDragOverForCase(true);
    } else {
      setIsDragOverForCase(false);
    }
  };

  // Touch end handler
  const handleTouchEndForCase = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // Check if dropped on drop zone
    const dropZone = document.getElementById("weapon-drop-zone");
    if (dropZone && dropZone.contains(element) && draggedWeaponForCase) {
      if (
        !selectedWeaponsForNewCase.find((w) => w.id === draggedWeaponForCase.id)
      ) {
        setSelectedWeaponsForNewCase([
          ...selectedWeaponsForNewCase,
          draggedWeaponForCase,
        ]);
        setWeaponProbabilities({
          ...weaponProbabilities,
          [draggedWeaponForCase.id]: 0,
        });
      }
    }

    setIsDragOverForCase(false);
    setDraggedWeaponForCase(null);
  };
  // Update probability
  const handleProbabilityChangeForCase = (weaponId: string, value: string) => {
    setWeaponProbabilities({
      ...weaponProbabilities,
      [weaponId]: parseFloat(value) || 0,
    });
  };

  const handleConfirmWeaponAssignment = async () => {
    if (!newlyCreatedCaseId || selectedWeaponsForNewCase.length === 0) {
      showToast({
        type: "warning",
        title: "No Weapons",
        message: "Please drag at least one weapon to assign.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/crates/${newlyCreatedCaseId}/assign-weapons`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            weapon_ids: selectedWeaponsForNewCase.map((w) => w.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign weapons");
      }

      await fetchCrates();

      showToast({
        type: "success",
        title: "Success!",
        message: `Case created with ${selectedWeaponsForNewCase.length} weapon(s) assigned!`,
        duration: 2000,
      });

      setShowWeaponAssignModal(false);
      setNewlyCreatedCaseId(null);
      setNewlyCreatedCaseName("");
      setSelectedWeaponsForNewCase([]);
      setWeaponProbabilities({});
      resetForm(); // Add this line if not present
    } catch (err) {
      showToast({
        type: "error",
        title: "Error!",
        message: "Failed to assign weapons to case",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipWeaponAssignment = async () => {
    // Wait for fetch to complete
    await fetchCrates();

    showToast({
      type: "success",
      title: "Success!",
      message: "Case created successfully without weapons!",
      duration: 2000,
    });

    // Reset everything
    setShowWeaponAssignModal(false);
    setNewlyCreatedCaseId(null);
    setNewlyCreatedCaseName("");
    setSelectedWeaponsForNewCase([]);
    setWeaponProbabilities({});
    resetForm(); // Reset the form to create mode
  };

  // Calculate total probability
  const totalProbabilityForCase = Object.values(weaponProbabilities).reduce(
    (sum, prob) => sum + prob,
    0
  );
  const handleUpdate = async () => {
    if (!editingCrate) return;

    // Validation
    if (
      !formData.name ||
      !formData.price ||
      !formData.image ||
      !formData.rarity_id
    ) {
      showToast({
        type: "warning",
        title: "Validation Error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        rental: formData.rental ? 1 : 0,
        price: parseFloat(formData.price),
      };

      const response = await fetch(
        `${baseUrl}/api/admin/crates/${editingCrate.id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update crate");
      }

      await fetchCrates();

      showToast({
        type: "success",
        title: "Success!",
        message: "Case updated successfully!",
      });

      // Reset to create mode
      setIsEditMode(false);
      setEditingCrate(null);
      resetForm();
    } catch (err) {
      showToast({
        type: "error",
        title: "Error!",
        message: err instanceof Error ? err.message : "Failed to update case",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (crateId: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/crates/${crateId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete crate");
      }

      await fetchCrates();
      alert("Case deleted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete crate");
    }
  };

  const handleViewDetails = async (crateId: string) => {
    try {
      const crateDetails = await fetchCrateDetails(crateId);
      console.log("Crate Details:", crateDetails);
      setViewingCrate(crateDetails);
      const weapons = await fetchCrateWeapons(crateId);
    } catch (err) {
      console.error("Error viewing details:", err);
      alert("Failed to load crate details");
    }
  };

  const handleEdit = async (crateId: string) => {
    try {
      console.log("Editing crate:", crateId);
      const crateDetails = await fetchCrateDetails(crateId);
      console.log("Fetched crate details:", crateDetails);

      setEditingCrate(crateDetails);
      setFormData({
        name: crateDetails.name || "",
        price: crateDetails.price || "",
        image: crateDetails.image || "",
        description: crateDetails.description || null,
        type: crateDetails.type || "Case",
        first_sale_date: crateDetails.first_sale_date || "",
        rental:
          crateDetails.rental === 1 ||
          crateDetails.rental === true ||
          crateDetails.rental === "1",
        model_player: crateDetails.model_player || "",
        loot_image: crateDetails.loot_image || null,
        rarity_id: crateDetails.rarity_id || "",
      });
      setIsEditMode(true);

      // Scroll to form on mobile/tablet
      if (window.innerWidth < 1280) {
        setTimeout(() => {
          const formElement = document.getElementById("case-form-panel");
          if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    } catch (err) {
      console.error("Error editing crate:", err);
      showToast({
        type: "error",
        title: "Error!",
        message: "Failed to load case details",
      });
    }
  };
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingCrate(null);
    resetForm();

    showToast({
      type: "info",
      title: "Cancelled",
      message: "Edit mode cancelled",
    });
  };

  const handleManageWeapons = async (crateId: string) => {
    try {
      const crateDetails = await fetchCrateDetails(crateId);
      setViewingCrate(crateDetails);
      await fetchAvailableWeapons();
      await fetchCrateWeapons(crateId);
      setSelectedWeaponsToAssign([]);
      setSelectedWeaponsToUnassign([]);
      setWeaponSearchQuery("");
      setShowWeaponModal(true);
    } catch (err) {
      console.error("Error managing weapons:", err);
      alert("Failed to load weapon management for this crate.");
    }
  };

  const handleToggleTop = async (
    crateId: string,
    currentTopStatus: boolean
  ) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/crates/${crateId}/top`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle top status");
      }

      await fetchCrates();

      showToast({
        type: "success",
        title: "Success!",
        message: `Crate ${
          currentTopStatus ? "removed from" : "set as"
        } top successfully!`,
        duration: 2000,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Error!",
        message:
          err instanceof Error ? err.message : "Failed to toggle top status",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: "",
      description: null,
      type: "Case",
      first_sale_date: "",
      rental: true,
      model_player: "",
      loot_image: null,
      rarity_id: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleAssignedWeaponProbabilityChange = (
    weaponId: string,
    value: string
  ) => {
    setAssignedWeapons((prev) =>
      prev.map((weapon) =>
        weapon.id === weaponId
          ? {
              ...weapon,
              pivot: { ...weapon.pivot, probability: parseFloat(value) || 0 },
            }
          : weapon
      )
    );
  };

  useEffect(() => {
    fetchCrates();
    fetchAvailableWeapons();
    fetchRarities();
  }, []);

  const totalCases = crates.length;
  const activeCases = crates.length;
  const totalItems = crates.reduce((sum, crate) => {
    return sum + (crate.weapons?.length || 0);
  }, 0);
  const totalValue = crates.reduce((sum, crate) => {
    return sum + parseFloat(crate.price || "0");
  }, 0);

  const casesInfo: caseInfoItem[] = [
    {
      icon: <Layers size={30} />,
      value: totalCases.toString().padStart(2, "0"),
      label: "Total Cases",
      color: "#702AEC",
    },
    {
      icon: <Layers size={30} />,
      value: activeCases.toString().padStart(2, "0"),
      label: "Active Cases",
      color: "#24E9FF",
    },
    {
      icon: <List size={30} />,
      value: totalItems.toString(),
      label: "Total Items",
      color: "#347BFF",
    },
    {
      icon: <DollarSign size={30} />,
      value: `$${totalValue.toFixed(2)}`,
      label: "Total Value",
      color: "#FF3063",
    },
  ];
  // Filter cases based on search query
  const filteredCases = crates.filter(
    (crate) =>
      crate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crate.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const card: CollectionItem[] = filteredCases.map((crate, index) => {
    const colors = [
      { color: "#FB8609", color2: "#4A3426" },
      { color: "#347BFF", color2: "#203057" },
      { color: "#ED164C", color2: "#451C33" },
      { color: "#24E9FF", color2: "#1D4657" },
      { color: "#702AEC", color2: "#2C2053" },
    ];
    const colorSet = colors[index % colors.length];
    const weaponCount = crate.weapons?.length || 0;

    return {
      id: crate.id,
      img: crate.image,
      price: parseFloat(crate.price),
      items: weaponCount,
      status: "Active",
      color: colorSet.color,
      color2: colorSet.color2,
      isTop: crate.top || false,
      onEdit: () => handleEdit(crate.id),
      onDelete: () => handleDelete(crate.id),
      onViewDetails: () => handleViewDetails(crate.id),
      onManageWeapons: () => handleManageWeapons(crate.id),
      onToggleTop: () => handleToggleTop(crate.id, crate.top || false),
    };
  });

  // Filter available weapons based on search query
  const filteredAvailableWeapons = availableWeapons
    .filter((weapon) => !assignedWeapons.some((aw) => aw.id === weapon.id))
    .filter(
      (weapon) =>
        weaponSearchQuery === "" ||
        weapon.name.toLowerCase().includes(weaponSearchQuery.toLowerCase()) ||
        weapon.id.toLowerCase().includes(weaponSearchQuery.toLowerCase())
    );
  return (
    <div>
      {/* Info Cards Section - Stays at top */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-4 md:mb-5 xl:mb-6">
        {casesInfo.map((info, index) => (
          <InfoCard
            key={index}
            labelClass="justify-center md:justify-between"
            icon={info.icon}
            value={info.value}
            label={info.label}
            color={info.color}
          />
        ))}
      </div>

      {/* Main Grid Layout - Left: Database, Right: Form */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5 xl:gap-6">
        {/* LEFT PANEL - Cases Database */}
        <div className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
            <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
              Cases Database
            </h3>
            <span className="text-sm text-[#6F7083]">
              {filteredCases.length} Cases
            </span>
          </div>

          {/* Search Bar */}
          <div className="grid grid-cols-1 gap-3 mb-4 relative z-10">
            <Input
              type="search"
              placeholder="Search cases"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=""
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1A1D29] rounded-xl p-4 border border-white/10 animate-pulse"
                >
                  <div className="aspect-square bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 font-medium mb-2">Error: {error}</p>
              <button
                onClick={fetchCrates}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Cases Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-4">
              {card.length > 0 ? (
                card.map((singleCard) => (
                  <CollectionCard
                    key={singleCard.id}
                    id={singleCard.id}
                    img={singleCard.img}
                    price={Number(singleCard.price) || 0}
                    items={Number(singleCard.items) || 0}
                    status={singleCard.status ?? ""}
                    color={singleCard.color ?? ""}
                    color2={singleCard.color2 ?? ""}
                    isTop={singleCard.isTop}
                    onViewDetails={singleCard.onViewDetails}
                    onEdit={singleCard.onEdit}
                    onDelete={singleCard.onDelete}
                    onManageWeapons={singleCard.onManageWeapons}
                    onToggleTop={singleCard.onToggleTop}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white/60">
                    No cases found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Create/Edit Form */}
        <div
          id="case-form-panel"
          className="bg-white/6 rounded-2xl md:rounded-[20px] p-4 md:p-5 lg:p-6"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-5">
            <h3 className="text-white text-base md:text-lg font-bold !leading-[130%]">
              {isEditMode ? "Edit Case" : "Create New Case"}
            </h3>
            {isEditMode && (
              <button
                onClick={handleCancelEdit}
                className="text-sm text-[#6F7083] hover:text-white transition-colors"
              >
                <X size={18} className="inline mr-1" />
                Cancel
              </button>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-y-4 mb-3 md:mb-4 xl:mb-5">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                Image URL *
              </label>
              <Input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
                className=""
              />
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Case Name */}
              <div className="col-span-7 md:col-span-8">
                <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                  Case Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Chroma Case"
                  className=""
                />
              </div>

              {/* Price */}
              <div className="col-span-5 md:col-span-4">
                <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                  Price *
                </label>
                <Input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="11.50"
                  className=""
                />
              </div>

              {/* Description */}
              <div className="col-span-7 md:col-span-8">
                <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                  Description
                </label>
                <Input
                  type="text"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Special Edition Case"
                  className=""
                />
              </div>

              {/* Rarity */}
              <div className="col-span-5 md:col-span-4">
                <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                  Rarity *
                </label>
                <select
                  name="rarity_id"
                  value={formData.rarity_id}
                  onChange={handleInputChange}
                  className="w-full bg-blur border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C8D0FF]"
                >
                  <option value="" className="text-black">
                    Select
                  </option>
                  {rarities.map((rarity) => (
                    <option
                      key={rarity.id}
                      value={rarity.id}
                      className="text-black"
                    >
                      {rarity.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                Type
              </label>
              <Input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Case"
                className=""
              />
            </div>

            {/* First Sale Date */}
            <div>
              <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                First Sale Date
              </label>
              <input
                type="date"
                name="first_sale_date"
                value={formData.first_sale_date}
                onChange={handleInputChange}
                className=""
                max="2099-12-31"
                title="Select the first sale date for this case"
              />
              {formData.first_sale_date && (
                <p className="text-xs text-gray-400 mt-1">
                  Selected:{" "}
                  {new Date(formData.first_sale_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              )}
            </div>

            {/* Model Player */}
            <div>
              <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                Model Player
              </label>
              <Input
                type="text"
                name="model_player"
                value={formData.model_player}
                onChange={handleInputChange}
                placeholder="Model path..."
                className=""
              />
            </div>

            {/* Collapsible Advanced Section */}
            {/* Collapsible Advanced Section */}
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-[#BFC0D8] hover:text-white transition-colors list-none flex items-center justify-between">
                <span>Advanced Options</span>
                <svg
                  className="w-4 h-4 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>

              <div className="mt-4 space-y-4 pl-2 border-l-2 border-white/10">
                {/* Loot Image Only */}
                <div>
                  <label className="block text-sm font-medium text-[#BFC0D8] mb-2">
                    Loot Image URL
                  </label>
                  <Input
                    type="text"
                    name="loot_image"
                    value={formData.loot_image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/loot.png"
                    className=""
                  />
                  {formData.loot_image && (
                    <div className="mt-2">
                      <img
                        src={formData.loot_image}
                        alt="Loot preview"
                        className="w-20 h-20 object-contain rounded border border-white/20"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="w-full px-4 font-semibold btn text-sm md:text-base bg-white/10 hover:bg-white/15 min-h-11 md:min-h-13 shadow-none rounded-xl border-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-11 md:min-h-13 flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Case"}
                </button>
              </>
            ) : (
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="w-full gradient-border-two rounded-xl p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-11 md:min-h-13 flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Case"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weapon Management Modal */}
      {showWeaponModal && viewingCrate && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl md:rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                Manage Weapons for {viewingCrate.name}
              </h2>
              <button
                onClick={() => setShowWeaponModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Assign New Weapon */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">
                  Assign New Weapon
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Weapons
                    </label>

                    {/* Search Input */}
                    <div className="mb-3 relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="text"
                        placeholder="Search weapons by name or ID..."
                        value={weaponSearchQuery}
                        onChange={(e) => setWeaponSearchQuery(e.target.value)}
                        className="w-full  border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                      {weaponSearchQuery && (
                        <button
                          onClick={() => setWeaponSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    {/* Results count */}
                    {weaponSearchQuery && (
                      <p className="text-sm text-gray-400 mb-2">
                        Found {filteredAvailableWeapons.length} weapon(s)
                      </p>
                    )}

                    <div className=" border border-white/10 rounded-lg p-3 max-h-64 overflow-y-auto">
                      {filteredAvailableWeapons.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">
                          {weaponSearchQuery
                            ? `No weapons found matching "${weaponSearchQuery}"`
                            : "All weapons are already assigned"}
                        </p>
                      ) : (
                        filteredAvailableWeapons.map((weapon) => (
                          <label
                            key={weapon.id}
                            className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer border-b border-white/5 last:border-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedWeaponsToAssign.includes(
                                weapon.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedWeaponsToAssign((prev) => [
                                    ...prev,
                                    weapon.id,
                                  ]);
                                } else {
                                  setSelectedWeaponsToAssign((prev) =>
                                    prev.filter((id) => id !== weapon.id)
                                  );
                                }
                              }}
                              className="w-4 h-4 rounded border-white/10 bg-gray-800 text-primary focus:ring-primary"
                            />
                            {weapon.image && (
                              <img
                                src={weapon.image}
                                alt={weapon.name}
                                className="w-10 h-10 object-contain rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">
                                {weapon.name}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {weapon.id}
                              </p>
                            </div>
                            {weapon.price && (
                              <span className="text-primary text-sm font-semibold">
                                ${weapon.price}
                              </span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                    {selectedWeaponsToAssign.length > 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        {selectedWeaponsToAssign.length} weapon(s) selected
                      </p>
                    )}
                  </div>

                  {/* Select All / Deselect All Buttons */}
                  {filteredAvailableWeapons.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const allFilteredIds = filteredAvailableWeapons.map(
                            (w) => w.id
                          );
                          setSelectedWeaponsToAssign((prev) => {
                            const newSelection = [...prev];
                            allFilteredIds.forEach((id) => {
                              if (!newSelection.includes(id)) {
                                newSelection.push(id);
                              }
                            });
                            return newSelection;
                          });
                        }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Select All{" "}
                        {weaponSearchQuery &&
                          `(${filteredAvailableWeapons.length})`}
                      </button>
                      <button
                        onClick={() => setSelectedWeaponsToAssign([])}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleAssignWeapon}
                    disabled={selectedWeaponsToAssign.length === 0}
                    className="w-full bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Assign{" "}
                    {selectedWeaponsToAssign.length > 0
                      ? `${selectedWeaponsToAssign.length} `
                      : ""}
                    Weapon(s)
                  </button>
                </div>
              </div>

              {/* Assigned Weapons */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">
                  Currently Assigned Weapons ({assignedWeapons.length})
                </h3>
                {assignedWeapons.length === 0 ? (
                  <p className="text-gray-400">
                    No weapons assigned to this crate yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#0D0F14] border border-white/10 rounded-lg p-3 max-h-96 overflow-y-auto">
                      {assignedWeapons.map((weapon) => (
                        <label
                          key={weapon.id}
                          className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer border-b border-white/5 last:border-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedWeaponsToUnassign.includes(
                              weapon.id
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWeaponsToUnassign((prev) => [
                                  ...prev,
                                  weapon.id,
                                ]);
                              } else {
                                setSelectedWeaponsToUnassign((prev) =>
                                  prev.filter((id) => id !== weapon.id)
                                );
                              }
                            }}
                            className="w-4 h-4 rounded border-white/10 bg-gray-800 text-red-500 focus:ring-red-500"
                          />
                          {weapon.image && (
                            <img
                              src={weapon.image}
                              alt={weapon.name}
                              className="w-12 h-12 object-contain rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">
                              {weapon.name}
                            </p>
                            <p className="text-gray-400 text-xs">{weapon.id}</p>
                            {weapon.probability !== undefined &&
                              weapon.probability !== null && (
                                <p className="text-gray-400 text-xs">
                                  Probability: {weapon.probability}%
                                </p>
                              )}
                          </div>
                        </label>
                      ))}
                    </div>

                    {selectedWeaponsToUnassign.length > 0 && (
                      <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm font-medium">
                          {selectedWeaponsToUnassign.length} weapon(s) selected
                          for removal
                        </p>
                        <button
                          onClick={handleUnassignWeapons}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Unassign Selected
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setSelectedWeaponsToUnassign(
                            assignedWeapons.map((w) => w.id)
                          )
                        }
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => setSelectedWeaponsToUnassign([])}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => setShowWeaponModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showWeaponAssignModal && newlyCreatedCaseId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
          <div className="rounded-2xl md:rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-[20px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Assign Weapons to: {newlyCreatedCaseName}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="hidden md:inline">
                    Drag weapons from left and drop them on the right
                  </span>
                  <span className="md:hidden">
                    Tap and hold weapons to drag
                  </span>
                </p>
                <div className="mt-1">
                  <span className="text-xs">
                    <span
                      className={
                        totalProbabilityForCase > 100
                          ? "text-red-400"
                          : "text-primary"
                      }
                    >
                      {totalProbabilityForCase.toFixed(2)}%
                    </span>
                    <span className="text-gray-400"> total probability</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowWeaponAssignModal(false);
                  setNewlyCreatedCaseId(null);
                  setSelectedWeaponsForNewCase([]);
                  setWeaponProbabilities({});
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left Side - Available Weapons */}
              <div className="md:w-1/2 md:border-r border-white/10 p-4 overflow-y-auto max-h-[40vh] md:max-h-full">
                <h3 className="text-base font-semibold text-white mb-2">
                  Available Weapons
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                  {availableWeapons
                    .filter(
                      (weapon) =>
                        !selectedWeaponsForNewCase.find(
                          (w) => w.id === weapon.id
                        )
                    )
                    .map((weapon) => (
                      <div
                        key={weapon.id}
                        draggable
                        onDragStart={() => handleDragStartForCase(weapon)}
                        onDragEnd={handleDragEndForCase}
                        onTouchStart={(e) => handleTouchStartForCase(e, weapon)}
                        onTouchMove={handleTouchMoveForCase}
                        onTouchEnd={handleTouchEndForCase}
                        className={`bg-[#0D0F14] border border-white/10 rounded-lg p-2 cursor-move hover:border-primary/50 transition-all active:scale-95 ${
                          draggedWeaponForCase?.id === weapon.id
                            ? "opacity-50 scale-95"
                            : ""
                        }`}
                        style={{ touchAction: "none" }}
                      >
                        {weapon.image && (
                          <img
                            src={weapon.image}
                            alt={weapon.name}
                            className="w-full h-16 object-contain rounded mb-1 pointer-events-none"
                          />
                        )}
                        <p className="text-white text-xs font-medium truncate">
                          {weapon.name}
                        </p>
                        <p className="text-primary text-[10px]">
                          ${weapon.price}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Side - Drop Zone */}
              <div className="md:w-1/2 p-4 overflow-y-auto flex-1">
                <h3 className="text-base font-semibold text-white mb-2">
                  Selected Weapons ({selectedWeaponsForNewCase.length})
                </h3>

                <div
                  id="weapon-drop-zone"
                  onDragOver={handleDragOverForCase}
                  onDragLeave={handleDragLeaveForCase}
                  onDrop={handleDropForCase}
                  className={`border-2 border-dashed rounded-lg p-3 min-h-[200px] md:min-h-[300px] transition-all ${
                    isDragOverForCase
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {selectedWeaponsForNewCase.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 animate-pulse">
                        <Plus size={24} className="text-white/40" />
                      </div>
                      <p className="text-white/60 text-sm">Drop weapons here</p>
                      <p className="text-white/40 text-xs mt-1">
                        <span className="hidden md:inline">
                          Drag from the left panel
                        </span>
                        <span className="md:hidden">
                          Tap and hold to drag from above
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {selectedWeaponsForNewCase.map((weapon) => (
                        <div
                          key={weapon.id}
                          className="bg-[#0D0F14] border border-white/10 rounded-lg p-2 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-start gap-2">
                            {weapon.image && (
                              <img
                                src={weapon.image}
                                alt={weapon.name}
                                className="w-12 h-12 md:w-14 md:h-14 object-contain rounded flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium truncate">
                                {weapon.name}
                              </p>
                              <p className="text-primary text-[10px] mb-1">
                                ${weapon.price}
                              </p>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Probability %"
                                value={weaponProbabilities[weapon.id] || ""}
                                onChange={(e) =>
                                  handleProbabilityChangeForCase(
                                    weapon.id,
                                    e.target.value
                                  )
                                }
                                className="w-full bg-[#1A1D29] border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveWeaponFromCase(weapon.id)
                              }
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded p-1 transition-all flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-white/10 bg-[#0D0F14]/50">
              <button
                onClick={handleSkipWeaponAssignment}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleConfirmWeaponAssignment}
                disabled={
                  selectedWeaponsForNewCase.length === 0 || isSubmitting
                }
                className="flex-1 gradient-border-two rounded-lg p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="w-full h-full bg-[#1A1D29] rounded-lg flex items-center justify-center px-4 text-white font-bold text-sm">
                  {isSubmitting
                    ? "Saving..."
                    : `Confirm (${selectedWeaponsForNewCase.length})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
