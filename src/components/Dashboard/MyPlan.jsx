import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "react-feather";
import { useNavigate } from "react-router-dom";

export default function MyPlan() {
  const [user, setUser] = useState(null);    
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [services, setServices] = useState([]);
  const [pastPlans, setPastPlans] = useState([]);
  const [expandedPlanIndex, setExpandedPlanIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allPlans, setAllPlans] = useState([]);
  const [daysLeft, setDaysLeft] = useState(null);
  const [daysToBilling, setDaysToBilling] = useState(null);
  const [showExpiryAlert, setShowExpiryAlert] = useState(false);
  const [showBillingAlert, setShowBillingAlert] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [showRenewPopup, setShowRenewPopup] = useState(false);

  const navigate = useNavigate();

  const EXPIRY_WARNING_DAYS = 7;
  const BILLING_WARNING_DAYS = 7;
  const LIMIT_WARNING_THRESHOLD = 5;

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  const getEndDate = (startDate) => {
    if (!startDate) return "—";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + 1);
    return end.toLocaleDateString();
  };

  
  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found in localStorage.");
          if (mounted) setLoading(false);
          return;
        }
        const [userRes, subsRes] = await Promise.all([
          axios.get("https://vaahan-suraksha-backend.vercel.app/api/v1/auth/my-details", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription"),
        ]);

        const userData = userRes?.data?.data || null;
        const subscriptions = subsRes?.data?.data || [];

        if (!mounted) return;
        setUser(userData);
        setCurrentPlan(userData?.currentPlan || null);
        setIsSubscribed(Boolean(userData?.isSubscribed));
        setPastPlans(userData?.pastPlans || []);
        setAllPlans(subscriptions);

        if (userData?.currentPlan) {
          const today = new Date();
          const endDate = userData.currentPlan.endDate
            ? new Date(userData.currentPlan.endDate)
            : null;
          if (endDate) {
            const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            setDaysLeft(diffDays);
            setShowExpiryAlert(diffDays >= 0 && diffDays <= EXPIRY_WARNING_DAYS);
          }

          const nextBilling = userData.currentPlan.nextBillingDate
            ? new Date(userData.currentPlan.nextBillingDate)
            : null;
          if (nextBilling) {
            const diffBilling = Math.ceil(
              (nextBilling - today) / (1000 * 60 * 60 * 24)
            );
            setDaysToBilling(diffBilling);
            setShowBillingAlert(diffBilling >= 0 && diffBilling <= BILLING_WARNING_DAYS);
          }

          const limitRemaining =
            typeof userData.currentPlan.limit === "number"
              ? userData.currentPlan.limit
              : Number(userData.currentPlan.limit) || null;

          setShowLimitAlert(
            typeof limitRemaining === "number" && limitRemaining <= LIMIT_WARNING_THRESHOLD
          );
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => (mounted = false);
  }, []);

 
  useEffect(() => {
    let mounted = true;
    const loadServices = async () => {
      if (!currentPlan) {
        if (mounted) setServices([]);
        return;
      }

      if (
        Array.isArray(currentPlan.services) &&
        currentPlan.services.length > 0 &&
        typeof currentPlan.services[0] === "object" &&
        currentPlan.services[0]?.name
      ) {
        if (mounted) setServices(currentPlan.services);
        return;
      }

      try {
        const res = await axios.get(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
        );
        const allServices = res?.data?.data || [];
        const planServiceIds = (currentPlan.services || []).map((s) =>
          typeof s === "string" ? s : s?._id
        );
        const matched = allServices.filter((s) => planServiceIds.includes(s._id));
        if (mounted) setServices(matched);
      } catch (err) {
        console.error("❌ Error fetching services:", err);
        if (mounted) setServices([]);
      }
    };
    loadServices();
    return () => (mounted = false);
  }, [currentPlan]);

  const handleRenewConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        setLoading(false);
        return;
      }

      const subscriptionIdRaw = currentPlan?.subscriptionId;
      const subscriptionId =
        typeof subscriptionIdRaw === "string"
          ? subscriptionIdRaw
          : subscriptionIdRaw?._id || subscriptionIdRaw;

      const payload = {
        planId: subscriptionId,
        price: currentPlan?.price,
        limit: currentPlan?.limit,
        serviceIds: (currentPlan?.services || []).map((s) =>
          typeof s === "string" ? s : s._id
        ),
      };

      const res = await axios.post(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/renew",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res?.data?.data;
      if (data?.razorpayOrderId) {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Vaahan Suraksha",
          description: "Subscription Renewal",
          order_id: data.razorpayOrderId,
          prefill: {
            name: data.user?.name || user?.name || "",
            email: data.user?.email || user?.email || "",
            contact: data.user?.phoneNo || user?.phoneNo || "",
          },
          handler: function () {
            alert("✅ Subscription renewed successfully!");
            window.location.reload();
          },
          theme: { color: "#4F46E5" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else alert("Unable to start payment. Please try again.");
    } catch (err) {
      console.error("❌ Renewal error:", err);
      alert("Something went wrong during renewal. Please try again.");
    } finally {
      setLoading(false);
      setShowRenewPopup(false);
    }
  };

  const getProgressPercent = () => {
    try {
      const planIdObj = currentPlan?.subscriptionId;
      const planId = typeof planIdObj === "string" ? planIdObj : planIdObj?._id;
      const meta = allPlans.find((p) => p._id === planId);
      const total = meta?.limit || null;
      const remaining =
        typeof currentPlan?.limit === "number" ? currentPlan.limit : null;
      if (!total || typeof remaining !== "number") return 0;
      const pct = Math.round((remaining / total) * 100);
      return Math.min(100, Math.max(0, pct));
    } catch {
      return 0;
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="min-h-[70vh] flex justify-center items-start bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Plan</h1>

        {/* Alerts */}
        <div className="space-y-2 mb-4">
          {showExpiryAlert && daysLeft !== null && (
            <marquee className="block bg-yellow-100 text-yellow-800 font-medium py-2 rounded-lg shadow-sm px-3">
              ⚠️ Your plan expires in {daysLeft} day{daysLeft > 1 ? "s" : ""}.
              Renew now to avoid interruption.
            </marquee>
          )}
          {showBillingAlert && daysToBilling !== null && (
            <marquee className="block bg-indigo-50 text-indigo-800 font-medium py-2 rounded-lg shadow-sm px-3">
              🔔 Billing date is in {daysToBilling} day
              {daysToBilling > 1 ? "s" : ""}.
            </marquee>
          )}
          {showLimitAlert && (
            <marquee className="block bg-red-100 text-red-800 font-medium py-2 rounded-lg shadow-sm px-3">
              ⚠️ Your plan limit is running low. Consider renewing or upgrading.
            </marquee>
          )}
        </div>

        {isSubscribed && currentPlan ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{currentPlan.name}</h2>
                <p className="text-indigo-100 font-bold mt-1 text-sm">
                  Remaining Limit: {currentPlan.limit ?? "—"}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
              <div>
                <p className="text-gray-700 font-medium">Price:</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentPlan.price}</p>
                <div className="text-sm text-gray-600 mt-2">
                  <div>Start: {formatDate(currentPlan.startDate)}</div>
                  <div>End: {getEndDate(currentPlan.startDate)}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRenewPopup(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                  Renew Plan
                </button>
                <button
                  onClick={() => navigate("/subscription")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2 rounded-lg border transition"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-gray-800 font-medium text-sm">Plan usage</p>
                  <p className="text-xs text-gray-500">{getProgressPercent()}% remaining</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${getProgressPercent()}%` }}
                  />
                </div>
              </div>

              {services.length > 0 && (
                <>
                  <h3 className="text-gray-800 font-semibold mb-3">Included Services:</h3>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service) => (
                      <div
                        key={service._id || service.name}
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
                </>
              )}
            </div>

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
                      <div key={index} className="p-4 bg-white rounded-xl shadow-sm border">
                        <p className="font-semibold text-gray-800 text-lg">{plan.name}</p>
                        <p className="text-sm text-gray-500">
                          Limit: {plan.limit} | Price: ₹{plan.price}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
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
          <p className="text-gray-600 text-center">
            You don’t have any active subscription.
          </p>
        )}
      </div>

 
      {showRenewPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Confirm Renewal</h2>
            <p className="text-gray-600 mb-2">Plan: {currentPlan.name}</p>
            <p className="text-gray-600 mb-2">Price: ₹{currentPlan.price}</p>
            <p className="text-gray-600 mb-4">Validity: 1 Year</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRenewPopup(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewConfirm}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
