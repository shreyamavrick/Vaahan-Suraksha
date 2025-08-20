import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "https://vaahan-suraksha-backend.vercel.app";

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamically add Authorization header on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete config.headers["Authorization"];
  }
  return config;
});

/**
 * Helper: unwrap response shape like:
 * { statusCode:200, data: [...], message: "...", success: true }
 */
function extractDataArray(res) {
  if (!res) return [];
  if (res.data && Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  // fallback
  return [];
}

function extractDataObject(res) {
  if (!res) return null;
  if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) return res.data;
  if (res.data && res.data.data && typeof res.data.data === "object") return res.data.data;
  return null;
}

/* Get all brands */
export async function getBrands() {
  const res = await api.get("/api/v1/car/brand/");
  return extractDataArray(res); // array of brand objects with _id, name, car_models
}

/* Get models by brandId */
export async function getModelsByBrand(brandId) {
  if (!brandId) return [];
  const res = await api.get(`/api/v1/car/model/${brandId}`);
  return extractDataArray(res); // array of model objects with _id, name
}

/* Get cars for current user */
export async function getUserCars() {
  const res = await api.get("/api/v1/car/");
  return extractDataArray(res); // array of car objects
}

/* Add car
   Payload we send: { brand, carModel, transmission, fuel }
*/
export async function addCar({ brand, carModel, transmission, fuel }) {
  const body = {
    brand,
    transmission,
    fuel,
  };
  if (carModel) body.carModel = carModel;

  const res = await api.post("/api/v1/car/create", body);
  return extractDataObject(res); // created car object in res.data
}

/* Update car
   Payload: { carId, brand, carModel, transmission, fuel }
*/
export async function updateCar({ carId, brand, carModel, transmission, fuel }) {
  if (!carId) throw new Error("carId is required for update");
  const body = { carId, brand, transmission, fuel };
  if (carModel) body.carModel = carModel;
  const res = await api.put("/api/v1/car/update", body);
  return extractDataObject(res); // updated car object
}
