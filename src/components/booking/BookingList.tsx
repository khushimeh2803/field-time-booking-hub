
import { Booking } from "@/hooks/useBookings";
import BookingCard from "@/components/booking/BookingCard";

interface BookingListProps {
  bookings: Booking[];
  sportName: (id: string) => string;
  onRateBooking: (bookingId: string, rating: number) => void;
  onCancellationRequest: (bookingId: string) => void;
  isLoading: boolean;
}

const BookingList = ({ 
  bookings, 
  sportName, 
  onRateBooking, 
  onCancellationRequest,
  isLoading
}: BookingListProps) => {
  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          sportName={sportName(booking.sport)}
          onRateBooking={onRateBooking}
          onCancellationRequest={onCancellationRequest}
        />
      ))}
    </div>
  );
};

export default BookingList;
