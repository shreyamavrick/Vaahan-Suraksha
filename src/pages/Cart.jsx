import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-semibold mb-4">🛒 Your cart is empty</h2>
        <button
          onClick={() => navigate("/allservices")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Your Cart
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {cart.map((service) => (
          <div
            key={service._id}
            className="flex items-center justify-between border-b py-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-500">
                {service.description || "No description available"}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(service._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-6 flex justify-between items-center">
          <span className="font-semibold text-gray-800">
            Subtotal: ₹{subtotal}
          </span>
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear Cart
            </button>
            <button
              onClick={() => alert("Proceeding to checkout...")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
