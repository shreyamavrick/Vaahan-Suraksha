import { useEffect, useState } from "react";
import hero_img_1 from "../../assets/hero_img_1.jpg";
import hero_img_2 from "../../assets/hero_img_2.jpg";

const slides = [
  {
    image: hero_img_1,
    tagline: "STUCK ON THE ROAD? WE’VE GOT YOU!",
    title: "24/7 Roadside Help",
    highlight: "We’re here!",
    subtitle: "Instant assistance for vehicle breakdowns anywhere.",
  },
  {
    image: hero_img_2,
    tagline: "YOUR CAR, YOUR CHOICE!",
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

  return (
    <div className="w-full container mx-auto md:mt-4 flex items-center">
      <div className="relative flex items-center w-full h-[450px] md:h-[550px] md:rounded-3xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-1000"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute md:pl-10 inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
                <div className="h-full flex items-center px-3 md:px-8">
                  <div className="text-white">
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium uppercase tracking-wider mb-2">
                        {slide.tagline}
                      </p>
                    </div>
                    <h2 className="max-md:text-4xl md:text-[80px] font-bold">
                      {slide.title}
                    </h2>
                    <h3 className="max-md:text-4xl md:text-[80px] font-bold md:-mt-6 mb-3">
                      {slide.highlight}
                    </h3>
                    <p className="text-xl md:w-max mb-8 border-t pt-3 border-white/20">
                      {slide.subtitle}
                    </p>
                    <div className="relative inline-block">
                      <button className="bg-[#49AEFE] hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-colors duration-300">
                        Our Services
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        
        <div className="max-md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 py-8 px-4 bg-[#f0f2f4] rounded-l-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 h-2 w-2 rounded-full ${
                index === currentSlide
                  ? "bg-black"
                  : "bg-[#49AEFE]/90 hover:bg-[#49AEFE]/60"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
