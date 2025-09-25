import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react"; // modern icon for services

const OneTimePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://vaahan-suraksha-backend.vercel.app/api/v1/oneTime/")
      .then((res) => {
        if (res.data?.success) {
          setPlans(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading plans...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        One-Time Service Plans
      </h2>

      {plans.length === 0 ? (
        <p className="text-center text-gray-500">No plans available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition duration-300 border border-gray-200"
            >
              {/* Plan Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm opacity-90">Limit: {plan.limit}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                {/* Services */}
                <div>
                  <p className="font-semibold text-gray-700 mb-3">
                    Services Included
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {plan.services.map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50"
                      >
                        <img
                          src={service.images?.[0]}
                          alt={service.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="text-gray-700 flex items-center gap-1">
                          <CheckCircle2 size={16} className="text-green-500" />
                          {service.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <p className="font-semibold text-gray-700 mb-3">
                    Pricing by Car Type
                  </p>
                  <ul className="space-y-2">
                    {Object.entries(plan.pricing).map(([carType, amount]) => (
                      <li
                        key={carType}
                        className="flex justify-between border-b pb-1 text-gray-700"
                      >
                        <span>{carType}</span>
                        <span className="font-bold text-blue-600">₹{amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book Now Button */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OneTimePlans;
