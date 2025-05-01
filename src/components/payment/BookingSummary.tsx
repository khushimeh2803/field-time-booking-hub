
import React from 'react';

interface BookingSummaryProps {
  booking: {
    groundName: string;
    date: string;
    time: string;
    address: string;
  };
}

const BookingSummary = ({ booking }: BookingSummaryProps) => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h3 className="font-medium mb-2">Booking Summary</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Ground:</span>
          <span className="font-medium">{booking.groundName}</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Date:</span>
          <span>{booking.date}</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Time:</span>
          <span>{booking.time}</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Address:</span>
          <span className="text-sm">{booking.address}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
