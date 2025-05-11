
import { Building, CalendarDays, Clock, IndianRupee } from "lucide-react";
import { format } from "date-fns";

interface BookingSummaryProps {
  groundData: any;
  bookingDate: Date | null;
  selectedSlots: string[];
  timeSlotMap: Record<string, string>;
}

const BookingSummary = ({ groundData, bookingDate, selectedSlots, timeSlotMap }: BookingSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Venue</div>
          <div className="font-medium">{groundData?.name || "Loading..."}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Date</div>
          <div className="font-medium">
            {bookingDate ? format(bookingDate, "EEEE, MMMM d, yyyy") : "Loading..."}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Time Slots</div>
          <div className="font-medium">
            {selectedSlots.map(slot => timeSlotMap[slot]).join(", ")}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <IndianRupee className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Rate</div>
          <div className="font-medium">₹{groundData?.price_per_hour || "0"} per hour</div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
