
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Sports Arena</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your premier destination for sports facility bookings and management
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Sports Arena was founded in 2020 with a simple mission: to make sports facility 
                booking easier, more accessible, and more efficient for both players and facility owners.
              </p>
              <p className="text-lg text-muted-foreground">
                What started as a small project to help local communities has grown into a comprehensive 
                platform connecting sports enthusiasts with quality facilities across the country.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80" 
                alt="Sports Arena Story" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe that access to quality sports facilities should be simple, transparent, and 
            stress-free. Our platform is designed to remove barriers between sports enthusiasts and 
            the perfect venues for their activities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplify Booking</h3>
              <p className="text-muted-foreground">
                Make the process of finding and booking sports facilities as simple as possible.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Communities</h3>
              <p className="text-muted-foreground">
                Build bridges between sports enthusiasts and quality facilities in their area.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ensure Quality</h3>
              <p className="text-muted-foreground">
                Maintain high standards for all facilities listed on our platform through rigorous vetting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12">
            Meet the passionate sports enthusiasts behind Sports Arena who are dedicated to improving 
            your sports facility booking experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
              {
                name: "Sarah Chen",
                role: "Chief Operations Officer",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
              {
                name: "Michael Lee",
                role: "Head of Technology",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
              {
                name: "Emily Rodriguez",
                role: "Customer Success",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto shadow-md">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of sports enthusiasts who have simplified their facility booking experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/grounds">Browse Facilities</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 hover:bg-white/20">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
