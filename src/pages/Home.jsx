import HeroSection from "../components/Home/HeroSection"
import WhoWeAre from "../components/Home/WhoWeAre"
import Services from "../components/Home/Services"
import Testimonials from "../components/Home/Testimonials"
import ContactForm from "../components/Home/ContactForm"
import MarqueeText from "../components/Home/MarqueeText"
import Pricing from "../components/Home/Pricing"
import WhyChooseUs from "../components/Home/WhyChooseUs"

const Home = () => {
  return (
    <>
    <HeroSection/>
    <WhyChooseUs/>
    <MarqueeText/>
    <Services/>
    <WhoWeAre/>
    <Pricing/>
    <Testimonials/>
    <ContactForm/>
    
    
    </>
  );
};

export default Home;
