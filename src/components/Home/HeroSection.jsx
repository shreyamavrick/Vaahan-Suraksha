import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useVehicle } from "../../context/vehicleContext";
import { useUser } from "../../context/UserContext"; 
 
import hero_img_1 from "../../assets/hero_img_1.jpg";
import hero_img_2 from "../../assets/hero_img_2.jpg";
import hero_img_3 from "../../assets/hero_img_3.jpg";
  
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
    tagline: "Keep Your Vehicle Running Smoothly",
    title: "Advanced Vehicle Care",
    highlight: "Quality Service",
    subtitle: "Diagnostics, Repairs and Upgrades, All at one place.",
  },
  {
    image: hero_img_3,
    tagline: "YOUR CAR, YOUR CHOICE!",
    title: "Custom Services",
    highlight: "At Your Doorstep",
    subtitle: "Book a service & get an expert at your location.",
  },
];

const DOT_BG = "bg-[#49AEFE]/90 hover:bg-[#49AEFE]/60";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setVehicle } = useVehicle();

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
  const [errors, setErrors] = useState({});
  const [hasAddedCar, setHasAddedCar] = useState(false);

  const fuelTypes = useMemo(() => ["Petrol", "Diesel", "CNG", "Electric"], []);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?._id) {
      const flag = localStorage.getItem(`hasAddedCar_${user._id}`);
      setHasAddedCar(flag === "true");
    }
  }, [user]);

  useEffect(() => {
    if (step === 2 && brands.length === 0) {
      axios
        .get("https://vaahan-suraksha-backend.vercel.app/api/v1/car/brand/")
        .then((res) => setBrands(res.data.data || []))
        .catch((err) => console.error("Error fetching brands:", err));
    }
  }, [step, brands.length]);
    
 
  useEffect(() => {
    if (!selectedBrandId) return;
    axios
      .get(
        `https://vaahan-suraksha-backend.vercel.app/api/v1/car/model/${selectedBrandId}`
      )
      .then((res) => {
        setModels(res.data.data || []);
        setStep(3);
      })
      .catch((err) => console.error("Error fetching models:", err));
  }, [selectedBrandId]);

  const handleNext = () => {
    const newErrors = {};
    if (!location.trim()) newErrors.location = "City is required";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(2);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!fuel) newErrors.fuel = "Please select a fuel type";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setVehicle({
        brand: manufacturer,
        model,
        fuel,
        location,
        mobile,
        id: selectedBrandId,
      });
      navigate("/allservices", {
        state: { location, mobile, manufacturer, model, fuel },
      });
    }
  };

  const getBrandImage = (name) =>
    `/images/brands/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

  const getModelImage = (name) =>
    `/images/models/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

  const handleBrandSelect = (brand) => {
    setManufacturer(brand.name);
    setSelectedBrandId(brand._id);
  };

  return (
    <div className="w-full container mx-auto md:mt-4">
      
      <div className="hidden md:block relative w-full h-[550px] rounded-3xl overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
                  <div className="h-full flex items-center justify-between px-8">
                    {/* Left text */}
                    <div
                      className={`text-white max-w-3xl transition-all duration-700 ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                    >
                      <p className="text-sm font-medium uppercase tracking-wider mb-2">
                        {slide.tagline}
                      </p>
                      <h2 className="text-[55px] lg:text-[80px] leading-none font-bold mt-5">
                        {slide.title}
                      </h2>
                      <h3 className="text-[55px] lg:text-[80px] leading-none font-bold mt-3 mb-3">
                        {slide.highlight}
                      </h3>
                      <p className="text-xl mb-8 border-t pt-3 border-white/20">
                        {slide.subtitle}
                      </p>
                      <button
                        onClick={() => navigate("/allservices")}
                        className="bg-[#49AEFE] text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        Our Services
                      </button>
                    </div>

                    {/* Right form */}
                    <div className="w-full max-w-[340px] ml-6">
                      <FormBox
                        step={step}
                        setStep={setStep}
                        location={location}
                        setLocation={setLocation}
                        mobile={mobile}
                        setMobile={setMobile}
                        brands={brands}
                        models={models}
                        manufacturer={manufacturer}
                        setManufacturer={setManufacturer}
                        model={model}
                        setModel={setModel}
                        fuel={fuel}
                        setFuel={setFuel}
                        fuelTypes={fuelTypes}
                        handleNext={handleNext}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        getBrandImage={getBrandImage}
                        getModelImage={getModelImage}
                        handleBrandSelect={handleBrandSelect}
                        hasAddedCar={hasAddedCar}
                        navigate={navigate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4 py-8 px-4 bg-[#f0f2f4] rounded-l-full">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 h-2 w-2 rounded-full ${
                i === currentSlide ? "bg-black" : DOT_BG
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      
      <div className="md:hidden w-full">
        
        <div
          className="relative w-full min-h-[320px] bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col items-start text-start text-white px-10 py-15 h-full">
            <p className="text-xs uppercase tracking-wider mb-2">
              {slides[currentSlide].tagline}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              {slides[currentSlide].title}
            </h2>
            <h3 className="text-2xl sm:text-4xl font-bold leading-tight mt-2 mb-2">
              {slides[currentSlide].highlight}
            </h3>
            <p className="text-sm sm:text-base max-w-xs mb-4">
              {slides[currentSlide].subtitle}
            </p>
            <button
              onClick={() => navigate("/allservices")}
              className="bg-[#49AEFE] text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Our Services
            </button>
          </div>
        </div>

        <div className="px-4 py-6">
          <FormBox
            step={step}
            setStep={setStep}
            location={location}
            setLocation={setLocation}
            mobile={mobile}
            setMobile={setMobile}
            brands={brands}
            models={models}
            manufacturer={manufacturer}
            setManufacturer={setManufacturer}
            model={model}
            setModel={setModel}
            fuel={fuel}
            setFuel={setFuel}
            fuelTypes={fuelTypes}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
            errors={errors}
            getBrandImage={getBrandImage}
            getModelImage={getModelImage}
            handleBrandSelect={handleBrandSelect}
            hasAddedCar={hasAddedCar}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

  
const FormBox = ({
  step,
  setStep,
  location,
  setLocation,
  mobile,
  setMobile,
  brands,
  models,
  manufacturer,
  setManufacturer,
  model,
  setModel,
  fuel,
  setFuel,
  fuelTypes,
  handleNext,
  handleSubmit,
  errors,
  getBrandImage,
  getModelImage,
  handleBrandSelect,
  hasAddedCar,
  navigate,
}) => {
  return (
    <div className="bg-white rounded-md shadow-xl border border-gray-300 px-4 sm:px-6 py-6 w-full">
      {step === 1 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug mb-2">
            Experience The Best Car Services In Delhi
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 text-center mb-5">
            Get instant quotes for your car service
          </p>
        </>
      )}

      {!hasAddedCar ? (
        <>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs sm:text-sm text-blue-600 mb-3 hover:underline"
            >
              ← Back
            </button>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="Enter City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mb-3 px-3 py-2.5 border border-gray-400 rounded-sm text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mb-2">{errors.location}</p>
              )}

              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full mb-3 px-3 py-2.5 border border-gray-400 rounded-sm text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mb-2">{errors.mobile}</p>
              )}

              <button
                onClick={handleNext}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-3 rounded-sm transition-all text-sm sm:text-base"
              >
                CHECK PRICES FOR FREE
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <p className="font-semibold mb-2">Select Manufacturer</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    onClick={() => handleBrandSelect(brand)}
                    className="cursor-pointer text-center bg-gray-100 px-2.5 py-2 rounded-md hover:scale-105 transition"
                  >
                    <img
                      src={getBrandImage(brand.name)}
                      alt={brand.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 object-contain"
                    />
                    <span className="text-xs sm:text-sm">{brand.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <p className="font-semibold mb-2">Select Model</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                {models.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => {
                      setModel(m.name);
                      setStep(4);
                    }}
                    className="cursor-pointer text-center bg-gray-100 px-2.5 py-2 rounded-md hover:scale-105 transition"
                  >
                    <img
                      src={getModelImage(m.name)}
                      alt={m.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 object-contain"
                    />
                    <span className="text-xs sm:text-sm">{m.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <p className="font-semibold mb-2">Select Fuel Type</p>
              {errors.fuel && (
                <p className="text-red-500 text-xs mb-2">{errors.fuel}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {fuelTypes.map((f) => (
                  <div
                    key={f}
                    onClick={() => setFuel(f)}
                    className={`cursor-pointer p-2 text-center border rounded-md text-xs sm:text-sm transition ${
                      fuel === f
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="mt-4 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-3 rounded-sm transition-all text-sm sm:text-base"
              >
                CHECK PRICES FOR FREE
              </button>
            </>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          Your car is already added. <br />
          Go to{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("/dashboard/cars")}
          >
            My Cars
          </span>{" "}
          to update it.
        </p>
      )}

      {/* Reviews + Customers */}
      {step === 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-6 pt-4 border-t border-gray-300 text-gray-800 text-sm">
          {/* Reviews */}
          <div className="flex-1 text-center sm:border-r border-gray-400 sm:pr-4">
            <p className="text-green-600 font-bold text-lg">★ 4.2/5</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Based on 40000+ Reviews
            </p>
          </div>

          {/* Happy Customers */}
          <div className="flex-1 text-center sm:pl-4">
            <p className="font-bold text-lg">2 Lakh+</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Happy Customers
            </p>
          </div>
        </div>
      )}
    </div>
  );
};



export default HeroSection;
