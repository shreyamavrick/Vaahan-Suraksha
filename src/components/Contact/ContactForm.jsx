    import { MapPin, Phone, Mail } from "lucide-react";

    const ContactForm = () => {
      return (
        <section className="py-10 bg-white">
          <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-600 text-lg mb-6">
                For more information or to inquire about our AMC services,<br />
                please contact us at
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-500" />
                  <p className="text-gray-700">
                    Shop No-F-19 Pankaj Central Market, LSC, Mandawali, Near Natraj
                    Bihar Society, East Delhi, Delhi-110092, India
                  </p> 
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="text-blue-500" />
                  <a href="tel:+917217747633" className="text-gray-700">
                    +91 7217747633
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="text-blue-500" />
                  <a
                    href="mailto:Jatin.kapoor@vaahansuraksha.com"
                    className="text-gray-700"
                  >
                    Jatin.kapoor@vaahansuraksha.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                ></textarea>
                <button
                  type="submit"
                  className="bg-black hover:bg-blue-500 text-white px-6 py-3 rounded-md transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      );
    };

    export default ContactForm;
