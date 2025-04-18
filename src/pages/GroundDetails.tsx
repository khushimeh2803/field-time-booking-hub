
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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

// Simulated ground data (would fetch from backend in real app)
const getGround = (id: string) => {
  return {
    id: parseInt(id),
    name: "Green Valley Stadium",
    sport: "football",
    price: 80,
    images: [
      "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      "https://images.unsplash.com/photo-1550881111-7cfde14b8831?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    ],
    address: "123 Sports Avenue, Stadium District",
    rating: 4.8,
    totalRatings: 156,
    type: "Outdoor Grass",
    capacity: "22 players",
    amenities: [
      { name: "Changing Rooms", icon: <Shirt /> },
      { name: "Showers", icon: <Droplets /> },
      { name: "Floodlights", icon: <LampFloor /> },
      { name: "Parking", icon: <Car /> },
      { name: "Spectator Seating", icon: <Users /> },
      { name: "Scoreboard", icon: <MonitorSmartphone /> },
      { name: "Cafeteria", icon: <Utensils /> }
    ],
    availability: "8:00 AM - 10:00 PM",
    description: "Green Valley Stadium is a premier outdoor football facility featuring a full-size natural grass pitch maintained to professional standards. The ground is suitable for 11-a-side matches with full markings and goal posts. Floodlights allow for evening play, and spectator seating is available for tournaments and friendly matches. The facility includes clean changing rooms, showers, and convenient parking for players and spectators.",
    reviews: [
      { id: 1, user: "John D.", rating: 5, comment: "Excellent pitch, well-maintained grass and great facilities. Will definitely book again.", date: "2023-08-15" },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Good facilities and helpful staff. The only downside was limited parking on busy days.", date: "2023-07-22" },
      { id: 3, user: "David K.", rating: 5, comment: "Perfect for our weekend league matches. The changing rooms are clean and the pitch is top quality.", date: "2023-06-30" }
    ]
  };
};

// Simulated available time slots
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
  const ground = getGround(id || "1");
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  const handleTimeSlotSelect = (slotId: number) => {
    if (selectedTimeSlots.includes(slotId)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== slotId));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slotId]);
    }
  };

  const calculateTotalPrice = () => {
    return ground.price * selectedTimeSlots.length;
  };

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
                {ground.images.map((image, index) => (
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
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
              
              {/* Book Now Button */}
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={selectedTimeSlots.length === 0}
                onClick={() => {
                  // In a real app, you would handle the booking here
                  if (selectedTimeSlots.length > 0) {
                    window.location.href = `/booking?groundId=${ground.id}&date=${selectedDate?.toISOString()}&slots=${selectedTimeSlots.join(',')}`;
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
