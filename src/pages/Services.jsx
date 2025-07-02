import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveCategoryBar from "../components/Services/ResponsiveCategoryBar";
import categoriesData from "../data/categoriesData";
import CategorySection from "../components/Services/CategorySection";
import { Pencil, ShoppingCart } from "lucide-react";

const Services = () => {
  const locationData = useLocation();
  const navigate = useNavigate(); // 👈 for redirection

  const manufacturer = locationData.state?.manufacturer || "Brand";
  const model = locationData.state?.model || "Model";

  const [selectedCategoryId, setSelectedCategoryId] = useState(categoriesData[0].id);
  const selectedCategory = categoriesData.find((cat) => cat.id === selectedCategoryId);

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar Category Bar */}
      <ResponsiveCategoryBar
        categories={categoriesData}
        selected={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 relative">
        {/* Selected Car and Cart Header */}
        <div className="flex justify-between items-center mb-4">
          {/* 🔴 Clickable Car Info Box */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 shadow hover:bg-red-700 transition"
            title="Click to change car"
          >
            <Pencil className="w-4 h-4" />
            <span className="font-semibold text-sm">
              {manufacturer} - {model}
            </span>
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <button className="bg-white border border-gray-300 rounded-full p-2 shadow hover:shadow-md transition">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
            <span className="absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
              0
            </span>
          </div>
        </div>

        {/* Category Title */}
        <h1 className="text-2xl font-bold mb-4">{selectedCategory.name}</h1>

        {/* Service Cards */}
        <CategorySection category={selectedCategory} />
      </main>
    </div>
  );
};

export default Services;
