
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
import { RefreshCw, Download, IndianRupee } from "lucide-react";
import ExportPDF from "@/components/admin/ExportPDF";
import * as XLSX from "xlsx";

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
      // Use explicit joins to avoid relational errors
      const { data, error } = await supabase
        .from("user_memberships")
        .select(`
          id,
          user_id,
          plan_id,
          start_date,
          end_date,
          created_at
        `);

      if (error) throw error;

      // Now fetch related profile data for each membership
      const enhancedMemberships = await Promise.all(
        (data || []).map(async (membership) => {
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", membership.user_id)
            .maybeSingle();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }

          // Fetch plan data
          const { data: planData, error: planError } = await supabase
            .from("membership_plans")
            .select("name, discount_percentage, duration_months, price")
            .eq("id", membership.plan_id)
            .maybeSingle();

          if (planError) {
            console.error("Error fetching plan:", planError);
          }

          return {
            ...membership,
            profiles: profileData,
            membership_plans: planData
          };
        })
      );

      setMemberships(enhancedMemberships);
    } catch (error: any) {
      console.error("Error fetching memberships:", error);
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

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = memberships.map((membership) => ({
        'User Name': membership.profiles?.full_name || "Unknown user",
        'Email': membership.profiles?.email || "Unknown email",
        'Plan': membership.membership_plans?.name || "Unknown plan",
        'Duration (Months)': membership.membership_plans?.duration_months || 0,
        'Discount': `${membership.membership_plans?.discount_percentage || 0}%`,
        'Price': membership.membership_plans?.price || 0,
        'Start Date': format(new Date(membership.start_date), "MMM dd, yyyy"),
        'End Date': format(new Date(membership.end_date), "MMM dd, yyyy"),
        'Status': isActive(membership.end_date) ? "Active" : "Expired"
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "User Memberships");
      
      // Generate and download the Excel file
      XLSX.writeFile(wb, `user_memberships_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
      
      toast({
        title: "Export Complete",
        description: "User memberships exported to Excel successfully!",
      });
    } catch (error: any) {
      console.error("Error exporting to Excel:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error.message || "Failed to export memberships to Excel",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Memberships</h1>
        <div className="flex space-x-2">
          <Button onClick={fetchUserMemberships}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <ExportPDF
            contentId="memberships-table"
            fileName="user-memberships"
            buttonText="Export as PDF"
          />
          <Button onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div id="memberships-table">
          {isLoading ? (
            <div className="p-8 text-center">Loading user memberships...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {membership.membership_plans?.price || "0.00"}
                        </div>
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
        </div>
      </Card>
    </div>
  );
};

export default UserMemberships;
