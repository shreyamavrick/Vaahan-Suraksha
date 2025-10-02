import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { ChevronDown, ChevronUp } from "react-feather"; // Make sure you have react-feather installed

export default function MyPlan() {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [services, setServices] = useState([]);
  const [pastPlans, setPastPlans] = useState([]);
  const [expandedPlanIndex, setExpandedPlanIndex] = useState(null); // For accordion

  useEffect(() => {
    setCurrentPlan(user?.currentPlan || null);
    setIsSubscribed(user?.isSubscribed || false);
    setPastPlans(user?.pastPlans || []);
  }, [user]);

  useEffect(() => {
    const fetchServices = async () => {
      if (currentPlan?.services?.length > 0) {
        try {
          const res = await axios.get(
            "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
          );
          const allServices = res.data.data || [];

          const planServiceIds = currentPlan.services.map((s) =>
            typeof s === "string" ? s : s._id
          );

          const matched = allServices.filter((s) =>
            planServiceIds.includes(s._id)
          );
          setServices(matched);
        } catch (error) {
          console.error("❌ Error fetching services:", error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Plan</h1>

        {isSubscribed && currentPlan ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Current Plan */}
            <div className="bg-indigo-600 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{currentPlan.name}</h2>
                <p className="text-indigo-100 font-bold mt-1 text-sm">
                  Limit: {currentPlan.limit}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            {/* Price */}
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

            {/* Plan History Accordion */}
            <div className="border-t border-gray-100">
              <button
                onClick={() =>
                  setExpandedPlanIndex(expandedPlanIndex === 0 ? null : 0)
                }
                className="w-full flex justify-between items-center px-6 py-4 text-indigo-600 font-semibold text-lg hover:bg-indigo-50 transition"
              >
                Plan History
                {expandedPlanIndex === 0 ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedPlanIndex === 0 && (
                <div className="p-6 space-y-4 bg-gray-50">
                  {pastPlans.length > 0 ? (
                    pastPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-xl shadow-sm border"
                      >
                        <p className="font-semibold text-gray-800 text-lg">{plan.name}</p>
                        <p className="text-sm text-gray-500">
                          Limit: {plan.limit} | Price: ₹{plan.price}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(plan.startDate).toLocaleDateString()} –{" "}
                          {new Date(plan.endDate).toLocaleDateString()}
                        </p>

                        {/* Services for past plan */}
                        {plan.services?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {plan.services.map((serviceId) => {
                              // Match with all services if needed
                              const service = services.find((s) => s._id === serviceId);
                              if (!service) return null;
                              return (
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
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No past plans found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You don’t have any active subscription.
          </p>
        )}
      </div>
    </section>
  );
}
