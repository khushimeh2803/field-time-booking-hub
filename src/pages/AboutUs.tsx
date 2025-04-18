
import MainLayout from "@/components/layout/MainLayout";

const AboutUs = () => {
  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Pitch Perfect</h1>
          <p className="text-xl max-w-2xl mx-auto">Your trusted partner in sports facility bookings</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Pitch Perfect, we believe that access to quality sports facilities should be simple and hassle-free. Our mission is to connect sports enthusiasts with the best venues while making the booking process seamless and efficient.
              </p>
              <p className="text-lg text-muted-foreground">
                Founded in 2024, we've grown to become the leading sports facility booking platform, serving thousands of athletes and sports enthusiasts across the region.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3"
                alt="Sports facility"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Quality Venues</h3>
                <p className="text-muted-foreground">
                  We partner with only the best sports facilities to ensure you have access to top-quality venues for your games.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
                <p className="text-muted-foreground">
                  Our platform makes it simple to find and book your preferred sports facility in just a few clicks.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Excellent Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is always ready to assist you with any queries or concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Alex Johnson", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3" },
              { name: "Sarah Williams", role: "Operations Manager", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3" },
              { name: "Michael Chen", role: "Tech Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3" },
              { name: "Emma Rodriguez", role: "Customer Relations", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3" }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            At Pitch Perfect, we're guided by a set of core values that define how we operate and serve our customers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold mb-4">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                We put our customers first, always striving to exceed expectations and provide the best possible service.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously innovate and improve our platform to provide the most seamless booking experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold mb-4">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in being transparent in all our operations, from pricing to policies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold mb-4">Community</h3>
              <p className="text-muted-foreground">
                We're building a community of sports enthusiasts and helping to promote active lifestyles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
