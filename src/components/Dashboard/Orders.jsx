import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("oneTime");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/order/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Order API response:", res.data);

        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);



  const oneTimeOrders = orders.filter((o) => o.type === "oneTime");
  const monthlyOrders = orders.filter((o) => o.type === "monthly");

  const renderOrders = (orderList) => {
    if (!orderList.length) return <p className="text-gray-500">No orders found</p>;

    return (
      <div className="grid gap-6 md:grid-cols-2">
        {orderList.map((order) => (
          <div
            key={order._id}
            className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-3xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="font-bold text-xl text-blue-700 mb-3">
              {order.subscriptionId?.name ||
                order.services?.[0]?.name ||
                "N/A"}{" "}
              Plan
            </h3>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                {(order.paidAmount || order.orderAmount || 0).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
              <p>
                <span className="font-semibold">Payment Status:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {order.services?.length > 0 && (
              <div className="mt-5">
                <button
                  onClick={() => toggleServices(order._id)}
                  className="w-full flex justify-between items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl font-medium text-blue-700 transition-all duration-200"
                >
                  <span>Services Included ({order.services.length})</span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      expandedOrders[order._id] ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {expandedOrders[order._id] && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {order.services.map((service) => (
                        <li
                          key={service._id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm"
                        >
                          {service.name}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-5 text-xs text-gray-500 space-y-1">
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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        {["oneTime", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              activeTab === tab
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "oneTime" ? "One-Time Orders" : "Monthly Orders"}
          </button>
        ))}
      </div>

      {activeTab === "oneTime"
        ? renderOrders(oneTimeOrders)
        : renderOrders(monthlyOrders)}
    </div>
  );
};

export default Orders;
