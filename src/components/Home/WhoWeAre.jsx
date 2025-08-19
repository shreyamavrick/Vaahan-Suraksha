import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import WhoWeAreVideo from "../../assets/whoweare.mp4";

const features = [
  "Tyre & Wheel Upgrade",
  "Increases resale value",
  "Detailed vehicle reports",
  "Precise wheel balancing",
  "Regular tire inspections",
  "High-quality tire products",
];

const WhoWeAre = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#202020] bg-opacity-95 overflow-hidden">
      {/* <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none" /> */}

      <div className="relative z-10 max-w-7xl w-full px-2 sm:px-8 py-12 grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-xs lg:max-w-md rounded-2xl overflow-hidden shadow-2xl bg-black bg-opacity-70">
            <video
              src={WhoWeAreVideo}
              className="w- h-fit object-cover rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
            </div>
          </div>
        </div>

        {/* Text Card */}
        <div className="flex items-center justify-center">
          <div className="w-full bg-black bg-opacity-90 rounded-2xl px-6 py-10 shadow-2xl max-w-xl">
            <p className="text-[#49AEFE] uppercase font-semibold tracking-wide mb-2 text-[15px]">/ Who We Are /</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              The <span className="text-[#49AEFE]">story</span> behind<br />service workshop
            </h2>
            <p className="text-gray-300 mb-6 text-base sm:text-lg">
              We carefully screen all of our cleaners, so you can rest assured that your home would receive the absolute highest quality of service providing. We know that if you love our service you're going to recommend.
            </p>
            <hr className="border-gray-500 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#49AEFE] text-base sm:text-lg" />
                  <span className="text-white text-base leading-tight">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
