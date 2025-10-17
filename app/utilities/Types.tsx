import { JSX } from "react";

export interface CaseItem {
     id: string;
    img?: string;
    price?: string;
    des?: string;
    color?: string;
    btn?:string;
}
export interface CollectionItem {
    id: string; // Added 'id' property
    img: string;
    price: number;
    items: number;
    status: string;
    color: string;
    color2: string;
    onEdit: () => void;
    onDelete: () => void;
    onViewDetails: () => void;
    onManageWeapons: () => void;
    isTop?: boolean;
    onToggleTop?: () => void;
}
export interface WeaponsCollection {
    img?: string;
    price?: number | string;
    percent?: number | string;
    items?: number | string;
    title?: string;
    status?: string;
    color?: string;
    color2?: string;
    Chance?: string;
}

export interface caseInfoItem {
    icon?: JSX.Element | string;
    value: string;
    label: string;
    color?: string;
}

export interface UserItem {
    name: string;
    email?: string;
    avatarColor?: string;
    statusColor?: string | null;
    status?: string;
    balance: number;
    casesOpened?: number;
    totalSpend: number;
    lastLogin?: string;
    active?: boolean;
}

export interface UserInfoItem {
    icon?: JSX.Element;
    value: string;
    label: string;
    color?: string;
}

export interface StremItem {
  img: string;
  price: string;
  name: string;
  color: string;
  color2: string;
  isReal: boolean;
  id: string;
}
export interface CardData {
  id: string;
  title: string;
  img: string;
  price: number | string;
  percent: number;
  color: string;
  color2: string;
}
