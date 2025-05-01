
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Check } from "lucide-react";

const AboutUs = () => {
  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Learn more about our mission to connect sports enthusiasts with the best facilities.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2020, Sports Ground Booking started with a simple mission: to make sports facilities more accessible to everyone. 
              We noticed how difficult it was to find and book quality sports venues, with outdated booking systems or phone-only reservations being the norm.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our founders, a group of sports enthusiasts and tech specialists, decided to create a platform that would bridge this gap. 
              Starting with just a few local facilities in New York, we've now expanded to over 300 venues across 15 cities.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we're proud to connect thousands of sports lovers with high-quality facilities every month, making it easier than ever to stay active and enjoy the sports you love.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission & Values</h2>
            
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Mission</h3>
              <p className="text-lg text-muted-foreground">
                To make sports accessible to everyone by providing a seamless platform that connects people with quality sports facilities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Core Values</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="bg-primary rounded-full p-1 mr-3 text-white">
                    <Check className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-medium">Accessibility</h4>
                    <p className="text-muted-foreground">We believe sports should be accessible to everyone, regardless of background or ability.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary rounded-full p-1 mr-3 text-white">
                    <Check className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-medium">Quality</h4>
                    <p className="text-muted-foreground">We partner only with facilities that meet our high standards for maintenance and service.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary rounded-full p-1 mr-3 text-white">
                    <Check className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-medium">Community</h4>
                    <p className="text-muted-foreground">We aim to foster local sports communities and encourage active lifestyles.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary rounded-full p-1 mr-3 text-white">
                    <Check className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-medium">Innovation</h4>
                    <p className="text-muted-foreground">We continuously improve our platform to provide the best user experience possible.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground mt-2">The people behind our mission</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Morgan",
                role: "CEO & Co-Founder",
                bio: "Former professional athlete with a passion for making sports accessible.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
              },
              {
                name: "Jordan Lee",
                role: "CTO & Co-Founder",
                bio: "Tech enthusiast who believes in using technology to improve everyday experiences.",
                image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
              {
                name: "Taylor Wong",
                role: "Head of Operations",
                bio: "Logistics expert ensuring our platform runs smoothly day in and day out.",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
              {
                name: "Jamie Rivera",
                role: "Community Manager",
                bio: "Sports enthusiast dedicated to building and nurturing our user community.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center" 
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
