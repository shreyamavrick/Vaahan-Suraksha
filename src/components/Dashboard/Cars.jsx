import { useEffect, useState } from "react";
import { useVehicle } from "../../context/vehicleContext"; 

const Cars = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [userCar, setUserCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { setVehicle } = useVehicle(); 
  const token = localStorage.getItem("token");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/brand/"
      );
      const data = await res.json();
      if (data.success) setBrands(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async (brandId) => {
    if (!brandId) return [];
    try {
      const res = await fetch(
        `https://vaahan-suraksha-backend.vercel.app/api/v1/car/model/${brandId}`
      );
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchUserCar = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const car = data.data[0];
        setSelectedBrand(car.brand?._id || "");
        setTransmission(car.transmission || "");
        setFuel(car.fuel || "");

        const modelsList = await fetchModels(car.brand?._id);
        setModels(modelsList);

        const carModelId = car.carModelId || car.brand?.car_models?.[0] || "";
        setSelectedModel(carModelId);
        const matchedModel = modelsList.find((m) => m._id === carModelId);

        const formattedCar = {
          _id: car._id,
          brand: car.brand,
          model: matchedModel || { _id: carModelId, name: "N/A" },
          transmission: car.transmission,
          fuel: car.fuel,
        };

        setUserCar(formattedCar);

        setVehicle({
          brand: formattedCar.brand?.name || "",
          model: formattedCar.model?.name || "",
          transmission: formattedCar.transmission,
          fuel: formattedCar.fuel,
        });
      } else {
        setUserCar(null);
        setSelectedBrand("");
        setSelectedModel("");
        setTransmission("");
        setFuel("");
        setModels([]);
        setVehicle({ brand: "", model: "", fuel: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchUserCar();
  }, []);

  const handleBrandChange = async (brandId) => {
    setSelectedBrand(brandId);
    setSelectedModel("");
    const modelsList = await fetchModels(brandId);
    setModels(modelsList);
  };

  const handleAddCar = async () => {
    if (!selectedBrand || !selectedModel || !transmission || !fuel) {
      alert("Please fill all fields!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            brandId: selectedBrand,
            carModelId: selectedModel,
            transmission,
            fuel,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Car added successfully!");
        fetchUserCar(); 
      } else alert(data.message || "Failed to add car");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCar = async () => {
    if (!selectedBrand || !selectedModel || !transmission || !fuel) {
      alert("Please fill all fields!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            carId: userCar._id,
            brandId: selectedBrand,
            carModelId: selectedModel,
            transmission,
            fuel,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Car updated successfully!");
        setIsEditing(false);
        fetchUserCar(); 
      } else alert(data.message || "Failed to update car");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async () => {
    if (!userCar?._id) return;
    try {
      setLoading(true);
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`},
          body: JSON.stringify({ carId: userCar._id }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Car deleted successfully!");
        setUserCar(null);
        setSelectedBrand("");
        setSelectedModel("");
        setTransmission("");
        setFuel("");
        setModels([]);
        setIsEditing(false);
        setVehicle({ brand: "", model: "", fuel: "" });
      } else alert(data.message || "Failed to delete car");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      {loading ? (
        <Loader />
      ) : !userCar && !isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Your Car</h2>
          <p className="text-gray-500 mb-6">No car added yet. Please add your car details below.</p>
          <CarForm
            brands={brands}
            models={models}
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            transmission={transmission}
            fuel={fuel}
            handleBrandChange={handleBrandChange}
            setSelectedModel={setSelectedModel}
            setTransmission={setTransmission}
            setFuel={setFuel}
            onSubmit={handleAddCar}
            submitText="Add Car"
          />
        </div>
      ) : userCar && !isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Car </h2>
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm">
            <ul className="space-y-2 text-gray-700">
              <li><strong>Brand:</strong> {userCar.brand?.name}</li>
              <li><strong>Model:</strong> {userCar.model?.name}</li>
              <li><strong>Transmission:</strong> {userCar.transmission}</li>
              <li><strong>Fuel:</strong> {userCar.fuel}</li>
            </ul>
            <div className="mt-6 flex gap-3">
  <button
    className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
    onClick={() => setIsEditing(true)}
  >
    Update
  </button>
  <button
    className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
    onClick={handleDeleteCar}
  >
    Delete
  </button>
</div>

          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Car ✏️</h2>
          <CarForm
            brands={brands}
            models={models}
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            transmission={transmission}
            fuel={fuel}
            handleBrandChange={handleBrandChange}
            setSelectedModel={setSelectedModel}
            setTransmission={setTransmission}
            setFuel={setFuel}
            onSubmit={handleUpdateCar}
            submitText="Update Car"
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
};

// Loader Component
const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const CarForm = ({
  brands,
  models,
  selectedBrand,
  selectedModel,
  transmission,
  fuel,
  handleBrandChange,
  setSelectedModel,
  setTransmission,
  setFuel,
  onSubmit,
  submitText,
  onCancel,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <select
      value={selectedBrand}
      onChange={(e) => handleBrandChange(e.target.value)}
      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      <option value="">Select Brand</option>
      {brands.map((b) => (
        <option key={b._id} value={b._id}>{b.name}</option>
      ))}
    </select>

    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      <option value="">Select Model</option>
      {models.map((m) => (
        <option key={m._id} value={m._id}>{m.name}</option>
      ))}
    </select>

    <select
      value={transmission}
      onChange={(e) => setTransmission(e.target.value)}
      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      <option value="">Select Transmission</option>
      <option value="Automatic">Automatic</option>
      <option value="Manual">Manual</option>
    </select>

    <select
      value={fuel}
      onChange={(e) => setFuel(e.target.value)}
      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      <option value="">Select Fuel</option>
      <option value="Petrol">Petrol</option>
      <option value="Diesel">Diesel</option>
      <option value="CNG">CNG</option>
    </select>

    <div className="col-span-2 flex gap-3 mt-4">
      <button
        onClick={onSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
      >
        {submitText}
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
);

export default Cars;
