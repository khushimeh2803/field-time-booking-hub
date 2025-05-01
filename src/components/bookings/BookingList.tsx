
import BookingCard from "./BookingCard";
import NoBookingsFound from "./NoBookingsFound";

interface BookingListProps {
  bookings: any[];
  onRateBooking: (bookingId: number, rating: number) => void;
  onCancellationRequest: (bookingId: number) => void;
}

const BookingList = ({ bookings, onRateBooking, onCancellationRequest }: BookingListProps) => {
  if (bookings.length === 0) {
    return <NoBookingsFound />;
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onRateBooking={onRateBooking}
          onCancellationRequest={onCancellationRequest}
        />
      ))}
    </div>
  );
};

export default BookingList;
