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
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-wide">
          The best <span className="text-blue-500">pricing</span> to help you!
        </h2>
        <p className="text-neutral-500 mt-4">
          Choose the subscription plan that fits your needs.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {plans.map((plan, index) => (
          <div
            key={plan._id || index}
            className={`w-full sm:w-[300px] md:w-[320px] lg:w-[350px] bg-white p-8 rounded-2xl shadow-xl transition-transform hover:scale-105`}
          >
            
            <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>

           
            <p className="text-4xl font-bold mb-1">
              ₹{plan.pricing?.["1"]?.monthlyPrice || "N/A"}
            </p>
            <p className="text-sm text-neutral-400 mb-6">
              / {plan.duration} {plan.durationUnit}
            </p>

           
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Limit: {plan.limit} services</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Active: {plan.active ? "Yes" : "No"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Subscribers: {plan.currentSubscribers.length}</span>
              </li>
            </ul>            
            <a
              href="#"
              className={`block text-center w-full py-3 rounded-lg font-medium border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition`}
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
