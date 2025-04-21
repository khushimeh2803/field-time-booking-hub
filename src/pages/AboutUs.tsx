
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>What drives us forward</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                At Sports Ground Booking, our mission is to connect sports enthusiasts with quality facilities. 
                We believe that everyone should have easy access to sports venues, promoting an active and 
                healthy lifestyle across communities.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>How we started</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Founded in 2023, Sports Ground Booking emerged from a simple frustration: finding and booking sports 
                facilities was unnecessarily complicated. Our founders, all passionate sports players, decided to 
                create a solution that would make the process seamless and efficient.
              </p>
              <p>
                What began as a small project has now grown into a comprehensive platform connecting thousands of 
                players with hundreds of venues across the country. Our journey is driven by our users' feedback 
                and our continuous commitment to improvement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
              <CardDescription>The people behind the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our diverse team brings together expertise in sports management, technology, and customer service. 
                We're united by our passion for sports and our commitment to creating an exceptional user experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3"></div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <p className="text-sm text-gray-500">CEO & Co-founder</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3"></div>
                  <h3 className="font-semibold">Michael Chen</h3>
                  <p className="text-sm text-gray-500">CTO & Co-founder</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3"></div>
                  <h3 className="font-semibold">Elena Rodriguez</h3>
                  <p className="text-sm text-gray-500">Head of Operations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>What we stand for</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Accessibility:</strong> Making sports venues accessible to everyone</li>
                <li><strong>Community:</strong> Building connections through sports</li>
                <li><strong>Innovation:</strong> Constantly improving our platform</li>
                <li><strong>Reliability:</strong> Providing dependable service for venues and users</li>
                <li><strong>Sustainability:</strong> Promoting environmentally responsible practices</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
