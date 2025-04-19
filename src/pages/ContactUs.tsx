
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { name, email, message }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or suggestions? We'd love to hear from you!
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Email Us</h3>
                </div>
                <p className="text-muted-foreground">
                  Our friendly team is here to help.
                </p>
                <a href="mailto:hello@pitchperfect.com" className="text-primary font-medium block mt-2">
                  hello@pitchperfect.com
                </a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Call Us</h3>
                </div>
                <p className="text-muted-foreground">
                  Mon-Fri from 8am to 5pm
                </p>
                <a href="tel:+123456789" className="text-primary font-medium block mt-2">
                  +1 (234) 567-89
                </a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Visit Us</h3>
                </div>
                <p className="text-muted-foreground">
                  Come say hello at our office
                </p>
                <address className="text-primary font-medium block mt-2 not-italic">
                  123 Sports Avenue<br />
                  Stadium District<br />
                  Sport City, SP 12345
                </address>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
                    Your name
                  </label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Your email
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
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Your message
                  </label>
                  <Textarea 
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={6}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUs;
