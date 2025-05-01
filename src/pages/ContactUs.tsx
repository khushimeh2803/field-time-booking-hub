
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Save contact submission to database
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name,
            email,
            phone,
            subject,
            message,
            status: 'new'
          }
        ]);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubject('General Inquiry');
      setSubmitted(true);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error submitting form",
        description: error.message || "Please try again later."
      });
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Our team is here to help!
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="text-green-600 h-8 w-8 mr-3" />
                    <h3 className="text-xl font-medium text-green-800">Message Sent!</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    Thank you for contacting us. We've received your message and will respond as soon as possible.
                  </p>
                  <Button 
                    variant="outline" 
                    className="text-green-700 border-green-300 hover:bg-green-50"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Your Name *</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Email Address *</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium">Subject</label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Booking Issue">Booking Issue</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">Message *</label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="How can we help you today?"
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Our Address</h3>
                    <p className="text-gray-600">
                      123 Sports Avenue<br />
                      Bangalore, Karnataka 560001<br />
                      India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-600">
                      Customer Support: +91 80 1234 5678<br />
                      Business Inquiries: +91 80 8765 4321
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-600">
                      General Information: info@sportspot.com<br />
                      Customer Support: support@sportspot.com<br />
                      Partnerships: partnerships@sportspot.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 8:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-gray-500 text-sm mt-1">All times are in IST (GMT+5:30)</p>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8">
                <h3 className="font-medium mb-3">Find Us on the Map</h3>
                <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124435.93094833352!2d77.56825777937586!3d12.953945596031627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1633857754864!5m2!1sen!2sus" 
                    className="w-full h-full border-0" 
                    loading="lazy"
                    title="SportSpot Location Map"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How do I book a sports venue?</h3>
              <p className="text-gray-600">Browse our available venues, select your preferred date and time, and complete the booking process online. You'll receive an immediate confirmation email with all the details.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Can I cancel or reschedule my booking?</h3>
              <p className="text-gray-600">Yes, you can cancel or reschedule your booking according to our cancellation policy. Cancellations made more than 48 hours in advance receive a full refund.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How can I list my sports venue on SportSpot?</h3>
              <p className="text-gray-600">If you own a sports venue and would like to list it on our platform, please contact our partnerships team at partnerships@sportspot.com for more information.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit/debit cards, UPI payments, and selected digital wallets. Some venues also offer pay-at-venue options.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactUs;
