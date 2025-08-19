import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import loginVisual from "../../assets/signup-visual.webp";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phoneNo: form.phoneNo,
        password: form.password,
        type: "b2c",
      };

      const { data } = await api.post("/user/createUser", payload);

      if (!data?.success) {
        throw new Error(data?.message || "Signup failed");
      }

      alert("Account created! Please log in.");
      navigate("/login");
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl flex items-center justify-center shadow-lg bg-white rounded-3xl overflow-hidden min-h-[500px]">
        {/* Image section - hidden on mobile, rounded left side only */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <img
            src={loginVisual}
            alt=""
            className="w-full h-full object-cover rounded-l-3xl"
            style={{ minHeight: 500 }}
            draggable={false}
          />
        </div>
        {/* Signup card */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Create Account</h2>
          <p className="mb-6 text-gray-500 text-center">Sign up to get started</p>
          <div className="w-full max-w-xs mx-auto">
            {err && <p className="text-red-600 text-sm mb-3">{err}</p>}
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={onChange}
                required
              />
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                required
              />
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                name="phoneNo"
                placeholder="Phone number"
                value={form.phoneNo}
                onChange={onChange}
                required
              />
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold text-lg transition-all shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-blue-600 underline">
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
