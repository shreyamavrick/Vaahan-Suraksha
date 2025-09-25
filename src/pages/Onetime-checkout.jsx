import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // optional; remove if not used

const ONE_TIME_PLANS_URL = "https://vaahan-suraksha-backend.vercel.app/api/v1/oneTime/";
const BRANDS_API = "https://vaahan-suraksha-backend.vercel.app/api/v1/car/brand/";
const MODELS_API = "https://vaahan-suraksha-backend.vercel.app/api/v1/car/model/"; // append brandId
const CREATE_ORDER_API = "https://vaahan-suraksha-backend.vercel.app/api/v1/order/oneTime/create";
const VERIFY_ORDER_API = "https://vaahan-suraksha-backend.vercel.app/api/v1/order/oneTime/verify";

const currency = (n) => (typeof n === "number" ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" }) : "—");

export default function CheckoutOneTime() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser(); // if you don't have this context, remove and handle auth differently

  const planId = searchParams.get("planId");
  const pricingType = "oneTimePrice";

  const [plan, setPlan] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [carType, setCarType] = useState("");
  const [price, setPrice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    scheduledDate: "",
    location: "",
  });

  // 1) Fetch plans list and find plan by id (safer than assuming /:id exists)
  useEffect(() => {
    let mounted = true;
    async function loadPlan() {
      if (!planId) {
        if (mounted) {
          setErr("No plan selected.");
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(ONE_TIME_PLANS_URL);
        if (!mounted) return;
        if (res.data?.success) {
          const found = (res.data.data || []).find((p) => p._id === planId);
          if (!found) {
            setErr("Plan not found.");
          } else {
            setPlan(found);
          }
        } else {
          setErr("Failed to load plans.");
        }
      } catch (e) {
        console.error("Plan fetch error:", e);
        setErr("Failed to load plan.");
      } finally {
        mounted && setLoading(false);
      }
    }
    loadPlan();
    return () => {
      mounted = false;
    };
  }, [planId]);

  // 2) Fetch brands
  useEffect(() => {
    let mounted = true;
    axios
      .get(BRANDS_API)
      .then((res) => {
        if (!mounted) return;
        console.log("brands:", res.data);
        if (res.data?.success) setBrands(res.data.data || []);
        else setBrands([]);
      })
      .catch((e) => {
        console.error("Brands fetch error:", e);
        setBrands([]);
      });
    return () => (mounted = false);
  }, []);

  // 3) Fetch models for selected brand
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setSelectedModel("");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${MODELS_API}${selectedBrand}`);
        if (cancelled) return;
        if (res.data?.success) {
          setModels(res.data.data || []);
        } else {
          setModels([]);
        }
      } catch (e) {
        console.error("Models fetch error:", e);
        setModels([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedBrand]);

  // 4) When model selected update carType and price (support both pricing shapes)
  useEffect(() => {
    if (!selectedModel || !plan || !models.length) {
      setCarType("");
      setPrice(null);
      return;
    }
    const modelObj = models.find((m) => m._id === selectedModel);
    if (!modelObj) {
      setCarType("");
      setPrice(null);
      return;
    }
    const resolvedCarType = modelObj.carType;
    setCarType(resolvedCarType);

    const planPricingEntry = plan.pricing?.[resolvedCarType];
    // support numeric or nested shape
    let resolvedPrice = null;
    if (typeof planPricingEntry === "number") resolvedPrice = planPricingEntry;
    else if (planPricingEntry && typeof planPricingEntry === "object") {
      // commonly might be { oneTimePrice: 5000 } or { price: 5000 }
      resolvedPrice = planPricingEntry.oneTimePrice ?? planPricingEntry.price ?? null;
    }
    setPrice(resolvedPrice ?? null);
  }, [selectedModel, plan, models]);

  // 5) Prefill user details if user context present and clear local storage if belongs to other user
  useEffect(() => {
    // If you want to persist the form per user, include user.uid when storing; here we only prefill.
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.fullName ?? prev.name,
      phone: user.phone ?? prev.phone,
    }));

    // Optional: restore saved form only if belongs to same user
    try {
      const saved = localStorage.getItem("checkoutForm");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.userId && parsed.userId === user.uid) {
          setFormData((prev) => ({ ...prev, ...parsed }));
        } else {
          // do not restore form from other user
        }
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.name || !formData.phone || !formData.scheduledDate || !formData.location) {
      setErr("Please fill all required fields.");
      return false;
    }
    if (!selectedBrand) {
      setErr("Please select car brand.");
      return false;
    }
    if (!selectedModel) {
      setErr("Please select car model.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setErr("Phone must be 10 digits.");
      return false;
    }
    const today = new Date().toISOString().split("T")[0];
    if (formData.scheduledDate < today) {
      setErr("Scheduled date cannot be in the past.");
      return false;
    }
    if (!price) {
      setErr("Price not available for selected model.");
      return false;
    }
    setErr("");
    return true;
  };

  const handlePay = async () => {
    if (!validate()) return;
    if (!isAuthenticated) {
      // redirect to login; after login redirect back to this page with same query params
      navigate(`/login?redirect=/checkout-onetime?planId=${planId}`);
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const serviceIds = (plan.services || []).map((s) => (typeof s === "string" ? s : s._id));

      const payload = {
        name: formData.name,
        phoneNo: formData.phone,
        scheduledOn: formData.scheduledDate,
        location: formData.location,
        planId: plan._id,
        pricingType,
        carType,
        amount: price,
        serviceIds,
      };

      // 1) Create order
      const createRes = await axios.post(CREATE_ORDER_API, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!createRes.data?.success) {
        throw new Error(createRes.data?.message || "Order creation failed");
      }

      // API expected to return { data: { razorpayOrderId, amount, currency, key, newOrderId } }
      const orderData = createRes.data.data;
      const razorKey = orderData.key;
      const razorOrderId = orderData.razorpayOrderId ?? orderData.orderId ?? orderData.razorpay_order_id;
      const razorAmount = orderData.amount ?? orderData.amountInPaisa ?? orderData.amount;
      const razorCurrency = orderData.currency ?? "INR";
      const newOrderId = orderData.newOrderId ?? orderData.orderId;

      if (!window.Razorpay) {
        // if Razorpay lib is not loaded — load script dynamically or instruct dev
        console.error("Razorpay not found on window. Make sure Razorpay script is loaded.");
        alert("Payment gateway not available. Try again later.");
        setProcessing(false);
        return;
      }

      const options = {
        key: razorKey,
        amount: razorAmount,
        currency: razorCurrency,
        order_id: razorOrderId,
        name: plan.name || "Vaahan Suraksha",
        description: "One-time plan purchase",
        handler: async function (razorResp) {
          try {
            // verify payment
            const verifyRes = await axios.post(
              VERIFY_ORDER_API,
              {
                razorpay_payment_id: razorResp.razorpay_payment_id,
                razorpay_order_id: razorResp.razorpay_order_id,
                razorpay_signature: razorResp.razorpay_signature,
                orderId: newOrderId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
            );
            if (verifyRes.data?.success) {
              // success -> navigate to orders
              navigate("/dashboard/orders");
            } else {
              alert(verifyRes.data?.message || "Payment verification failed");
            }
          } catch (verifyErr) {
            console.error("Payment verify error:", verifyErr);
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error("Create order error:", e);
      alert(e?.response?.data?.message ?? e.message ?? "Failed to create order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] grid place-items-center">Loading checkout...</div>;
  }

  if (!plan) {
    return <div className="min-h-[60vh] grid place-items-center text-red-600">Selected plan not found.</div>;
  }

  return (
    <section className="min-h-screen py-14 bg-gradient-to-b from-indigo-50 to-white flex justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center sm:text-left">Checkout</h1>

        {/* Plan preview */}
        <div className="mb-6 p-4 border rounded-lg bg-indigo-50">
          <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
          {carType ? (
            <p className="text-indigo-600 font-semibold text-lg">Price: ₹{price ?? "—"}</p>
          ) : (
            <p className="text-gray-500">Select brand & model to see price</p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border p-3 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Booking Date</label>
            <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input id="location-input" type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          </div>

          {/* Brand & Model selects */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Car Brand</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full border p-3 rounded-lg">
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {models.length > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Car Model</label>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full border p-3 rounded-lg">
                <option value="">Select Model</option>
                {models.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.carType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {err && <p className="text-red-600 mt-2">{err}</p>}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">Included services:</p>
          <ul className="list-disc ml-5 mt-2 text-gray-700">
            {plan.services?.map((s) => (
              <li key={typeof s === "string" ? s : s._id}>{typeof s === "string" ? s : s.name}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {processing ? "Processing…" : `Proceed to Pay ${price ? `₹${price}` : ""}`}
        </button>
      </div>
    </section>
  );
}
