import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const ServicesEmbla = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const autoplayRef = useRef(null);

  // Fetch services from API
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
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Embla autoplay
  useEffect(() => {
    if (!emblaApi || services.length === 0) return;

    const autoplay = () => {
      if (!emblaApi) return;
      emblaApi.scrollNext();
      autoplayRef.current = setTimeout(autoplay, 2000);
    };

    autoplay();

    return () => clearTimeout(autoplayRef.current);
  }, [emblaApi, services]);

  if (loading) {
    return <p className="text-center py-10">Loading services...</p>;
  }

  if (!services || services.length === 0) {
    return <p className="text-center py-10">No services available.</p>;
  }

  return (
    <div className="overflow-hidden py-16">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-blue-500 font-semibold text-sm tracking-wide uppercase">
          / Our Services /
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight mt-2">
          We offer a <span className="text-blue-500">wide range</span>
          <br className="hidden sm:block" /> of car services
        </h2>
      </div>

      {/* Embla carousel */}
      <div className="embla" ref={emblaRef}>
        <div className="flex gap-x-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 sm:w-72 md:w-80 bg-white rounded-3xl shadow-md p-4"
            >
              <div className="overflow-hidden rounded-2xl mb-4">
                <img
                  src={
                    service.images?.[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={service.name}
                  className="w-full h-44 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-lg text-center">{service.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesEmbla;
