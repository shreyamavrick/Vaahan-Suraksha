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
    <section ref={ref} className="w-full px-4 md:px-8 py-12">
      {/* Five equal circular feature cards in a single row */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center gap-6">

          {/* Card 1 */}
          <div
            className={`flex-1 min-w-0 flex flex-col items-center text-center p-6 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-700`}
          >
            <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image1} alt="image1" className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-4 font-semibold">Roadside Help</h4>
            <p className="mt-2 text-sm text-gray-500">Towing, fuel delivery &amp; more</p>
          </div>

          {/* Card 2 */}
          <div
            className={`flex-1 min-w-0 flex flex-col items-center text-center p-6 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-800 delay-75`}
          >
            <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image2} alt="image2" className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-4 font-semibold">Quick Response</h4>
            <p className="mt-2 text-sm text-gray-500">Average arrival under 30 mins</p>
          </div>

          {/* Card 3 - stats center */}
          <div
            className={`flex-1 min-w-0 flex flex-col items-center text-center p-6 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-900 delay-150`}
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-2xl text-white">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold leading-none">
                  {inView ? <CountUp start={1} end={230} duration={3} /> : 0}
                  <span className="ml-1 text-lg">+</span>
                </div>
                <div className="text-xs">Experts</div>
              </div>
            </div>
            <h4 className="mt-4 font-semibold">Trusted Pros</h4>
            <p className="mt-2 text-sm text-gray-500">Certified &amp; background checked</p>
          </div>

          {/* Card 4 */}
          <div
            className={`flex-1 min-w-0 flex flex-col items-center text-center p-6 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-1000 delay-200`}
          >
            <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image4} alt="image4" className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-4 font-semibold">Easy Booking</h4>
            <p className="mt-2 text-sm text-gray-500">Seamless, no surprises</p>
          </div>

          {/* Card 5 */}
          <div
            className={`flex-1 min-w-0 flex flex-col items-center text-center p-6 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-1100 delay-250`}
          >
            <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
              <img src={image5} alt="image5" className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-4 font-semibold">Certified Techs</h4>
            <p className="mt-2 text-sm text-gray-500">Background checked &amp; insured</p>
          </div>

        </div>
      </div>
    </section>
  );
}
