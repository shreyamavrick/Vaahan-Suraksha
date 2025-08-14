import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/service/subscription/"
        );
        const data = await res.json();
        if (data.success) {
          setPlans(data.data);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <section className="py-20 bg-[#f4f7fa]">
      <div className="text-center mb-12 max-w-2xl mx-auto px-4">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-wide">
          The best <span className="text-blue-500">pricing</span> to help you!
        </h2>
        <p className="text-neutral-500 mt-4">
          Choose the subscription plan that fits your needs.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-center px-4">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="flex flex-col justify-between min-w-[300px] max-w-[350px] bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-transform hover:scale-105"
          >
            {/* Title */}
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

            {/* Price */}
            <div className="mb-4">
              <p className="text-4xl font-bold text-black">
                ₹{plan.pricing?.["1"]?.monthlyPrice || "N/A"}
              </p>
              <p className="text-sm text-neutral-400">
                / {plan.duration} {plan.durationUnit}
              </p>
            </div>

            {/* Limit above services */}
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                Limit: {plan.limit} 
              </span>
            </div>

            {/* Services */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Included Services:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {plan.services?.length > 0 ? (
                  plan.services.map((service) => (
                    <li key={service._id}>{service.name}</li>
                  ))
                ) : (
                  <li>No services available</li>
                )}
              </ul>
            </div>

            {/* Button */}
            <a
              href="#"
              className="mt-auto block text-center w-full py-3 rounded-lg font-medium border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition"
            >
              Purchase Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
