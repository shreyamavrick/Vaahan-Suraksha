import React from "react";

const ResponsiveCategoryBar = ({ categories, selected, onSelect }) => {
  return (
    <div className="w-full bg-white shadow-sm md:w-64 md:border-r p-2 md:p-4 flex md:flex-col overflow-x-auto gap-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-3 py-1 text-sm md:text-base rounded ${
            selected === cat.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default ResponsiveCategoryBar;
