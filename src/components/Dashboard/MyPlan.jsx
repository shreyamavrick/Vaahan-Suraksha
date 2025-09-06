// src/pages/MyPlan.jsx
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { FaCrown } from "react-icons/fa";
import axios from "axios";

export default function MyPlan() {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [services, setServices] = useState([]);

  // ✅ Sync currentPlan and subscription status whenever user updates
  useEffect(() => {
    setCurrentPlan(user?.currentPlan || null);
    setIsSubscribed(user?.isSubscribed || false);
  }, [user]);

  // ✅ Fetch full service objects whenever currentPlan changes
  useEffect(() => {
    const fetchServices = async () => {
      if (currentPlan?.services?.length > 0) {
        try {
          const res = await axios.get(
            "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
          );

          const allServices = res.data.data || [];

          // Match plan service IDs with full service objects
          const matched = allServices.filter((s) =>
            currentPlan.services.includes(s._id)
          );

          setServices(matched);
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      } else {
        setServices([]); // clear services if no current plan
      }
    };

    fetchServices();
  }, [currentPlan]); // ✅ dependency is currentPlan

  return (
    <section className="min-h-[70vh] flex justify-center items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 flex justify-center items-center gap-3">
          
          My Plan
        </h1>

        {isSubscribed && currentPlan ? (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-indigo-600">{currentPlan.name}</p>
            <p className="text-gray-700">
              Price: <span className="font-medium">₹{currentPlan.price}/month</span>
            </p>
            <p className="text-gray-600">
              Limit: {currentPlan.limit || 0}
            </p>

            {services.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Included Services:
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="text-center bg-gray-50 rounded-lg shadow-sm p-3"
                    >
                      {service.images?.length > 0 && (
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      )}
                      <p className="text-xs mt-1 font-medium">{service.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">You don’t have any active subscription.</p>
        )}
      </div>
    </section>
  );
}
