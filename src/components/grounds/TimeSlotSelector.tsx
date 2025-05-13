
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlotSelectorProps {
  openingTime: string;
  closingTime: string;
  selectedDate: Date;
  groundId: string;
  onSlotsChange: (slots: string[]) => void;
}

const TimeSlotSelector = ({
  openingTime,
  closingTime,
  selectedDate,
  groundId,
  onSlotsChange
}: TimeSlotSelectorProps) => {
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate time slots based on opening and closing times
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const [openHour] = openingTime.split(":").map(Number);
      const [closeHour] = closingTime.split(":").map(Number);
      
      for (let hour = openHour; hour < closeHour; hour++) {
        const startHour = hour.toString().padStart(2, "0");
        const endHour = (hour + 1).toString().padStart(2, "0");
        slots.push(`${startHour}:00 - ${endHour}:00`);
      }
      
      return slots;
    };
    
    setSlots(generateTimeSlots());
    
    // Reset selected slots when opening/closing time changes
    setSelectedSlots([]);
    onSlotsChange([]);
  }, [openingTime, closingTime, onSlotsChange]);

  // Check booked slots for selected date and ground
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!groundId || !selectedDate) return;
      
      try {
        setIsLoading(true);
        const dateString = selectedDate.toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("bookings")
          .select("start_time, end_time")
          .eq("ground_id", groundId)
          .eq("booking_date", dateString)
          .in("status", ["confirmed", "pending"]);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Extract booked time slots
          const bookedTimes: string[] = [];
          data.forEach(booking => {
            const [startHour] = booking.start_time.split(":").map(Number);
            const [endHour] = booking.end_time.split(":").map(Number);
            
            for (let hour = startHour; hour < endHour; hour++) {
              const startHourStr = hour.toString().padStart(2, "0");
              const endHourStr = (hour + 1).toString().padStart(2, "0");
              bookedTimes.push(`${startHourStr}:00 - ${endHourStr}:00`);
            }
          });
          
          setBookedSlots(bookedTimes);
        } else {
          setBookedSlots([]);
        }
      } catch (error: any) {
        console.error("Error checking availability:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check availability"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookedSlots();
    
    // Reset selected slots when date changes
    setSelectedSlots([]);
    onSlotsChange([]);
  }, [groundId, selectedDate, toast, onSlotsChange]);

  const handleSlotClick = (slot: string) => {
    // If slot is already booked, don't allow selection
    if (bookedSlots.includes(slot)) return;
    
    const newSelectedSlots = [...selectedSlots];
    
    if (newSelectedSlots.includes(slot)) {
      // Deselect if already selected
      const index = newSelectedSlots.indexOf(slot);
      newSelectedSlots.splice(index, 1);
    } else {
      // Add to selection
      newSelectedSlots.push(slot);
    }
    
    // Sort slots chronologically
    newSelectedSlots.sort((a, b) => {
      const aStart = parseInt(a.split(":")[0]);
      const bStart = parseInt(b.split(":")[0]);
      return aStart - bStart;
    });
    
    setSelectedSlots(newSelectedSlots);
    onSlotsChange(newSelectedSlots);
  };

  const isSlotSelectable = (slot: string, selected: boolean) => {
    // If slot is already booked, it's not selectable
    if (bookedSlots.includes(slot)) return false;
    
    // If no slots selected yet, any slot is selectable
    if (selectedSlots.length === 0 || selected) return true;
    
    // Check if slot is adjacent to selected slots for continuity
    const slotStartHour = parseInt(slot.split(":")[0]);
    
    return selectedSlots.some(selectedSlot => {
      const selectedStartHour = parseInt(selectedSlot.split(":")[0]);
      return Math.abs(slotStartHour - selectedStartHour) === 1;
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlots.includes(slot);
          const isBooked = bookedSlots.includes(slot);
          const selectable = isSlotSelectable(slot, isSelected);
          
          return (
            <Button
              key={slot}
              type="button"
              variant={isSelected ? "default" : isBooked ? "outline" : "secondary"}
              disabled={isBooked || (!selectable && !isSelected)}
              onClick={() => handleSlotClick(slot)}
              className={`text-sm ${isBooked ? "opacity-50 line-through" : ""}`}
            >
              {slot}
            </Button>
          );
        })}
      </div>
      
      {isLoading && <p className="text-sm text-muted-foreground">Checking availability...</p>}
      
      {bookedSlots.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Some time slots are already booked for this date.
        </p>
      )}
    </div>
  );
};

export default TimeSlotSelector;
