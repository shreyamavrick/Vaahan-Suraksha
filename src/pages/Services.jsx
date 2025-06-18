import React, { useState } from "react";

const categories = [
  "Periodic Services",
  "AC Service & Repair",
  "Batteries",
  "Tyres & Wheel Care",
  "Denting & Painting",
  "Detailing Services",
  "Spa & Cleaning",
  "Inspections",
  "Windshields & Lights",
  "Suspension & Fitments",
  "Clutch & Body Parts",
];

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Periodic Services");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 border-r bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">Service Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:w-3/4 p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Placeholder for services */}
          <div className="bg-white shadow p-4 rounded-lg text-gray-600 text-center">
            No services added yet for <strong>{selectedCategory}</strong>.
          </div>
          {/* Add more service cards here dynamically */}
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;
