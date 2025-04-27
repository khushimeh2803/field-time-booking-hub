import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Star as StarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MyBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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

    fetchBookings();
  }, [toast]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.groundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = !selectedSport || booking.sport === selectedSport;
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  const handleRateBooking = (bookingId: number, rating: number) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, rated: true, rating } 
        : booking
    ));
  };

  const handleCancellationRequest = (bookingId: number) => {
    alert("Cancellation request sent to admin. You will be notified once processed.");
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
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-2 rounded-lg"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  Filters
                </Button>
                
                <Select 
                  value={selectedSport} 
                  onValueChange={setSelectedSport}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredBookings.length} bookings
            </p>
          </div>

          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/4 h-48 md:h-auto relative">
                    <img 
                      src={booking.image} 
                      alt={booking.groundName} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded text-xs font-medium text-white ${
                      booking.status === 'confirmed' ? 'bg-green-500' :
                      booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {booking.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-6 md:w-3/4">
                    <div className="md:flex justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{booking.groundName}</h3>
                        <p className="text-muted-foreground capitalize">{booking.sport}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <p className="font-bold text-lg">${booking.price}</p>
                        <p className="text-sm text-muted-foreground">{booking.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm text-muted-foreground">{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {format(booking.date, "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {booking.timeSlots.join(", ")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                      {booking.completed ? (
                        booking.rated ? (
                          <div className="flex items-center">
                            <span className="mr-2">Your Rating:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon 
                                  key={star} 
                                  className={`h-5 w-5 ${star <= booking.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="mr-2">Rate your experience:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star}
                                  onClick={() => handleRateBooking(booking.id, star)}
                                  className="focus:outline-none"
                                >
                                  <StarIcon 
                                    className="h-5 w-5 text-gray-300 hover:text-yellow-500 hover:fill-current"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {new Date() > booking.date 
                            ? "Your booking date has passed"
                            : `${Math.ceil((booking.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until your booking`
                          }
                        </div>
                      )}
                      
                      {booking.status === 'confirmed' && !booking.completed && (
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleCancellationRequest(booking.id)}
                        >
                          Request Cancellation
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground mb-6">You don't have any bookings matching your filters.</p>
              <Button asChild>
                <a href="/grounds">Book a Ground Now</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default MyBookings;
