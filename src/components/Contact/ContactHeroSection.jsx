import React from "react";
import aboutBg from "../../assets/about-bg.jpg";

const ContactHeroSection = () => {
  return (
    <div
      className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${aboutBg})`,
        borderRadius: "20px",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 rounded-[20px]"></div>
      <h1 className="relative text-5xl font-bold z-10">Contact Us</h1>
    </div>
  );
};

export default ContactHeroSection;
