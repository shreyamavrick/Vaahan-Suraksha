  import { useEffect, useMemo, useState } from "react"; 
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { useUser } from "../context/UserContext";

  const PLANS_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/";
  const SERVICES_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/service/";

  const currency = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" }) : "—";

  const getFirstPricingKey = (pricingObj) => {
    if (!pricingObj || typeof pricingObj !== "object") return null;
    const keys = Object.keys(pricingObj);
    return keys.length ? keys[0] : null;
  };

  export default function Subscription() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useUser();

    const [plans, setPlans] = useState([]);
    const [servicesMap, setServicesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [pricingSelection, setPricingSelection] = useState({});
    const [pricingTypeSelection, setPricingTypeSelection] = useState({});
    const [expanded, setExpanded] = useState({});

    const targetServiceParam = searchParams.get("service");

    useEffect(() => {
      let isCancelled = false;
      const fetchAll = async () => {
        try {
          setLoading(true);
          setErr(null);
          const [plansRes, servicesRes] = await Promise.all([fetch(PLANS_URL), fetch(SERVICES_URL)]);
          const plansJson = await plansRes.json();
          const servicesJson = await servicesRes.json();

          if (!plansJson?.success) throw new Error(plansJson?.message || "Failed to load plans");
          if (!servicesJson?.success) throw new Error(servicesJson?.message || "Failed to load services");
          if (isCancelled) return;

          const plansData = plansJson.data || [];
          const servicesData = servicesJson.data || [];
          setPlans(plansData);

          const map = {};
          servicesData.forEach((s) => { map[s._id] = s; });
          setServicesMap(map);

          const initialPricingSel = {};
          const initialTypeSel = {};
          plansData.forEach((p) => {
            const firstKey = getFirstPricingKey(p.pricing);
            if (firstKey) {
              initialPricingSel[p._id] = firstKey;
              initialTypeSel[p._id] = "oneTimePrice"; // default
            }
          });
          setPricingSelection(initialPricingSel);
          setPricingTypeSelection(initialTypeSel);
        } catch (e) {
          if (!isCancelled) setErr(e.message || "Something went wrong");
        } finally { if (!isCancelled) setLoading(false); }
      };

      fetchAll();
      return () => { isCancelled = true; };
    }, []);

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
      const plan = plans.find((p) => p.services?.includes(targetServiceId));
      return plan?._id || null;
    }, [plans, targetServiceId]);

    const toggleExpanded = (planId) => setExpanded((prev) => ({ ...prev, [planId]: !prev[planId] }));
    const handlePricingChange = (planId, key) => setPricingSelection((prev) => ({ ...prev, [planId]: key }));
    const handlePricingTypeChange = (planId, type) => setPricingTypeSelection((prev) => ({ ...prev, [planId]: type }));

    const handleSubscribe = (plan) => {
      const pricingKey = pricingSelection[plan._id] || getFirstPricingKey(plan.pricing);
      const type = pricingTypeSelection[plan._id] || "oneTimePrice";

      if (!isAuthenticated) {
        navigate(`/login?redirect=/checkout?planId=${plan._id}&pricingKey=${pricingKey}&pricingType=${type}`);
        return;
      }

      navigate(`/checkout?planId=${plan._id}&pricingKey=${pricingKey}&pricingType=${type}`);
    };

    if (loading) return <div className="min-h-[60vh] grid place-items-center animate-pulse">Loading plans…</div>;
    if (err) return <div className="min-h-[60vh] grid place-items-center text-red-600">{err}</div>;

    return (
      <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600 mt-2">Unlock better pricing and bundled services. Choose a plan that fits your vehicle’s needs.</p>

            {targetServiceParam && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
                You’re looking for: <span className="font-semibold">{servicesMap[targetServiceId]?.name || targetServiceParam}</span>
                {recommendedPlanId ? <span className="ml-2">— Recommended plan highlighted below.</span> : <span className="ml-2">— No plan explicitly lists this service.</span>}
              </div>
            )}
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const pricingKeys = Object.keys(plan.pricing || {});
              const selectedPricingKey = pricingSelection[plan._id] || getFirstPricingKey(plan.pricing);
              const selectedTier = selectedPricingKey && plan.pricing ? plan.pricing[selectedPricingKey] : null;
              const selectedType = pricingTypeSelection[plan._id] || "oneTimePrice";

              return (
                <div key={plan._id} className={`relative flex flex-col rounded-2xl border bg-white shadow-sm hover:shadow-md transition ${recommendedPlanId === plan._id ? "ring-2 ring-blue-500" : "border-gray-200"}`}>
                  
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Duration: <span className="font-medium">{plan.duration} {plan.durationUnit}{plan.duration>1?'s':''}</span> · Limit: <span className="font-medium">{plan.limit}</span>
                    </p>

                    {pricingKeys.length > 1 && (
                      <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-1">Pricing Tier</label>
                        <select
                          value={selectedPricingKey}
                          onChange={(e) => handlePricingChange(plan._id, e.target.value)}
                          className="w-full rounded-lg border-gray-300"
                        >
                          {pricingKeys.map((k) => <option key={k} value={k}>Tier {k}</option>)}
                        </select>
                      </div>
                    )}

                    <div className="mt-3">
                      <span className="block text-sm text-gray-600 mb-1">Pricing Type</span>
                      <div className="flex gap-3">
                        {["oneTimePrice", "monthlyPrice"].map((type) => (
                          <button
                            key={type}
                            onClick={() => handlePricingTypeChange(plan._id, type)}
                            className={`px-4 py-2 rounded-lg border ${selectedType === type ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700"}`}
                          >
                            {type === "oneTimePrice" ? "One-time" : "Monthly"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-lg font-semibold">{currency(selectedTier?.[selectedType])}</div>
                  </div>

                  <div className="p-6 flex-1">
                    <button onClick={() => toggleExpanded(plan._id)} className="w-full flex items-center justify-between rounded-lg border px-4 py-2 text-left hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-800">What’s included ({plan.services?.length || 0})</span>
                      <svg className={`h-5 w-5 transition-transform ${expanded[plan._id] ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {expanded[plan._id] && (
                      <ul className="mt-3 max-h-48 overflow-auto space-y-2">
                        {plan.services?.length ? plan.services.map((s) => {
                          const serviceName = typeof s === "string" ? servicesMap[s]?.name : s.name;
                          return (
                            <li key={typeof s === "string"?s:s._id} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                              <span>{serviceName || "Unknown Service"}</span>
                            </li>
                          );
                        }) : <li className="text-sm text-gray-500">No services listed.</li>}
                      </ul>
                    )}
                  </div>

                  <div className="p-6 border-t">
                    <button onClick={() => handleSubscribe(plan)} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold transition">
                      Subscribe Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center text-gray-500 text-sm">
            Prices are indicative. Taxes may apply. Only one active plan per user.
          </div>
        </div>
      </section>
    );
  }
