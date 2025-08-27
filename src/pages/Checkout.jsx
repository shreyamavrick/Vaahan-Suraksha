import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PLANS_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/";
const SERVICES_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/service/";

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : "—";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const [plan, setPlan] = useState(null);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [processing, setProcessing] = useState(false);

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
        const plansRes = await fetch(PLANS_URL);
        const plansJson = await plansRes.json();
        if (!plansJson.success) throw new Error(plansJson.message || "Failed to load plans");

        const planData = plansJson.data.find((p) => p._id === planId);
        if (!planData) throw new Error("Plan not found.");

        setPlan(planData);
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

  const handlePay = async () => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=/checkout?planId=${planId}&pricingKey=${pricingKey}&pricingType=${pricingType}`
      );
      return;
    }
    if (!plan) {
      alert("Plan data missing");
      return;
    }
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const serviceIds = plan.services?.map((s) => (typeof s === "string" ? s : s._id));
      const price = plan.pricing?.[pricingKey]?.[pricingType];
      if (!price) {
        alert("Pricing not found.");
        setProcessing(false);
        return;
      }

      const orderRes = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/order/oneTime/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            planId,
            pricingType,
            amount: price,
            serviceIds,
          }),
        }
      );
      const orderJson = await orderRes.json();
      if (!orderJson.success) {
        alert(orderJson.message || "Order creation failed");
        setProcessing(false);
        return;
      }
      const { razorpayOrderId, amount, currency, key, newOrderId } = orderJson.data;

      const options = {
        key,
        amount, 
        currency,
        order_id: razorpayOrderId,
        name: plan.name,
        description: "Vaahan Suraksha Plan Purchase",
        handler: async function (razorpayResponse) {
        
          const verifyRes = await fetch(
            "https://vaahan-suraksha-backend.vercel.app/api/v1/order/oneTime/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify({
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                orderId: newOrderId,
              }),
            }
          );
          const verifyJson = await verifyRes.json();
          console.log("API Response:", verifyJson);
         
          if (verifyJson.success) {
            navigate("/dashboard/orders"); 
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert(e.message || "Unexpected error. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] grid place-items-center animate-pulse">
        {"Loading checkout…"}
      </div>
    );
  if (err)
    return (
      <div className="min-h-[60vh] grid place-items-center text-red-600">{err}</div>
    );

  const selectedTier = plan.pricing?.[pricingKey];
  const price = selectedTier?.[pricingType];

  return (
  <section className="min-h-screen py-14 bg-gradient-to-b from-indigo-50 to-white flex justify-center px-4">
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 sm:p-12">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center sm:text-left">Checkout</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Selected Plan</h2>
        <p className="text-gray-700 text-lg font-medium">{plan.name}</p>
        <p className="text-sm text-gray-500 mt-1">
          Tier: <span className="capitalize">{pricingKey}</span> &middot;{" "}
          <span>{pricingType === "oneTimePrice" ? "One-time" : "Monthly"}</span>
        </p>
        <p className="mt-3 text-2xl font-bold text-indigo-600">{currency(price)}</p>
      </div>

      {plan.services?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Included Services</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed text-base max-h-60 overflow-auto">
            {plan.services.map((s) => {
              const name = typeof s === "string" ? servicesMap[s]?.name : s.name;
              return (
                <li key={typeof s === "string" ? s : s._id} className="hover:text-indigo-600 transition-colors">
                  {name || "Unknown Service"}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 focus:outline-none text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {processing ? "Processing…" : "Proceed to Pay"}
      </button>
    </div>
  </section>
);

}
