
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { timeSlotMap } from "@/utils/timeSlotUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeSlotSelectorProps {
  groundId: string;
  selectedDate: Date | null;
  selectedSlots: string[];
  onSlotsChange: (slots: string[]) => void;
}

const TimeSlotSelector = ({
  groundId,
  selectedDate,
  selectedSlots,
  onSlotsChange,
}: TimeSlotSelectorProps) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Convert slots to array of time strings for comparison
  const getTimeRange = (start: string, end: string): string[] => {
    const slots = [];
    const allSlots = Object.entries(timeSlotMap);
    let capture = false;

    for (const [id, timeRange] of allSlots) {
      const slotStart = timeRange.split(" - ")[0];
      
      if (slotStart === start) {
        capture = true;
      }
      
      if (capture) {
        slots.push(id);
      }
      
      if (timeRange.split(" - ")[1] === end) {
        break;
      }
    }
    
    return slots;
  };

  // Fetch booked slots when date or ground changes
  useEffect(() => {
    if (groundId && selectedDate) {
      fetchBookedSlots();
    }
  }, [groundId, selectedDate]);

  const fetchBookedSlots = async () => {
    if (!selectedDate) return;
    
    try {
      setIsLoading(true);
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("start_time, end_time")
        .eq("ground_id", groundId)
        .eq("booking_date", formattedDate)
        .in("status", ["pending", "confirmed"]);
        
      if (error) throw error;

      // Get all booked time slots
      let booked: string[] = [];
      
      for (const booking of bookingsData || []) {
        const bookedSlotIds = getTimeRange(booking.start_time, booking.end_time);
        booked = [...booked, ...bookedSlotIds];
      }
      
      setBookedSlots(booked);

      // Generate available slots based on current time for today
      const isToday = selectedDate.toDateString() === new Date().toDateString();
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      
      const availableSlotIds = Object.entries(timeSlotMap)
        .filter(([id, timeRange]) => {
          if (booked.includes(id)) return false; // Skip already booked slots
          
          // If today, check if time has already passed
          if (isToday) {
            const slotHour = parseInt(timeRange.split(":")[0]);
            const slotMinute = parseInt(timeRange.split(":")[1].split(" -")[0]);
            
            // Allow booking only if slot starts at least 30 minutes in the future
            if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute + 30)) {
              return false;
            }
          }
          
          return true;
        })
        .map(([id]) => id);
        
      setAvailableSlots(availableSlotIds);
      
      // Clear any selected slots that are now invalid
      const validSelectedSlots = selectedSlots.filter(id => availableSlotIds.includes(id));
      if (validSelectedSlots.length !== selectedSlots.length) {
        onSlotsChange(validSelectedSlots);
        if (selectedSlots.length > 0 && validSelectedSlots.length === 0) {
          toast({
            variant: "destructive",
            title: "Selected slots are no longer available", 
            description: "The time slots you selected are either already booked or in the past."
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching booked slots:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load booking availability"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    if (selectedSlots.includes(slotId)) {
      // If slot is already selected, remove it
      onSlotsChange(selectedSlots.filter((id) => id !== slotId));
    } else {
      // If selecting a new slot, ensure contiguous selection
      const slotIds = Object.keys(timeSlotMap).map(Number).sort((a, b) => a - b);
      const numericSlotIds = selectedSlots.map(Number);
      const selectedMin = Math.min(...numericSlotIds, Infinity);
      const selectedMax = Math.max(...numericSlotIds, -Infinity);
      const numericSlotId = Number(slotId);
      
      // Allow selection if:
      // 1. First selection
      // 2. Adjacent to min selected (one less)
      // 3. Adjacent to max selected (one more)
      if (selectedSlots.length === 0 || 
          numericSlotId === selectedMin - 1 || 
          numericSlotId === selectedMax + 1) {
        onSlotsChange([...selectedSlots, slotId]);
      } else {
        toast({
          title: "Time Slot Selection",
          description: "Please select contiguous time slots only.",
        });
      }
    }
  };

  if (!selectedDate) {
    return (
      <div className="bg-muted p-6 rounded-md text-center">
        Please select a date first
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Available Time Slots</h3>
        {isLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
      </div>

      {!isLoading && availableSlots.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-center">
          No available time slots for this date. Please select another date.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.entries(timeSlotMap).map(([id, time]) => {
          const isBooked = bookedSlots.includes(id);
          const isSelected = selectedSlots.includes(id);
          const isAvailable = availableSlots.includes(id);
          
          return (
            <Button
              key={id}
              variant={isSelected ? "default" : "outline"}
              className={`
                h-auto py-3 px-4 justify-center text-center
                ${isBooked ? "bg-gray-100 text-gray-400 border-gray-200" : ""}
                ${!isAvailable && !isBooked ? "bg-gray-50 text-gray-400" : ""}
              `}
              onClick={() => isAvailable && handleSlotSelect(id)}
              disabled={!isAvailable || isBooked}
            >
              <div>
                <span className="block text-sm">{time}</span>
                <span className="text-xs block mt-1">
                  {isBooked 
                    ? "Booked" 
                    : !isAvailable 
                    ? "Unavailable" 
                    : isSelected 
                    ? "Selected" 
                    : "Available"}
                </span>
              </div>
            </Button>
          );
        })}
      </div>

      {selectedSlots.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">
            Selected: {selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedSlots
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((id) => timeSlotMap[id])
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
