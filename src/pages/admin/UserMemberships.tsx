
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
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const UserMemberships = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserMemberships();
  }, []);

  const fetchUserMemberships = async () => {
    try {
      setIsLoading(true);
      // Join with profiles and membership_plans to get more details
      const { data, error } = await supabase
        .from("user_memberships")
        .select(`
          *,
          profiles:user_id (full_name, email),
          membership_plans:plan_id (name, discount_percentage, duration_months)
        `)
        .order("end_date", { ascending: false });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load user memberships",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (endDate: string) => {
    return new Date(endDate) >= new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Memberships</h1>
        <Button>
          Refresh Data
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading user memberships...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No user memberships found.
                  </TableCell>
                </TableRow>
              ) : (
                memberships.map((membership) => (
                  <TableRow key={membership.id}>
                    <TableCell className="font-medium">
                      {membership.profiles?.full_name || "Unknown user"}
                      <br />
                      <span className="text-xs text-gray-500">{membership.profiles?.email}</span>
                    </TableCell>
                    <TableCell>
                      {membership.membership_plans?.name || "Unknown plan"}
                      <br />
                      <span className="text-xs text-gray-500">
                        {membership.membership_plans?.duration_months} months, {membership.membership_plans?.discount_percentage}% discount
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(membership.start_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(membership.end_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          isActive(membership.end_date)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isActive(membership.end_date) ? "Active" : "Expired"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default UserMemberships;
