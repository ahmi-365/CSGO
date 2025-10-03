'use client';

import React, { useState, useEffect } from 'react';
import CollectionCard from '@/app/components/dashboard/CollectionCard';
import InfoCard from '@/app/components/dashboard/InfoCard';
import { CollectionItem, caseInfoItem } from '@/app/utilities/Types';
import Link from 'next/link';
import { Layers, List, DollarSign, Settings, Plus, X } from 'lucide-react';

type Props = {}

interface CrateFormData {
    name: string;
    price: string;
    image: string;
    description: string | null;
    type: string;
    first_sale_date: string;
    market_hash_name: string;
    rental: boolean;
    model_player: string;
    loot_name: string | null;
    loot_footer: string | null;
    loot_image: string | null;
}

export default function Page({ }: Props) {
    const [crates, setCrates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editingCrate, setEditingCrate] = useState<any>(null);
    const [viewingCrate, setViewingCrate] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<CrateFormData>({
        name: '',
        price: '',
        image: '',
        description: null,
        type: 'Case',
        first_sale_date: '',
        market_hash_name: '',
        rental: true,
        model_player: '',
        loot_name: null,
        loot_footer: null,
        loot_image: null
    });

    const baseUrl = 'https://backend.bismeel.com';

    // Get auth token from localStorage
    const getAuthToken = () => {
        if (typeof window === 'undefined') return null;
        const authData = localStorage.getItem('auth');
        if (!authData) return null;
        try {
            const parsed = JSON.parse(authData);
            return parsed.token;
        } catch {
            return null;
        }
    };

    // Get headers with auth token
    const getHeaders = () => {
        const token = getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // Fetch crates data
    const fetchCrates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseUrl}/api/admin/crates`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch crates');
            }

            const data = await response.json();
            const cratesData = data.crates.data || [];
            setCrates(cratesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Fetch single crate details
    const fetchCrateDetails = async (crateId: string) => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/crates/${crateId}`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch crate details');
            }

            const data = await response.json();
            return data.crate || data;
        } catch (err) {
            console.error('Error fetching crate details:', err);
            throw err;
        }
    };

    // Create new crate
    const handleCreate = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/crates`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create crate');
            }

            await fetchCrates();
            setShowModal(false);
            resetForm();
            alert('Case created successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create crate');
        }
    };

    // Update crate
    const handleUpdate = async () => {
        if (!editingCrate) return;

        try {
            const response = await fetch(`${baseUrl}/api/admin/crates/${editingCrate.id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update crate');
            }

            await fetchCrates();
            setShowModal(false);
            setIsEditMode(false);
            setEditingCrate(null);
            resetForm();
            alert('Case updated successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update crate');
        }
    };

    // Delete crate
    const handleDelete = async (crateId: string) => {
        if (!confirm('Are you sure you want to delete this case?')) return;

        try {
            const response = await fetch(`${baseUrl}/api/admin/crates/${crateId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete crate');
            }

            await fetchCrates();
            alert('Case deleted successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete crate');
        }
    };

    // View crate details
    const handleViewDetails = async (crateId: string) => {
        try {
            const crateDetails = await fetchCrateDetails(crateId);
            console.log('Crate Details:', crateDetails);
            setViewingCrate(crateDetails);
            setShowDetailsModal(true);
        } catch (err) {
            console.error('Error viewing details:', err);
            alert('Failed to load crate details');
        }
    };

    // Open edit modal
    const handleEdit = async (crateId: string) => {
        try {
            console.log('Editing crate:', crateId);
            const crateDetails = await fetchCrateDetails(crateId);
            console.log('Fetched crate details:', crateDetails);
            setEditingCrate(crateDetails);
            setFormData({
                name: crateDetails.name || '',
                price: crateDetails.price || '',
                image: crateDetails.image || '',
                description: crateDetails.description || null,
                type: crateDetails.type || 'Case',
                first_sale_date: crateDetails.first_sale_date || '',
                market_hash_name: crateDetails.market_hash_name || '',
                rental: crateDetails.rental === 1 || crateDetails.rental === true || crateDetails.rental === '1',
                model_player: crateDetails.model_player || '',
                loot_name: crateDetails.loot_name || null,
                loot_footer: crateDetails.loot_footer || null,
                loot_image: crateDetails.loot_image || null
            });
            setIsEditMode(true);
            setShowModal(true);
        } catch (err) {
            console.error('Error editing crate:', err);
            alert('Failed to load crate details');
        }
    };

    // Open create modal
    const handleOpenCreateModal = () => {
        resetForm();
        setIsEditMode(false);
        setEditingCrate(null);
        setShowModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            image: '',
            description: null,
            type: 'Case',
            first_sale_date: '',
            market_hash_name: '',
            rental: true,
            model_player: '',
            loot_name: null,
            loot_footer: null,
            loot_image: null
        });
    };

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value
        }));
    };

    useEffect(() => {
        fetchCrates();
    }, []);

    // Calculate stats
    const totalCases = crates.length;
    const activeCases = crates.length;
    const totalItems = crates.reduce((sum, crate) => {
        return sum + (crate.items?.length || 0) + (crate.weapons?.length || 0);
    }, 0);
    const totalValue = crates.reduce((sum, crate) => {
        return sum + parseFloat(crate.price || '0');
    }, 0);

    const casesInfo: caseInfoItem[] = [
        {
            icon: <Layers size={30} />,
            value: totalCases.toString().padStart(2, '0'),
            label: "Total Cases",
            color: "#702AEC"
        },
        {
            icon: <Layers size={30} />,
            value: activeCases.toString().padStart(2, '0'),
            label: "Active Cases",
            color: "#24E9FF"
        },
        {
            icon: <List size={30} />,
            value: totalItems.toString(),
            label: "Total Items",
            color: "#347BFF"
        },
        {
            icon: <DollarSign size={30} />,
            value: `$${totalValue.toFixed(2)}`,
            label: "Total Value",
            color: "#FF3063"
        },
       
    ];

    // Transform API data to match CollectionItem type
    const card: CollectionItem[] = crates.map((crate, index) => {
        const colors = [
            { color: '#FB8609', color2: '#4A3426' },
            { color: '#347BFF', color2: '#203057' },
            { color: '#ED164C', color2: '#451C33' },
            { color: '#24E9FF', color2: '#1D4657' },
            { color: '#702AEC', color2: '#2C2053' },
        ];
        const colorSet = colors[index % colors.length];

        return {
            id: crate.id,
            img: crate.image,
            price: parseFloat(crate.price),
            items: (crate.items?.length || 0) + (crate.weapons?.length || 0),
            status: "Active",
            color: colorSet.color,
            color2: colorSet.color2,
            onEdit: () => handleEdit(crate.id),
            onDelete: () => handleDelete(crate.id),
            onViewDetails: () => handleViewDetails(crate.id)
        };
    });

    return (
        <div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {casesInfo.map((info, index) => (
                    <InfoCard key={index} labelClass='justify-center md:justify-between' icon={info.icon} value={info.value} label={info.label} color={info.color} />
                ))}
            </div>
            <div className="flex items-center justify-between mt-4 md:mt-5 xl:mt-6 mb-4">
                <h3 className='text-white text-lg md:text-xl xl:text-2xl font-bold !leading-[130%]'>Manage Cases</h3>
                <button 
                    onClick={handleOpenCreateModal}
                    className='btn bg-none shadow-none bg-primary hover:bg-primary/50 hover:opacity-100 rounded-xl !border-t !border-white/25 border-0'
                >
                    <Plus size={16} />
                    Add Case
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bg-[#1A1D29] rounded-xl p-4 border border-white/10 animate-pulse">
                            <div className="aspect-square bg-gray-700 rounded-lg mb-3"></div>
                            <div className="h-4 bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-2/3 mb-3"></div>
                            <div className="flex gap-2">
                                <div className="flex-1 h-8 bg-gray-700 rounded-lg"></div>
                                <div className="flex-1 h-8 bg-gray-700 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                    <p className="text-red-400 font-medium">Error loading cases: {error}</p>
                    <button
                        onClick={fetchCrates}
                        className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}


{!loading && !error && (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
        {card.map((singleCard) => ( // Iterate over the 'card' array here in Page.tsx
            <CollectionCard
                key={singleCard.id} // Important for React list rendering
                id={singleCard.id}
                img={singleCard.img}
                price={Number(singleCard.price) || 0}
                items={Number(singleCard.items) || 0} // This is the count of items inside the case
                status={singleCard.status ?? ''}
                color={singleCard.color ?? ''}
                color2={singleCard.color2 ?? ''}
                onViewDetails={singleCard.onViewDetails} // Pass individual actions
                onEdit={singleCard.onEdit}
                onDelete={singleCard.onDelete}
            />
        ))}
    </div>
)}
            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1D29] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {isEditMode ? 'Edit Case' : 'Create New Case'}
                            </h2>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Market Hash Name</label>
                                <input
                                    type="text"
                                    name="market_hash_name"
                                    value={formData.market_hash_name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">First Sale Date</label>
                                <input
                                    type="date"
                                    name="first_sale_date"
                                    value={formData.first_sale_date}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Model Player</label>
                                <input
                                    type="text"
                                    name="model_player"
                                    value={formData.model_player}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rental</label>
                                <select
                                    name="rental"
                                    value={formData.rental.toString()}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rental: e.target.value === 'true' }))}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full bg-[#0D0F14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-white/10">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={isEditMode ? handleUpdate : handleCreate}
                                className="flex-1 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                            >
                                {isEditMode ? 'Update Case' : 'Create Case'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && viewingCrate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1D29] rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Case Details</h2>
                            <button 
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {viewingCrate.image && (
                                <div className="flex justify-center mb-4">
                                    <img src={viewingCrate.image} alt={viewingCrate.name} className="max-h-48 rounded-lg" />
                                </div>
                            )}
                            
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400">ID</label>
                                        <p className="text-white font-medium">{viewingCrate.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Name</label>
                                        <p className="text-white font-medium">{viewingCrate.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Price</label>
                                        <p className="text-white font-medium">${viewingCrate.price}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Type</label>
                                        <p className="text-white font-medium">{viewingCrate.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">First Sale Date</label>
                                        <p className="text-white font-medium">{viewingCrate.first_sale_date || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Rental</label>
                                        <p className="text-white font-medium">{viewingCrate.rental ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm text-gray-400">Market Hash Name</label>
                                        <p className="text-white font-medium">{viewingCrate.market_hash_name || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm text-gray-400">Model Player</label>
                                        <p className="text-white font-medium break-all text-sm">{viewingCrate.model_player || 'N/A'}</p>
                                    </div>
                                    {viewingCrate.description && (
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-400">Description</label>
                                            <p className="text-white font-medium">{viewingCrate.description}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm text-gray-400">Created At</label>
                                        <p className="text-white font-medium text-sm">{new Date(viewingCrate.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Updated At</label>
                                        <p className="text-white font-medium text-sm">{new Date(viewingCrate.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Loot Information */}
                            {(viewingCrate.loot_name || viewingCrate.loot_footer || viewingCrate.loot_image) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">Loot Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {viewingCrate.loot_name && (
                                            <div>
                                                <label className="text-sm text-gray-400">Loot Name</label>
                                                <p className="text-white font-medium">{viewingCrate.loot_name}</p>
                                            </div>
                                        )}
                                        {viewingCrate.loot_footer && (
                                            <div>
                                                <label className="text-sm text-gray-400">Loot Footer</label>
                                                <p className="text-white font-medium">{viewingCrate.loot_footer}</p>
                                            </div>
                                        )}
                                        {viewingCrate.loot_image && (
                                            <div className="col-span-2">
                                                <label className="text-sm text-gray-400">Loot Image</label>
                                                <img src={viewingCrate.loot_image} alt="Loot" className="mt-2 max-h-32 rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Items/Weapons */}
                            {(viewingCrate.items?.length > 0 || viewingCrate.weapons?.length > 0) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">
                                        Items & Weapons ({(viewingCrate.items?.length || 0) + (viewingCrate.weapons?.length || 0)})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[...(viewingCrate.items || []), ...(viewingCrate.weapons || [])].map((item: any) => (
                                            <div key={item.id} className="bg-[#0D0F14] border border-white/10 rounded-lg p-3 flex items-center gap-3">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-white font-medium text-sm">{item.name}</p>
                                                    <p className="text-gray-400 text-xs">{item.id}</p>
                                                    {item.price && (
                                                        <p className="text-primary font-semibold text-sm mt-1">${item.price}</p>
                                                    )}
                                                    {item.rarity && (
                                                        <p className="text-gray-400 text-xs">Rarity: {item.rarity}</p>
                                                    )}
                                                    {item.probability && (
                                                        <p className="text-gray-400 text-xs">Probability: {item.probability}%</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skins */}
                            {viewingCrate.skins?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">
                                        Skins ({viewingCrate.skins.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {viewingCrate.skins.map((skin: any) => (
                                            <div key={skin.id} className="bg-[#0D0F14] border border-white/10 rounded-lg p-3 flex items-center gap-3">
                                                {skin.image && (
                                                    <img src={skin.image} alt={skin.name} className="w-16 h-16 object-contain rounded" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-white font-medium text-sm">{skin.name}</p>
                                                    {skin.price && (
                                                        <p className="text-primary font-semibold text-sm mt-1">${skin.price}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Keys */}
                            {viewingCrate.keys?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">
                                        Keys ({viewingCrate.keys.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {viewingCrate.keys.map((key: any) => (
                                            <div key={key.id} className="bg-[#0D0F14] border border-white/10 rounded-lg p-3">
                                                <p className="text-white font-medium text-sm">{key.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 p-6 border-t border-white/10">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}