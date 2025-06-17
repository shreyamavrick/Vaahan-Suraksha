import experienceImg from "../../assets/experience.jpg"; // Update with actual image path

const ExperienceSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Image with Overlay */}
        <div className="relative w-full lg:w-1/2">
          <img
            src={experienceImg}
            alt="20 Years Experience"
            className="rounded-md w-full object-cover"
          />
          {/* Overlay Number */}
          {/* <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <h1 className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-bold text-white/40 select-none">
              20
            </h1>
          </div> */}
        </div>

        {/* Right: Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            20 Years <span className="text-black">Experience</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Armory Alliance India Private Limited, also known as Vaahan Suraksha. We focus on
            ensuring that our customers can concentrate on their core business operations without
            worrying about vehicle maintenance.
          </p>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-4">
            At Vaahan Suraksha, we provide Annual Maintenance Contracts (AMCs) for all types of
            vehicles, including Hatchbacks, Sedans, Mini SUVs, and SUVs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
