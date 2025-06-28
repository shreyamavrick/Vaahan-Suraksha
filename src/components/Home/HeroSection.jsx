// src/components/HeroSection.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero_img_1 from "../../assets/hero_img_1.jpg";
import hero_img_2 from "../../assets/hero_img_2.jpg";
import vehicleData from "../../data/vehicle_data.json";
import logo from "../../../public/logo.avif"; // Add your logo path here

const slides = [
  {
    image: hero_img_1,
    tagline: "STUCK ON THE ROAD? WE’VE GOT YOU!",
    title: "24/7 Roadside Help",
    highlight: "We’re here!",
    subtitle: "Instant assistance for vehicle breakdowns anywhere."
  },
  {
    image: hero_img_2,
    tagline: "YOUR CAR, YOUR CHOICE!",
    title: "Advanced Vehicle Care",
    highlight: "Quality Service",
    subtitle: "Diagnostics, Repairs and Upgrades, All at one place"
  }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [mobile, setMobile] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(
        `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`
      );
    });
  };

  useEffect(() => {
    const splashTimeout = setTimeout(() => setShowSplash(false), 2000);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      clearTimeout(splashTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleNext = () => {
    if (step < 4) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    navigate("/services");
  };

  if (showSplash) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center">
        <img src={logo} alt="AutoCare Logo" className="w-32 h-32 mb-4 animate-pulse" />
        <p className="text-xl font-semibold text-gray-700 animate-fade-in">AutoCare</p>
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto md:mt-4 flex items-center">
      <div className="relative flex items-center w-full h-[500px] md:h-[550px] md:rounded-3xl overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center justify-between px-4 md:px-10">
                <div className="text-white max-w-[50%]">
                  <p className="text-sm font-medium uppercase tracking-wider mb-2">
                    {slide.tagline}
                  </p>
                  <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                    {slide.title}
                  </h2>
                  <h3 className="text-4xl md:text-6xl font-bold md:-mt-2 mb-3">
                    {slide.highlight}
                  </h3>
                  <p className="text-xl border-t pt-3 border-white/20">
                    {slide.subtitle}
                  </p>
                  <button className="mt-6 bg-[#49AEFE] hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-colors duration-300">
                    Our Services
                  </button>
                </div>

                {/* Right Multi-step Form */}
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Get instant quotes for your car service
                  </h3>

                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="text-sm text-blue-600 mb-2 hover:underline"
                    >
                      ← Back
                    </button>
                  )}

                  {step === 1 && (
                    <>
                      <input
                        type="text"
                        placeholder="Enter City"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full mb-3 p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="tel"
                        placeholder="Enter Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full mb-3 p-2 border border-gray-300 rounded"
                      />
                      <button onClick={handleNext} className="w-full bg-red-600 text-white font-semibold py-2 rounded">
                        Continue
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <p className="font-semibold mb-2">Select Manufacturer</p>
                      <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                        {vehicleData.manufacturers.map((brand) => (
                          <div
                            key={brand.name}
                            onClick={() => {
                              setManufacturer(brand.name);
                              setStep(3);
                            }}
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
                          >
                            <span className="text-xs text-center font-medium py-2 px-3 bg-gray-100 rounded-md">
                              {brand.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <p className="font-semibold mb-2">Select Model</p>
                      <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                        {vehicleData.manufacturers.find((v) => v.name === manufacturer)?.models.map((m) => (
                          <div
                            key={m.name}
                            onClick={() => {
                              setModel(m.name);
                              setStep(4);
                            }}
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
                          >
                            <span className="text-xs text-center font-medium py-2 px-3 bg-gray-100 rounded-md">
                              {m.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <p className="font-semibold mb-2">Select Fuel Type</p>
                      <div className="grid grid-cols-2 gap-4">
                        {vehicleData.fuelTypes.map((f) => (
                          <div
                            key={f.type}
                            onClick={() => setFuel(f.type)}
                            className={`flex justify-center items-center cursor-pointer p-2 border rounded text-sm font-medium ${fuel === f.type ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          >
                            {f.type}
                          </div>
                        ))}
                      </div>
                      <button onClick={handleSubmit} className="mt-4 w-full bg-red-600 text-white font-semibold py-2 rounded">
                        Check Prices for Free
                      </button>
                    </>
                  )}
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
