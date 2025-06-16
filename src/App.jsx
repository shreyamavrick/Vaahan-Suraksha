import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs";
import MarqueeText from "./components/MarqueeText";
import Services from "./components/Services";
import WhoWeAre from "./components/WhoWeAre";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

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
      <Testimonials/>
      <ContactForm/>
      <Footer/>
        {/* </div> */}
    </>
  );
};

export default App;