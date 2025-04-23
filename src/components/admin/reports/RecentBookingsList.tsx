
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RecentBookingsProps {
  recentBookings: Array<{
    id: string;
    booking_date: string;
    status: string;
    total_amount: string | number;
  }>;
}

const RecentBookingsList = ({ recentBookings }: RecentBookingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">Booking #{booking.id.substring(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
                <p className="ml-4 font-medium">
                  ${typeof booking.total_amount === 'string' ? 
                    parseFloat(booking.total_amount) : 
                    booking.total_amount}
                </p>
              </div>
            </div>
          ))}
          {recentBookings.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">No recent bookings found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookingsList;
