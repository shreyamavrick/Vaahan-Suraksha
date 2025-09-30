import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [openSection, setOpenSection] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/order/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.orders)
          ? res.data.orders
          : [];

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpanded = (orderId) => {
    setActiveOrderId((prev) => (prev === orderId ? null : orderId));
    setOpenSection({});
  };

  const toggleSection = (orderId, section) => {
    setOpenSection((prev) => ({
      [orderId]: prev[orderId] === section ? null : section,
    }));
  };

  const filterOrders = () => {
    if (!Array.isArray(orders)) return [];
    if (activeTab === "one-time") return orders.filter((o) => o.type !== "monthly");
    if (activeTab === "subscription") return orders.filter((o) => o.type === "monthly");
    return orders;
  };

  const renderOrders = (orderList) => {
    if (!Array.isArray(orderList) || orderList.length === 0) {
      return <p className="text-gray-500">No orders found</p>;
    }

    return (
      <div className="grid gap-6">
        {orderList.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {activeOrderId !== order._id ? (
                // Compact View
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6"
                >
                  <h3 className="font-bold text-xl text-blue-700 mb-3 flex items-center gap-2">
                    {order.subscriptionName || order.services?.[0]?.name || "Order"}{" "}
                    <span className="text-sm font-medium px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      {order.type === "monthly" ? "Subscription" : "Plan"}
                    </span>
                  </h3>

                  <div className="text-gray-600 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Order ID:</span>{" "}
                      <span className="break-all">{order._id}</span>
                    </p>
                    <p>
                      <span className="font-medium">Booking Date:</span>{" "}
                      {order.scheduledOn ? new Date(order.scheduledOn).toLocaleDateString() : "N/A"}
                    </p>
                    {order.subscriptionId && (
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {order.subscriptionId.duration} {order.subscriptionId.durationUnit}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus || "Unknown"}
                      </span>
                    </p>
                  </div>


                  <button
                    onClick={() => toggleExpanded(order._id)}
                    className="mt-5 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
                  >
                    View Details ▼
                  </button>
                </motion.div>
              ) : (
                // Expanded View
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-6 bg-white border-l-4 border-blue-600 rounded-2xl shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
                    <button
                      onClick={() => toggleExpanded(order._id)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                    >
                      Back
                    </button>
                  </div>

                  {["user", "services", "billing", "subscription", "track"].map((section) => {
                    let sectionName, content;
                    switch (section) {
                      case "user":
                        sectionName = "👤 User Info";
                        content = (
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <p>
                              <span className="font-medium">Name:</span> {order.name || order.user?.name || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">Mobile:</span> {order.phoneNo || order.user?.phoneNo || "N/A"}
                            </p>
                            <p className="sm:col-span-2">
                              <span className="font-medium">Location:</span> {order.location || "N/A"}
                            </p>
                          </div>
                        );
                        break;

                      case "services":
                        if (!order.services?.length) return null;
                        sectionName = "🛠 Services";
                        content = (
                          <div className="flex flex-wrap gap-3">
                            {order.services.map((service) => (
                              <div
                                key={service._id}
                                className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1"
                              >
                                {service.images?.[0] && (
                                  <img src={service.images[0]} alt={service.name} className="w-12 h-12 rounded-full object-cover" />
                                )}
                                <span className="text-sm font-medium text-blue-700">{service.name}</span>
                              </div>
                            ))}
                          </div>
                        );
                        break;

                      case "billing":
                        sectionName = "💳 Billing Info";
                        content = (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium">Description</th>
                                  <th className="px-4 py-2 text-right font-medium">Amount (₹)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                <tr>
                                  <td className="px-4 py-2">Order Amount</td>
                                  <td className="px-4 py-2 text-right">{order.orderAmount || 0}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2">Paid Amount</td>
                                  <td className="px-4 py-2 text-right">{order.paidAmount || 0}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2">Service Charge</td>
                                  <td className="px-4 py-2 text-right">{order.serviceCharge || 0}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2">Spare Parts</td>
                                  <td className="px-4 py-2 text-right">{order.sparePartsCharge || 0}</td>
                                </tr>
                                {order.billingHistory?.length > 0 && (
                                  <tr>
                                    <td className="px-4 py-2">History</td>
                                    <td className="px-4 py-2 text-right">
                                      {order.billingHistory.map((b, i) => `₹${b.amount}${i < order.billingHistory.length - 1 ? ", " : ""}`)}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              <tfoot className="bg-gray-100 font-bold">
                                <tr>
                                  <td className="px-4 py-2 text-left">Total</td>
                                  <td className="px-4 py-2 text-right">
                                    ₹{(order.orderAmount || 0) + (order.serviceCharge || 0) + (order.sparePartsCharge || 0)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        );
                        break;

                      case "subscription":
                        if (!order.subscriptionId) return null;
                        sectionName = "📦 Subscription Info";
                        content = (
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <p><span className="font-medium">Name:</span> {order.subscriptionId.name}</p>
                            <p><span className="font-medium">Duration:</span> {order.subscriptionId.duration} {order.subscriptionId.durationUnit}</p>
                            <p><span className="font-medium">Limit:</span> {order.subscriptionId.limit}</p>
                            <p>
  <span className="font-medium">Pricing:</span>{" "}
  {order.subscriptionId.pricing
    ? (() => {
        const firstKey = Object.keys(order.subscriptionId.pricing)[0];
        const price = order.subscriptionId.pricing[firstKey].price;
        return `₹${price} `;
      })()
    : "N/A"}
</p>

                          </div>
                        );
                        break;

                      case "track":
                        if (!order.trackStatus) return null;
                        sectionName = "📍 Track Order";
                        content = (
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Current Status:</span> {order.trackStatus}</p>
                            {order.status && <p><span className="font-medium">Detailed Status:</span> {order.status}</p>}
                            {order.eta && <p><span className="font-medium">ETA:</span> {order.eta}</p>}
                            {order.assignedTo && <p><span className="font-medium">Assigned To:</span> {order.assignedTo}</p>}
                          </div>
                        );
                        break;

                      default:
                        return null;
                    }

                    return (
                      <div key={section} className="border rounded-lg bg-white shadow-sm">
                        <button
                          className="w-full text-left px-4 py-2 font-medium flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                          onClick={() => toggleSection(order._id, section)}
                        >
                          {sectionName}
                          <span
                            className={`transform transition-transform ${
                              openSection[order._id] === section ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                        <AnimatePresence>
                          {openSection[order._id] === section && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-4 py-3 bg-gray-50 border-t"
                            >
                              {content}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p className="p-6 text-center">Loading orders...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {["all", "one-time", "subscription"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab === "all"
              ? "All Orders"
              : tab === "one-time"
              ? "One-Time Orders"
              : "Subscription Orders"}
          </button>
        ))}
      </div>

      {renderOrders(filterOrders())}
    </div>
  );
};

export default Orders;
