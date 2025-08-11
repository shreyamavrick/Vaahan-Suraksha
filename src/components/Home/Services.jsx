import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import BatteryImg from "../../assets/battery.jpg";
import DetailingImg from "../../assets/detailing.jpg";
import EngineImg from "../../assets/engine.jpg";
import SpaImg from "../../assets/spa.jpg";
import TowingImg from "../../assets/towing.jpg";

const services = [
  {
    title: 'Batteries',
    desc: 'Battery replacement and maintenance services',
    image: BatteryImg,
    link: '/services/batteries', 
  },
  {
    title: 'Detailing Services',
    desc: 'Premium car detailing and deep cleaning services',
    image: DetailingImg,
    link: '/services/detailing',
  },
  {
    title: 'Spa & Cleaning',
    desc: 'Luxury car spa treatments and thorough cleaning services',
    image: SpaImg,
    link: '/services/spa',
  },
  {
    title: 'Engine Repair',
    desc: 'Engine diagnosis and repair solutions',
    image: EngineImg,
    link: '/services/engine',
  },
  {
    title: 'Towing Services',
    desc: 'Fast and safe towing at your location',
    image: TowingImg,
    link: '/services/towing',
  },
];

const ServicesSection = () => {
  return (
    <div className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-6 mb-10">
  <p className="text-blue-500 font-semibold text-sm tracking-wide uppercase">/ Our Services /</p>
  <h2 className="text-4xl sm:text-5xl font-bold leading-tight mt-2">
    We offer a <span className="text-blue-500">wide range</span>
    <br className="hidden sm:block" /> of car services
  </h2>
</div>



      {/* Marquee */}
      <div className="overflow-hidden relative w-full">
        <div className="flex w-max animate-marquee gap-6">
         {[...services, ...services].map((service, index) => (

            <div
              key={index}
              className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] bg-white rounded-3xl shadow-md border p-4"
            >
              <img
                src={service.image}
                alt={service.title}
                className="rounded-2xl w-full h-44 sm:h-48 object-cover mb-4"
              />
              <h3 className="text-lg sm:text-xl font-bold mb-1">{service.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4">{service.desc}</p>
              <a
                href={service.link}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                <FaArrowRight />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
