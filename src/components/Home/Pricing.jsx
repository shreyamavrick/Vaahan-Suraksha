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

      <div className="flex flex-wrap gap-8 justify-center px-4 max-md:flex-col">
        {plans.map((plan, idx) => {
          const isDark = idx % 2 === 1; // alternate: 0 -> white, 1 -> black
          return (
            <div
              key={plan._id}
              className={`relative flex flex-col rounded-3xl p-8 min-w-[300px] max-w-[350px] shadow-lg transition-transform duration-300 hover:-translate-y-2 ${
                isDark
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col pb-5 border-b border-[#dbdbdb]">
                <p className={`font-bold font-raleway`}>
                  {plan.name}
                </p>
                <div className="flex items-start py-6">
                  <span className={`text-3xl md:text-5xl font-bold self-start mr-1`}>
                    ₹
                  </span>
                  <h1 className={`font-bold font-primary text-6xl md:text-7xl`}>
                    {plan.pricing?.["1"]?.price || "N/A"}
                    <span className={`text-xs md:text-base font-light font-raleway ${isDark ? "text-white/70" : "text-black/70"}`}>
                      / {plan.duration} {plan.durationUnit}
                    </span>
                  </h1>
                </div>
              </div>

              {/* Services List */}
              <div className={`flex-1 mt-5 space-y-3 overflow-y-auto ${isDark ? "scrollbar-blue" : "scrollbar-black"} hide-scrollbar`}>
                {plan.services?.length > 0 ? (
                  plan.services.map((service) => (
                    <div key={service._id} className="flex gap-x-3 items-center">
                      <CheckCircle2 className={`w-6 h-6 ${isDark ? "text-blue-500" : "text-black"}`} />
                      <p className={`font-light font-raleway ${isDark ? "text-white" : "text-black"}`}>
                        {service.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className={`font-light font-raleway ${isDark ? "text-white" : "text-black"}`}>
                    No services available
                  </p>
                )}
              </div><br></br>

              {/* Purchase Button */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <a
                  href="/subscription"
                  className={`w-max px-6 h-12 flex items-center justify-center rounded-full font-primary text-white transition-all duration-150 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  Purchase Now
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 9999px;
        }
        .scrollbar-black::-webkit-scrollbar-thumb {
          background-color: #000;
        }
        .scrollbar-blue::-webkit-scrollbar-thumb {
          background-color: #3b82f6; /* Tailwind blue-500 */
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: thin;
        }
      `}</style>
    </section>
  );
};

export default Pricing;
