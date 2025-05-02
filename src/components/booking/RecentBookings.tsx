
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface RecentBooking {
  id: string;
  groundName: string;
  date: Date;
  timeSlots: string[];
  status: string;
  price: number;
  image: string;
}

interface RecentBookingsProps {
  bookings: RecentBooking[];
}

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  if (bookings.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <div key={`recent-${booking.id}`} className="bg-white rounded-lg shadow p-4 flex gap-4">
            <div className="w-20 h-20 flex-shrink-0">
              <img 
                src={booking.image} 
                alt={booking.groundName} 
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{booking.groundName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{format(booking.date, "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{booking.timeSlots.join(", ")}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
                <span className="font-semibold">${booking.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;
