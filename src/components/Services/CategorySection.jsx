import React from "react";
import ServiceCard from "./ServiceCard";

const CategorySection = ({ category }) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{category.name}</h2>
      {category.services.map((service) => (
        <ServiceCard key={service.id} data={service} />
      ))}
    </div>
  );
};

export default CategorySection;
