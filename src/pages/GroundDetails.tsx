
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ImageGallery from "@/components/grounds/ImageGallery";
import GroundAmenities from "@/components/grounds/GroundAmenities";
import GroundHeader from "@/components/grounds/GroundHeader";
import GroundDescription from "@/components/grounds/GroundDescription";
import ReviewsList from "@/components/grounds/ReviewsList";
import BookingPanel from "@/components/grounds/BookingPanel";

const GroundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ground, setGround] = useState<any>(null);
  const [sport, setSport] = useState<any>(null);
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

  // Calculate rating for display
  const ratingDisplay = reviews.length > 0
    ? `${(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}/5`
    : "No ratings";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Ground Header with name and location */}
        <GroundHeader 
          name={ground.name} 
          sportName={ground.sports?.name} 
          address={ground.address} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={ground.images || []} groundName={ground.name} />
            
            {/* Ground Details & Description */}
            <GroundDescription 
              description={ground.description} 
              capacity={ground.capacity}
              openingTime={ground.opening_time}
              closingTime={ground.closing_time}
              rating={ratingDisplay}
            />
            
            {/* Amenities */}
            <GroundAmenities amenities={ground.amenities || []} />
            
            {/* Reviews & Feedback */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews & Feedback</h2>
              <ReviewsList reviews={reviews} />
            </div>
          </div>
          
          {/* Booking Panel */}
          <div>
            <BookingPanel 
              groundId={id || ""} 
              pricePerHour={ground.price_per_hour} 
              openingTime={ground.opening_time}
              closingTime={ground.closing_time}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroundDetails;
