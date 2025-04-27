
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAfter, isBefore, set } from 'date-fns';

const Booking = () => {
  const [groundId, setGroundId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [membershipApplied, setMembershipApplied] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      } else {
        toast({
          title: "Authentication Required",
          description: "Please login to book a ground",
          variant: "destructive"
        });
        navigate('/signin');
      }
    };
    
    fetchCurrentUser();
  }, [navigate, toast]);

  const validateBookingTime = () => {
    if (!selectedDate || !startTime || !endTime) {
      toast({
        title: "Validation Error",
        description: "Please select a date and time slots",
        variant: "destructive"
      });
      return false;
    }

    const now = new Date();
    const selectedDateTime = set(selectedDate, {
      hours: parseInt(startTime.split(':')[0]),
      minutes: parseInt(startTime.split(':')[1])
    });

    if (isBefore(selectedDateTime, now)) {
      toast({
        title: "Invalid Time",
        description: "You can only book for current or future times",
        variant: "destructive"
      });
      return false;
    }

    // Validate that end time is after start time
    const endDateTime = set(selectedDate, {
      hours: parseInt(endTime.split(':')[0]),
      minutes: parseInt(endTime.split(':')[1])
    });

    if (!isAfter(endDateTime, selectedDateTime)) {
      toast({
        title: "Invalid Time Selection",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to make a booking",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    if (!validateBookingTime()) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            ground_id: groundId,
            booking_date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            start_time: startTime,
            end_time: endTime,
            total_amount: totalAmount,
            payment_status: 'pending',
            status: 'pending',
            promo_code: promoCode,
            membership_applied: membershipApplied,
            user_id: userId,
          },
        ]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create booking: " + error.message,
          variant: "destructive"
        });
        console.error("Error creating booking:", error);
      } else {
        toast({
          title: "Success",
          description: "Booking created successfully!",
        });
        console.log("Booking created successfully:", data);
        // Redirect to payment page
        navigate('/payment');
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book a Ground</h1>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="ground-id">Ground ID</Label>
          <Input
            id="ground-id"
            type="text"
            value={groundId}
            onChange={(e) => setGroundId(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="total-amount">Total Amount</Label>
          <Input
            id="total-amount"
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="promo-code">Promo Code</Label>
          <Input
            id="promo-code"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="membership" 
            checked={membershipApplied}
            onCheckedChange={(checked) => setMembershipApplied(checked === true)}
          />
          <Label htmlFor="membership">Apply Membership</Label>
        </div>

        <Button onClick={handleBooking} className="w-full">Create Booking</Button>
      </div>
    </div>
  );
};

export default Booking;
