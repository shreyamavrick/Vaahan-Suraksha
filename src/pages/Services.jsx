import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveCategoryBar from "../components/Services/ResponsiveCategoryBar";
import CategorySection from "../components/Services/CategorySection";
import { Pencil, ShoppingCart } from "lucide-react";
import { useCart } from "../context/cartContext";
import { useUser } from "../context/UserContext";

const Services = () => {
  const locationData = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart, isInCart } = useCart();
  const { user } = useUser();

  const manufacturer = locationData.state?.manufacturer || "Brand";
  const model = locationData.state?.model || "Model";

  useEffect(() => {
    const auto = locationData.state?.autoAddService;
    if (auto && !isInCart(auto.id)) addToCart(auto);
  }, [locationData.state]);

  
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetch("https://vaahan-suraksha-backend.vercel.app/api/v1/service/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          
          const formatted = data.data.map((item, index) => ({
            id: item._id,
            name: item.name,
            packages: item.packages,
          }));
          setCategoriesData(formatted);
          if (formatted.length > 0) {
            setSelectedCategoryId(formatted[0].id);
          }
        }
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const selectedCategory = categoriesData.find(
    (c) => c.id === selectedCategoryId
  );

  if (!selectedCategory) {
    return <p className="p-4">Loading services...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <ResponsiveCategoryBar
        categories={categoriesData}
        selected={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div
            onClick={() => navigate("/", { state: { manufacturer, model } })}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700"
          >
            <Pencil className="w-4 h-4" />
            <span>
              {manufacturer} - {model}
            </span>
          </div>
          <button
            onClick={() =>
              navigate(user ? "/cart" : "/login", {
                state: { from: "/services" },
              })
            }
            className="relative p-2 bg-white rounded-full shadow hover:shadow-md"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{selectedCategory.name}</h1>
        <CategorySection category={selectedCategory} />
      </main>
    </div>
  );
};

export default Services;
