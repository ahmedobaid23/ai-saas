"use client;";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
  {
    name: "Sohaib Ahmed",
    avatar: "A",
    title: "Undergrad Software Engineer",
    description:
      "I have been using Genius for the past 6 months and it has helped me generate code for my projects. It has saved me a lot of time and effort.",
    url: "/sohaib.jpg",
  },
  {
    name: "Armaghan Shakir",
    avatar: "A",
    title: "Undergrad Software Engineer",
    description:
      "My Goto tool for generating images and code snippets. It has helped me a lot in almost all of my projects. I highly recommend it to everyone.",
    url: "/armaghan.jpg",
  },
  {
    name: "Usman Bashir",
    avatar: "usman.jpg",
    title: "Undergrad Software Engineer",
    description:
      "I can't imagine my life without Genius. The tool is amazing and works like a charm. I have been using it for a while now and it has helped me a lot.",
    url: "/usman.jpg",
  },
  {
    name: "Umar Abdullah",
    avatar: "A",
    title: "Undergrad Software Engineer",
    description:
      "My AI buddy. I have been using Genius for the past year and it has helped me generate code for my projects. It has saved me a lot of time and effort.",
    url: "/umar.jpg",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <Image
                  src={testimonial.url}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="text-lg">{testimonial.name}</p>
                  <p className="text-zinc-400 text-sm">{testimonial.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-2 px-0">
                {testimonial.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
