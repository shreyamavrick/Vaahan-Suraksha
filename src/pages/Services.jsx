import React, { useState } from "react";
import ResponsiveCategoryBar from "../components/Services/ResponsiveCategoryBar";
import categoriesData from "../data/categoriesData";
import CategorySection from "../components/Services/CategorySection";


const Services = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoriesData[0].id);
  const selectedCategory = categoriesData.find((cat) => cat.id === selectedCategoryId);

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <ResponsiveCategoryBar
        categories={categoriesData}
        selected={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">{selectedCategory.name}</h1>
        <CategorySection category={selectedCategory} />
      </main>
    </div>
  );
};

export default Services;
