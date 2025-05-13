
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  groundName: string;
  sport: string;
  date: Date;
  timeSlots: string[];
  price: number;
  status: string;
  image: string;
  address: string;
  paymentMethod: string;
  completed: boolean;
  rated: boolean;
  rating: number;
  createdAt: string;
}

interface Sport {
  id: string;
  name: string;
}

export const useBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from("sports")
        .select("id, name");

      if (error) throw error;
      setSports(data || []);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to view your bookings",
        });
        return;
      }

      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_date,
          start_time,
          end_time,
          status,
          total_amount,
          payment_status,
          ground_id,
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch ground details for each booking
      if (bookingsData && bookingsData.length > 0) {
        const enhancedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            // Get ground details
            const { data: groundData } = await supabase
              .from("grounds")
              .select("name, address, sport_id, images")
              .eq("id", booking.ground_id)
              .single();

            // Format time slots
            const timeSlots = [`${booking.start_time} - ${booking.end_time}`];

            // Check if booking was already rated in feedback system
            const { data: feedbackData } = await supabase
              .from("booking_feedback")
              .select("rating")
              .eq("booking_id", booking.id.toString())
              .maybeSingle();

            return {
              id: booking.id.toString(),
              groundName: groundData?.name || "Unknown Ground",
              sport: groundData?.sport_id || "",
              date: new Date(booking.booking_date),
              timeSlots,
              price: parseFloat(booking.total_amount),
              status: booking.status,
              image: groundData?.images?.[0] || "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
              address: groundData?.address || "Address unavailable",
              paymentMethod: booking.payment_status === "paid" ? "Credit Card" : "Pay at Venue",
              completed: new Date() > new Date(booking.booking_date),
              rated: !!feedbackData,
              rating: feedbackData?.rating || 0,
              createdAt: booking.created_at
            };
          })
        );

        setBookings(enhancedBookings);
      } else {
        setBookings([]);
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load your bookings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rating a booking
  const handleRateBooking = async (bookingId: string, rating: number) => {
    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to rate a booking."
        });
        return;
      }

      // Save rating to the database
      const { error } = await supabase
        .from("booking_feedback")
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          rating: rating,
          feedback_date: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, rated: true, rating } 
          : booking
      ));
      
      toast({
        title: "Thank You!",
        description: "Your rating has been submitted.",
      });
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit your rating",
      });
    }
  };

  // Handle requesting cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      
      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled.",
      });

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" } 
          : booking
      ));
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to cancel your booking",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    // Filter by search term
    const matchesSearch = booking.groundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by sport
    const matchesSport = !selectedSport || selectedSport === "all" || booking.sport === selectedSport;
    
    // Filter by status
    const matchesStatus = !statusFilter || statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  // Recent bookings (show 2 most recent ones)
  const recentBookings = [...bookings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 2);

  // Get sport name from id
  const getSportName = (sportId: string) => {
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : "Unknown Sport";
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedSport,
    setSelectedSport,
    statusFilter,
    setStatusFilter,
    filteredBookings,
    recentBookings,
    sports,
    isLoading,
    isSubmitting,
    getSportName,
    handleRateBooking,
    handleCancelBooking
  };
};
