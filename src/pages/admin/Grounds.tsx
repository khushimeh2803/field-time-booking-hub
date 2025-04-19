
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
import { Plus, Edit, Trash2 } from "lucide-react";

const AdminGrounds = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select("*, sports(name)")
        .order("name");

      if (error) throw error;
      setGrounds(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load grounds data",
      });
    }
  };

  const handleDeleteGround = async (groundId: string) => {
    try {
      const { error } = await supabase
        .from("grounds")
        .delete()
        .eq("id", groundId);

      if (error) throw error;

      toast({
        title: "Ground Deleted",
        description: "The ground has been successfully deleted.",
      });

      fetchGrounds(); // Refresh the list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete ground",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Grounds</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Ground
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Price/Hour</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grounds.map((ground) => (
            <TableRow key={ground.id}>
              <TableCell>{ground.name}</TableCell>
              <TableCell>{ground.sports?.name || 'N/A'}</TableCell>
              <TableCell>{ground.address}</TableCell>
              <TableCell>{ground.capacity}</TableCell>
              <TableCell>${ground.price_per_hour}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => handleDeleteGround(ground.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminGrounds;
