
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin, Users, Star } from "lucide-react";
import TimeSlotSelector from "@/components/grounds/TimeSlotSelector";
import BookingDatePicker from "@/components/grounds/BookingDatePicker";
import ImageGallery from "@/components/grounds/ImageGallery";
import GroundAmenities from "@/components/grounds/GroundAmenities";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const GroundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ground, setGround] = useState<any>(null);
  const [sport, setSport] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchGroundDetails();
      fetchGroundReviews();
    }
  }, [id]);

  const fetchGroundDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("grounds")
        .select(`*, sports:sport_id(name)`)
        .eq("id", id)
        .single();

      if (error) throw error;
      setGround(data);
      
      // Get sport details
      if (data.sport_id) {
        const { data: sportData, error: sportError } = await supabase
          .from("sports")
          .select("*")
          .eq("id", data.sport_id)
          .single();
          
        if (sportError) throw sportError;
        setSport(sportData);
      }
    } catch (error: any) {
      console.error("Error fetching ground details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ground details"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroundReviews = async () => {
    try {
      if (!id) return;
      
      // Get all bookings for this ground
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("id")
        .eq("ground_id", id);
        
      if (bookingsError) throw bookingsError;
      
      if (!bookingsData || bookingsData.length === 0) {
        setReviews([]);
        return;
      }
      
      // Extract booking IDs
      const bookingIds = bookingsData.map(booking => booking.id);
      
      // Get feedback for these bookings
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("booking_feedback")
        .select(`
          id,
          rating,
          feedback_date,
          booking_id,
          user_id
        `)
        .in("booking_id", bookingIds);
        
      if (feedbackError) throw feedbackError;
      
      if (!feedbackData || feedbackData.length === 0) {
        setReviews([]);
        return;
      }
      
      // Fetch user details for each feedback
      const enhancedFeedback = await Promise.all(
        feedbackData.map(async (feedback) => {
          // Get user profile
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", feedback.user_id)
            .single();
            
          if (userError) {
            console.error("Error fetching user profile:", userError);
            return {
              ...feedback,
              userName: "Anonymous User",
              userAvatar: null
            };
          }
          
          return {
            ...feedback,
            userName: userData?.full_name || "Anonymous User",
            userAvatar: userData?.avatar_url
          };
        })
      );
      
      setReviews(enhancedFeedback);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlots([]);
  };

  const handleTimeSlotSelect = (slots: string[]) => {
    setSelectedTimeSlots(slots);
  };

  const handleBookNow = () => {
    if (selectedTimeSlots.length === 0) {
      toast({
        title: "Select Time",
        description: "Please select at least one time slot",
      });
      return;
    }
    
    // Redirect to booking page with params
    const params = new URLSearchParams();
    params.append("groundId", id || "");
    params.append("date", selectedDate.toISOString());
    params.append("slots", selectedTimeSlots.join(","));
    params.append("price", ground?.price_per_hour || "0");
    
    window.location.href = `/booking?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <p>Loading ground details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!ground) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Ground not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Ground name and sport */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{ground.name}</h1>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="mr-2">
              {ground.sports?.name || "Sports"}
            </Badge>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{ground.address}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={ground.images || []} groundName={ground.name} />
            
            {/* Ground Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this venue</h2>
              <p className="text-muted-foreground">
                {ground.description || "No description available."}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-medium">{ground.capacity} people</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Clock className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm text-muted-foreground">Hours</span>
                  <span className="font-medium">{ground.opening_time} - {ground.closing_time}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <CalendarDays className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <span className="font-medium">Daily</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Star className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="font-medium">
                    {reviews.length > 0
                      ? `${(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}/5`
                      : "No ratings"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Amenities */}
            <GroundAmenities amenities={ground.amenities || []} />
            
            {/* Reviews & Feedback */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews & Feedback</h2>
              
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>{review.userName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{review.userName}</p>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(review.feedback_date), "MMM d, yyyy")}
                              </p>
                            </div>
                            <div className="flex items-center mt-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Panel */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Book this venue</h2>
              <div className="border-b pb-4 mb-4">
                <p className="text-lg font-bold flex items-center">
                  <span>₹{ground.price_per_hour}</span>
                  <span className="text-sm font-normal text-muted-foreground ml-2">per hour</span>
                </p>
              </div>
              
              <div className="space-y-6">
                <BookingDatePicker 
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Time Slots
                  </label>
                  <TimeSlotSelector 
                    openingTime={ground.opening_time}
                    closingTime={ground.closing_time}
                    selectedDate={selectedDate}
                    groundId={id || ""}
                    selectedSlots={selectedTimeSlots}
                    onSlotsChange={handleTimeSlotSelect}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Selected hours</span>
                    <span>{selectedTimeSlots.length}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{(ground.price_per_hour * selectedTimeSlots.length).toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    disabled={selectedTimeSlots.length === 0}
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroundDetails;
