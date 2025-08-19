// src/components/Dashboard/Addresses.jsx
import { MapPin, Home, Plus } from "lucide-react";

const dummyAddresses = [
  {
    id: 1,
    type: "Home",
    details: "123, MG Road, Bengaluru, Karnataka",
  },
  {
    id: 2,
    type: "Office",
    details: "42, Electronic City, Bengaluru, Karnataka",
  },
];

const Addresses = () => {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
      <div className="grid gap-4">
        {dummyAddresses.map((address) => (
          <div
            key={address.id}
            className="border rounded-2xl p-4 shadow-sm flex items-start gap-3 bg-white"
          >
            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <div className="font-semibold flex items-center gap-2">
                {address.type === "Home" ? (
                  <Home className="w-5 h-5 text-gray-600" />
                ) : (
                  <MapPin className="w-5 h-5 text-gray-600" />
                )}
                {address.type}
              </div>
              <p className="text-sm text-gray-600">{address.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add new address button */}
      <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700">
        <Plus className="w-5 h-5" /> Add New Address
      </button>
    </div>
  );
};

export default Addresses;
