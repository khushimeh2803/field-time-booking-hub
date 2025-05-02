
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingCard from "@/components/booking/BookingCard";
import BookingFilters from "@/components/booking/BookingFilters";
import RecentBookings from "@/components/booking/RecentBookings";
import EmptyBookingState from "@/components/booking/EmptyBookingState";

const MyBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sports, setSports] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchSports();
  }, []);

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

            return {
              id: String(booking.id), // Ensure ID is explicitly converted to string
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
              rated: false,
              rating: 0,
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

  // Handle rating a booking
  const handleRateBooking = (bookingId: string, rating: number) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, rated: true, rating } 
        : booking
    ));
    
    // Here you would also save the rating to the database
    toast({
      title: "Thank You!",
      description: "Your rating has been submitted.",
    });
  };

  // Handle requesting cancellation
  const handleCancellationRequest = (bookingId: string) => {
    // In a real app, this would send a request to the backend
    toast({
      title: "Cancellation Request Sent",
      description: "Your request has been submitted to admin. You will be notified once processed.",
    });
  };

  // Recent bookings (show 2 most recent ones)
  const recentBookings = [...bookings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 2);

  // Get sport name from id
  const getSportName = (sportId: string) => {
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : "Unknown Sport";
  };

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Manage and track all your sports facility bookings.
          </p>
        </div>
      </section>

      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          {/* Recent Bookings Component */}
          <RecentBookings bookings={recentBookings} />

          {/* Filters Component */}
          <BookingFilters
            sports={sports}
            searchTerm={searchTerm}
            selectedSport={selectedSport}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onSportChange={setSelectedSport}
            onStatusChange={setStatusFilter}
          />

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? "Loading your bookings..." : `Showing ${filteredBookings.length} bookings`}
            </p>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                sportName={getSportName(booking.sport)}
                onRateBooking={handleRateBooking}
                onCancellationRequest={handleCancellationRequest}
              />
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && filteredBookings.length === 0 && (
            <EmptyBookingState />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default MyBookings;
