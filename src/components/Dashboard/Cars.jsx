import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import {
  getUserCars,
  addCar,
  updateCar,
  getBrands,
  getModelsByBrand,
} from "../../services/carApi";

const initialForm = {
  brand: "",
  carModel: "",
  transmission: "",
  fuel: "",
};

export default function MyCarsPage() {
  const { user, isAuthenticated } = useUser();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      setCars([]);
      setLoading(false);
      return;
    }
    // Fetch user's cars
    const fetchCars = async () => {
      setLoading(true);
      try {
        const userCars = await getUserCars();
        setCars(userCars || []);
      } catch (err) {
        console.error(err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [isAuthenticated]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const b = await getBrands();
        setBrands(b);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (!form.brand) {
      setModels([]);
      return;
    }
    const fetchModels = async () => {
      try {
        const m = await getModelsByBrand(form.brand);
        setModels(m);
      } catch {
        setModels([]);
      }
    };
    fetchModels();
  }, [form.brand]);

  const openAddModal = () => {
    setForm(initialForm);
    setEditingCarId(null);
    setModalOpen(true);
    setError("");
  };

  const openEditModal = (car) => {
    setForm({
      brand: car.brand?._id || car.brand || "",
      carModel: car.carModel || "",
      transmission: car.transmission || "",
      fuel: car.fuel || "",
    });
    setEditingCarId(car._id);
    setModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCarId(null);
    setForm(initialForm);
    setError("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("You must be logged in to add or edit cars.");
      return;
    }

    if (!form.brand || !form.transmission || !form.fuel) {
      setError("Please select brand, transmission and fuel.");
      return;
    }

    setSaving(true);
    try {
      if (editingCarId) {
        await updateCar({ carId: editingCarId, ...form });
      } else {
        await addCar(form);
      }

      // Refresh list
      const updated = await getUserCars();
      setCars(updated || []);
      closeModal();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to save car"
      );
    } finally {
      setSaving(false);
    }
  };

  // --- UI ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-2">My Cars</h2>
        <p className="text-gray-500">
          You must log in to view or add cars.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl mb-4 font-bold">My Cars</h1>

      {loading ? (
        <div>Loading cars...</div>
      ) : cars.length === 0 ? (
        <div className="text-center">
          <p className="mb-3">You haven't added any cars yet.</p>
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={openAddModal}
          >
            Add Car
          </button>
        </div>
      ) : (
        <>
          {cars.map((car) => (
            <div
              key={car._id}
              className="border rounded px-4 py-2 mb-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {car.brand?.name || "Brand"} {car.carModel && `- ${car.carModel}`}
                </div>
                <div className="text-sm text-gray-600">
                  {car.transmission} {car.fuel && `• ${car.fuel}`}
                </div>
              </div>
              <button
                onClick={() => openEditModal(car)}
                className="border px-3 py-1 text-sm rounded"
              >
                Edit
              </button>
            </div>
          ))}
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={openAddModal}
          >
            Add New Car
          </button>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-lg font-bold mb-4">
              {editingCarId ? "Edit Car" : "Add Car"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Brand</label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={onChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">— Select Brand —</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Model</label>
                <select
                  name="carModel"
                  value={form.carModel}
                  onChange={onChange}
                  className="w-full border p-2 rounded"
                  disabled={!form.brand}
                >
                  <option value="">— Select Model —</option>
                  {models.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={form.transmission}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">— Select —</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="AMT">AMT</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Fuel</label>
                  <select
                    name="fuel"
                    value={form.fuel}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">— Select —</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={saving}
                >
                  {saving ? (editingCarId ? "Updating..." : "Adding...") : editingCarId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="border px-4 py-2 rounded"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
