import { testimonials } from "../../constants";

const Testimonials = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center font-bold tracking-wide text-black mb-16">
          What People Are Saying
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-full sm:w-[45%] lg:w-[30%] bg-[#f4f7fa] rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <p className="text-neutral-700 text-base leading-relaxed italic mb-6">
                “{testimonial.text}”
              </p>

              <div className="flex items-center gap-4 mt-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.user}
                  className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                />
                <div>
                  <h5 className="text-lg font-semibold text-black">
                    {testimonial.user}
                  </h5>
                  <p className="text-sm text-neutral-500 italic">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
