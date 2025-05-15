
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!name || !email || !message) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all fields."
        });
        return;
      }

      // Save to Supabase
      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        message
      });

      if (error) throw error;

      // Show success message
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us! We'll get back to you soon."
      });

      // Clear the form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Failed to send message. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have questions about our services or need assistance with your booking? 
            Get in touch with our team and we'll be happy to help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">support@pitchperfect.com</p>
                    <p className="text-muted-foreground">bookings@pitchperfect.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">+91 123 456 7890</p>
                    <p className="text-muted-foreground">+91 987 654 3210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-muted-foreground">
                      Pitch Perfect HQ, <br />
                      123 Sports Avenue, <br />
                      Bangalore - 560001, <br />
                      Karnataka, India
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="font-semibold mb-4">Working Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Find Us</h2>
            <div className="h-[400px] bg-muted rounded-lg overflow-hidden">
              {/* Replace with actual map component in production */}
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Interactive map would be displayed here</p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I book a sports ground?</h3>
                <p className="text-muted-foreground">
                  You can book a sports ground by creating an account, selecting your preferred 
                  sport and location, choosing available time slots, and completing the payment.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I cancel my booking?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your booking up to 24 hours before the scheduled time. 
                  Cancellations made after that may be subject to cancellation fees.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">What is the membership plan?</h3>
                <p className="text-muted-foreground">
                  Our membership plans offer discounts and priority booking for regular users. 
                  Check out our Membership page for more details on available plans.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I report issues with a booked facility?</h3>
                <p className="text-muted-foreground">
                  You can report any issues through the "My Bookings" section or by contacting 
                  our customer support team via email or phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUs;
