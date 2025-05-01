
import React from 'react';

interface BookingSummaryProps {
  booking: {
    groundName: string;
    date: string;
    time: string;
    address: string;
    capacity?: number;
  };
}

const BookingSummary = ({ booking }: BookingSummaryProps) => {
  return (
    <div>
      <h4 className="font-medium text-lg mb-3">{booking.groundName}</h4>
      <p className="text-gray-600 mb-4">{booking.address}</p>
      
      <div className="bg-gray-50 rounded-md p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{booking.time}</span>
          </div>
          {booking.capacity && (
            <div className="flex justify-between">
              <span className="text-gray-600">Players:</span>
              <span className="font-medium">{booking.capacity}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
