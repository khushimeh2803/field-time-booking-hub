
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
import { Edit, Trash2, Plus } from "lucide-react";
import AddGroundForm from "@/components/admin/forms/AddGroundForm";

const AdminGrounds = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGrounds();
    fetchSports();
  }, []);

  const fetchGrounds = async () => {
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select("*")
        .order("created_at", { ascending: false });

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

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from("sports")
        .select("id, name");

      if (error) throw error;
      setSports(data || []);
    } catch (error: any) {
      console.error("Error fetching sports:", error);
    }
  };

  const getSportName = (sportId: string) => {
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Grounds</h1>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ground
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Price/Hour</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grounds.map((ground) => (
              <TableRow key={ground.id}>
                <TableCell className="font-medium">{ground.name}</TableCell>
                <TableCell>{getSportName(ground.sport_id)}</TableCell>
                <TableCell>{ground.address}</TableCell>
                <TableCell>${ground.price_per_hour}</TableCell>
                <TableCell>{ground.capacity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${ground.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {ground.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {grounds.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No grounds found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddGroundForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={fetchGrounds}
      />
    </div>
  );
};

export default AdminGrounds;
