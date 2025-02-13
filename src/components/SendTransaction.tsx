"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";
import { decryptData } from "@/lib/keyStore";

const SendTransaction = () => {
  const [password, setPassword] = useState("");
  const [encryptedSecret, setEncryptedSecret] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendTx = async () => {
    if (!encryptedSecret || !password || !destination || !amount) {
      setMessage("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      // Dynamically import the Stellar SDK
      const StellarSdk = await import("@stellar/stellar-sdk");

      const url = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "";
      const networkPassphrase =
        process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;

      const sourceSecretKey = decryptData(encryptedSecret, password);
      if (!sourceSecretKey) {
        setMessage("Invalid password or no secret key found.");
        return;
      }

      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
      const sourcePublicKey = sourceKeypair.publicKey();

      const { Server } = await import("@stellar/stellar-sdk/rpc");
      const server = new Server(url, { allowHttp: true });
      const account = await server.getAccount(sourcePublicKey);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destination,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      // Let's see the XDR (encoded in base64) of the transaction we just built
      console.log(transaction.toEnvelope().toXDR("base64"));

      const response = await server.sendTransaction(transaction);

      if (response.hash) {
        setMessage("Transaction sent successfully! Hash: " + response.hash);
        // Clear form after successful transaction
        setEncryptedSecret("");
        setPassword("");
        setDestination("");
        setAmount("");
      } else {
        setMessage("Error: " + (response.status || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Error sending transaction: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl p-8 mb-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-4 mb-6">
        <Send className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold text-yellow-400">Send Transaction</h2>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Encrypted Secret Key"
          value={encryptedSecret}
          onChange={(e) => setEncryptedSecret(e.target.value)}
          className="w-full bg-gray-900 border border-yellow-500/30 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-500"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-900 border border-yellow-500/30 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-500"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Destination Key"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-gray-900 border border-yellow-500/30 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-500"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Amount in XLM"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-900 border border-yellow-500/30 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-500"
          disabled={isLoading}
        />
        <button
          onClick={sendTx}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-600 to-purple-800 hover:from-yellow-700 hover:to-purple-900 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Transaction"}
        </button>
        {message && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-yellow-500/30">
            <p className="text-cyan-400">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendTransaction;
