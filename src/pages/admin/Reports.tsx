
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

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
      const totalAmount = revenueData?.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0);
      setTotalRevenue(totalAmount || 0);
      
      // Get active grounds
      const { count: groundCount, error: groundError } = await supabase
        .from('grounds')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true);
        
      if (groundError) throw groundError;
      setActiveGrounds(groundCount || 0);
      
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    }
  };

  const generateReport = () => {
    // In a real application, you would generate a CSV or PDF file here
    toast({
      title: "Report Generated",
      description: "Your report has been generated and is ready to download.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <Button onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGrounds}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingsByMonth}
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
                <Bar dataKey="bookings" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Sport</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sportDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sportDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
