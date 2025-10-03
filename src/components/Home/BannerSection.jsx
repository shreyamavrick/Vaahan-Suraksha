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
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6 w-full md:h-60">
        
        {/* Left Block */}
        <div className="flex-1 w-full relative bg-white rounded-3xl overflow-hidden">
          <img
            src={roadsideImg}
            alt="Roadside"
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/20 to-transparent"></div>
          
          <div className="pl-6 pr-4 py-6 flex flex-col justify-around relative z-10 h-auto md:h-full">
            <p className="text-blue-600 uppercase font-semibold text-sm">
              / Road Side /
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-black">
              Roadside Assistance <br /> for Your Vehicle
            </h1>
          </div>
        </div>

        {/* Center Counter */}
        <div className="md:w-64 w-full h-auto md:h-full bg-blue-600 rounded-3xl flex flex-col justify-around p-6 text-white">
          <div className="flex items-center">
            <h2 className="text-4xl md:text-6xl font-bold">
              {inView ? <CountUp start={1} end={230} duration={3} /> : 0}
            </h2>
            <span className="text-4xl md:text-6xl font-bold ml-1">+</span>
          </div>
          <p className="text-base md:text-lg font-medium leading-snug">
            Professional and <br />
            Experienced staff ready <br />
            to help you
          </p>
        </div>

        {/* Right Block */}
        <div className="flex-1 w-full relative bg-white rounded-3xl overflow-hidden">
          <img
            src={mechanicImg}
            alt="Top Services"
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent"></div>

          <div className="pl-6 pr-4 py-6 flex flex-col justify-around relative z-10 h-auto md:h-full">
            <p className="text-blue-600 uppercase font-semibold text-sm">
              / Top Services /
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-black">
              Easy Booking & <br /> Fast Communication
            </h1>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BannerSection;
