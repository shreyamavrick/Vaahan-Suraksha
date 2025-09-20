import { Clock, Users, ShieldCheck, Handshake } from "lucide-react";
import carImage from "../../assets/about-img.avif"; // Transparent car image

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 items-center">
        {/* Left Section */}
        <div>
          <p className="text-[#49AEFE] uppercase tracking-wide font-semibold mb-2">/ Why Choose Us /</p>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            What makes us <span className="text-[#49AEFE]">different?</span>
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed">
            Vaahan Suraksha offers hassle-free, transparent, and timely vehicle care with expert technicians, flexible maintenance plans, doorstep service, and 24/7 support, ensuring your vehicles stay safe, efficient, and always road-ready, giving you complete peace of mind.
          </p>
          <a
            href="/about"
            className="inline-flex items-center mt-8 px-6 py-3 text-white bg-[#49AEFE] rounded-full font-medium shadow hover:brightness-110 transition duration-300"
          >
            Learn More <span className="ml-2">↗</span>
          </a>
        </div>

        {/* Center Image */}
        <div className="flex justify-center">
          <img src={carImage} alt="car service" className="w-full max-w-md object-contain" />
        </div>

        {/* Right Section - Features */}
        <div className="space-y-8">
          <FeatureItem
            icon={<Users size={24} />}
            title="Experienced Mechanics"
            desc="Skilled professionals ensuring reliable and efficient vehicle care every time."
          />
          <FeatureItem
            icon={<Clock size={24} />}
            title="24/7 Quality Service"
            desc="Round-the-clock vehicle support for emergencies and routine maintenance."
          />
          <FeatureItem
            icon={<ShieldCheck size={24} />}
            title="Money Back Guarantee"
            desc="Complete satisfaction or your money returned, no questions asked."
          />
          <FeatureItem
            icon={<Handshake size={24} />}
            title="Quality Equipment"
            desc="Advanced tools and technology for precise, high-quality vehicle servicing."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 rounded-xl bg-gray-100 text-[#49AEFE]">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  </div>
);

export default WhyChooseUs;
