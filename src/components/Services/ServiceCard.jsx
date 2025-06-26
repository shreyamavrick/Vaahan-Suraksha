import React from "react";
import IncludedServiceChip from "./IncludedServiceChip";

const ServiceCard = ({ data }) => {
  return (
    <div className="flex flex-col lg:flex-row bg-white p-6 rounded-xl shadow-md gap-6">
      {/* Image Section */}
      <div className="relative w-full lg:w-1/2">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="rounded-lg object-cover w-full h-full max-h-64"
        />
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          ₹{data.newPrice}
        </span>
      </div>

      {/* Details Section */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">{data.name}</h2>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
          <span>⭐ {data.rating}</span>
          <span>⏱️ {data.duration}</span>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <p>🔁 {data.usage}</p>
          <p>📅 Interval: {data.interval}</p>
        </div>

        <p className="font-semibold mt-2 mb-1">Included Services:</p>
        <div className="flex flex-wrap">
          {data.included.slice(0, 3).map((item, index) => (
            <IncludedServiceChip key={index} name={item} />
          ))}
          {data.included.length > 3 && (
            <span className="text-blue-500 text-sm mt-2">
              +{data.included.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <span className="line-through text-gray-500">₹{data.oldPrice}</span>
          <span className="text-red-600 font-bold text-lg">₹{data.newPrice}</span>
          <span className="text-green-600 font-semibold">{data.discount}</span>
        </div>

        <div className="flex gap-2 mt-3">
          {data.recommended && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              Recommended
            </span>
          )}
          {data.isNew && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              New
            </span>
          )}
        </div>

        <button className="mt-5 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Add to Cart +
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
