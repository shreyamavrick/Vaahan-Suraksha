import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, Lock } from "lucide-react";

const API_BASE = "https://vaahan-suraksha-backend.vercel.app/api/v1";

function readStoredSession() {
  const tryParse = (k) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  };
  const auth = tryParse("auth") || tryParse("authPayload") || tryParse("authentication");
  const userOnly = tryParse("user") || tryParse("currentUser");
  const tokenOnly = localStorage.getItem("token") || localStorage.getItem("accessToken");

  if (auth) {
    const user = auth.user || auth.data?.user || auth.data || auth;
    const accessToken = auth.accessToken || auth.token || auth.data?.accessToken || auth.data?.token;
    return { user, token: accessToken };
  }
  if (userOnly) {
    const maybeUser = userOnly.user || userOnly.data?.user || userOnly;
    const tokenFromUserObject = userOnly.accessToken || userOnly.token || null;
    return { user: maybeUser, token: tokenFromUserObject || tokenOnly || null };
  }
  if (tokenOnly && userOnly) {
    return { user: userOnly, token: tokenOnly };
  }
  try {
    const rawAuth = localStorage.getItem("auth");
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth);
      return { user: parsed.user || parsed, token: parsed.accessToken || parsed.token || null };
    }
  } catch {}
  return { user: null, token: null };
}

export default function Profile() {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phoneNo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const { user: storedUser } = readStoredSession();
      if (storedUser) {
        const normalized = {
          _id: storedUser._id || storedUser.id,
          name: storedUser.name || "",
          email: storedUser.email || "",
          phoneNo: storedUser.phoneNo || "",
          raw: storedUser,
        };
        setUser(normalized);
        setForm({
          name: normalized.name,
          email: normalized.email,
          phoneNo: normalized.phoneNo,
          password: "",
        });
      }
    } catch (err) {
      console.error("Error loading session", err);
    }
    setInitialLoaded(true);
  }, []);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const makeClient = () => {
    const client = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });
    const { token } = readStoredSession();
    if (token) client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return client;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!form.name.trim()) return setError("Name is required");
    if (!form.phoneNo.trim()) return setError("Phone number is required");

    setLoading(true);
    try {
      await makeClient().patch("/user/updateUser", {
        name: form.name.trim(),
        phoneNo: form.phoneNo.trim(),
        ...(form.password && { password: form.password }),
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Update failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!initialLoaded) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <div className="h-screen flex items-center justify-center">Please login first.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-4 md:px-6 py-10">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl p-8 shadow-md w-full max-w-5xl space-y-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

        {message && (
          <div className="p-3 rounded-md bg-green-100 text-green-700 border border-green-300 text-sm">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
            placeholder="Full Name"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-100 
                       text-gray-500 cursor-not-allowed"
            placeholder="Email Address"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="phoneNo"
            value={form.phoneNo}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
            placeholder="Phone Number"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="New Password (Optional)"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Buttons */}
<div className="flex gap-4 pt-4">
  <button
    type="submit"
    disabled={loading}
    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
               hover:from-blue-700 hover:to-blue-600 text-white 
               rounded-full font-semibold shadow-md 
               transition-transform duration-300 hover:scale-102 
               disabled:opacity-50"
  >
    {loading ? "Updating..." : "Save Changes"}
  </button>
  
  <button
    type="button"
    onClick={() => {
      setForm({ name: user.name, email: user.email, phoneNo: user.phoneNo, password: "" });
      setMessage(null);
      setError(null);
    }}
    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 
               hover:bg-gray-100 rounded-full font-semibold 
               transition-transform duration-300 hover:scale-102"
  >
    Reset
  </button>
</div>

      </form>
    </div>
  );
}
