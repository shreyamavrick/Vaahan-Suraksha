import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PLANS_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/";
const SERVICES_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/service/";

const currency = (n) =>
  typeof n === "number" ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" }) : "—";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const [plan, setPlan] = useState(null);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const planId = searchParams.get("planId");
  const pricingKey = searchParams.get("pricingKey");
  const pricingType = searchParams.get("pricingType") || "oneTimePrice";

  useEffect(() => {
    if (!planId) {
      setErr("No plan selected. Please go back and choose a plan.");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);

        // Fetch all plans
        const plansRes = await fetch(PLANS_URL);
        const plansJson = await plansRes.json();
        if (!plansJson.success) throw new Error(plansJson.message || "Failed to load plans");

        const planData = plansJson.data.find((p) => p._id === planId);
        if (!planData) throw new Error("Plan not found.");

        setPlan(planData);

        // Fetch services for displaying names
        const servicesRes = await fetch(SERVICES_URL);
        const servicesJson = await servicesRes.json();
        if (!servicesJson.success) throw new Error(servicesJson.message || "Failed to load services");

        const map = {};
        servicesJson.data.forEach((s) => {
          map[s._id] = s;
        });
        setServicesMap(map);
      } catch (e) {
        setErr(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [planId]);

  const handlePay = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/checkout?planId=${planId}&pricingKey=${pricingKey}&pricingType=${pricingType}`);
      return;
    }
    alert("Payment functionality not implemented yet.");
  };

  if (loading) return <div className="min-h-[60vh] grid place-items-center animate-pulse">Loading checkout…</div>;
  if (err) return <div className="min-h-[60vh] grid place-items-center text-red-600">{err}</div>;

  const selectedTier = plan.pricing?.[pricingKey];
  const price = selectedTier?.[pricingType];

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Selected Plan</h2>
          <p className="text-gray-700 mt-1">{plan.name}</p>
          <p className="text-gray-500 text-sm">
            Tier: {pricingKey} · {pricingType === "oneTimePrice" ? "One-time" : "Monthly"}
          </p>
          <p className="text-lg font-semibold mt-2">{currency(price)}</p>
        </div>

        {plan.services?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Included Services</h2>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              {plan.services.map((s) => {
                const name = typeof s === "string" ? servicesMap[s]?.name : s.name;
                return <li key={typeof s === "string" ? s : s._id}>{name || "Unknown Service"}</li>;
              })}
            </ul>
          </div>
        )}

        <button
          onClick={handlePay}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-lg transition"
        >
          Proceed to Pay
        </button>
      </div>
    </section>
  );
}
