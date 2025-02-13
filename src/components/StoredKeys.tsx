import { FileKey, KeyRound } from "lucide-react";
import React, { useEffect, useState } from "react";
const StoredKeys = () => {
  const [storedKeys, setStoredKeys] = useState<
    { key: string; value: string }[]
  >([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const keyValues = keys.map((key) => ({
      key,
      value: localStorage.getItem(key) || "",
    }));
    setStoredKeys(keyValues);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl p-8 mb-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
	  <div className="flex text-yellow-500 items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Stored Keys:</h2>
        <KeyRound size={24}/>
		<FileKey size={24}/>
		</div>
        {storedKeys.length === 0 ? (
          <p className="text-gray-400">No keys stored in localStorage.</p>
        ) : (
          <ul className="space-y-2">
            {storedKeys.map(({ key, value }) => (
              <li key={key} className="bg-gray-700 p-2 rounded-lg border border-red-500/30 shadow-lg shadow-red-500/20">
                <p className="text-yellow-400 overflow-hidden text-ellipsis">
                  Public Key: {key}
                </p>
                <p className="text-cyan-400 overflow-hidden text-ellipsis">
                  Encrypted Data: {value}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StoredKeys;
