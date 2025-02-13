// components/FundWallet.tsx
"use client";

import { useState } from "react";
import { Coins } from "lucide-react";

interface FundWalletProps {
  publicKey: string;
}

export default function FundWallet({ publicKey }: FundWalletProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fundWallet() {
    const url = process.env.NEXT_PUBLIC_FRIENDBOT_URL;
    if (!publicKey) {
      setMessage("No wallet created. Please generate a key first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${url}?addr=${publicKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "fundWallet",
          publicKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Account funded successfully! Transaction hash: ${data.hash}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage("Error funding account.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={fundWallet}
        disabled={!publicKey || isLoading}
        className={`w-full mb-8 flex items-center justify-center gap-2 py-4 rounded-lg font-bold transition-all duration-300 ${
          publicKey && !isLoading
            ? "bg-gradient-to-r from-yellow-500 to-purple-500 text-black hover:from-yellow-600 hover:to-purple-600"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        <Coins size={24} />
        {isLoading ? "Funding..." : "Fund Wallet"}
      </button>
      {message && (
        <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl p-6 mb-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
          <p className="text-center text-cyan-400">{message}</p>
        </div>
      )}
    </div>
  );
}
