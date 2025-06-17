import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../../constants";

const Pricing = () => {
  return (
    <section className="py-20 bg-[#f4f7fa]"> {/* Light grey background */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-wide">
          The best <span className="text-blue-500">pricing</span> to help you!
        </h2>
        <p className="text-neutral-500 mt-4">
          We carefully screen all of our cleaners, so you can rest assured that
          your home would receive the absolute highest quality of service
          providing.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {pricingOptions.map((option, index) => (
          <div
            key={index}
            className={`w-full sm:w-[300px] md:w-[320px] lg:w-[350px] bg-white ${
              option.title === "Standard Services" ? "bg-black text-white" : "text-black"
            } p-8 rounded-2xl shadow-xl transition-transform hover:scale-105`}
          >
            <h3 className="text-xl font-semibold mb-4">{option.title}</h3>
            <p className="text-4xl font-bold mb-1">₹{option.price}</p>
            <p className="text-sm text-neutral-400 mb-6">/ Per Month</p>

            <ul className="space-y-4 mb-10">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      option.title === "Standard Services"
                        ? "text-blue-400"
                        : "text-black"
                    }`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#"
              className={`block text-center w-full py-3 rounded-lg font-medium border ${
                option.title === "Standard Services"
                  ? "border-white hover:bg-white hover:text-black"
                  : "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
              } transition`}
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
