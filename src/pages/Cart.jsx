import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, changeQuantity, subtotal } = useCart();
  const [promo, setPromo] = useState("");
  const SHIPPING = 50;
  const total = subtotal + SHIPPING;
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">🛒 Your Cart</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Items List */}
        <div className="flex-1 space-y-4">
          {cartItems.length === 0 && (
            <p className="text-gray-600">Your cart is empty.</p>
          )}

          {cartItems.map(({ service, qty }) => (
            <div
              key={service.id}
              className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow p-4"
            >
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full md:w-32 h-24 object-cover rounded"
              />

              <div className="flex-1 md:ml-4 mt-4 md:mt-0">
                <h2 className="font-semibold text-lg">{service.name}</h2>
                <p className="text-gray-500 text-sm">Category: {service.category}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => changeQuantity(service.id, -1)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                >
                  –
                </button>
                <span className="w-6 text-center">{qty}</span>
                <button
                  onClick={() => changeQuantity(service.id, 1)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Remove & Price */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => removeFromCart(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
                <span className="font-semibold">
                  ₹{(service.newPrice * qty).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{SHIPPING.toFixed(2)}</span>
          </div>

          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Apply
            </button>
          </div>

          <div className="flex justify-between font-bold text-lg pt-4 border-t">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700">
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate("/services")}
            className="w-full border border-gray-300 py-3 rounded hover:bg-gray-100"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
