import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ExportPDF from "@/components/admin/ExportPDF";
import StatsOverview from "@/components/admin/reports/StatsOverview";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import WeeklyBookingTrend from "@/components/admin/reports/WeeklyBookingTrend";
import RecentBookingsList from "@/components/admin/reports/RecentBookingsList";

// Sample data for bookings trend
const bookingsTrend = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 8 },
  { name: 'Fri', bookings: 12 },
  { name: 'Sat', bookings: 14 },
  { name: 'Sun', bookings: 10 },
];

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalGrounds, setTotalGrounds] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get users count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
        
      if (userError) throw userError;
      setTotalUsers(userCount || 0);
      
      // Get bookings count
      const { count: bookingCount, error: bookingError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true });
        
      if (bookingError) throw bookingError;
      setTotalBookings(bookingCount || 0);
      
      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('bookings')
        .select('total_amount');
        
      if (revenueError) throw revenueError;
      
      // Convert the numeric total_amount to a number for calculation
      const totalAmount = revenueData?.reduce((sum, booking) => {
        const amount = typeof booking.total_amount === 'string' 
          ? parseFloat(booking.total_amount) 
          : booking.total_amount;
        return sum + amount;
      }, 0);
      
      setTotalRevenue(totalAmount || 0);
      
      // Get grounds count
      const { count: groundCount, error: groundError } = await supabase
        .from('grounds')
        .select('id', { count: 'exact', head: true });
        
      if (groundError) throw groundError;
      setTotalGrounds(groundCount || 0);
      
      // Get recent bookings
      const { data: bookings, error: recentBookingsError } = await supabase
        .from('bookings')
        .select('id, booking_date, status, total_amount, ground_id, user_id')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (recentBookingsError) throw recentBookingsError;
      setRecentBookings(bookings || []);
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    }
  };

  const handleRealtimeBooking = useCallback((payload: any) => {
    console.log("Realtime booking update:", payload);
    fetchDashboardStats();
  }, []);

  const handleRealtimeMembership = useCallback((payload: any) => {
    console.log("Realtime membership update:", payload);
    fetchDashboardStats();
  }, []);

  useRealtimeSubscription({
    table: 'bookings',
    onEvent: handleRealtimeBooking,
  });

  useRealtimeSubscription({
    table: 'user_memberships',
    onEvent: handleRealtimeMembership,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => fetchDashboardStats()} variant="outline">
            Refresh Data
          </Button>
          <ExportPDF 
            contentId="dashboard-content"
            fileName="dashboard-report"
            buttonText="Export Dashboard"
          />
        </div>
      </div>

      <div id="dashboard-content">
        <StatsOverview
          totalUsers={totalUsers}
          totalBookings={totalBookings}
          totalRevenue={totalRevenue}
          activeGrounds={totalGrounds}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <WeeklyBookingTrend data={bookingsTrend} />
          <RecentBookingsList recentBookings={recentBookings} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
