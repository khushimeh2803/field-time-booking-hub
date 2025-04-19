
import MainLayout from "@/components/layout/MainLayout";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Pitch Perfect</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              At Pitch Perfect, our mission is to connect sports enthusiasts with the best playing facilities. 
              We believe that everyone should have easy access to quality sports grounds, regardless of their skill level. 
              Our platform simplifies the booking process, making it effortless to find and reserve sports venues.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Founded in 2023, Pitch Perfect began with a simple observation: booking sports grounds was unnecessarily complicated. 
              Our founders, all avid sports players, experienced firsthand the frustrations of finding and securing playing venues. 
              This led to the creation of a streamlined platform where users can discover, book, and pay for sports facilities in just a few clicks.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-2">Accessibility</h3>
                <p className="text-gray-700">Making sports venues available to everyone, everywhere.</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-2">Community</h3>
                <p className="text-gray-700">Building connections through shared passion for sports.</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-2">Quality</h3>
                <p className="text-gray-700">Ensuring high standards for all listed facilities.</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-2">Innovation</h3>
                <p className="text-gray-700">Continuously improving our platform with cutting-edge technology.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium">Alex Johnson</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium">Sarah Williams</h3>
                <p className="text-gray-600">Operations Director</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium">Michael Chen</h3>
                <p className="text-gray-600">Technology Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
