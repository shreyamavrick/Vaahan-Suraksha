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
    <section className="bg-white text-black py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        
        {/* Left - Text Content */}
        <div>
          <p className="text-[#49AEFE] uppercase font-semibold tracking-wide mb-2">/ Who We Are /</p>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            The <span className="text-[#49AEFE]">story</span> behind <br /> service workshop
          </h2>
          <p className="text-gray-600 mb-8">
            We carefully screen all of our cleaners, so you can rest assured that your home would receive the absolute highest quality of service providing. We know that if you love our service you're going to recommend.
          </p>

          <hr className="border-gray-300 mb-6" />

          {/* Features List */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaCheckCircle className="text-[#49AEFE] text-lg" />
                <span className="font-medium text-black">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Video */}
        <div className="w-full max-w-lg aspect-video overflow-hidden rounded-2xl shadow-lg mx-auto">
  <video
    src={WhoWeAreVideo}
    className="w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
  />
</div>

      </div>
    </section>
  );
};

export default WhoWeAre;
