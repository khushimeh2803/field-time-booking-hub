
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Star as StarIcon, X, Check, Filter } from "lucide-react";
import { format } from "date-fns";

// Simulated bookings data
const bookingsData = [
  {
    id: 1,
    groundName: "Green Valley Stadium",
    sport: "football",
    date: new Date("2023-09-15"),
    timeSlots: ["18:00 - 19:00", "19:00 - 20:00"],
    price: 160,
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
    address: "123 Sports Avenue, Stadium District",
    paymentMethod: "Pay at Venue",
    completed: true,
    rated: true,
    rating: 4
  },
  {
    id: 2,
    groundName: "Central Sports Hub",
    sport: "football",
    date: new Date("2023-09-22"),
    timeSlots: ["10:00 - 11:00"],
    price: 65,
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "45 Central Park Road, Downtown",
    paymentMethod: "Credit Card",
    completed: false,
    rated: false,
    rating: 0
  },
  {
    id: 3,
    groundName: "Cricket Oval",
    sport: "cricket",
    date: new Date("2023-09-18"),
    timeSlots: ["14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"],
    price: 360,
    status: "pending",
    image: "https://images.unsplash.com/photo-1554178286-2d4133387b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "256 Boundary Road, Sports Village",
    paymentMethod: "Pay at Venue",
    completed: false,
    rated: false,
    rating: 0
  },
  {
    id: 4,
    groundName: "Elite Badminton Center",
    sport: "badminton",
    date: new Date("2023-09-10"),
    timeSlots: ["17:00 - 18:00", "18:00 - 19:00"],
    price: 70,
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "47 Racquet Avenue, Sportsville",
    paymentMethod: "Credit Card",
    completed: true,
    rated: false,
    rating: 0
  }
];

const MyBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [bookings, setBookings] = useState(bookingsData);
  const [showFilters, setShowFilters] = useState(false);

  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    // Filter by search term
    const matchesSearch = booking.groundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by sport
    const matchesSport = !selectedSport || booking.sport === selectedSport;
    
    // Filter by status
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  // Handle rating a booking
  const handleRateBooking = (bookingId: number, rating: number) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, rated: true, rating } 
        : booking
    ));
  };

  // Handle requesting cancellation
  const handleCancellationRequest = (bookingId: number) => {
    // In a real app, this would send a request to the backend
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredBookings.length} bookings
            </p>
          </div>

          {/* Bookings List */}
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

          {/* Empty State */}
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
