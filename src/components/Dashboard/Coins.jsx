// src/components/Dashboard/Coins.jsx
import { CircleDollarSign } from "lucide-react";

const dummyCoins = {
  totalCoins: 1200,
  earned: 1500,
  spent: 300,
};

export default function Coins() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Coins</h2>

      {/* Main coins balance */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 mb-6">
        <CircleDollarSign className="w-10 h-10 text-yellow-500" />
        <div>
          <p className="text-gray-600">Total Coins</p>
          <p className="text-2xl font-bold text-gray-800">{dummyCoins.totalCoins}</p>
        </div>
      </div>

      {/* Coins details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-600">Coins Earned</p>
          <p className="text-lg font-bold text-green-600">{dummyCoins.earned}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-600">Coins Spent</p>
          <p className="text-lg font-bold text-red-500">{dummyCoins.spent}</p>
        </div>
      </div>
    </div>
  );
}
