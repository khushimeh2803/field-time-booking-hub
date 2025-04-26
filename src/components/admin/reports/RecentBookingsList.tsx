
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RecentBookingsProps {
  recentBookings: Array<{
    id: string;
    booking_date: string;
    status: string;
    total_amount: string | number;
    ground_id?: string;
    user_id?: string;
  }>;
}

const RecentBookingsList = ({ recentBookings }: RecentBookingsProps) => {
  const [bookingsWithDetails, setBookingsWithDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!recentBookings.length) return;

      const detailedBookings = await Promise.all(
        recentBookings.map(async (booking) => {
          // Fetch ground name
          let groundName = "Unknown";
          if (booking.ground_id) {
            const { data: groundData } = await supabase
              .from('grounds')
              .select('name')
              .eq('id', booking.ground_id)
              .single();
            if (groundData) groundName = groundData.name;
          }

          // Fetch user name
          let userName = "Anonymous";
          if (booking.user_id) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', booking.user_id)
              .single();
            if (userData) userName = userData.full_name || "Anonymous";
          }

          return {
            ...booking,
            groundName,
            userName,
            formattedDate: format(new Date(booking.booking_date), 'MMM dd, yyyy')
          };
        })
      );

      setBookingsWithDetails(detailedBookings);
    };

    fetchBookingDetails();
  }, [recentBookings]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Bookings</CardTitle>
        <Badge variant="outline" className="font-normal">
          {recentBookings.length} recent
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookingsWithDetails.map((booking) => (
            <div 
              key={booking.id} 
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{booking.groundName}</p>
                <p className="text-sm text-muted-foreground">
                  by {booking.userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.formattedDate}
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
                    parseFloat(booking.total_amount).toFixed(2) : 
                    booking.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {bookingsWithDetails.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">No recent bookings found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookingsList;
