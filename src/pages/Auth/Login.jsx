import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useUser } from "../../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const from = location.state?.from || "/services";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        <div className="flex mb-4 border rounded overflow-hidden">
          <button
            className={`w-1/2 py-2 ${mode === "phone" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setMode("phone")}
            type="button"
          >
            Login with Phone
          </button>
          <button
            className={`w-1/2 py-2 ${mode === "password" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setMode("password")}
            type="button"
          >
            Email + Password
          </button>
        </div>

        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "phone" ? (
            <input
              className="w-full border rounded px-3 py-2"
              name="phoneNo"
              placeholder="Phone number"
              value={form.phoneNo}
              onChange={onChange}
            />
          ) : (
            <>
              <input
                className="w-full border rounded px-3 py-2"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
              />
              <input
                className="w-full border rounded px-3 py-2"
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
            className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-blue-600 underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
