import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "react-feather";

export default function MyPlan() {
  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [services, setServices] = useState([]);
  const [pastPlans, setPastPlans] = useState([]);
  const [expandedPlanIndex, setExpandedPlanIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data using stored token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Make sure token is saved at login
        if (!token) {
          console.error("❌ No token found. User is not logged in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/auth/my-details", // endpoint that returns current user details
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = res.data.data;
        setUser(userData);
        setCurrentPlan(userData.currentPlan || null);
        setIsSubscribed(userData.isSubscribed || false);
        setPastPlans(userData.pastPlans || []);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch services for current plan
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

  // Handle Subscription Renewal (same as before)
  const handleRenewSubscription = async () => {
    try {
      setLoading(true);
      const payload = {
        planId: currentPlan?.subscriptionId,
        price: currentPlan?.price,
        limit: currentPlan?.limit,
        serviceIds: currentPlan?.services,
      };

      const res = await axios.post(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/renew",
        payload
      );

      const data = res.data.data;

      if (data?.razorpayOrderId) {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Vaahan Suraksha",
          description: "Subscription Renewal",
          order_id: data.razorpayOrderId,
          prefill: {
            name: data.user.name,
            email: data.user.email,
            contact: data.user.phoneNo,
          },
          handler: function (response) {
            alert("✅ Subscription renewed successfully!");
            window.location.reload();
          },
          theme: { color: "#4F46E5" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("❌ Renewal error:", error);
      alert("Something went wrong during renewal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="min-h-[70vh] flex justify-center items-start bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Plan</h1>

        {isSubscribed && currentPlan ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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

            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-gray-700 font-medium">Price:</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentPlan.price}</p>
              </div>
              {currentPlan.limit <= 0 && (
                <button
                  onClick={handleRenewSubscription}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                  {loading ? "Processing..." : "Renew"}
                </button>
              )}
            </div>

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

            <div className="border-t border-gray-100">
              <button
                onClick={() => setExpandedPlanIndex(expandedPlanIndex === 0 ? null : 0)}
                className="w-full flex justify-between items-center px-6 py-4 text-indigo-600 font-semibold text-lg hover:bg-indigo-50 transition"
              >
                Plan History
                {expandedPlanIndex === 0 ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedPlanIndex === 0 && (
                <div className="p-6 space-y-4 bg-gray-50">
                  {pastPlans.length > 0 ? (
                    pastPlans.map((plan, index) => (
                      <div key={index} className="p-4 bg-white rounded-xl shadow-sm border">
                        <p className="font-semibold text-gray-800 text-lg">{plan.name}</p>
                        <p className="text-sm text-gray-500">
                          Limit: {plan.limit} | Price: ₹{plan.price}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(plan.startDate).toLocaleDateString()} –{" "}
                          {new Date(plan.endDate).toLocaleDateString()}
                        </p>
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
          <p className="text-gray-600 text-center">You don’t have any active subscription.</p>
        )}
      </div>
    </section>
  );
}
