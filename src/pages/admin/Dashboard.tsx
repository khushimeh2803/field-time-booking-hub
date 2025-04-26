
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ExportPDF from "@/components/admin/ExportPDF";
import StatsOverview from "@/components/admin/reports/StatsOverview";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import WeeklyBookingTrend from "@/components/admin/reports/WeeklyBookingTrend";
import RecentBookingsList from "@/components/admin/reports/RecentBookingsList";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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

  const fetchDashboardStats = useCallback(async () => {
    try {
      console.log("Fetching dashboard stats...");
      // Get users count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
        
      if (userError) throw userError;
      setTotalUsers(userCount || 0);
      
      // Get bookings count and total revenue
      const { data: bookingsData, error: bookingError } = await supabase
        .from('bookings')
        .select('id, total_amount, booking_date, status, ground_id, user_id')
        .order('created_at', { ascending: false });
        
      if (bookingError) throw bookingError;
      
      setTotalBookings(bookingsData?.length || 0);
      
      const totalAmount = bookingsData?.reduce((sum, booking) => {
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
      const { data: recentBookingsData, error: recentBookingsError } = await supabase
        .from('bookings')
        .select('id, booking_date, status, total_amount, ground_id, user_id')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (recentBookingsError) throw recentBookingsError;
      setRecentBookings(recentBookingsData || []);
      
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Handle real-time updates for bookings
  const handleBookingChange = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log("Realtime booking update:", payload);
    toast({
      title: "Booking Update",
      description: `A booking was ${payload.eventType.toLowerCase()}d`,
    });
    fetchDashboardStats();
  }, [fetchDashboardStats, toast]);

  // Handle real-time updates for user profiles
  const handleProfileChange = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log("Realtime profile update:", payload);
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Handle real-time updates for grounds
  const handleGroundChange = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log("Realtime ground update:", payload);
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Set up real-time subscriptions
  useRealtimeSubscription({
    table: 'bookings',
    onEvent: handleBookingChange,
  });

  useRealtimeSubscription({
    table: 'profiles',
    onEvent: handleProfileChange,
  });

  useRealtimeSubscription({
    table: 'grounds',
    onEvent: handleGroundChange,
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
