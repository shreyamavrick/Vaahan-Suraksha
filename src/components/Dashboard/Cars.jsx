import { useEffect, useState } from "react";

const Cars = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [userCar, setUserCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/brand/"
      );
      const data = await res.json();
      if (data.success) setBrands(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch models by brand
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

  // Fetch user car
  const fetchUserCar = async () => {
    try {
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

        // Fetch models of the brand
        const modelsList = await fetchModels(car.brand?._id);
        setModels(modelsList);

        // Get correct model name
        const carModelId = car.carModelId || car.brand?.car_models?.[0] || "";
        setSelectedModel(carModelId);
        const matchedModel = modelsList.find((m) => m._id === carModelId);

        setUserCar({ ...car, modelName: matchedModel?.name || "N/A" });
      } else {
        setUserCar(null);
        setSelectedBrand("");
        setSelectedModel("");
        setTransmission("");
        setFuel("");
        setModels([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // On component mount
  useEffect(() => {
    fetchBrands();
    fetchUserCar();
  }, []);

  // Handle brand change
  const handleBrandChange = async (brandId) => {
    setSelectedBrand(brandId);
    setSelectedModel("");
    const modelsList = await fetchModels(brandId);
    setModels(modelsList);
  };

  // Add car
  const handleAddCar = async () => {
    if (!selectedBrand || !selectedModel || !transmission || !fuel) {
      alert("Please fill all fields!");
      return;
    }
    try {
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
    }
  };

  // Update car
  const handleUpdateCar = async () => {
    if (!selectedBrand || !selectedModel || !transmission || !fuel) {
      alert("Please fill all fields!");
      return;
    }
    try {
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
        fetchUserCar(); // ✅ REFRESH full car details to get brand & model name
      } else alert(data.message || "Failed to update car");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete car
  const handleDeleteCar = async () => {
    if (!userCar?._id) return;
    try {
      const res = await fetch(
        "https://vaahan-suraksha-backend.vercel.app/api/v1/car/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      } else alert(data.message || "Failed to delete car");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {!userCar && !isEditing ? (
        <>
          <h2 className="text-xl font-bold mb-4">Add Car</h2>
          <CarForm
            brands={brands}
            models={models}
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            transmission={transmission}
            fuel={fuel}
            handleBrandChange={handleBrandChange}
            setSelectedBrand={setSelectedBrand}
            setSelectedModel={setSelectedModel}
            setTransmission={setTransmission}
            setFuel={setFuel}
            onSubmit={handleAddCar}
            submitText="Add Car"
          />
        </>
      ) : userCar && !isEditing ? (
        <>
          <h2 className="text-xl font-bold mb-4">My Car</h2>
          <div className="border p-4 rounded shadow-sm">
            <p>
              <strong>Brand:</strong> {userCar.brand?.name}
            </p>
            <p>
              <strong>Model:</strong> {userCar.modelName}
            </p>
            <p>
              <strong>Transmission:</strong> {userCar.transmission}
            </p>
            <p>
              <strong>Fuel:</strong> {userCar.fuel}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setIsEditing(true)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteCar}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Update Car</h2>
          <CarForm
            brands={brands}
            models={models}
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            transmission={transmission}
            fuel={fuel}
            handleBrandChange={handleBrandChange}
            setSelectedBrand={setSelectedBrand}
            setSelectedModel={setSelectedModel}
            setTransmission={setTransmission}
            setFuel={setFuel}
            onSubmit={handleUpdateCar}
            submitText="Update Car"
            onCancel={() => setIsEditing(false)}
          />
        </>
      )}
    </div>
  );
};

const CarForm = ({
  brands,
  models,
  selectedBrand,
  selectedModel,
  transmission,
  fuel,
  handleBrandChange,
  setSelectedBrand,
  setSelectedModel,
  setTransmission,
  setFuel,
  onSubmit,
  submitText,
  onCancel,
}) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <select
      value={selectedBrand}
      onChange={(e) => handleBrandChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select Brand</option>
      {brands.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
        </option>
      ))}
    </select>

    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select Model</option>
      {models.map((m) => (
        <option key={m._id} value={m._id}>
          {m.name}
        </option>
      ))}
    </select>

    <select
      value={transmission}
      onChange={(e) => setTransmission(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select Transmission</option>
      <option value="Automatic">Automatic</option>
      <option value="Manual">Manual</option>
    </select>

    <select
      value={fuel}
      onChange={(e) => setFuel(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select Fuel</option>
      <option value="Petrol">Petrol</option>
      <option value="Diesel">Diesel</option>
      <option value="CNG">CNG</option>
    </select>

    <div className="col-span-2 flex gap-2 mt-2">
      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {submitText}
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
);

export default Cars;
