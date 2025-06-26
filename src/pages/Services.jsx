import React, { useState } from "react";
import Sidebar from "../components/Services/Sidebar";
import CategorySection from "../components/Services/CategorySection";
import categoriesData from "../data/categoriesData";

const Services = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoriesData[0].id);

  const selectedCategory = categoriesData.find((cat) => cat.id === selectedCategoryId);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        categories={categoriesData}
        selected={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
      <main className="flex-1 p-6">
        {selectedCategory ? (
          <CategorySection category={selectedCategory} />
        ) : (
          <p>No services found for this category.</p>
        )}
      </main>
    </div>
  );
};

export default Services;
