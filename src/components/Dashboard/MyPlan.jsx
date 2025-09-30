import { useEffect, useState } from "react"; 
import { useUser } from "../../context/UserContext";
import axios from "axios";

export default function MyPlan() {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    setCurrentPlan(user?.currentPlan || null);
    setIsSubscribed(user?.isSubscribed || false);
  }, [user]);

  useEffect(() => {
    const fetchServices = async () => {
      if (currentPlan?.services?.length > 0) {
        try {
          const res = await axios.get(
            "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
          );
          const allServices = res.data.data || [];
          const matched = allServices.filter((s) =>
            currentPlan.services.includes(s._id)
          );
          setServices(matched);
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      } else {
        setServices([]); 
      }
    };

    fetchServices();
  }, [currentPlan]); 

  return (
    <section className="min-h-[70vh] flex justify-center items-start bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-gray-900 mb-8 ">My Plan</h1>

        {isSubscribed && currentPlan ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header: Plan name and status */}
            <div className="bg-indigo-600 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{currentPlan.name}</h2>
                <p className="text-indigo-100 font-bold mt-1 text-sm">
                  {currentPlan.duration} {currentPlan.durationUnit} Limit: {currentPlan.limit}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            {/* Pricing */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <p className="text-gray-700 font-medium">Price:</p>
              <p className="text-2xl font-bold text-gray-900">₹{currentPlan.price}</p>
            </div>

            {/* Services */}
            {services.length > 0 && (
              <div className="p-6">
                <h3 className="text-gray-800 font-semibold mb-3">Included Services:</h3>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1 shadow-sm text-sm font-medium"
                    >
                      {service.images?.[0] && (
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      {service.name}
                    </div>
                  ))}
                </div> 
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center">You don’t have any active subscription.</p>
        )}
      </div>
    </section>
  );
}
