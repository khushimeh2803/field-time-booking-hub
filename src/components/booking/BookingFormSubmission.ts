
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { timeSlotMap } from "@/utils/timeSlotUtils";

interface BookingFormSubmissionProps {
  groundId: string | null;
  bookingDate: Date | null;
  selectedSlots: string[];
  total: number;
  appliedPromo: { code: string, discount: number } | null;
  applyMembership: boolean;
  paymentMethod: string;
  acceptTerms: boolean;
}

export const useBookingSubmission = ({
  groundId,
  bookingDate,
  selectedSlots,
  total,
  appliedPromo,
  applyMembership,
  paymentMethod,
  acceptTerms
}: BookingFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms & Conditions",
        description: "You must accept the terms and conditions to proceed."
      });
      setIsSubmitting(false);
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
        setIsSubmitting(false);
        return;
      }

      if (!groundId || !bookingDate || selectedSlots.length === 0) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please ensure all booking details are filled correctly."
        });
        setIsSubmitting(false);
        return;
      }

      // Get start and end times from the first and last selected time slots
      let firstSlot = "";
      let lastSlot = "";
      
      // Safe access to time slots
      if (selectedSlots.length > 0) {
        const sortedSlots = [...selectedSlots].sort((a, b) => parseInt(a) - parseInt(b));
        const firstSlotId = sortedSlots[0];
        const lastSlotId = sortedSlots[sortedSlots.length - 1];
        
        if (timeSlotMap[firstSlotId] && timeSlotMap[lastSlotId]) {
          firstSlot = timeSlotMap[firstSlotId].split(" - ")[0];
          lastSlot = timeSlotMap[lastSlotId].split(" - ")[1];
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Time Slot",
            description: "One or more selected time slots is invalid."
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Missing Time Slots",
          description: "Please select at least one time slot."
        });
        setIsSubmitting(false);
        return;
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmitBooking, isSubmitting };
};
