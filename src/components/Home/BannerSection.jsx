import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import roadsideImg from "../../assets/roadside.webp";
import mechanicImg from "../../assets/mechanic.webp";

const BannerSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="w-full px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:h-60">
        
        {/* Left Block */}
        <div className="flex-1 w-full relative bg-white rounded-3xl overflow-hidden h-106 md:h-full">
          <img
            src={roadsideImg}
            alt="Roadside"
            className="absolute inset-0 m-auto w-72 md:w-84 lg:w-110 object-contain object-top md:object-cover h-full pointer-events-none"
          />
          <div className="pl-6 pr-4 py-6 flex flex-col justify-center relative z-10 h-full bg-gradient-to-t from-white/90 via-white/70 to-transparent">
            <p className="text-blue-600 uppercase font-semibold text-sm mb-2">
              / Road Side /
            </p>
            <h1 className="text-2xl font-bold text-black leading-snug">
              Roadside Assistance <br /> for Your Vehicle
            </h1>
          </div>
        </div>

        {/* Center Counter */}
        <div className="md:w-64 w-full h-96 md:h-full bg-blue-600 rounded-3xl flex flex-col justify-center items-center p-6 text-white">
          <div className="flex items-center">
            <h2 className="text-6xl font-bold">
              {inView ? <CountUp start={0} end={530} duration={3} /> : 0}
            </h2>
            <span className="text-6xl font-bold ml-1">+</span>
          </div>
          <p className="text-lg font-medium text-center leading-snug mt-2">
            Professional and <br />
            Experienced staff ready <br />
            to help you
          </p>
        </div>

        {/* Right Block */}
        <div className="flex-1 w-full relative bg-white rounded-3xl overflow-hidden h-106 md:h-full">
          <img
            src={mechanicImg}
            alt="Top Services"
            className="absolute inset-0 m-auto w-48 md:w-56 object-contain md:object-cover h-full pointer-events-none"
          />
          <div className="pl-6 pr-4 py-6 flex flex-col justify-center relative z-10 h-full bg-gradient-to-t from-white/90 via-white/70 to-transparent">
            <p className="text-blue-600 uppercase font-semibold text-sm mb-2">
              / Top Services /
            </p>
            <h1 className="text-2xl font-bold text-black leading-snug">
              Easy Booking & <br /> Fast Communication
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
