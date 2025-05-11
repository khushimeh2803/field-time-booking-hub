
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface BookingDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const BookingDatePicker = ({ selectedDate, onDateChange }: BookingDatePickerProps) => {
  // Generate available dates (today and next 30 days)
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Choose a Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            disabled={(date) => {
              // Disable past dates
              return date < new Date(today.setHours(0, 0, 0, 0)) ||
                // Disable dates more than 1 month in the future
                date > oneMonthLater;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">
        You can book up to 30 days in advance.
      </p>
    </div>
  );
};

export default BookingDatePicker;
