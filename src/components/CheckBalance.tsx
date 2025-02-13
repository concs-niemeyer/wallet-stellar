"use client";
import { useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

const CheckBalance = () => {
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkBalance = async () => {
    const url = process.env.NEXT_PUBLIC_URL_NODE_STELLAR;
    //console.log(url)
    if (!publicKey) {
      setMessage("Please enter a public key to check balance.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setBalance("");

    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${url}/accounts/${publicKey}`,
        headers: {
          Accept: "application/json",
        },
      };

      const response = await axios.request(config);
	  console.log(response)
      setBalance(response.data.balances[0].balance);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setMessage("Error: " + error.response.data.error);
      } else {
        setMessage("Error checking balance.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl p-8 mb-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-4 mb-6">
        <Sparkles className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold text-yellow-400">Check Balance</h2>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Public Key"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          className="w-full bg-gray-900 border border-yellow-500/30 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-500"
          disabled={isLoading}
        />
        <button
          onClick={checkBalance}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Checking..." : "Check Balance!"}
        </button>
        {balance && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-red-500/30">
            <p className="text-xl text-cyan-400 text-center">{balance} XLM</p>
          </div>
        )}
        {message && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-yellow-500/30">
            <p className="text-xl text-yellow-400 text-center">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckBalance;