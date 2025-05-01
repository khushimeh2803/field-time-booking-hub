
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export const useMyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          grounds (
            name,
            address,
            images,
            sport_id (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBookings = data.map((booking: any) => ({
        id: booking.id,
        groundName: booking.grounds?.name || 'Unknown Ground',
        sport: booking.grounds?.sport_id?.name?.toLowerCase() || 'unknown',
        date: new Date(booking.booking_date),
        timeSlots: [`${booking.start_time} - ${booking.end_time}`],
        price: booking.total_amount,
        status: booking.status,
        image: booking.grounds?.images?.[0] || 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80',
        address: booking.grounds?.address || 'Address not available',
        paymentMethod: booking.payment_status === 'paid' ? 'Paid' : 'Pending',
        completed: new Date(booking.booking_date) < new Date(),
        rated: false,
        rating: 0
      }));

      setBookings(formattedBookings);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Set up real-time subscription to bookings updates
  useRealtimeSubscription({
    table: 'bookings',
    onEvent: () => {
      fetchBookings();
    },
  });

  const handleRateBooking = (bookingId: number, rating: number) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, rated: true, rating } 
        : booking
    ));
  };

  const handleCancellationRequest = (bookingId: number) => {
    toast({
      title: "Cancellation Request",
      description: "Cancellation request sent to admin. You will be notified once processed."
    });
  };

  return {
    bookings,
    loading,
    handleRateBooking,
    handleCancellationRequest
  };
};
