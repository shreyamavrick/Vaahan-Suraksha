import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs";
import MarqueeText from "./components/MarqueeText";
import Services from "./components/Services";
import WhoWeAre from "./components/WhoWeAre";
import Pricing from "./components/Pricing";

const App = () => {
  return (
    <>
      <Navbar />
      {/* <div className="max-w-7xl mx-auto pt-20 px-6"> */}
      <HeroSection />
      <WhyChooseUs />
      <MarqueeText />
      <Services />
      <WhoWeAre/>
      <Pricing/>
        {/* </div> */}
    </>
  );
};

export default App;