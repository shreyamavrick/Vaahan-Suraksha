import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import hero_img_1 from "../../assets/hero_img_1.jpg";
import hero_img_2 from "../../assets/hero_img_2.jpg";

const logo = "/logo.avif";

const slides = [
  {
    image: hero_img_1,
    tagline: "STUCK ON THE ROAD? WE'VE GOT YOU!",
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
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [mobile, setMobile] = useState("");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");

  const [showSplash, setShowSplash] = useState(true);
  const [errors, setErrors] = useState({});

  const fuelTypes = [
    { type: "Petrol" },
    { type: "Diesel" },
    { type: "CNG" },
    { type: "Electric" },
  ];

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

  useEffect(() => {
    if (step === 2 && brands.length === 0) {
      axios
        .get("https://vaahan-suraksha-backend.vercel.app/api/v1/car/brand/")
        .then((res) => setBrands(res.data.data || []))
        .catch((err) => console.error("Error fetching brands:", err));
    }
  }, [step]);

  useEffect(() => {
    if (selectedBrandId) {
      axios
        .get(
          `https://vaahan-suraksha-backend.vercel.app/api/v1/car/model/${selectedBrandId}`
        )
        .then((res) => setModels(res.data.data || []))
        .catch((err) => console.error("Error fetching models:", err));
    }
  }, [selectedBrandId]);

  const getBrandImage = (brandName) => {
    const base = brandName.toLowerCase().replace(/\s+/g, "_");
    return `/images/brands/${base}.png`;
  };

  const getModelImage = (modelName) => {
    const base = modelName.toLowerCase().replace(/\s+/g, "_");
    return `/images/models/${base}.png`;
  };

  const handleNext = () => {
    const newErrors = {};

    if (step === 1) {
      if (!location.trim()) newErrors.location = "City is required";
      if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!fuel) newErrors.fuel = "Please select a fuel type";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/allservices", {
        state: {
          location,
          mobile,
          manufacturer,
          model,
          fuel,
        },
      });
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/35 flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-6 overflow-y-auto">
              <div className="text-white text-center md:text-left w-full md:w-1/2 mb-8 md:mb-0">
                <p className="text-sm font-medium uppercase tracking-wider mb-2">
                  {slide.tagline}
                </p>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                  {slide.title}
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold mt-2 mb-3">
                  {slide.highlight}
                </h3>
                <p className="text-lg border-t pt-3 border-white/30">
                  {slide.subtitle}
                </p>
                <button className="mt-6 bg-[#49AEFE] hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-colors duration-300">
                  Our Services
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-6 w-full md:w-1/2 max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Get instant quotes for your car service
                </h3>

                {step > 1 && (
                  <button
                    onClick={() => setStep((prev) => prev - 1)}
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
                      className="w-full mb-1 p-2 border border-gray-300 rounded"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.location}
                      </p>
                    )}

                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full mb-1 p-2 border border-gray-300 rounded"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.mobile}
                      </p>
                    )}

                    <button
                      onClick={handleNext}
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded mt-2"
                    >
                      Continue
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="font-semibold mb-2">Select Manufacturer</p>
                    <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                      {brands.map((brand) => (
                        <div
                          key={brand._id}
                          onClick={() => {
                            setManufacturer(brand.name);
                            setSelectedBrandId(brand._id);
                            setStep(3);
                          }}
                          className="cursor-pointer text-center bg-gray-100 px-3 py-2 rounded hover:scale-105 transition"
                        >
                          <img
                            src={getBrandImage(brand.name)}
                            alt={brand.name}
                            className="w-12 h-12 mx-auto mb-1"
                            onError={(e) =>
                              (e.target.src = `/images/brands/${brand.name
                                .toLowerCase()
                                .replace(/\s+/g, "_")}.jpeg`)
                            }
                          />
                          {brand.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <p className="font-semibold mb-2">Select Model</p>
                    <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                      {models.map((m) => (
                        <div
                          key={m._id}
                          onClick={() => {
                            setModel(m.name);
                            setStep(4);
                          }}
                          className="cursor-pointer text-center bg-gray-100 px-3 py-2 rounded hover:scale-105 transition"
                        >
                          <img
                            src={getModelImage(m.name)}
                            alt={m.name}
                            className="w-12 h-12 mx-auto mb-1"
                            onError={(e) =>
                              (e.target.src = `/images/models/${m.name
                                .toLowerCase()
                                .replace(/\s+/g, "_")}.jpeg`)
                            }
                          />
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <p className="font-semibold mb-2">Select Fuel Type</p>
                    {errors.fuel && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.fuel}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {fuelTypes.map((f) => (
                        <div
                          key={f.type}
                          onClick={() => setFuel(f.type)}
                          className={`cursor-pointer p-2 text-center border rounded text-sm font-medium ${
                            fuel === f.type
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          {f.type}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded"
                    >
                      Check Prices for Free
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 flex-col gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition ${
              index === currentSlide ? "bg-black" : "bg-[#49AEFE]/80"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
