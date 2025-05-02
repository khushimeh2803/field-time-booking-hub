import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign,
  Droplets,
  ParkingCircle,
  LampFloor,
  Car,
  Shirt,
  MonitorSmartphone,
  Utensils,
  ChevronLeft
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Map for amenity icons
const amenityIcons: Record<string, JSX.Element> = {
  "Changing Rooms": <Shirt />,
  "Showers": <Droplets />,
  "Floodlights": <LampFloor />,
  "Parking": <Car />,
  "Spectator Seating": <Users />,
  "Scoreboard": <MonitorSmartphone />,
  "Cafeteria": <Utensils />,
};

// Simulated available time slots (would fetch from backend in real app)
const availableTimeSlots = [
  { id: 1, time: "08:00 - 09:00", available: true },
  { id: 2, time: "09:00 - 10:00", available: true },
  { id: 3, time: "10:00 - 11:00", available: true },
  { id: 4, time: "11:00 - 12:00", available: false },
  { id: 5, time: "12:00 - 13:00", available: false },
  { id: 6, time: "13:00 - 14:00", available: true },
  { id: 7, time: "14:00 - 15:00", available: true },
  { id: 8, time: "15:00 - 16:00", available: true },
  { id: 9, time: "16:00 - 17:00", available: false },
  { id: 10, time: "17:00 - 18:00", available: true },
  { id: 11, time: "18:00 - 19:00", available: true },
  { id: 12, time: "19:00 - 20:00", available: true },
  { id: 13, time: "20:00 - 21:00", available: true },
  { id: 14, time: "21:00 - 22:00", available: true }
];

const GroundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ground, setGround] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeMembership, setActiveMembership] = useState<any>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  // Fetch ground details and user's active membership
  useEffect(() => {
    const fetchGroundDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch ground details
        const { data: groundData, error: groundError } = await supabase
          .from('grounds')
          .select(`
            *,
            sport_id(id, name)
          `)
          .eq('id', id)
          .single();
          
        if (groundError) throw groundError;
        if (!groundData) {
          toast({
            title: "Ground not found",
            description: "The requested ground could not be found.",
            variant: "destructive"
          });
          navigate('/grounds');
          return;
        }
        
        // Check if user has an active membership
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: membershipData } = await supabase
            .from('user_memberships')
            .select(`
              *,
              plan_id(id, name, discount_percentage)
            `)
            .eq('user_id', user.id)
            .gte('end_date', new Date().toISOString())
            .order('end_date', { ascending: false })
            .limit(1)
            .single();
          
          if (membershipData) {
            setActiveMembership(membershipData);
            setDiscountPercentage(membershipData.plan_id.discount_percentage || 0);
          }
        }
        
        // Format the ground data
        const formattedGround = {
          id: groundData.id,
          name: groundData.name,
          sport: groundData.sport_id?.name || 'Unknown',
          price: groundData.price_per_hour,
          images: groundData.images && groundData.images.length > 0 
            ? groundData.images 
            : ['https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80'],
          address: groundData.address,
          rating: 4.8, // Default rating
          totalRatings: 156, // Default number of ratings
          type: groundData.amenities && groundData.amenities.includes("Indoor") ? "Indoor" : "Outdoor",
          capacity: `${groundData.capacity} players`,
          amenities: groundData.amenities?.map((amenity: string) => ({
            name: amenity,
            icon: amenityIcons[amenity] || <Users />
          })) || [],
          availability: `${groundData.opening_time} - ${groundData.closing_time}`,
          description: groundData.description || "No description available.",
          // Default reviews - could be implemented with a real reviews system
          reviews: [
            { id: 1, user: "John D.", rating: 5, comment: "Excellent pitch, well-maintained and great facilities.", date: "2023-08-15" },
            { id: 2, user: "Sarah M.", rating: 4, comment: "Good facilities and helpful staff.", date: "2023-07-22" }
          ]
        };
        
        setGround(formattedGround);
      } catch (error) {
        console.error("Error fetching ground details:", error);
        toast({
          title: "Error",
          description: "Failed to load ground details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroundDetails();
  }, [id, toast, navigate]);

  const handleTimeSlotSelect = (slotId: number) => {
    if (selectedTimeSlots.includes(slotId)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== slotId));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slotId]);
    }
  };

  const calculateTotalPrice = () => {
    if (!ground) return 0;
    
    const subtotal = ground.price * selectedTimeSlots.length;
    
    // Apply membership discount if available
    if (discountPercentage > 0) {
      const discountAmount = subtotal * (discountPercentage / 100);
      return subtotal - discountAmount;
    }
    
    return subtotal;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!ground) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ground not found</h2>
          <Link to="/grounds" className="text-primary hover:underline">
            Return to grounds listing
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/grounds" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Grounds
        </Link>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ground Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative rounded-xl overflow-hidden h-96 mb-2">
                <img 
                  src={ground.images[activeImage]} 
                  alt={ground.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {ground.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`rounded-md overflow-hidden h-20 w-32 flex-shrink-0 ${
                      index === activeImage ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${ground.name} view ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Ground Title and Rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{ground.name}</h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{ground.address}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                  <span>{ground.rating} ({ground.totalRatings} reviews)</span>
                </div>
              </div>
            </div>

            {/* Ground Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-semibold">${ground.price} / hour</div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Operating Hours</div>
                  <div className="font-semibold">{ground.availability}</div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Capacity</div>
                  <div className="font-semibold">{ground.capacity}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground">{ground.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ground.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <div className="text-primary">
                      {amenity.icon}
                    </div>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {ground.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div className="font-semibold">{review.user}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                          fill="currentColor" 
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Book This Ground</h2>
              
              {/* Date Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Select Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Select Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && handleTimeSlotSelect(slot.id)}
                      disabled={!slot.available}
                      className={`py-2 px-3 rounded-md text-sm transition-colors ${
                        !slot.available 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTimeSlots.includes(slot.id)
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                {selectedTimeSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please select at least one time slot
                  </p>
                )}
              </div>
              
              {/* Price Summary */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Price per hour</span>
                  <span>${ground.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Number of hours</span>
                  <span>{selectedTimeSlots.length}</span>
                </div>
                
                {activeMembership && discountPercentage > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Membership discount ({discountPercentage}%)</span>
                    <span>-${(ground.price * selectedTimeSlots.length * discountPercentage / 100).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>${calculateTotalPrice().toFixed(2)}</span>
                </div>
                
                {activeMembership && (
                  <div className="mt-2 text-sm text-green-600">
                    Your {activeMembership.plan_id.name} membership applied!
                  </div>
                )}
              </div>
              
              {/* Book Now Button */}
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={selectedTimeSlots.length === 0}
                onClick={() => {
                  if (selectedTimeSlots.length > 0) {
                    // Include membership ID in the booking parameters if available
                    const membershipParam = activeMembership ? `&membershipId=${activeMembership.id}` : '';
                    // Include the calculated price
                    const priceParam = `&price=${calculateTotalPrice().toFixed(2)}`;
                    window.location.href = `/booking?groundId=${ground.id}&date=${selectedDate?.toISOString()}&slots=${selectedTimeSlots.join(',')}${membershipParam}${priceParam}`;
                  }
                }}
              >
                Proceed to Book
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroundDetails;
