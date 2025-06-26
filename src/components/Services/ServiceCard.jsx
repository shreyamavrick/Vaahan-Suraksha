import React from "react";
import IncludedServiceChip from "./IncludedServiceChip";

const ServiceCard = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white p-4 md:p-6 rounded-xl shadow-md gap-4 md:gap-6 w-full">
      {/* Image */}
      <div className="w-full md:w-1/2 flex-shrink-0">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-48 md:h-64 object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">{data.name}</h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <span>⭐ {data.rating}</span>
            <span>⏱️ {data.duration}</span>
          </div>

          <div className="text-sm text-gray-700 mb-3">
            <p>🔁 {data.usage}</p>
            <p>📅 Interval: {data.interval}</p>
          </div>

          <p className="font-medium mb-2">Included Services:</p>
          <div className="flex flex-wrap mb-3">
            {data.included.slice(0, 3).map((item, i) => (
              <IncludedServiceChip key={i} name={item} />
            ))}
            {data.included.length > 3 && (
              <span className="text-blue-500 text-sm mt-2">+{data.included.length - 3} more</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 mb-2">
            <span className="line-through text-gray-500 text-sm">₹{data.oldPrice}</span>
            <span className="text-red-600 font-bold text-lg">₹{data.newPrice}</span>
            <span className="text-green-600 font-semibold text-sm">{data.discount}</span>
          </div>

          <div className="flex gap-2 mt-2">
            {data.recommended && (
              <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                Recommended
              </span>
            )}
            {data.isNew && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">New</span>
            )}
          </div>
        </div>

        <button className="mt-4 w-full md:w-fit px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Add to Cart +
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
