import { Mail, MapPin, Phone, CalendarDays } from "lucide-react";

const contactItems = [
  {
    icon: <Mail size={28} className="text-blue-500" />,
    title: "Mail Us 24/7",
    lines: [
      "jatin.kapoor@vaahansuraksha.com",
      "Vaahansuraksha@gmail.com",
    ],
  },
  {
    icon: <MapPin size={28} className="text-blue-500" />,
    title: "Our Location",
    lines: [
      "Shop No-F-19 Pankaj Central Market, LSC, Mandawali, Near Natraj Bihar Society",
      "East Delhi, Delhi-110092, India",
    ],
  },
  {
    icon: <Phone size={28} className="text-blue-500" />,
    title: "Call US 24/7",
    lines: ["Phone: +91 721-774-7633", "Mobile: +91 800-572-4369"],
  },
  {
    icon: <CalendarDays size={28} className="text-blue-500" />,
    title: "Working Days",
    lines: ["Mon to Fri - 09:00am To 06:00pm", "Saturday to Sunday - Closed"],
  },
];

const ContactInfo = () => {
  return (
    <section className="py-10 bg-white">
      <div className="w-[90%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-8">
          {contactItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="bg-blue-100 rounded-full p-3 mb-4">
                {item.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h4>
              {item.lines.map((line, i) => (
                <p key={i} className="text-sm text-gray-700">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
