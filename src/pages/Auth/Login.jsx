import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useUser } from "../../context/UserContext";
import loginVisual from "../../assets/login-visual.webp";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const from = location.state?.from || "/";
  const autoAddService = location.state?.addService;

  const [mode, setMode] = useState("phone");
  const [role] = useState("user");

  const [form, setForm] = useState({
    phoneNo: "",
    email: "",
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
      let payload = { role };

      if (mode === "phone") {
        if (!form.phoneNo.trim()) throw new Error("Phone number is required");
        payload.phoneNo = form.phoneNo.trim();
      } else {
        if (!form.email.trim() || !form.password.trim())
          throw new Error("Email and password are required");
        payload.email = form.email.trim();
        payload.password = form.password;
      }

      const { data } = await api.post("/auth/login", payload);

      if (!data?.success) {
        throw new Error(data?.message || "Invalid credentials");
      }

      const authPayload = {
        user: data.data.user,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };

      login(authPayload);

      navigate(from, {
        state: autoAddService ? { autoAddService } : {},
        replace: true,
      });
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl flex items-center justify-center shadow-lg bg-white rounded-3xl overflow-hidden min-h-[500px]">
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <img
            src={loginVisual}
            alt=""
            className="w-full h-full object-cover rounded-l-3xl"
            style={{ minHeight: 500 }}
            draggable={false}
          />
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Welcome back</h2>
          <p className="mb-6 text-gray-500 text-center">Sign in to your account</p>
          <div className="w-full max-w-xs mx-auto">
            
            <div className="flex mb-6 bg-gray-100 rounded-full p-1 shadow-inner">
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all font-semibold text-base
                  ${mode === "phone"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setMode("phone")}
                type="button"
              >
                <FaPhoneAlt /> Phone
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all font-semibold text-base
                  ${mode === "password"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setMode("password")}
                type="button"
              >
                <FaEnvelope /> Email
              </button>
            </div>

            {err && <p className="text-red-600 text-sm mb-3">{err}</p>}

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "phone" ? (
                <input
                  className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  name="phoneNo"
                  placeholder="Phone number"
                  value={form.phoneNo}
                  onChange={onChange}
                />
              ) : (
                <>
                  <input
                    className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={onChange}
                  />
                  <input
                    className="w-full border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={onChange}
                  />
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold text-lg transition-all shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Log In"}
              </button>
            </form>
            <p className="text-sm text-center mt-4">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
