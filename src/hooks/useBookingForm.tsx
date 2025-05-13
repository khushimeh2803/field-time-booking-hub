
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import custom hooks
import { useGroundDetails } from "@/hooks/useGroundDetails";
import { useDiscounts } from "@/hooks/useDiscounts";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";

// Import constants
import { timeSlotMap } from "@/constants/timeSlots";

// Re-export timeSlotMap for convenience
export { timeSlotMap };

export const useBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Booking details
  const [groundId, setGroundId] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Get authenticated user
  const [userId, setUserId] = useState<string | undefined>(undefined);
  
  // Fetch ground details
  const { groundData } = useGroundDetails(groundId);
  
  // Payment methods
  const { paymentMethod, setPaymentMethod, cardDetails, setCardDetails } = usePaymentMethod();
  
  // Discounts management
  const [discountState, discountActions] = useDiscounts(userId, subtotal, setTotal);

  // Check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };
    checkUser();
  }, []);

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gId = params.get("groundId");
    const dateStr = params.get("date");
    const slots = params.get("slots");
    const priceParam = params.get("price");

    if (gId) {
      setGroundId(gId);
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
  }, [location.search]);

  // Update subtotal when ground data is fetched
  useEffect(() => {
    if (groundData && selectedSlots.length > 0 && subtotal === 0) {
      const initialSubtotal = groundData.price_per_hour * selectedSlots.length;
      setSubtotal(initialSubtotal);
      setTotal(initialSubtotal);
    }
  }, [groundData, selectedSlots, subtotal]);

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
          promo_code: discountState.appliedPromo?.code || null,
          membership_applied: discountState.applyMembership
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

  return {
    groundData,
    bookingDate,
    selectedSlots,
    totalHours,
    subtotal,
    total,
    paymentMethod,
    setPaymentMethod,
    promoCode: discountState.promoCode,
    setPromoCode: discountActions.setPromoCode,
    appliedPromo: discountState.appliedPromo,
    applyPromoCode: discountActions.applyPromoCode,
    removePromo: discountActions.removePromo,
    hasMembership: discountState.hasMembership,
    applyMembership: discountState.applyMembership,
    toggleMembership: discountActions.toggleMembership,
    membershipDiscount: discountState.membershipDiscount,
    membershipDetails: discountState.membershipDetails,
    hasFeedbackHistory: discountState.hasFeedbackHistory,
    applyFeedbackDiscount: discountState.applyFeedbackDiscount,
    toggleFeedbackDiscount: discountActions.toggleFeedbackDiscount,
    feedbackDiscount: discountState.feedbackDiscount,
    acceptTerms,
    setAcceptTerms,
    cardDetails,
    setCardDetails,
    handleSubmitBooking
  };
};
