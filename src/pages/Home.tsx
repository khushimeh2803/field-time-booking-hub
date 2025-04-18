
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Award, Clock, Shield, CreditCard } from "lucide-react";

const Home = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526232373132-0e4ee16ea28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80')] bg-cover mix-blend-overlay opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Book Sports Grounds with Ease</h1>
            <p className="text-xl mb-8">Find and book the perfect sports facility for your game. Football, cricket, basketball, and more - all in one place.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/grounds">
                <Button className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">Book a Ground</Button>
              </Link>
              <Link to="/membership">
                <Button variant="outline" className="bg-white/10 border-white hover:bg-white/20 text-white text-lg px-8 py-6">Join Membership</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Sports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Football", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80" },
              { name: "Cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1647&q=80" },
              { name: "Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80" },
              { name: "Badminton", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80" },
            ].map((sport) => (
              <Link 
                key={sport.name} 
                to={`/sports/${sport.name.toLowerCase()}`}
                className="group relative rounded-xl overflow-hidden shadow-lg h-60 hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={sport.image} 
                  alt={sport.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white text-xl font-semibold">{sport.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Pitch Perfect</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">We make booking sports facilities simple, fast, and reliable.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">Book your preferred sports ground with just a few clicks. Simple and hassle-free.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-muted-foreground">Choose from a wide range of grounds and sports facilities across multiple locations.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Venues</h3>
              <p className="text-muted-foreground">We partner with only the best venues to ensure quality sports experience for all users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <MapPin />, title: "Find a Ground", description: "Browse through our extensive collection of sports grounds." },
              { icon: <CalendarDays />, title: "Select Date & Time", description: "Choose your preferred date and time slots for your activity." },
              { icon: <CreditCard />, title: "Make Payment", description: "Secure your booking with our simple payment process." },
              { icon: <Clock />, title: "Play & Enjoy", description: "Arrive at the venue and enjoy your game without any hassle." },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="bg-white w-16 h-16 rounded-full shadow-md flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-300"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Become a Member Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Get exclusive benefits, discounts, and priority booking with our membership plans.</p>
          <Link to="/membership">
            <Button className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">View Membership Plans</Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
