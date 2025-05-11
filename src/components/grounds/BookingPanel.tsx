
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import TimeSlotSelector from "@/components/grounds/TimeSlotSelector";
import BookingDatePicker from "@/components/grounds/BookingDatePicker";

interface BookingPanelProps {
  groundId: string;
  pricePerHour: number;
  openingTime: string;
  closingTime: string;
}

const BookingPanel = ({ 
  groundId, 
  pricePerHour, 
  openingTime, 
  closingTime 
}: BookingPanelProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const { toast } = useToast();

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
    params.append("groundId", groundId || "");
    params.append("date", selectedDate.toISOString());
    params.append("slots", selectedTimeSlots.join(","));
    params.append("price", pricePerHour.toString() || "0");
    
    window.location.href = `/booking?${params.toString()}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Book this venue</h2>
      <div className="border-b pb-4 mb-4">
        <p className="text-lg font-bold flex items-center">
          <span>₹{pricePerHour}</span>
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
            openingTime={openingTime}
            closingTime={closingTime}
            selectedDate={selectedDate}
            groundId={groundId}
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
            <span>₹{(pricePerHour * selectedTimeSlots.length).toFixed(2)}</span>
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
  );
};

export default BookingPanel;
