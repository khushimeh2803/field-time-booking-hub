
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddSportForm from "@/components/admin/forms/AddSportForm";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminSports = () => {
  const [sports, setSports] = useState<any[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Edit form state
  const [editedSport, setEditedSport] = useState({
    name: "",
    description: "",
    image_url: ""
  });

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

  const handleOpenEditForm = (sport: any) => {
    setSelectedSport(sport);
    setEditedSport({
      name: sport.name || "",
      description: sport.description || "",
      image_url: sport.image_url || ""
    });
    setIsEditFormOpen(true);
  };

  const handleOpenDeleteDialog = (sport: any) => {
    setSelectedSport(sport);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSport = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sports")
        .update({
          name: editedSport.name,
          description: editedSport.description,
          image_url: editedSport.image_url
        })
        .eq("id", selectedSport.id);

      if (error) throw error;

      toast({
        title: "Sport Updated",
        description: "The sport information has been updated successfully."
      });
      
      setIsEditFormOpen(false);
      fetchSports(); // Refresh the sports list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update sport"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSport = async () => {
    setIsLoading(true);
    try {
      // Check if there are any grounds using this sport
      const { data: grounds, error: groundsError } = await supabase
        .from("grounds")
        .select("id")
        .eq("sport_id", selectedSport.id)
        .limit(1);

      if (groundsError) throw groundsError;

      if (grounds && grounds.length > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: "This sport has grounds associated with it. Please delete the grounds first."
        });
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      const { error } = await supabase
        .from("sports")
        .delete()
        .eq("id", selectedSport.id);

      if (error) throw error;

      toast({
        title: "Sport Deleted",
        description: "The sport has been successfully deleted."
      });
      
      setIsDeleteDialogOpen(false);
      fetchSports(); // Refresh the sports list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete sport"
      });
    } finally {
      setIsLoading(false);
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleOpenEditForm(sport)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500" 
                    onClick={() => handleOpenDeleteDialog(sport)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
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

      {/* Edit Sport Dialog */}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sport</DialogTitle>
            <DialogDescription>
              Update the sport information below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Sport Name</label>
              <Input
                id="name"
                value={editedSport.name}
                onChange={(e) => setEditedSport({...editedSport, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={editedSport.description}
                onChange={(e) => setEditedSport({...editedSport, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
              <Input
                id="imageUrl"
                value={editedSport.image_url}
                onChange={(e) => setEditedSport({...editedSport, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
              {editedSport.image_url && (
                <div className="mt-2">
                  <img
                    src={editedSport.image_url}
                    alt="Sport preview"
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFormOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSport} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sport "{selectedSport?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSport} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Sport"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSports;
