
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const useFetchBooking = () => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const navigate = useNavigate();
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

  return { loading, booking, user };
};
