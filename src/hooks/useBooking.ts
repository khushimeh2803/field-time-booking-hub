
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isAfter, isBefore, set } from 'date-fns';

export const useBooking = () => {
  const [groundId, setGroundId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [promoCode, setPromoCode] = useState<string>('');
  const [membershipApplied, setMembershipApplied] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  const validateBookingTime = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      toast({
        title: "Validation Error",
        description: "Please select a date and time slots",
        variant: "destructive"
      });
      return false;
    }

    const now = new Date();
    const selectedDateTime = set(selectedDate, {
      hours: parseInt(selectedStartTime.split(':')[0]),
      minutes: parseInt(selectedStartTime.split(':')[1])
    });

    if (isBefore(selectedDateTime, now)) {
      toast({
        title: "Invalid Time",
        description: "You can only book for current or future times",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateBookingTime()) return;

    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to make a booking",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            ground_id: groundId,
            booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
            start_time: selectedStartTime,
            end_time: selectedEndTime,
            total_amount: totalAmount,
            payment_status: paymentStatus,
            promo_code: promoCode,
            membership_applied: membershipApplied,
            user_id: userId,
          },
        ]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create booking",
          variant: "destructive"
        });
        console.error("Error creating booking:", error);
      } else {
        toast({
          title: "Success",
          description: "Booking created successfully!",
        });
        console.log("Booking created successfully:", data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
      console.error("Error creating booking:", error);
    }
  };

  return {
    groundId,
    setGroundId,
    bookingDate,
    setBookingDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    totalAmount,
    setTotalAmount,
    paymentStatus,
    setPaymentStatus,
    promoCode,
    setPromoCode,
    membershipApplied,
    setMembershipApplied,
    selectedDate,
    setSelectedDate,
    selectedStartTime,
    setSelectedStartTime,
    selectedEndTime,
    setSelectedEndTime,
    handleBooking,
  };
};
