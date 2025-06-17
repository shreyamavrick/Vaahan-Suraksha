import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import carTeam from "../../assets/car-team.png"; // update path as per your project

const tabData = [
  {
    id: "history",
    tabTitle: "Our History",
    heading: "Vaahan Suraksha Founded in 1999 at INDIA",
    description:
      "A wonderful serenity taken possession into entire soul also like these sweet morning spring which thing of an existence in this spot, created for the bliss of souls like ours.",
    bullets: [],
  },
  {
    id: "mission",
    tabTitle: "Our Mission",
    heading: "Our Mission: Innovating Vehicle Maintenance",
    description: "",
    bullets: [
      "Share best practices and hi-tech product knowledge",
      "Collaborate with technology",
      "Technology, information security, and business partners",
    ],
  },
  {
    id: "vision",
    tabTitle: "Our Vision",
    heading: "Our Vision: Transform the Automotive Experience",
    description: "",
    bullets: [
      "Deliver excellence in vehicle care solutions",
      "Customer-first innovation and approach",
      "Build sustainable and scalable service networks",
    ],
  },
];

const CompanyInfoSection = () => {
  const [activeTab, setActiveTab] = useState("history");

  const current = tabData.find((tab) => tab.id === activeTab);

  return (
    <section className="w-full px-4 md:px-12 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Tabs */}
        <div className="flex flex-col gap-6 w-full md:w-1/4">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-5 text-left text-lg font-semibold rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              <BookOpen />
              {tab.tabTitle}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="w-full md:w-3/4 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">{current.heading}</h2>
            <div className="h-1 w-14 bg-blue-500 rounded"></div>

            {current.description && (
              <p className="text-gray-700 text-lg">{current.description}</p>
            )}

            {current.bullets.length > 0 && (
              <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-800 text-base">
                {current.bullets.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1">
            <img
              src={carTeam}
              alt="Team working on car"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfoSection;
