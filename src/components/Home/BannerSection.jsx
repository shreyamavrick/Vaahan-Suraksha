import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import image4 from "../../assets/image4.webp";
import image5 from "../../assets/image5.avif";

export default function BannerSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="w-full px-4 md:px-8 py-8">
      {/* Responsive five circular feature cards.
          - Desktop (md+): single-row 5 equal cards
          - Mobile: 2-column grid with center stat spanning full width for balance
          - No buttons, images inside circles, subtle entrance animation
      */}

      <div className="max-w-6xl mx-auto">
        {/* Wrapper: grid on small screens, flex on md+ */}
        <div className="grid grid-cols-2 gap-4 md:flex md:gap-6 md:items-center">

          {/* Card 1 */}
          <div className={`flex flex-col items-center text-center p-4 md:p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image1} alt="image1" className="w-full h-full object-cover object-center" />
            </div>
            <h4 className="mt-3 md:mt-4 font-semibold text-sm md:text-base">Roadside Help</h4>
            <p className="mt-1 text-xs md:text-sm text-gray-500">Towing, fuel delivery &amp; more</p>
          </div>

          {/* Card 2 */}
          <div className={`flex flex-col items-center text-center p-4 md:p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-800 delay-75`}>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image2} alt="image2" className="w-full h-full object-cover object-center" />
            </div>
            <h4 className="mt-3 md:mt-4 font-semibold text-sm md:text-base">Quick Response</h4>
            <p className="mt-1 text-xs md:text-sm text-gray-500">Average arrival under 30 mins</p>
          </div>

          {/* Card 3 - center stat: spans 2 cols on small screens */}
          <div className={`col-span-2 md:col-auto flex flex-col items-center text-center p-4 md:p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-900 delay-150`}>
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-2xl text-white">
              <div>
                <div className="text-xl md:text-2xl font-extrabold leading-none">
                  {inView ? <CountUp start={1} end={230} duration={3} /> : 0}
                  <span className="ml-1 text-sm md:text-lg">+</span>
                </div>
                <div className="text-[10px] md:text-xs">Experts</div>
              </div>
            </div>
            <h4 className="mt-3 md:mt-4 font-semibold text-sm md:text-base">Trusted Pros</h4>
            <p className="mt-1 text-xs md:text-sm text-gray-500">Certified &amp; background checked</p>
          </div>

          {/* Card 4 */}
          <div className={`flex flex-col items-center text-center p-4 md:p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-1000 delay-200`}>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image4} alt="image4" className="w-full h-full object-cover object-center" />
            </div>
            <h4 className="mt-3 md:mt-4 font-semibold text-sm md:text-base">Easy Booking</h4>
            <p className="mt-1 text-xs md:text-sm text-gray-500">Seamless, no surprises</p>
          </div>

          {/* Card 5 */}
          <div className={`flex flex-col items-center text-center p-4 md:p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-1100 delay-250`}>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image5} alt="image5" className="w-full h-full object-cover object-center" />
            </div>
            <h4 className="mt-3 md:mt-4 font-semibold text-sm md:text-base">Certified Techs</h4>
            <p className="mt-1 text-xs md:text-sm text-gray-500">Background checked &amp; insured</p>
          </div>

        </div>
      </div>
    </section>
  );
}
