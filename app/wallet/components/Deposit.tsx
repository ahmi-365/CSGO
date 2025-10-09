"use client";

import { useState, useEffect } from "react";
import Input from "@/app/components/ui/Input";
import { CryptoItem } from "./WalletContent"; // Import the shared interface

// API response types
interface Wallet {
  id: number;
  user_id: number;
  chain: string;
  address: string | null;
  balance: string;
  status: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  wallet: Wallet;
}

// Helper function to get the auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        return JSON.parse(auth).token;
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }
  }
  return null;
};

// Component Props
type Props = {
  selectedCrypto: CryptoItem | null;
};

export default function Deposit({ selectedCrypto }: Props) {
  const [is_copied, set_is_copied] = useState(false);
  const [amount, setAmount] = useState("");
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This effect runs whenever the selectedCrypto prop changes
  useEffect(() => {
    const generateWalletAddress = async () => {
      if (!selectedCrypto) return;

      setLoading(true);
      setError(null);
      setWalletData(null); // Reset previous wallet data

      try {
        const token = getAuthToken();
        if (!token)
          throw new Error("Authentication error. Please log in again.");

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/generate`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currency: selectedCrypto.currency.toLowerCase(),
          }),
        });

        if (response.status === 401)
          throw new Error("Your session has expired. Please log in again.");
        if (!response.ok)
          throw new Error(
            `Failed to generate a wallet address for ${selectedCrypto.name}.`
          );

        const result: ApiResponse = await response.json();
        if (result.status && result.wallet) {
          setWalletData(result.wallet);
        } else {
          throw new Error(result.message || "An unexpected error occurred.");
        }
      } catch (err: any) {
        setError(err.message);
        console.error(
          `Failed to fetch ${selectedCrypto.name} wallet address:`,
          err
        );
      } finally {
        setLoading(false);
      }
    };

    generateWalletAddress();
  }, [selectedCrypto]); // Re-run effect when selectedCrypto changes

  const handleCopy = (address: string | null) => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      set_is_copied(true);
      setTimeout(() => set_is_copied(false), 3000);
    });
  };

  // Conditional rendering based on state
  if (!selectedCrypto) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-white/70">
          Select a cryptocurrency to get deposit address.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-white/70 animate-pulse">
          Generating your {selectedCrypto.name} deposit address...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-solid border-[#FF8809]/20 bg-[#FF8809]/10 text-center">
        <p className="text-[#FF8809] font-medium">Error: {error}</p>
      </div>
    );
  }

  const notes = [
    {
      des: `Only send ${selectedCrypto.name} (${selectedCrypto.currency}) to this address`,
    },
    { des: `Minimum deposit: 0.0001 ${selectedCrypto.currency}` },
    { des: "Requires 3 network confirmations" },
    { des: "Deposits are automatically credited after confirmation" },
  ];

  return (
    <div>
      <Input
        className="mb-4 md:mb-5"
        type="text"
        label={`Amount (${selectedCrypto.currency})`}
        placeholder={`Min: 0.0001 ${selectedCrypto.currency}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="px-4 py-3 rounded-xl border border-solid border-[#39FF67]/10 bg-[#39FF67]/10 mb-3 md:mb-4 lg:mb-5">
        <h4 className="text-lg text-white font-satoshi font-bold !leading-[120%] mb-3 md:mb-4">
          Your {selectedCrypto.name} Deposit Address
        </h4>
        <div className="bg-[#171925]/25 px-3 py-4 rounded-xl mb-3 flex items-center justify-between">
          <p className="text-sm text-[#AEB0BDCC]/80 font-satoshi font-medium line-clamp-1 !leading-[110%] break-all">
            {walletData?.address || "Address not available"}
          </p>
          <button
            onClick={() => handleCopy(walletData?.address ?? null)}
            disabled={!walletData?.address}
            className="text-sm text-white font-satoshi font-bold !leading-[110%] ml-2 flex-shrink-0 disabled:text-white/50 disabled:cursor-not-allowed"
          >
            {is_copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-3 lg:px-4.5 min-h-8 lg:min-h-10 flex items-center text-nowrap justify-center capitalize bg-white/8 text-xs md:text-sm xl:text-base font-medium !leading-[130%] rounded-lg lg:rounded-xl hover:text-white hover:bg-primary/20">
              Show QR
            </button>
            <h4 className="capitalize text-sm xl:text-base font-medium font-satoshi line-clamp-1 text-white/50 !leading-[130%]">
              Min confirmations: 3
            </h4>
          </div>
          <h4 className="capitalize text-sm xl:text-base font-medium font-satoshi text-[#39FF67] line-clamp-1 !leading-[130%]">
            Network: {walletData?.chain || selectedCrypto.currency}
          </h4>
        </div>
      </div>
      <div className="py-3 px-4 rounded-xl border border-solid border-[#FF8809]/10 bg-[#FF8809]/10 mb-3 md:mb-4 lg:mb-5">
        <h4 className="flex items-center gap-2 lg:gap-2.5 text-[#FF8809] text-lg font-satoshi font-bold !leading-[110%] mb-2 md:mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_0_1619)">
              <path
                d="M10.0003 18.3334C14.6027 18.3334 18.3337 14.6024 18.3337 10C18.3337 5.39765 14.6027 1.66669 10.0003 1.66669C5.39795 1.66669 1.66699 5.39765 1.66699 10C1.66699 14.6024 5.39795 18.3334 10.0003 18.3334Z"
                stroke="#FF8809"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 6.66669V10"
                stroke="#FF8809"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 13.3333H10.01"
                stroke="#FF8809"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_0_1619">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Important Notes:
        </h4>
        {notes.map((item, index) => (
          <div className="flex items-start gap-2 mb-1" key={index}>
            <div className="bg-[#FF8809] size-2 rounded-full ml-1.5 mt-1.5 flex-shrink-0"></div>
            <p className="text-sm text-[#FF8809] font-satoshi font-medium !leading-[150%]">
              {item.des}
            </p>
          </div>
        ))}
      </div>
      <button className="grow px-4.5 min-h-10 md:min-h-13 flex items-center justify-center capitalize bg-white/8 text-base font-medium !leading-[130%] rounded-xl hover:text-white hover:bg-primary w-full">
        View Deposit History
      </button>
    </div>
  );
}
