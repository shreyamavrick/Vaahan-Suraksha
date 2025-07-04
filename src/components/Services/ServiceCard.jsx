import React from "react";
import IncludedServiceChip from "./IncludedServiceChip";
import { useCart } from "../../context/cartContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ data, categoryName }) => {
  const { user } = useUser();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const navigate = useNavigate();

  const handleCartAction = () => {
    if (!user) {
      return navigate("/login", {
        state: { from: "/services", addService: { ...data, category: categoryName } },
      });
    }
    if (isInCart(data.id)) {
      removeFromCart(data.id);
    } else {
      addToCart({ ...data, category: categoryName });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6">
      {/* Image */}
      <div className="md:w-1/3 bg-gray-100 rounded overflow-hidden">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Top details */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{data.name}</h2>

          {/* Rating, Duration */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <span>⭐ {data.rating}</span>
            <span>⏱️ {data.duration}</span>
          </div>

          {/* Usage & Interval */}
          <div className="text-sm text-gray-700 mb-3">
            <p>🔁 {data.usage}</p>
            <p>📅 Interval: {data.interval}</p>
          </div>

          {/* Included Services */}
          <p className="font-medium mb-2">Included Services:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.included.map((item, idx) => (
              <IncludedServiceChip key={idx} name={item} />
            ))}
          </div>

          {/* Pricing & Discount */}
          <div className="flex items-center gap-4 mb-3">
            <span className="line-through text-gray-500">₹{data.oldPrice}</span>
            <span className="text-red-600 font-bold text-xl">₹{data.newPrice}</span>
            <span className="text-green-600 font-semibold">{data.discount}</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
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
        </div>

        {/* Add/Remove Button */}
        <button
          onClick={handleCartAction}
          className={`mt-2 self-start px-6 py-2 rounded text-white transition ${
            isInCart(data.id)
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isInCart(data.id) ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
