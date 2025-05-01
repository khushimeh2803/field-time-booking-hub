
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePayment = (booking: any) => {
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('venue');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [membershipName, setMembershipName] = useState('');
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Calculate final price with discounts
  const calculateFinalPrice = () => {
    if (!booking) return 0;
    
    const subtotal = booking.total_amount;
    const promoDiscountAmount = (subtotal * promoDiscount) / 100;
    const membershipDiscountAmount = (subtotal * membershipDiscount) / 100;
    
    // Apply both discounts
    return subtotal - promoDiscountAmount - membershipDiscountAmount;
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

  return {
    processing,
    paymentComplete,
    paymentMethod,
    setPaymentMethod,
    termsAccepted,
    setTermsAccepted,
    promoDiscount,
    membershipDiscount,
    promoCode,
    membershipName,
    receiptDetails,
    handlePromoApplied,
    handleMembershipApplied,
    calculateFinalPrice,
    handleCompletePayment,
    handleViewBookings
  };
};
