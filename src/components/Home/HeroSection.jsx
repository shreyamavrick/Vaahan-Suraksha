import { useEffect, useState } from "react";
import hero_img_1 from "../../assets/hero_img_1.jpg";
import hero_img_2 from "../../assets/hero_img_2.jpg";

const slides = [
  {
    image: hero_img_1,
    title: "24/7 Roadside Help",
    highlight: "We’re here!",
    subtitle: "Instant assistance for vehicle breakdowns anywhere.",
  },
  {
    image: hero_img_2,
    title: "Advanced Vehicle Care",
    highlight: "Quality Service",
    subtitle: "Diagnostics, Repairs and Upgrades, All at one place",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[currentSlide];

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${current.image})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xs sm:text-sm md:text-lg text-white/80 mb-2 md:mb-4 uppercase tracking-wide">
          STUCK ON THE ROAD? WE’VE GOT YOU!
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-snug">
          {current.title}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mt-2">
          {current.highlight}
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-xl">
          {current.subtitle}
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="bg-[#49AEFE] hover:bg-blue-500 text-white font-medium py-2 px-6 sm:px-8 rounded-full shadow-lg transition duration-300 text-base sm:text-lg"
          >
            Our Services
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
