
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import DiscountOptions from "@/components/booking/DiscountOptions";
import PromoCodeSection from "@/components/booking/PromoCodeSection";
import TermsAgreement from "@/components/booking/TermsAgreement";
import OrderSummary from "@/components/booking/OrderSummary";

// Map for time slots
const timeSlotMap: Record<string, string> = {
  "1": "08:00 - 09:00",
  "2": "09:00 - 10:00",
  "3": "10:00 - 11:00",
  "4": "11:00 - 12:00",
  "5": "12:00 - 13:00",
  "6": "13:00 - 14:00",
  "7": "14:00 - 15:00",
  "8": "15:00 - 16:00",
  "9": "16:00 - 17:00",
  "10": "17:00 - 18:00",
  "11": "18:00 - 19:00",
  "12": "19:00 - 20:00",
  "13": "20:00 - 21:00",
  "14": "21:00 - 22:00"
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Booking details
  const [groundId, setGroundId] = useState<string | null>(null);
  const [groundData, setGroundData] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  
  // Payment details
  const [paymentMethod, setPaymentMethod] = useState("venue");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number } | null>(null);
  const [total, setTotal] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Membership details
  const [hasMembership, setHasMembership] = useState(false);
  const [applyMembership, setApplyMembership] = useState(false);
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  
  // Feedback history - for 10% discount if user has provided feedback previously
  const [hasFeedbackHistory, setHasFeedbackHistory] = useState(false);
  const [applyFeedbackDiscount, setApplyFeedbackDiscount] = useState(false);
  const [feedbackDiscount] = useState(10); // Fixed 10% discount for feedback
  
  // For card payment (mock)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  
  // Available promo codes from database
  const [availablePromoCodes, setAvailablePromoCodes] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gId = params.get("groundId");
    const dateStr = params.get("date");
    const slots = params.get("slots");
    const priceParam = params.get("price");

    if (gId) {
      setGroundId(gId);
      fetchGroundDetails(gId);
    }
    
    if (dateStr) {
      try {
        setBookingDate(new Date(dateStr));
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    }
    
    if (slots) {
      const slotArray = slots.split(",");
      setSelectedSlots(slotArray);
      setTotalHours(slotArray.length);
    }

    // If price is passed directly from ground details
    if (priceParam) {
      const price = parseFloat(priceParam);
      if (!isNaN(price)) {
        const slotsCount = slots ? slots.split(",").length : 0;
        const initialSubtotal = price * slotsCount;
        setSubtotal(initialSubtotal);
        setTotal(initialSubtotal);
      }
    }
    
    // Check if user has membership and fetch available promo codes
    checkUserMembership();
    fetchPromoCodes();
    checkUserFeedbackHistory();
  }, [location.search]);

  // Check if user has a feedback history for discount eligibility
  const checkUserFeedbackHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has submitted any feedback
      const { data: feedbackData, error } = await supabase
        .from('booking_feedback')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) throw error;
      
      // If user has feedback history, they are eligible for a 10% discount
      if (feedbackData && feedbackData.length > 0) {
        setHasFeedbackHistory(true);
      }
    } catch (error) {
      console.error("Error checking feedback history:", error);
    }
  };

  // Fetch ground details from Supabase
  const fetchGroundDetails = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('grounds')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setGroundData(data);
        
        // Calculate initial price if not already set by URL param
        if (selectedSlots.length > 0 && subtotal === 0) {
          const initialSubtotal = data.price_per_hour * selectedSlots.length;
          setSubtotal(initialSubtotal);
          setTotal(initialSubtotal);
        }
      }
    } catch (error) {
      console.error("Error fetching ground details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ground details."
      });
    }
  };

  // Check if user has an active membership
  const checkUserMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Check for active membership
      const { data: memberships, error } = await supabase
        .from('user_memberships')
        .select('*, membership_plans(discount_percentage)')
        .eq('user_id', user.id)
        .gte('end_date', today)
        .lt('start_date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking membership:", error);
        return;
      }
      
      if (memberships) {
        setHasMembership(true);
        setMembershipDiscount(memberships.membership_plans.discount_percentage || 0);
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
    }
  };

  // Fetch valid promo codes from the database
  const fetchPromoCodes = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', today)
        .gte('valid_until', today);
      
      if (error) throw error;
      
      setAvailablePromoCodes(data || []);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    const foundPromo = availablePromoCodes.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    
    if (foundPromo) {
      setAppliedPromo({
        code: foundPromo.code,
        discount: foundPromo.discount_percentage
      });
      
      // Calculate new total with promo discount
      calculateTotal(foundPromo.discount_percentage, applyMembership ? membershipDiscount : 0, applyFeedbackDiscount ? feedbackDiscount : 0);
      
      toast({
        title: "Promo Code Applied",
        description: `${foundPromo.code} applied with ${foundPromo.discount_percentage}% discount.`
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid or has expired."
      });
    }
  };

  // Remove applied promo
  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    calculateTotal(0, applyMembership ? membershipDiscount : 0, applyFeedbackDiscount ? feedbackDiscount : 0);
  };

  // Toggle membership application
  const toggleMembership = (checked: boolean) => {
    setApplyMembership(checked);
    calculateTotal(appliedPromo?.discount || 0, checked ? membershipDiscount : 0, applyFeedbackDiscount ? feedbackDiscount : 0);
  };

  // Toggle feedback discount application
  const toggleFeedbackDiscount = (checked: boolean) => {
    setApplyFeedbackDiscount(checked);
    calculateTotal(appliedPromo?.discount || 0, applyMembership ? membershipDiscount : 0, checked ? feedbackDiscount : 0);
  };

  // Calculate total price with all applicable discounts
  const calculateTotal = (promoDiscount: number, membershipDiscount: number, feedbackDiscount: number) => {
    let discountedTotal = subtotal;
    
    // Apply promo code discount first
    if (promoDiscount > 0) {
      const promoDiscountAmount = (subtotal * promoDiscount) / 100;
      discountedTotal -= promoDiscountAmount;
    }
    
    // Then apply membership discount on already discounted amount if any
    if (membershipDiscount > 0) {
      const membershipDiscountAmount = (discountedTotal * membershipDiscount) / 100;
      discountedTotal -= membershipDiscountAmount;
    }
    
    // Finally apply feedback discount if applicable
    if (feedbackDiscount > 0) {
      const feedbackDiscountAmount = (discountedTotal * feedbackDiscount) / 100;
      discountedTotal -= feedbackDiscountAmount;
    }
    
    setTotal(discountedTotal);
  };

  // Handle booking submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms & Conditions",
        description: "You must accept the terms and conditions to proceed."
      });
      return;
    }

    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to make a booking."
        });
        return;
      }

      if (!groundId || !bookingDate || selectedSlots.length === 0) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please ensure all booking details are filled correctly."
        });
        return;
      }

      // Example start and end times from first and last slot
      const firstSlot = timeSlotMap[selectedSlots[0]].split(" - ")[0];
      const lastSlot = timeSlotMap[selectedSlots[selectedSlots.length - 1]].split(" - ")[1];

      // Create booking in Supabase
      const { data: bookingData, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          ground_id: groundId,
          booking_date: bookingDate?.toISOString().split('T')[0],
          start_time: firstSlot,
          end_time: lastSlot,
          status: "pending",
          payment_status: paymentMethod === "card" ? "paid" : "pending",
          total_amount: total,
          promo_code: appliedPromo?.code || null,
          membership_applied: applyMembership
        })
        .select();

      if (error) {
        console.error("Booking error:", error);
        throw error;
      }

      toast({
        title: "Booking Successful",
        description: "Your booking has been successfully created!"
      });
      
      // Navigate to booking confirmation
      navigate("/my-bookings");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Failed to create your booking. Please try again."
      });
    }
  };

  // Card details object for the PaymentMethodSelector component
  const cardDetails = {
    cardName,
    cardNumber,
    cardExpiry,
    cardCvc
  };

  // Card details setters for the PaymentMethodSelector component
  const setCardDetails = {
    setCardName,
    setCardNumber,
    setCardExpiry,
    setCardCvc
  };

  return (
    <MainLayout>
      <BookingHeader 
        title="Complete Your Booking" 
        description="You're just a few steps away from securing your sports venue."
      />

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
                
                {/* Booking Summary Component */}
                <BookingSummary 
                  groundData={groundData} 
                  bookingDate={bookingDate} 
                  selectedSlots={selectedSlots} 
                  timeSlotMap={timeSlotMap} 
                />
                
                <form onSubmit={handleSubmitBooking}>
                  {/* Payment Method Component */}
                  <PaymentMethodSelector 
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    cardDetails={cardDetails}
                    setCardDetails={setCardDetails}
                  />
                  
                  {/* Discount Options Component */}
                  <DiscountOptions 
                    hasFeedbackHistory={hasFeedbackHistory}
                    applyFeedbackDiscount={applyFeedbackDiscount}
                    toggleFeedbackDiscount={toggleFeedbackDiscount}
                    feedbackDiscount={feedbackDiscount}
                    hasMembership={hasMembership}
                    applyMembership={applyMembership}
                    toggleMembership={toggleMembership}
                    membershipDiscount={membershipDiscount}
                    subtotal={subtotal}
                  />
                  
                  {/* Promo Code Component */}
                  <PromoCodeSection 
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    appliedPromo={appliedPromo}
                    applyPromoCode={applyPromoCode}
                    removePromo={removePromo}
                  />
                  
                  {/* Terms and Agreement Component */}
                  <TermsAgreement 
                    acceptTerms={acceptTerms}
                    setAcceptTerms={setAcceptTerms}
                  />
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
                    disabled={!acceptTerms}
                  >
                    Complete Booking
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Order Summary Component */}
            <div>
              <OrderSummary 
                groundData={groundData}
                subtotal={subtotal}
                total={total}
                totalHours={totalHours}
                appliedPromo={appliedPromo}
                applyMembership={applyMembership}
                membershipDiscount={membershipDiscount}
                applyFeedbackDiscount={applyFeedbackDiscount}
                feedbackDiscount={feedbackDiscount}
                paymentMethod={paymentMethod}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Booking;
