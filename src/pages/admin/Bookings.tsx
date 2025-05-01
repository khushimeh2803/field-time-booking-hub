
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookingStatusBadge from "@/components/admin/BookingStatusBadge";
import ExportPDF from "@/components/admin/ExportPDF";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [grounds, setGrounds] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);
  
  // Use realtime updates for bookings table
  useRealtimeSubscription({
    table: 'bookings',
    onEvent: () => {
      fetchBookings(statusFilter !== "all" ? statusFilter : undefined);
    },
  });

  const fetchData = async () => {
    await Promise.all([
      fetchBookings(),
      fetchUsers(),
      fetchGrounds()
    ]);
  };

  const fetchBookings = async (status?: string) => {
    try {
      let query = supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });
        
      if (status && status !== "all") {
        query = query.eq("status", status);
      }
        
      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings data",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email");

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGrounds = async () => {
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select("id, name");

      if (error) throw error;
      setGrounds(data || []);
    } catch (error) {
      console.error("Error fetching grounds:", error);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : 'Unknown';
  };

  const getGroundName = (groundId: string) => {
    const ground = grounds.find(g => g.id === groundId);
    return ground ? ground.name : 'Unknown';
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      });

      fetchBookings(statusFilter !== "all" ? statusFilter : undefined);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status",
      });
    }
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    fetchBookings(value !== "all" ? value : undefined);
  };

  return (
    <div className="space-y-6" id="bookings-table">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filter by status:</span>
            <Select 
              value={statusFilter}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ExportPDF
            contentId="bookings-table"
            fileName="bookings-report"
            buttonText="Export Bookings"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Ground</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id.substring(0, 8)}...</TableCell>
                <TableCell>{getUserName(booking.user_id)}</TableCell>
                <TableCell>{getGroundName(booking.ground_id)}</TableCell>
                <TableCell>
                  {booking.booking_date ? format(new Date(booking.booking_date), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {booking.start_time} - {booking.end_time}
                </TableCell>
                <TableCell>${booking.total_amount}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <Select 
                    defaultValue={booking.status}
                    onValueChange={(value) => handleStatusChange(booking.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirm</SelectItem>
                      <SelectItem value="cancelled">Cancel</SelectItem>
                      <SelectItem value="completed">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
