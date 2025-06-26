import React from "react";

const Sidebar = ({ categories, selected, onSelect }) => {
  return (
    <div className="w-64 bg-white border-r p-4">
      <ul className="space-y-3">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`cursor-pointer hover:text-blue-500 ${
              selected === cat.id ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => onSelect(cat.id)}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
