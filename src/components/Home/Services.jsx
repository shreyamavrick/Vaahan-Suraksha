import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/service/"
        );
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-blue-500 font-semibold text-sm tracking-wide uppercase">
          / Our Services /
        </p>
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
                src={
                  service.images?.[0] ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={service.name}
                className="rounded-2xl w-full h-44 sm:h-48 object-cover mb-4"
              />
              <h3 className="text-lg sm:text-xl font-bold mb-1">
                {service.name}
              </h3>
              <a
                href={`/services/${service._id}`}
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

export default Services;
