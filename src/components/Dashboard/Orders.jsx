import { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("oneTime");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/order/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("📦 Orders API Response:", res.data);
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // filter orders by type
  const oneTimeOrders = orders.filter((o) => o.type === "oneTime");
  const monthlyOrders = orders.filter((o) => o.type === "monthly");

  const renderOrders = (orderList) => {
    if (orderList.length === 0) {
      return <p className="text-gray-500">No orders found</p>;
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        {orderList.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              {order.subscriptionId?.name ||
                order.services?.[0]?.name ||
                "N/A"}{" "}
              Plan
            </h3>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                {(order.paidAmount || order.orderAmount || 0).toLocaleString(
                  "en-IN",
                  {
                    style: "currency",
                    currency: "INR",
                  }
                )}
              </p>
              <p>
                <span className="font-semibold">Payment Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <span className="font-semibold">Type:</span> {order.type}
              </p>
              {order.createdAt && (
  <p>
    <strong>Created At:</strong>{" "}
    {new Date(order.createdAt).toLocaleDateString()}
  </p>
)}

            </div>

            {order.services?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Services:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {order.services.map((service) => (
                    <div
                      key={service._id}
                      className="text-center bg-gray-50 rounded-lg shadow-sm p-2"
                    >
                      {service.images?.length > 0 && (
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      )}
                      <p className="text-xs mt-1 font-medium">{service.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Razorpay Order ID:</span>{" "}
                {order.razorpayOrderId}
              </p>
              <p>
                <span className="font-semibold">Payment ID:</span>{" "}
                {order.razorpayPaymentId}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("oneTime")}
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "oneTime"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          One-Time Orders
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "monthly"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Monthly Orders
        </button>
      </div>

      {/* Orders */}
      {activeTab === "oneTime"
        ? renderOrders(oneTimeOrders)
        : renderOrders(monthlyOrders)}
    </div>
  );
};

export default Orders;
