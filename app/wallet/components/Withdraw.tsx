"use client";

import Input from "@/app/components/ui/Input";
import React, { useState, useEffect, useMemo } from "react";

// --- Type Definitions ---
interface Notes {
  des: string;
}

interface Wallet {
  id: number;
  account_id: string; // This is the senderAccountId
  balance: string;
  chain: string;
}

interface WalletApiResponse {
  status: boolean;
  message: string;
  wallet: Wallet;
}

// --- Helper function to get auth token ---
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

// --- Static Data ---
const notes: Notes[] = [
  { des: "Double-check the withdrawal address" },
  { des: "Withdrawals cannot be reversed" },
  { des: "Minimum withdrawal: 0.001 BTC" },
  { des: "Processing time: 10-30 minutes" },
  { des: "Network fee: 0.0005 BTC" },
];

const NETWORK_FEE = 0.0005;
const MIN_WITHDRAWAL = 0.001;

type Props = {};

export default function BitcoinWithdraw({}: Props) {
  // --- State Management ---
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [userWallet, setUserWallet] = useState<Wallet | null>(null);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError("You are not logged in.");
        setInitialLoading(false);
        return;
      }

      try {
        const [walletRes, priceRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/get?currency=btc`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/list/prices`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (walletRes.ok) {
          const walletResult: WalletApiResponse = await walletRes.json();
          if (walletResult.status) setUserWallet(walletResult.wallet);
        } else {
          throw new Error("Could not fetch user wallet details.");
        }

        if (priceRes.ok) {
          const priceResult = await priceRes.json();
          if (priceResult.status && priceResult.prices.data.BTC) {
            setBtcPrice(priceResult.prices.data.BTC.price);
          }
        } else {
          throw new Error("Could not fetch cryptocurrency prices.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const summary = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    const usdValue = (amountNum * (btcPrice || 0)).toFixed(2);
    const youWillReceive =
      amountNum > 0 ? (amountNum - NETWORK_FEE).toFixed(8) : "0";

    return [
      { name: "Amount:", des: `${amountNum.toFixed(8)} BTC` },
      { name: "Network Fee:", des: `${NETWORK_FEE.toFixed(8)} BTC` },
      { name: "USD Value:", des: btcPrice ? `$${usdValue}` : "N/A" },
      { name: "You'll Receive:", des: `${youWillReceive} BTC` },
    ];
  }, [amount, btcPrice]);

  const handleWithdraw = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!userWallet?.account_id) {
      setError("Your wallet account ID is missing. Please refresh.");
      return;
    }
    if (!recipientAddress) {
      setError("Please enter a withdrawal address.");
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amountNum < MIN_WITHDRAWAL) {
      setError(`The minimum withdrawal amount is ${MIN_WITHDRAWAL} BTC.`);
      return;
    }
    if (amountNum > parseFloat(userWallet.balance)) {
      setError("Insufficient balance for this withdrawal.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senderAccountId: userWallet.account_id,
            address: recipientAddress,
            amount: amountNum,
            fee: NETWORK_FEE,
            compliant: false,
            senderNote: "User withdrawal",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Withdrawal failed. Please try again."
        );
      }

      setSuccessMessage(
        result.message || "Withdrawal request submitted successfully!"
      );
      setAmount("");
      setRecipientAddress("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <p className="text-center text-white/70 animate-pulse">
        Loading wallet details...
      </p>
    );
  }

  return (
    <form onSubmit={handleWithdraw}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2 md:mb-3">
        <h3 className="text-lg md:text-xl lg:text-[22px] text-white font-satoshi font-bold !leading-[120%]">
          Withdraw Bitcoin
        </h3>
        <p className="text-sm text-white/60">
          Balance: {parseFloat(userWallet?.balance ?? "0").toFixed(8)} BTC
        </p>
      </div>
      <Input
        className="mb-3 md:mb-4 lg:mb-5"
        type="number"
        label="Amount (BTC)"
        placeholder={`Min: ${MIN_WITHDRAWAL} BTC`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.00000001"
      />
      <Input
        className="mb-3 md:mb-4 lg:mb-5"
        type="text"
        label="Withdrawal Address"
        placeholder="Enter Bitcoin address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <div className="px-4 py-3 rounded-xl border border-solid border-[#39FF67]/10 bg-white/4 mb-4 md:mb-5">
        <h4 className="text-lg text-white font-satoshi font-bold !leading-[120%] mb-3 md:mb-4">
          Transaction Summary
        </h4>
        {summary.map((item, index) => (
          <div
            className={`flex items-center justify-between mb-3 lg:mb-4 last:pt-3 lg:last:pt-4 last:mb-0 last:border-t last:border-t-[#3E404B]`}
            key={index}
          >
            <p className="text-sm xl:text-base text-[#767884] font-satoshi font-medium !leading-[140%]">
              {item.name}
            </p>
            <p className="text-sm xl:text-base text-white font-satoshi font-medium !leading-[140%]">
              {item.des}
            </p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      <div className="py-3 px-4 rounded-xl border border-solid border-[#FF7194]/10 bg-[#FF7194]/10 mb-3 md:mb-4 lg:mb-5">
        <h4 className="flex items-center gap-2 md:gap-2.5 text-[#FF7194] text-lg font-satoshi font-bold !leading-[110%] mb-2 md:mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_0_1809)">
              <path
                d="M10.0003 18.3333C14.6027 18.3333 18.3337 14.6023 18.3337 9.99996C18.3337 5.39759 14.6027 1.66663 10.0003 1.66663C5.39795 1.66663 1.66699 5.39759 1.66699 9.99996C1.66699 14.6023 5.39795 18.3333 10.0003 18.3333Z"
                stroke="#FF7194"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 6.66663V9.99996"
                stroke="#FF7194"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 13.3334H10.01"
                stroke="#FF7194"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_0_1809">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Important Notes:
        </h4>
        {notes.map((item, index) => (
          <div className="flex items-start gap-2 mb-1" key={index}>
            <div className="bg-[#FF7194] size-2 rounded-full ml-1.5 mt-1.5 flex-shrink-0"></div>
            <p className="text-sm text-[#FF7194] font-satoshi font-medium !leading-[150%]">
              {item.des}
            </p>
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || initialLoading}
        className="w-full px-4.5 min-h-10 md:min-h-13 flex items-center justify-center capitalize bg-white/8 text-base font-medium !leading-[130%] rounded-xl hover:text-white hover:bg-primary disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Withdraw BTC"}
      </button>
    </form>
  );
}
