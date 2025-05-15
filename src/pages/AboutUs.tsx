
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      bio: "Sports enthusiast with over 15 years of experience in sports facility management.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwYnVzaW5lc3NtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      fallback: "RK"
    },
    {
      name: "Priya Singh",
      role: "Operations Director",
      bio: "Former national-level athlete with a passion for making sports accessible to all.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwYnVzaW5lc3N3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      fallback: "PS"
    },
    {
      name: "Amit Patel",
      role: "Technology Head",
      bio: "Tech innovator focused on creating seamless digital experiences for sports lovers.",
      image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGluZGlhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      fallback: "AP"
    },
    {
      name: "Ritu Sharma",
      role: "Customer Relations",
      bio: "Dedicated to ensuring every customer has an exceptional booking experience.",
      image: "https://images.unsplash.com/photo-1619783524147-73bd4f71e076?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      fallback: "RS"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About SportVenue</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting sports enthusiasts with quality venues since 2020
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">
              SportVenue was born out of a simple frustration: finding and booking quality sports facilities in India was unnecessarily complicated. Our founders, avid sports players themselves, often found themselves making countless phone calls, dealing with unreliable bookings, and facing opaque pricing when trying to arrange matches with friends.
            </p>
            <p className="mb-4">
              In 2020, we set out to solve this problem by creating a platform that brings transparency, convenience, and reliability to sports venue bookings. Starting with just 5 football grounds in Mumbai, we've now expanded to cover multiple sports across major cities in India.
            </p>
            <p>
              Our mission is to make quality sports facilities accessible to everyone, supporting both casual players and professional athletes. We believe in the power of sports to transform lives and communities, and we're committed to making participation as easy as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  We believe sports should be accessible to everyone, regardless of skill level or background. We work to ensure our platform and venues are inclusive and welcoming.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  From pricing to facility features, we provide clear and honest information so you can make informed decisions about where to play.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We're building more than a booking platform; we're fostering a community of sports enthusiasts who share our passion for active living.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">250+</p>
              <p className="text-lg font-medium">Sports Venues</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">12</p>
              <p className="text-lg font-medium">Cities Across India</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">50,000+</p>
              <p className="text-lg font-medium">Monthly Bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl text-muted-foreground mb-8">
            To create a nation where quality sports facilities are just a click away for everyone.
          </p>
          <p className="text-muted-foreground">
            We envision a future where every neighborhood has access to well-maintained sports venues, where booking a game is as easy as ordering food, and where people of all ages prioritize physical activity as part of a healthy lifestyle.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
