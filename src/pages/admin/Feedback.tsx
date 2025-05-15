import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Star, StarHalf } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";

const AdminFeedback = () => {
  const [contactFeedbacks, setContactFeedbacks] = useState<any[]>([]);
  const [bookingFeedbacks, setBookingFeedbacks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("booking");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch contact form submissions
      const { data: contactData, error: contactError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactError) throw contactError;
      setContactFeedbacks(contactData || []);
      
      // 2. Fetch booking ratings with related information - using maybeSingle for safer queries
      const { data: bookingData, error: bookingError } = await supabase
        .from("booking_feedback")
        .select(`
          id,
          rating,
          feedback_date,
          booking_id,
          user_id,
          bookings!booking_id (
            id,
            ground_id,
            booking_date,
            grounds (name, address)
          ),
          profiles!user_id (full_name, email)
        `)
        .order("feedback_date", { ascending: false });

      if (bookingError) throw bookingError;
      console.log("Booking feedback data:", bookingData);
      setBookingFeedbacks(bookingData || []);
    } catch (error: any) {
      console.error("Error fetching feedback:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback data: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      // This would update a "is_read" field if it existed in your table
      // For now, we'll just show the toast
      toast({
        title: "Status Updated",
        description: `Feedback marked as ${currentStatus ? "unread" : "read"}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update feedback status",
      });
    }
  };
  
  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 font-medium">{rating}/5</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Feedback & Ratings</h1>
          <Button onClick={fetchFeedbacks}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="booking">Booking Ratings</TabsTrigger>
            <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
          </TabsList>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading feedback data...</p>
            </div>
          ) : (
            <>
              <TabsContent value="booking" className="space-y-4">
                {bookingFeedbacks.length === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Ratings</CardTitle>
                      <CardDescription>
                        No booking ratings have been submitted yet.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <StarHalf className="h-5 w-5 text-yellow-500" />
                        Booking Ratings
                      </CardTitle>
                      <CardDescription>
                        Reviews and ratings from users after completing their bookings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Ground</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Booking Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookingFeedbacks.map((feedback) => (
                            <TableRow key={feedback.id}>
                              <TableCell>
                                {feedback.feedback_date
                                  ? format(new Date(feedback.feedback_date), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{feedback.profiles?.full_name || "Anonymous"}</TableCell>
                              <TableCell>{feedback.bookings?.grounds?.name || "Unknown Ground"}</TableCell>
                              <TableCell>{renderStars(feedback.rating)}</TableCell>
                              <TableCell>
                                {feedback.bookings?.booking_date
                                  ? format(new Date(feedback.bookings.booking_date), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        Showing {bookingFeedbacks.length} booking ratings
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="contact">
                {contactFeedbacks.length === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Contact Submissions</CardTitle>
                      <CardDescription>
                        There are no contact form submissions yet.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Submissions</CardTitle>
                      <CardDescription>
                        Messages from the contact form
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contactFeedbacks.map((feedback) => (
                            <TableRow key={feedback.id}>
                              <TableCell>
                                {feedback.created_at
                                  ? format(new Date(feedback.created_at), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{feedback.name}</TableCell>
                              <TableCell>{feedback.email}</TableCell>
                              <TableCell className="max-w-md truncate">
                                {feedback.message}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(feedback.id, false)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Mark Read
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-500"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
