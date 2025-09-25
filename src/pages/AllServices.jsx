import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicle } from "../context/vehicleContext";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/cartContext";
import { ShoppingCart } from "lucide-react"; 
const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vehicle, setVehicle } = useVehicle();
  const { user, isAuthenticated } = useUser();
  const { addToCart, isInCart, cart } = useCart(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      const savedCar = localStorage.getItem(`car_${user._id}`);
      if (savedCar) {
        try {
          setVehicle(JSON.parse(savedCar));
        } catch {
          localStorage.removeItem(`car_${user._id}`);
        }
      }
    }
  }, [isAuthenticated, user, setVehicle]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
        );
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookService = (service) => {
    if (!isAuthenticated) {
      alert("Please log in first to book a service.");
      navigate("/login");
      return;
    }

    if (!vehicle?.brand || !vehicle?.model) {
      alert("Please confirm your car details before booking.");
      navigate("/dashboard/cars");
      return;
    }

    const userPlan = user?.currentPlan;

    if (!userPlan) {
      if (
        window.confirm(
          ` You don’t have a subscription. ${service.name} requires a plan.\nWould you like to view subscriptions?`
        )
      ) {
        navigate("/subscription", { state: { recommendedService: service } });
      }
      return;
    }

    const isIncluded = userPlan.services?.some((s) =>
      typeof s === "string" ? s === service._id : s._id === service._id
    );

    if (isIncluded) {
      if (isInCart(service._id)) {
        alert(`🛒 ${service.name} is already in your cart.`);
      } else {
        addToCart(service);
        alert(
          `${service.name} added to cart for your ${vehicle.brand} ${vehicle.model}`
        );
      }
    } else {
      if (
        window.confirm(
          ` ${service.name} is not included in your current plan (${userPlan.name}).\nWould you like to view upgradation options?`
        )
      ) {
        navigate("/subscription", { state: { recommendedService: service } });
      }
    }
  };

  if (loading) return <p className="text-center py-20">Loading services...</p>;

  if (isAuthenticated && (!vehicle?.brand || !vehicle?.model)) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold mb-2">Confirm Your Car</h2>
        <p className="text-gray-600 mb-4">
          Please add your car details before booking a service.
        </p>
        <button
          onClick={() => navigate("/dashboard/cars")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Car
        </button>
      </div>
    );
  }

  if (!isAuthenticated && (!vehicle?.brand || !vehicle?.model)) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold mb-2">Select Vehicle</h2>
        <p className="text-gray-600 mb-4">
          Please select your vehicle (brand & model) before viewing services.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Select Vehicle
        </button>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* 🛒 Cart Icon with Badge */}
<button
  onClick={() => navigate("/cart")}
  className="fixed top-35 right-14 z-50 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
>
  <ShoppingCart className="w-6 h-6 text-blue-600" />
  {cart.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
      {cart.length}
    </span>
  )}
</button>


        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Our <span className="text-blue-600">Premium Services</span>
        </h2>

        {vehicle?.brand && vehicle?.model && (
          <p className="text-center text-gray-600 mb-14">
            Showing services for:{" "}
            <span className="font-semibold">
              {vehicle.brand} {vehicle.model}
            </span>{" "}
            {isAuthenticated && (
              <button
                onClick={() => navigate("/dashboard/cars")}
                className="ml-2 text-blue-600 underline hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            )}
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-200"
            >
              <div className="relative group">
                <img
                  src={
                    service.images?.[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={service.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h3>
                <button
                  onClick={() => handleBookService(service)}
                  className={`mt-4 px-4 py-2 rounded-lg text-white ${
                    isInCart(service._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isInCart(service._id)}
                >
                  {isInCart(service._id) ? "In Cart" : "Book Service"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllServices;
