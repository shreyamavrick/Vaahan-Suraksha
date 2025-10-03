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
          const isDark = idx % 2 === 1; // alternate: 0 -> white, 1 -> dark
          return (
            <div
              key={plan._id}
              className={`relative flex flex-col rounded-3xl p-8 min-w-[300px] max-w-[350px] shadow-lg ${
                isDark
                  ? "bg-vahan_dark text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className="relative flex flex-col z-10">
                {/* Header */}
                <div className="flex flex-col pb-5 border-b border-[#dbdbdb]">
                  <p
                    className={`font-bold font-raleway ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-start py-6">
                    <span
                      className={`text-3xl md:text-5xl font-bold self-start mr-1 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      ₹
                    </span>
                    <h1
                      className={`font-bold font-primary text-6xl md:text-7xl ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {plan.pricing?.["1"]?.price || "N/A"}
                      <span
                        className={`text-xs md:text-base font-light font-raleway ${
                          isDark ? "text-white/70" : "text-black/70"
                        }`}
                      >
                        / {plan.duration} {plan.durationUnit}
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Services List */}
                <div className="flex-1 overflow-y-auto mt-5 space-y-3 hide-scrollbar">
                  {plan.services?.length > 0 ? (
                    plan.services.map((service) => (
                      <div
                        key={service._id}
                        className="flex gap-x-3 items-center"
                      >
                        <CheckCircle2
                          className={`w-6 h-6 ${
                            isDark ? "text-vahan_secondry" : "text-black"
                          }`}
                        />
                        <p
                          className={`font-light ${
                            isDark ? "text-white" : "text-black"
                          } font-raleway`}
                        >
                          {service.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p
                      className={`font-light ${
                        isDark ? "text-white" : "text-black"
                      } font-raleway`}
                    >
                      No services available
                    </p>
                  )}
                </div>

                {/* Purchase Button */}
                <a
                  href="/subscription"
                  className={`mt-6 py-3 rounded-full text-center font-medium transition-all duration-150 ${
                    isDark
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-black text-white hover:bg-gray-800"
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
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Pricing;