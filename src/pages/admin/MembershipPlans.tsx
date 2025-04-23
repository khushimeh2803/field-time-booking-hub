
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
import { Trash2, Plus, Edit } from "lucide-react";
import AddMembershipPlanForm from "@/components/admin/forms/AddMembershipPlanForm";

const MembershipPlans = () => {
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setMembershipPlans(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load membership plans",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership plan?")) return;
    
    try {
      const { error } = await supabase
        .from("membership_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Plan Deleted",
        description: "The membership plan has been deleted successfully",
      });
      
      // Update local state
      setMembershipPlans(membershipPlans.filter((plan) => plan.id !== id));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete membership plan",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membership Plans</h1>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading membership plans...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration (Months)</TableHead>
                <TableHead>Price ($)</TableHead>
                <TableHead>Discount (%)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No membership plans found. Create your first plan!
                  </TableCell>
                </TableRow>
              ) : (
                membershipPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.duration_months}</TableCell>
                    <TableCell>${typeof plan.price === 'string' ? parseFloat(plan.price).toFixed(2) : plan.price.toFixed(2)}</TableCell>
                    <TableCell>{plan.discount_percentage}%</TableCell>
                    <TableCell className="max-w-xs truncate">{plan.description || "—"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Open edit modal */}}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => deletePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <AddMembershipPlanForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={fetchMembershipPlans}
      />
    </div>
  );
};

export default MembershipPlans;
