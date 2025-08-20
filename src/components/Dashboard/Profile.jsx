import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://vaahan-suraksha-backend.vercel.app/api/v1";

/* ---------- unchanged helper ---------- */
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

/* ---------- Profile component (UI simplified) ---------- */
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
          _id:
            storedUser._id ||
            storedUser.id ||
            storedUser._uid ||
            storedUser.userId ||
            storedUser.user_id ||
            storedUser._id,
          name: storedUser.name || storedUser.fullName || storedUser.displayName || storedUser.username || "",
          email: storedUser.email || storedUser.emailId || "",
          phoneNo: storedUser.phoneNo || storedUser.phone || storedUser.mobile || "",
          type: storedUser.type || storedUser.accountType || "",
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

  const tryUpdateEndpoints = async (payload) => {
    const client = makeClient();
    const tries = [
      { method: "patch", url: "/user/updateUser" },
      { method: "put", url: "/user/update" },
      { method: "patch", url: "/user/update" },
      { method: "put", url: `/user/${user._id}` },
      { method: "patch", url: `/user/${user._id}` },
      { method: "put", url: `/user/updateUser` },
      { method: "put", url: `/auth/update` },
    ];

    let lastErr = null;
    for (const t of tries) {
      try {
        const res = await client.request({ method: t.method, url: t.url, data: payload });
        if (res && (res.status === 200 || res.status === 201 || res.data?.success)) {
          return res;
        }
      } catch (err) {
        lastErr = err;
      }
    }
    const err = lastErr || new Error("All update endpoints failed");
    throw err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) {
      setError("No logged-in user found. Please login first.");
      return;
    }
    if (!form.name?.trim()) {
      setError("Name is required");
      return;
    }
    if (!form.phoneNo?.trim()) {
      setError("Phone number is required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      phoneNo: form.phoneNo.trim(),
    };
    if (form.password && form.password.length > 0) payload.password = form.password;
    setLoading(true);
    try {
      const res = await tryUpdateEndpoints(payload);
      let updatedUser = null;
      if (res.data) {
        updatedUser = res.data.data?.user || res.data.user || res.data;
      }
      if (!updatedUser || typeof updatedUser !== "object") {
        updatedUser = { ...user.raw, ...payload };
      }
      try {
        const rawAuthStr = localStorage.getItem("auth");
        if (rawAuthStr) {
          const rawAuth = JSON.parse(rawAuthStr);
          rawAuth.user = updatedUser;
          localStorage.setItem("auth", JSON.stringify(rawAuth));
        } else {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        if (localStorage.getItem("currentUser")) {
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }
      } catch {}
      const normalized = {
        _id: updatedUser._id || updatedUser.id || user._id,
        name: updatedUser.name || updatedUser.fullName || updatedUser.displayName || form.name,
        email: updatedUser.email || form.email,
        phoneNo: updatedUser.phoneNo || updatedUser.phone || form.phoneNo,
        raw: updatedUser,
      };
      setUser(normalized);
      setForm((s) => ({ ...s, password: "" }));
      setMessage("Profile updated successfully");
    } catch (err) {
      try {
        const rawAuthStr = localStorage.getItem("auth");
        let updatedUser = { ...(user.raw || {}), name: payload.name, phoneNo: payload.phoneNo };
        if (payload.password) updatedUser.password = payload.password;
        if (rawAuthStr) {
          const rawAuth = JSON.parse(rawAuthStr);
          rawAuth.user = updatedUser;
          localStorage.setItem("auth", JSON.stringify(rawAuth));
        } else {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        setUser((prev) => ({ ...prev, name: payload.name, phoneNo: payload.phoneNo, raw: updatedUser }));
        setForm((s) => ({ ...s, password: "" }));
        setMessage("Profile updated locally (API failed).");
      } catch (stErr) {
        setError((err && err.message) || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- SIMPLE CLEAN UI BELOW ----------
  if (!initialLoaded) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <span className="text-gray-400 text-lg">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-semibold mb-3">Profile</h2>
        <p className="text-gray-500">Please log in to view or edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12">
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
        {/* compact header (white, no gradient) */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="flex-shrink-0">
            <div className="bg-gray-100 text-gray-700 font-semibold rounded-full w-12 h-12 flex items-center justify-center text-lg">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          </div>
          <div>
            <div className="text-gray-900 font-medium text-lg">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email || "No email"}</div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-6">
          {message && (
            <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 text-sm border border-green-100">
              ✅ {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                disabled
                className="w-full border border-gray-100 px-3 py-2 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input
                name="phoneNo"
                value={form.phoneNo}
                onChange={onChange}
                className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password (optional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Leave blank to keep existing password"
                className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: user.name || "",
                    email: user.email || "",
                    phoneNo: user.phoneNo || "",
                    password: "",
                  });
                  setMessage(null);
                  setError(null);
                }}
                className="flex-1 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
