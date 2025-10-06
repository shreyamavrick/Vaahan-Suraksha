import { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckoutSubs() {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [planId, setPlanId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    scheduledDate: "",
    location: "",
  });
  const [err, setErr] = useState("");
  const locationRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutData");
    if (saved) {
      const { cart: savedCart, planId } = JSON.parse(saved);
      setCart(savedCart || []);
      setPlanId(planId || null);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.fullName ?? prev.name,
      phone: user.phone ?? prev.phone,
    }));
  }, [user]);

  useEffect(() => {
    if (!window.google || !locationRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(locationRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "IN" },
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      setFormData((prev) => ({ ...prev, location: place.formatted_address }));
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.name || !formData.phone || !formData.scheduledDate || !formData.location) {
      setErr("Please fill all required fields.");
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
    setErr("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout-subs");
      return;
    }

    if (!planId) {
      alert("No active subscription found. Cannot book services.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        phoneNo: formData.phone,
        scheduledOn: formData.scheduledDate,
        location: formData.location,
        planId,
        serviceIds: cart.map((s) => s._id),
      };

      // Step 1: Create subscription order
      const res = await axios.post(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/order/monthly/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // Step 2: If booking successful → decrease limit
      if (res.data?.success) {
        try {
          const decreaseRes = await axios.post(
            "https://vaahan-suraksha-backend.vercel.app/api/v1/subscription/decrease-limit",
            { planId },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );

          if (decreaseRes.data?.success) {
            console.log("✅ Subscription limit decreased successfully.");
          } else {
            console.warn("⚠️ Failed to decrease limit:", decreaseRes.data?.message);
          }
        } catch (limitErr) {
          console.error("❌ Error decreasing limit:", limitErr);
        }

        alert("Booking successful! You can now view your services in the dashboard.");
        localStorage.removeItem("checkoutData");
        navigate("/dashboard/orders");
      } else {
        alert(res.data?.message || "Booking failed.");
      }
    } catch (e) {
      console.error("Booking error:", e);
      alert(e?.response?.data?.message ?? "Failed to book services.");
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
        );
        const data = await res.json();
        if (data.results?.[0]?.formatted_address)
          setFormData((prev) => ({ ...prev, location: data.results[0].formatted_address }));
      },
      (err) => alert("Unable to fetch location: " + err.message)
    );
  };

  if (!cart.length)
    return <div className="min-h-[60vh] grid place-items-center">Your cart is empty.</div>;

  return (
    <section className="min-h-screen py-14 bg-gradient-to-b from-indigo-50 to-white flex justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center sm:text-left">
          Checkout
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Booking Date</label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              ref={locationRef}
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Enter your address"
            />
            <button
              type="button"
              onClick={useCurrentLocation}
              className="mt-2 text-sm text-indigo-600 underline"
            >
              Use Current Location
            </button>
          </div>

          {err && <p className="text-red-600 mt-2">{err}</p>}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">Services in your plan:</p>
          <ul className="list-disc ml-5 mt-2 text-gray-700">
            {cart.map((s) => (
              <li key={s._id}>{s.name}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Confirm Booking
        </button>
      </div>
    </section>
  );
}
