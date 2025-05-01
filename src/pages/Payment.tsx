
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import PaymentModeSelector from "@/components/payment/PaymentModeSelector";
import CardDetailsForm from "@/components/payment/CardDetailsForm";
import PromoCodeForm from "@/components/payment/PromoCodeForm";
import MembershipDiscount from "@/components/payment/MembershipDiscount";
import TermsAndConditions from "@/components/payment/TermsAndConditions";
import PriceSummary from "@/components/payment/PriceSummary";
import BookingSummary from "@/components/payment/BookingSummary";
import PaymentReceipt from "@/components/payment/PaymentReceipt";

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('venue');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [membershipName, setMembershipName] = useState('');
  const [user, setUser] = useState<any>(null);
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Fetch the latest booking and user info
  useEffect(() => {
    const fetchBookingAndUser = async () => {
      try {
        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to complete payment",
            variant: "destructive"
          });
          navigate('/signin');
          return;
        }
        
        const userId = sessionData.session.user.id;
        setUser(sessionData.session.user);
        
        // Fetch user profile for receipt
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single();
        
        // Get latest booking for this user
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            grounds (
              name,
              address,
              price_per_hour,
              sport_id (name)
            )
          `)
          .eq('user_id', userId)
          .eq('payment_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (bookingError || !bookingData) {
          toast({
            title: "No Pending Booking Found",
            description: "No recent booking was found for payment",
            variant: "destructive"
          });
          navigate('/grounds');
          return;
        }
        
        // Format booking data
        const formattedBooking = {
          ...bookingData,
          groundName: bookingData.grounds?.name || 'Unknown Ground',
          address: bookingData.grounds?.address || 'Address not available',
          price: bookingData.total_amount,
          formattedDate: format(new Date(bookingData.booking_date), 'EEEE, MMMM d, yyyy'),
          formattedTime: `${bookingData.start_time} - ${bookingData.end_time}`,
          userName: profileData?.full_name || 'User'
        };
        
        setBooking(formattedBooking);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive"
        });
        console.error("Error fetching booking:", error);
        navigate('/grounds');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndUser();
  }, [navigate, toast]);

  // Calculate final price with discounts
  const calculateFinalPrice = () => {
    if (!booking) return 0;
    
    const subtotal = booking.total_amount;
    const promoDiscountAmount = (subtotal * promoDiscount) / 100;
    const membershipDiscountAmount = (subtotal * membershipDiscount) / 100;
    
    // Apply both discounts
    return subtotal - promoDiscountAmount - membershipDiscountAmount;
  };

  // Handle promo code application
  const handlePromoApplied = (discount: number, code: string) => {
    setPromoDiscount(discount);
    setPromoCode(code);
  };

  // Handle membership discount application
  const handleMembershipApplied = (discount: number, name: string) => {
    setMembershipDiscount(discount);
    setMembershipName(name);
  };

  // Complete payment process
  const handleCompletePayment = async () => {
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "You must accept the Terms and Conditions to proceed"
      });
      return;
    }

    try {
      setProcessing(true);
      
      const finalAmount = calculateFinalPrice();
      
      // Update booking with payment details
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'paid',
          status: 'confirmed',
          total_amount: finalAmount,
          promo_code: promoCode || null,
          membership_applied: membershipDiscount > 0
        })
        .eq('id', booking.id);

      if (error) throw error;
      
      // Create receipt details for download
      setReceiptDetails({
        id: booking.id,
        groundName: booking.groundName,
        date: booking.formattedDate,
        time: booking.formattedTime,
        totalAmount: finalAmount,
        paymentMethod: paymentMethod === 'venue' ? 'Pay at Venue' : 'Credit Card',
        promoCode: promoCode || undefined,
        membershipApplied: membershipName || undefined,
        userName: booking.userName
      });
      
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed."
      });
      
      setPaymentComplete(true);
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Navigate to My Bookings
  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {paymentComplete ? "Payment Complete" : "Complete Payment"}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {paymentComplete 
              ? "Thank you for your payment. Your booking is confirmed!" 
              : "Review your booking details and complete the payment process."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {!paymentComplete ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Booking Summary */}
              {booking && (
                <BookingSummary 
                  booking={{
                    groundName: booking.groundName,
                    date: booking.formattedDate,
                    time: booking.formattedTime,
                    address: booking.address
                  }}
                />
              )}
              
              {/* Payment Method Selection */}
              <PaymentModeSelector
                value={paymentMethod} 
                onChange={setPaymentMethod}
              />
              
              {/* Card Details Form (only shown when credit card is selected) */}
              <CardDetailsForm visible={paymentMethod === 'card'} />
              
              {/* Membership Discount - Auto applied if available */}
              {user && (
                <MembershipDiscount 
                  userId={user.id}
                  onMembershipApplied={handleMembershipApplied}
                />
              )}
              
              {/* Promo Code Input */}
              <PromoCodeForm onPromoApplied={handlePromoApplied} />
              
              {/* Price Summary */}
              <PriceSummary
                subtotal={booking ? booking.total_amount : 0}
                promoDiscount={promoDiscount}
                membershipDiscount={membershipDiscount}
                promoCode={promoCode}
                membershipName={membershipName}
                total={calculateFinalPrice()}
              />
              
              {/* Terms and Conditions */}
              <TermsAndConditions 
                accepted={termsAccepted}
                onAcceptChange={setTermsAccepted}
              />
              
              {/* Complete Payment Button */}
              <Button 
                onClick={handleCompletePayment} 
                className="w-full"
                disabled={processing || !termsAccepted}
              >
                {processing ? "Processing..." : `Complete Payment ($${calculateFinalPrice().toFixed(2)})`}
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Success Message */}
              <div className="text-center mb-8">
                <div className="inline-block mx-auto bg-green-100 text-green-800 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                <p className="text-muted-foreground mt-2">
                  Your booking has been confirmed and is ready for use.
                </p>
              </div>
              
              {/* Payment Receipt */}
              {receiptDetails && <PaymentReceipt bookingDetails={receiptDetails} />}
              
              {/* View Bookings Button */}
              <Button 
                onClick={handleViewBookings} 
                className="w-full"
              >
                View My Bookings
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Payment;
