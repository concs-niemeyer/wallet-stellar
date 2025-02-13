// app/page.tsx
"use client";

import { useState } from "react";
import CreateWallet from "@/components/CreateWallet";
import FundWallet from "@/components/FundWallet";
import SendTransaction from "@/components/SendTransaction";
import CheckBalance from "@/components/CheckBalance";
import StoredKeys from "@/components/StoredKeys";

export default function Home() {
  const [currentPublicKey, setCurrentPublicKey] = useState("");

  const handleKeyCreated = (publicKey: string) => {
    setCurrentPublicKey(publicKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 via-purple-900 to-black text-purple-500 font-mono">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/image.png')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-yellow-500 flex items-center justify-center gap-4">
            <span className="text-4xl">ハッシュ</span>
            HashWarriors
            <span className="text-4xl">武</span>
          </h1>
          <p className="text-cyan-400 text-lg">dojo-stellar week#2</p>
        </div>

        <CreateWallet onKeyCreated={handleKeyCreated} />
        <FundWallet publicKey={currentPublicKey} />
        <CheckBalance />
        <SendTransaction />
        <StoredKeys />
      </div>
    </div>
  );
}
