import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://vaahan-suraksha-backend.vercel.app/api/v1";

function readStoredSession() {
  try {
    const raw = localStorage.getItem("auth") || localStorage.getItem("user");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.accessToken || parsed?.token || localStorage.getItem("token");
      return { token };
    }
  } catch {}
  return { token: null };
}

export default function CarPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const { token } = readStoredSession();
        const client = axios.create({
          baseURL: API_BASE,
          headers: { "Content-Type": "application/json" },
        });
        if (token) client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const res = await client.get("/car");
        if (res.data?.success) {
          setCars(res.data.data || []);
        } else {
          setError("Failed to load cars.");
        }
      } catch (err) {
        setError("Something went wrong while fetching cars.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <span className="text-gray-400 text-lg">Loading cars...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 rounded-lg shadow text-center text-red-600">
        {error}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow text-center">
        <h2 className="text-2xl font-semibold mb-2">No Cars Found</h2>
        <p className="text-gray-500">You haven’t added any cars yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Cars</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {car.brand?.name || "Unknown Brand"}
              </h3>
              <div className="space-y-1 text-gray-600 text-sm">
                <p>
                  <span className="font-medium">Fuel:</span> {car.fuel}
                </p>
                <p>
                  <span className="font-medium">Transmission:</span> {car.transmission}
                </p>
                <p>
                  <span className="font-medium">User ID:</span> {car.userId}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
