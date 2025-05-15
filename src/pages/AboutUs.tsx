
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Pitch Perfect</h1>
          
          <div className="mb-12 relative">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzJTIwc3RhZGl1bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Sports Ground" 
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-white text-2xl font-bold">Your Premier Sports Ground Booking Platform</h2>
            </div>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground">
                Pitch Perfect was founded in 2023 with a simple mission: to make sports ground bookings accessible, 
                convenient, and hassle-free for everyone. What started as a small venture by a group of sports 
                enthusiasts has now grown into a comprehensive platform connecting sports facilities with players 
                across the country.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                At Pitch Perfect, we're on a mission to transform the way sports facilities are booked and 
                accessed. We believe that everyone should have the opportunity to play their favorite sports 
                without the hassle of lengthy booking processes or unavailability of facilities.
              </p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <Card className="p-6 text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-primary" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Access</h3>
                <p className="text-muted-foreground">Book sports facilities with just a few clicks, anytime, anywhere.</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-primary" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Time Efficiency</h3>
                <p className="text-muted-foreground">Save time with our streamlined booking process and real-time availability.</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-primary" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Variety</h3>
                <p className="text-muted-foreground">Access a wide range of sports facilities for all your favorite games.</p>
              </Card>
            </div>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Extensive network of premium sports grounds across multiple locations</li>
                <li>Real-time availability and instant booking confirmation</li>
                <li>Secure and flexible payment options</li>
                <li>Membership plans with exclusive discounts and benefits</li>
                <li>Dedicated customer support to assist with all your booking needs</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground">
                Our diverse team of sports enthusiasts, technology experts, and customer service professionals 
                work together to ensure that Pitch Perfect delivers the best booking experience for all users. 
                We're united by our passion for sports and our commitment to making sports facilities more 
                accessible to everyone.
              </p>
            </section>
            
            <section className="bg-muted p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Join Pitch Perfect Today</h2>
              <p className="text-muted-foreground mb-4">
                Whether you're looking to book a football field for your weekend match, a tennis court for your 
                practice session, or a cricket ground for your team's tournament, Pitch Perfect has got you covered. 
                Join thousands of satisfied users who have simplified their sports ground booking experience with us.
              </p>
              <div className="flex justify-center">
                <a href="/signup" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">Sign Up Now</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
