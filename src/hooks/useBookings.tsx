import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Export the Booking type so it can be used in other components
export interface Booking {
  id: string;
  groundName: string;
  image: string;
  date: Date;
  timeSlots: string[];
  status: string;
  price: number;
  address: string;
  sport: string;
  completed: boolean;
  rated: boolean;
  rating: number;
  paymentMethod: string;
}

export const useBookings = () => {
  // State management
  const [bookings, setBookings] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sports, setSports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Fetch bookings and sports data on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Fetch user bookings from Supabase
        const { data: userBookings, error } = await supabase
          .from("bookings")
          .select(`
            *,
            grounds (
              id,
              name,
              images,
              address,
              sport_id
            )
          `)
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false });

        if (error) throw error;
        
        // Set all bookings and recent bookings
        setBookings(userBookings || []);
        
        // Get only the most recent 3 bookings for the top section
        setRecentBookings((userBookings || []).slice(0, 3));
        
        // Fetch all sports for the sport filter
        const { data: sportsData } = await supabase
          .from("sports")
          .select("id, name");
        
        setSports(sportsData || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your bookings."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  // Filter bookings based on search term, selected sport, and status
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesSearch = booking.grounds?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = selectedSport 
      ? booking.grounds?.sport_id === selectedSport 
      : true;
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : booking.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  // Helper function to get sport name from sport ID
  const getSportName = (sportId: string): string => {
    const sport = sports.find((s: any) => s.id === sportId);
    return sport ? sport.name : "Unknown Sport";
  };

  // Handle rating a booking
  const handleRateBooking = async (bookingId: string, rating: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to rate a booking."
        });
        return;
      }

      // Check if user has already rated this booking
      const { data: existingRating } = await supabase
        .from("booking_feedback")
        .select("*")
        .eq("booking_id", bookingId)
        .eq("user_id", user.id)
        .single();
      
      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from("booking_feedback")
          .update({ rating })
          .eq("id", existingRating.id);
          
        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from("booking_feedback")
          .insert({
            booking_id: bookingId,
            user_id: user.id,
            rating
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Thank You!",
        description: "Your rating has been submitted successfully."
      });
      
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your rating."
      });
    }
  };

  // Handle canceling a booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
        
      if (error) throw error;
      
      // Update the local state to reflect the change
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: "cancelled" } 
            : booking
        )
      );
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully."
      });
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel your booking."
      });
    }
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
    getSportName,
    handleRateBooking,
    handleCancelBooking
  };
};
