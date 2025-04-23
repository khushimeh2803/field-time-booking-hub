
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import StatsOverview from "@/components/admin/reports/StatsOverview";
import BookingsBarChart from "@/components/admin/reports/BookingsBarChart";
import SportPieChart from "@/components/admin/reports/SportPieChart";
import ExportPDF from "@/components/admin/ExportPDF";

// For demo purposes, using static data - in a real app this would come from the database
const bookingsByMonth = [
  { name: 'Jan', bookings: 45 },
  { name: 'Feb', bookings: 52 },
  { name: 'Mar', bookings: 61 },
  { name: 'Apr', bookings: 58 },
  { name: 'May', bookings: 63 },
  { name: 'Jun', bookings: 72 },
  { name: 'Jul', bookings: 80 },
  { name: 'Aug', bookings: 65 },
  { name: 'Sep', bookings: 59 },
  { name: 'Oct', bookings: 62 },
  { name: 'Nov', bookings: 55 },
  { name: 'Dec', bookings: 48 },
];

const sportDistribution = [
  { name: 'Football', value: 45 },
  { name: 'Basketball', value: 25 },
  { name: 'Tennis', value: 18 },
  { name: 'Cricket', value: 12 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminReports = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeGrounds, setActiveGrounds] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      if (userError) throw userError;
      setTotalUsers(userCount || 0);

      // Get total bookings
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
      const totalAmount = revenueData?.reduce((sum, booking) => sum + parseFloat(String(booking.total_amount)), 0);
      setTotalRevenue(totalAmount || 0);

      // Get active grounds
      const { count: groundCount, error: groundError } = await supabase
        .from('grounds')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true);
      if (groundError) throw groundError;
      setActiveGrounds(groundCount || 0);

      toast({
        title: "Data Refreshed",
        description: "Reports data has been updated"
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <Button onClick={fetchStatistics} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <ExportPDF 
            contentId="reports-content"
            fileName="sports-grounds-reports"
            buttonText="Export Reports"
          />
        </div>
      </div>
      
      <div id="reports-content">
        <StatsOverview
          totalUsers={totalUsers}
          totalBookings={totalBookings}
          totalRevenue={totalRevenue}
          activeGrounds={activeGrounds}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BookingsBarChart data={bookingsByMonth} />
          <SportPieChart data={sportDistribution} colors={COLORS} />
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
