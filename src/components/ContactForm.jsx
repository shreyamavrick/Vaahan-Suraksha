import bgImg from "../assets/contact-form-bg.jpg"; // Update path as per your file
import { Send } from "lucide-react";

const ContactFormWithBG = () => {
  return (
    <section
      className="w-full bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden mt-20"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex flex-col lg:flex-row w-full">
        {/* LEFT (Form with black background) */}
        <div className="w-full lg:w-1/2 bg-black bg-opacity-90 p-10 lg:p-20 text-white flex flex-col justify-center">
          <p className="text-blue-400 uppercase tracking-widest font-medium mb-2">
            / Cost Calculator /
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold mb-10">
            Get your free <span className="text-blue-400">estimate</span>!
          </h2>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
            <select className="col-span-1 w-full p-4 rounded-full bg-neutral-900 text-white">
              <option>Choose a Service</option>
            </select>
            <input
              type="date"
              className="col-span-1 w-full p-4 rounded-full bg-neutral-900 text-white"
            />
            <input
              type="text"
              placeholder="Your Name"
              className="col-span-1 w-full p-4 rounded-full bg-neutral-900 text-white"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="col-span-1 w-full p-4 rounded-full bg-neutral-900 text-white"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="col-span-1 sm:col-span-2 w-full p-4 rounded-full bg-neutral-900 text-white"
            />

            <p className="text-sm text-neutral-400 italic mt-2 sm:col-span-2">
              Submit this information and we will send you the cost for the service.
            </p>

            <button
              type="submit"
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full flex items-center gap-2 sm:col-span-2 justify-center text-lg font-semibold transition"
            >
              Get cost estimate <Send size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT (Image side - no overlay) */}
        <div className="hidden lg:block lg:w-1/2"></div>
      </div>
    </section>
  );
};

export default ContactFormWithBG;
