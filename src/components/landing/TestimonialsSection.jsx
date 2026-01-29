import { Star } from "lucide-react";

const TestimonialsSection = ({ testimonials }) => {
  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Are Saying
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Hear from our satisfied users about their experience with
            CloudShare.
          </p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lx shadow-sm hover:shadow-md  transform transition-shadow duration-500 hover:scale-105 "
            >
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex shring-0 h-12 w-12">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} 
                            size={16}
                            className={`${i < testimonial.rating ? 'text-yellow-400': 'test-gray-300'} fill-current`}/>
                    ))}
                </div>
                <blockquote className="mt-4"> 
                    <p className="text-base italic text-gray-600">
                        "{testimonial.quote}"
                    </p>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
