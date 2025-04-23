
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ExportPDF from "@/components/admin/ExportPDF";
import StatsOverview from "@/components/admin/reports/StatsOverview";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Building2 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

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
    fetchDashboardStats(); // Refresh all stats when a booking changes
  }, []);

  const handleRealtimeMembership = useCallback((payload: any) => {
    console.log("Realtime membership update:", payload);
    fetchDashboardStats(); // Refresh all stats when a membership changes
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Grounds</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGrounds}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Booking Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={bookingsTrend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
                      <p className="ml-4 font-medium">${typeof booking.total_amount === 'string' ? parseFloat(booking.total_amount) : booking.total_amount}</p>
                    </div>
                  </div>
                ))}
                {recentBookings.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">No recent bookings found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
