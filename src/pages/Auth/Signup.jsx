import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="phoneNo"
            placeholder="Phone number"
            value={form.phoneNo}
            onChange={onChange}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
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
            className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-60"
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
  );
}
