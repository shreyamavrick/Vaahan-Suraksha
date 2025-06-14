import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs";
import MarqueeText from "./components/MarqueeText";
import Services from "./components/Services";

const App = () => {
  return (
    <>
      <Navbar />
      {/* <div className="max-w-7xl mx-auto pt-20 px-6"> */}
      <HeroSection />
      <WhyChooseUs />
      <MarqueeText />
      <Services />
        {/* </div> */}
    </>
  );
};

export default App;