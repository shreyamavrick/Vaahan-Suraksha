import React from "react";
import ServiceCard from "./ServiceCard";

const CategorySection = ({ category }) => {
  return (
    <div className="flex flex-col gap-6">
      {category.services && category.services.length > 0 ? (
        category.services.map((service) => (
          <ServiceCard
            key={service.id}
            data={service}
            categoryName={category.name}
          />
        ))
      ) : (
        <p className="text-gray-600">No services available in this category.</p>
      )}
    </div>
  );
};

export default CategorySection;
