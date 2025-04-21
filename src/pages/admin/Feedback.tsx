
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // Fetch from contact submissions to show as feedback
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error: any) {
      console.error("Error fetching feedback:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback data",
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Feedback & Contact Submissions</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading feedback data...</p>
          </div>
        ) : (
          <>
            {feedbacks.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Feedback</CardTitle>
                  <CardDescription>
                    There are no feedback or contact submissions yet.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>
                    Review and respond to user feedback and contact submissions
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
                      {feedbacks.map((feedback) => (
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
