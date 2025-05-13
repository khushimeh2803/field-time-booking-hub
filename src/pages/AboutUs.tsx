
import MainLayout from "@/components/layout/MainLayout";

const AboutUs = () => {
  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We're passionate about connecting sports enthusiasts with the perfect venues to play the games they love.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                At PlayGround, our mission is to make sports accessible to everyone by simplifying the process of finding and booking sports facilities. 
                We believe that playing sports should be easy, enjoyable, and available to all, regardless of skill level or experience.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                PlayGround was founded in 2023 by a group of sports enthusiasts who were frustrated with the difficulty of finding and booking sports venues. 
                We realized that many great facilities were underutilized simply because people didn't know about them or found the booking process too complicated.
              </p>
              <p className="text-muted-foreground">
                What started as a simple idea has grown into a comprehensive platform connecting thousands of players with hundreds of venues across the country. 
                Our team comprises passionate sports lovers, tech innovators, and customer experience specialists working together to create the best possible platform for sports enthusiasts.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Easy discovery of sports venues in your area</li>
                <li>Seamless online booking and payment process</li>
                <li>Detailed information about facilities, amenities, and prices</li>
                <li>Member benefits and special discounts</li>
                <li>Ratings and reviews from real users</li>
                <li>Customer support to assist with bookings and inquiries</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">Making sports accessible to everyone, everywhere.</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">Building connections through the power of sports.</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Continuously improving our platform and services.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground">
                Whether you're a casual player looking for a weekend game, a serious athlete training regularly, or a facility owner wanting to reach more customers, 
                PlayGround is here to help. Join our growing community of sports enthusiasts and experience the joy of playing your favorite sports without the hassle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
