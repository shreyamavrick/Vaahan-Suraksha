// src/pages/OrdersPage.jsx
import { useState } from "react";

const OrdersPage = () => {
  // Dummy orders data
  const [orders] = useState([
    {
      id: "ORD123",
      service: "Car Wash & Detailing",
      car: "Honda City (CNG, Automatic)",
      date: "2025-08-15",
      status: "Completed",
      price: "₹1,200",
    },
    {
      id: "ORD124",
      service: "Battery Replacement",
      car: "Hyundai i20 (Petrol, Manual)",
      date: "2025-08-17",
      status: "Ongoing",
      price: "₹4,500",
    },
    {
      id: "ORD125",
      service: "Engine Oil Change",
      car: "Maruti Swift (Diesel, Manual)",
      date: "2025-08-18",
      status: "Pending",
      price: "₹2,000",
    },
  ]);

  // Helper: status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Ongoing":
        return "bg-blue-100 text-blue-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-lg"
          >
            {/* Left: Service Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{order.service}</h2>
              <p className="text-sm text-gray-600 mt-1">{order.car}</p>
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
              <p className="text-sm text-gray-500">Date: {order.date}</p>
            </div>

            {/* Right: Status & Price */}
            <div className="flex flex-col items-start md:items-end mt-3 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <p className="mt-2 text-lg font-bold text-gray-800">{order.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
