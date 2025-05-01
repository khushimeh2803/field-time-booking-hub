
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Star as StarIcon } from "lucide-react";
import { format } from "date-fns";

interface BookingCardProps {
  booking: {
    id: number;
    groundName: string;
    sport: string;
    date: Date;
    timeSlots: string[];
    price: number;
    status: string;
    image: string;
    address: string;
    paymentMethod: string;
    completed: boolean;
    rated: boolean;
    rating: number;
  };
  onRateBooking: (bookingId: number, rating: number) => void;
  onCancellationRequest: (bookingId: number) => void;
}

const BookingCard = ({ booking, onRateBooking, onCancellationRequest }: BookingCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/4 h-48 md:h-auto relative">
          <img 
            src={booking.image} 
            alt={booking.groundName} 
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded text-xs font-medium text-white ${
            booking.status === 'confirmed' ? 'bg-green-500' :
            booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {booking.status.toUpperCase()}
          </div>
        </div>
        
        <div className="p-6 md:w-3/4">
          <div className="md:flex justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{booking.groundName}</h3>
              <p className="text-muted-foreground capitalize">{booking.sport}</p>
            </div>
            <div className="mt-2 md:mt-0 text-right">
              <p className="font-bold text-lg">${booking.price}</p>
              <p className="text-sm text-muted-foreground">{booking.paymentMethod}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm text-muted-foreground">{booking.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {format(booking.date, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {booking.timeSlots.join(", ")}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
            {booking.completed ? (
              booking.rated ? (
                <div className="flex items-center">
                  <span className="mr-2">Your Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon 
                        key={star} 
                        className={`h-5 w-5 ${star <= booking.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">Rate your experience:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => onRateBooking(booking.id, star)}
                        className="focus:outline-none"
                      >
                        <StarIcon 
                          className="h-5 w-5 text-gray-300 hover:text-yellow-500 hover:fill-current"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                {new Date() > booking.date 
                  ? "Your booking date has passed"
                  : `${Math.ceil((booking.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until your booking`
                }
              </div>
            )}
            
            {booking.status === 'confirmed' && !booking.completed && (
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => onCancellationRequest(booking.id)}
              >
                Request Cancellation
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
