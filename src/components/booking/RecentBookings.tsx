
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Booking } from "@/hooks/useBookings";

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  if (!bookings || bookings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{booking.groundName}</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                <span>{format(booking.date, "MMM d, yyyy")}</span>
                <span className="capitalize">{booking.status}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold">₹{booking.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;
