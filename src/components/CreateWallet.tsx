// components/CreateWallet.tsx
"use client";

import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { Key } from "lucide-react";
import { encryptData } from "@/lib/keyStore";

interface CreateWalletProps {
  onKeyCreated: (publicKey: string, encryptedSecret: string) => void;
}

export default function CreateWallet({ onKeyCreated }: CreateWalletProps) {
  const [password, setPassword] = useState("");
  const [createdKey, setCreatedKey] = useState("");
  const [message, setMessage] = useState("");

  const createKey = () => {
    if (!password) {
      setMessage("Please enter a password to encrypt the secret key.");
      return;
    }
    const keypair = StellarSdk.Keypair.random();
    const encrypted = encryptData(keypair.secret(), password);
    const pubKey = keypair.publicKey();

    setCreatedKey(pubKey);
    setMessage("Go Fund Your Wallet!");
    onKeyCreated(pubKey, encrypted);
// Maybe store the data after the wallet is funded. 
    localStorage.setItem(pubKey, encrypted); 
  };

  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl p-8 mb-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-4 mb-6">
        <Key className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold text-yellow-400">Create New Wallet</h2>
      </div>
      <div className="space-y-4">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-900 border border-yellow-500/30 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-500"
        />
        <button
          onClick={createKey}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-800 hover:from-cyan-700 hover:to-purple-900 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Generate Keypair
        </button>
        {createdKey && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-yellow-500/30">
            <p className="text-sm text-cyan-400 break-all">
              New Public Key: {createdKey}
            </p>
          </div>
        )}
        {message && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-yellow-500/30">
            <p className="text-cyan-400">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}