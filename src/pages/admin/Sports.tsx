import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddSportForm from "@/components/admin/forms/AddSportForm";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

const AdminSports = () => {
  const [sports, setSports] = useState<any[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from("sports")
        .select("*")
        .order("name");

      if (error) throw error;
      setSports(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sports data",
      });
    }
  };

  const handleRealtimeSport = useCallback((payload: any) => {
    console.log("Realtime sport update:", payload);
    fetchSports(); // Refresh sports list when changes occur
  }, []);

  useRealtimeSubscription({
    table: 'sports',
    onEvent: handleRealtimeSport,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Sports</h1>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sport
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No sports found. Add your first sport!
              </TableCell>
            </TableRow>
          ) : (
            sports.map((sport) => (
              <TableRow key={sport.id}>
                <TableCell>{sport.name}</TableCell>
                <TableCell>{sport.description}</TableCell>
                <TableCell>
                  {sport.image_url && (
                    <img
                      src={sport.image_url}
                      alt={sport.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <AddSportForm 
        open={isAddFormOpen} 
        onOpenChange={setIsAddFormOpen} 
        onSuccess={fetchSports} 
      />
    </div>
  );
};

export default AdminSports;
