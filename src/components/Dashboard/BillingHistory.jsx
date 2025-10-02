import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { FaFileInvoiceDollar } from "react-icons/fa";

export default function BillingHistory() {
  const { user } = useUser();
  const [billingHistory, setBillingHistory] = useState([]);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
        );
        setAllServices(res.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Load billing history and sort by most recent first
  useEffect(() => {
    if (user?.billingHistory?.length > 0) {
      const sortedHistory = [...user.billingHistory].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBillingHistory(sortedHistory);
    }
  }, [user]);

  const getServiceDetails = (serviceId) => {
    return allServices.find((s) => s._id === serviceId);
  };

  return (
    <section className="min-h-[80vh] bg-gray-50 px-4 py-12 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <FaFileInvoiceDollar className="text-indigo-600" /> Billing History
        </h1>

        {billingHistory.length > 0 ? (
          <div className="space-y-6">
            {billingHistory.map((bill) => (
              <div
                key={bill.orderId}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    {bill.plan?.name || "Plan"}
                  </h2>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      bill.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bill.status.toUpperCase()}
                  </span>
                </div>

                {/* Billing Details */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100">
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Order ID:</span> {bill.orderId}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Payment ID:</span> {bill.paymentId}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Amount Paid:</span> ₹{bill.amount}{" "}
                      {bill.currency}
                    </p>
                    {bill.plan && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Plan Price:</span> ₹{bill.plan.price}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-gray-500 text-sm">
                    <p>
                      Date: {new Date(bill.createdAt).toLocaleDateString()} <br />
                      Time: {new Date(bill.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Services */}
                {bill.plan?.services?.length > 0 && (
                  <div className="p-5">
                    <h3 className="text-gray-800 font-semibold mb-3">
                      Services Included
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {bill.plan.services.map((serviceId) => {
                        const service = getServiceDetails(serviceId);
                        return service ? (
                          <div
                            key={service._id}
                            className="flex items-center gap-2 bg-indigo-50 text-indigo-800 text-sm px-3 py-1 rounded-full shadow-sm"
                          >
                            {service.images?.[0] && (
                              <img
                                src={service.images[0]}
                                alt={service.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            )}
                            {service.name}
                          </div>
                        ) : (
                          <div
                            key={serviceId}
                            className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                          >
                            {serviceId}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center mt-10">
            No billing history found.
          </p>
        )}
      </div>
    </section>
  );
}
