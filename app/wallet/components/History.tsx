"use client";
import React, { JSX, useState, useEffect } from "react";

// --- Type Definitions for API Response ---
interface ApiTransaction {
  id: number;
  txId: string;
  type: "deposit" | "withdrawal"; // The type of transaction
  currency: string; // e.g., 'BTC', 'ETH'
  amount: string; // The amount of the transaction
  address: string;
  status: "completed" | "pending" | "failed";
  confirmations: number;
  total_confirmations_needed: number;
  created_at: string; // ISO date string
}

interface ApiResponse {
  status: boolean;
  data: ApiTransaction[];
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

// --- Helper to get correct blockchain explorer URL ---
const explorerLinks: { [key: string]: string } = {
  BTC: "https://www.blockchain.com/btc/tx/",
  ETH: "https://etherscan.io/tx/",
  SOL: "https://solscan.io/tx/",
  // Add other currencies as needed
};

type Props = {};

export default function History({}: Props) {
  // --- State Management for API Data ---
  const [history, setHistory] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch transaction history on component mount ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError("You must be logged in to view history.");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/withdrawals`; // Using the correct endpoint
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transaction history.");
        }

        const result: ApiResponse = await response.json();

        if (result.status && Array.isArray(result.data)) {
          setHistory(result.data);
        } else {
          throw new Error("Invalid data format received from the server.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert(`Copied: ${text}`));
  };

  const getStatusStyles = (status: ApiTransaction["status"]) => {
    switch (status) {
      case "completed":
        return "text-[#39FF67]";
      case "pending":
        return "text-[#F7931A]";
      case "failed":
        return "text-[#FF7194]";
      default:
        return "text-white";
    }
  };

  // --- Render Loading, Error, or Empty State ---
  if (loading) {
    return (
      <p className="text-center text-white/70 animate-pulse">
        Loading transaction history...
      </p>
    );
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }
  if (history.length === 0) {
    return (
      <p className="text-center text-white/50">
        You have no transaction history yet.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-xl md:text-[22px] text-white font-satoshi font-bold !leading-[120%] mb-3 md:mb-5">
        Transaction History
      </h3>
      <div className="overflow-y-auto max-h-173 pr-4 -mr-4">
        {history.map((item) => (
          <div
            className="flex flex-col p-4 md:p-5 xl:p-6 bg-white/4 rounded-xl gap-y-2 md:gap-y-3 mb-3"
            key={item.id}
          >
            {/* --- Header Section --- */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <span
                  className={`${
                    item.type === "deposit"
                      ? "bg-[#39FF67]/8"
                      : "bg-[#FF7194]/8"
                  } size-10 flex items-center justify-center rounded-xl`}
                >
                  {/* Dynamic Icon based on type */}
                  {item.type === "deposit" ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_0_1976)">
                        <path
                          d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833"
                          stroke="#39FF67"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                          stroke="#39FF67"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_0_1976">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_0_1976)">
                        <path
                          d="M18.3337 9.2333V9.99997C18.3326 11.797 17.7507 13.5455 16.6748 14.9848C15.5988 16.4241 14.0864 17.477 12.3631 17.9866C10.6399 18.4961 8.79804 18.4349 7.11238 17.8121C5.42673 17.1894 3.98754 16.0384 3.00946 14.5309C2.03138 13.0233 1.56682 11.24 1.68506 9.4469C1.80329 7.65377 2.498 5.94691 3.66556 4.58086C4.83312 3.21482 6.41098 2.26279 8.16382 1.86676C9.91665 1.47073 11.7505 1.65192 13.392 2.3833"
                          stroke="#FF7194"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                          stroke="#FF7194"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_0_1976">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                </span>
                <div className="flex flex-col gap-y-2">
                  <h4 className="text-base md:text-lg text-white font-satoshi font-bold !leading-[110%] capitalize">
                    {item.type}{" "}
                    <span className="text-[#702AEC]">{item.currency}</span>
                  </h4>
                  <p className="text-xs text-[#6F7083] font-satoshi font-medium !leading-none">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <h4
                  className={`text-base md:text-lg font-satoshi font-bold !leading-[110%] ${
                    item.type === "deposit" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.type === "deposit" ? "+" : "-"}
                  {parseFloat(item.amount).toFixed(6)} {item.currency}
                </h4>
                {/* USD amount would ideally come from the API */}
              </div>
            </div>

            {/* --- Details Section --- */}
            <div className="flex items-center gap-y-3 justify-between flex-wrap">
              <h4 className="text-base text-white/50 font-satoshi font-medium !leading-[140%]">
                Status:
              </h4>
              <p
                className={`text-sm md:text-base font-medium capitalize ${getStatusStyles(
                  item.status
                )}`}
              >
                {item.status}
              </p>
            </div>
            <div className="flex items-center gap-y-3 justify-between flex-wrap">
              <h4 className="text-base text-white/50 font-satoshi font-medium !leading-[140%]">
                Address:
              </h4>
              <p className="text-sm md:text-base text-[#C3C4CC] flex items-center gap-2">
                {item.address?.substring(0, 8)}...
                {item.address?.substring(item.address.length - 8)}
                <button
                  className="text-[#767884] hover:text-white"
                  onClick={() => copyToClipboard(item.address)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_0_1993)">
                      <path
                        d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_0_1993">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </p>
            </div>
            <div className="flex items-center gap-y-3 justify-between flex-wrap">
              <h4 className="text-base text-white/50 font-satoshi font-medium !leading-[140%]">
                Confirmations:
              </h4>
              <p className="text-sm md:text-base text-white">
                {item.confirmations}/{item.total_confirmations_needed}
              </p>
            </div>
            <div className="flex items-center gap-y-3 justify-between flex-wrap">
              <h4 className="text-base text-white/50 font-satoshi font-medium !leading-[140%]">
                Transaction:
              </h4>
              <p className="text-sm md:text-base text-[#C3C4CC] flex items-center gap-2">
                {item.txId?.substring(0, 8)}...
                {item.txId?.substring(item.txId.length - 8)}
                <button
                  className="text-[#767884] hover:text-white"
                  onClick={() => copyToClipboard(item.txId)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_0_1993)">
                      <path
                        d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_0_1993">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#767884] hover:text-white"
                  href={`${explorerLinks[item.currency.toUpperCase()] || "#"}${
                    item.txId
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M13.5 9.75V14.25C13.5 14.6478 13.342 15.0294 13.0607 15.3107C12.7794 15.592 12.3978 15.75 12 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V6C2.25 5.60218 2.40804 5.22064 2.68934 4.93934C2.97064 4.65804 3.35218 4.5 3.75 4.5H8.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.25 2.25H15.75V6.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 10.5L15.75 2.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
