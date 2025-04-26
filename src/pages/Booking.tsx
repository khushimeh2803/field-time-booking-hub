
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isAfter, isBefore, set } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
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

    // Validate that the selected date and time are in the future
    if (isBefore(selectedDateTime, now)) {
      toast({
        title: "Invalid Time",
        description: "You can only book for current or future times",
        variant: "destructive"
      });
      return false;
    }

    // Additional validation can be added here, such as checking ground's operating hours
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

  return (
    <div>
      <h1>Booking Page</h1>
      <Input
        type="text"
        placeholder="Ground ID"
        value={groundId}
        onChange={(e) => setGroundId(e.target.value)}
      />
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
      <Input
        type="text"
        placeholder="Start Time"
        value={selectedStartTime}
        onChange={(e) => setSelectedStartTime(e.target.value)}
      />
      <Input
        type="text"
        placeholder="End Time"
        value={selectedEndTime}
        onChange={(e) => setSelectedEndTime(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(Number(e.target.value))}
      />
      <Input
        type="text"
        placeholder="Payment Status"
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Promo Code"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      <div>
        <label>Membership Applied:</label>
        <input
          type="checkbox"
          checked={membershipApplied}
          onChange={(e) => setMembershipApplied(e.target.checked)}
        />
      </div>
      <Button onClick={handleBooking}>Create Booking</Button>
    </div>
  );
};

export default Booking;
