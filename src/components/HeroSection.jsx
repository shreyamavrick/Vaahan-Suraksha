import { useEffect, useState } from "react";
import hero_img_1 from "../assets/hero_img_1.jpg";
import hero_img_2 from "../assets/hero_img_2.jpg";

const slides = [
  {
    image: hero_img_1,
    title: "Advanced Vehicle Care",
    highlight: "Quality Service",
    subtitle: "Diagnostics, Repairs and Upgrades, All at one place",
  },
  {
    image: hero_img_2,
    title: "Complete Auto Solutions",
    highlight: "Fast & Trusted",
    subtitle: "We care for your car like it's our own",
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
      style={{
        backgroundImage: `url(${current.image})`,
      }}
    >
      {/* Blurred overlay + content */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg text-white/80 mb-4">
          KEEP YOUR VEHICLE RUNNING SMOOTHLY
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
          {current.title}{" "}
          <span className="text-[#49AEFE]">{current.highlight}</span>
        </h1>
        <p className="mt-6 text-lg text-white/80 max-w-2xl">{current.subtitle}</p>
        <div className="mt-10">
          <a
            href="#"
            className="bg-[#49AEFE] text-white py-3 px-6 rounded-md shadow-lg hover:brightness-110 transition"
          >
            Our Services
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
