import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { CheckCircle2 } from "lucide-react";
import OneTimePlan from "../components/plans/OneTimePlans"
const PLANS_URL =
  "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/";
const SERVICES_URL =
  "https://vaahan-suraksha-backend.vercel.app/api/v1/service/";

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : "—";

const getFirstPricingKey = (pricingObj) => {
  if (!pricingObj || typeof pricingObj !== "object") return null;
  const keys = Object.keys(pricingObj);
  return keys.length ? keys[0] : null;
};

export default function Subscription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useUser();

  const [plans, setPlans] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [expanded, setExpanded] = useState({});

  const targetServiceParam = searchParams.get("service");

  useEffect(() => {
    let isCancelled = false;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setErr(null);
        const [plansRes, servicesRes] = await Promise.all([
          fetch(PLANS_URL),
          fetch(SERVICES_URL),
        ]);
        const plansJson = await plansRes.json();
        const servicesJson = await servicesRes.json();

        if (!plansJson?.success)
          throw new Error(plansJson?.message || "Failed to load plans");
        if (!servicesJson?.success)
          throw new Error(servicesJson?.message || "Failed to load services");
        if (isCancelled) return;

        setPlans(plansJson.data || []);

        const map = {};
        (servicesJson.data || []).forEach((s) => {
          map[s._id] = s;
        });
        setServicesMap(map);
      } catch (e) {
        if (!isCancelled) setErr(e.message || "Something went wrong");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  const targetServiceId = useMemo(() => {
    if (!targetServiceParam || !Object.keys(servicesMap).length) return null;
    if (servicesMap[targetServiceParam]) return targetServiceParam;
    const matchByName = Object.values(servicesMap).find(
      (s) => s.name?.toLowerCase() === targetServiceParam.toLowerCase()
    );
    return matchByName?._id || null;
  }, [targetServiceParam, servicesMap]);

  const recommendedPlanId = useMemo(() => {
    if (!targetServiceId || !plans.length) return null;
    const plan = plans.find((p) =>
      p.services?.some((s) => (typeof s === "string" ? s : s._id) === targetServiceId)
    );
    return plan?._id || null;
  }, [plans, targetServiceId]);

  const toggleExpanded = (planId) =>
    setExpanded((prev) => ({ ...prev, [planId]: !prev[planId] }));

  const handleSubscribe = (plan) => {
  const firstPricingKey = getFirstPricingKey(plan.pricing); // hatchback, sedan, etc.
  if (!firstPricingKey) {
    alert("No pricing available for this plan.");
    return;
  }

  if (!isAuthenticated) {
    // Redirect to login first
    const redirectUrl = user?.currentPlan?.subscriptionId
      ? `/checkout-upgrade?planId=${plan._id}&pricingKey=${firstPricingKey}&pricingType=monthlyPrice`
      : `/checkout?planId=${plan._id}&pricingKey=${firstPricingKey}&pricingType=monthlyPrice`;

    navigate(`/login?redirect=${redirectUrl}`);
    return;
  }

  if (user?.currentPlan?.subscriptionId) {
    // User has an existing plan → go to Upgrade checkout
    navigate(
      `/checkout-upgrade?planId=${plan._id}&pricingKey=${firstPricingKey}&pricingType=monthlyPrice`
    );
  } else {
    // New subscription → go to normal checkout
    navigate(
      `/checkout?planId=${plan._id}&pricingKey=${firstPricingKey}&pricingType=monthlyPrice`
    );
  }
};


  const filteredPlans = useMemo(() => {
    if (!user?.currentPlan?.subscriptionId) return plans;
    return plans.filter((p) => p._id !== user.currentPlan.subscriptionId);
  }, [plans, user]);

  if (loading)
    return (
      <div className="min-h-[60vh] grid place-items-center animate-pulse">
        Loading plans…
      </div>
    );
  if (err)
    return (
      <div className="min-h-[60vh] grid place-items-center text-red-600">
        {err}
      </div>
    );

  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Subscription Plans
          </h1>
          <p className="text-gray-600 mt-2">
            Unlock better pricing and bundled services. Choose a plan that fits
            your vehicle’s needs.
          </p>

          {user?.currentPlan?.name && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
              You are currently subscribed to{" "}
              <span className="font-semibold">
                {user.currentPlan.name} ({currency(user.currentPlan.price)})
              </span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlans.map((plan) => {
            const firstPricingKey = getFirstPricingKey(plan.pricing);
            const selectedTier =
              firstPricingKey && plan.pricing
                ? plan.pricing[firstPricingKey]
                : null;

            return (
              <div
                key={plan._id}
                className={`rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition duration-300 border border-gray-200 ${
                  recommendedPlanId === plan._id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {/* Plan Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm opacity-90">
                    Duration: {plan.duration} {plan.durationUnit}
                    {plan.duration > 1 ? "s" : ""} · Limit: {plan.limit}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-6">
                  {/* Services */}
                  <div>
                    <p className="font-semibold text-gray-700 mb-3">
                      Services Included
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {Array.isArray(plan.services) && plan.services.length > 0 ? (
                        plan.services.map((s) => {
                          const service =
                            typeof s === "string" ? servicesMap[s] : s;
                          return (
                            <div
                              key={typeof s === "string" ? s : s._id}
                              className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50"
                            >
                              {service?.images?.[0] ? (
                                <img
                                  src={service.images[0]}
                                  alt={service.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100" />
                              )}
                              <span className="text-gray-700 flex items-center gap-1">
                                <CheckCircle2 size={16} className="text-green-500" />
                                {service?.name || "Unknown Service"}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500">No services listed</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <p className="font-semibold text-gray-700 mb-3">
                      Starting Price
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {currency(selectedTier?.price)}
                    </p>
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    {user?.currentPlan?.subscriptionId
                      ? "Upgrade Plan"
                      : "Buy Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <OneTimePlan/>

        <div className="mt-10 text-center text-gray-500 text-sm">
          Prices are indicative. Taxes may apply. Only one active plan per user.
        </div>
      </div>
    </section>
  );
}
