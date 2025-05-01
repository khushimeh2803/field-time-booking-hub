
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Image } from "lucide-react";
import AddGroundForm from "@/components/admin/forms/AddGroundForm";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AdminGrounds = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentGroundId, setCurrentGroundId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
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

  const handleRealtimeGround = useCallback((payload: any) => {
    console.log("Realtime ground update:", payload);
    fetchGrounds(); // Refresh grounds list when changes occur
  }, []);

  const openImageDialog = (groundId: string, images: string[] = []) => {
    setCurrentGroundId(groundId);
    setImageUrls(images || []);
    setIsImageDialogOpen(true);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid image URL",
      });
      return;
    }
    
    setImageUrls([...imageUrls, newImageUrl]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...imageUrls];
    newImages.splice(index, 1);
    setImageUrls(newImages);
  };

  const handleSaveImages = async () => {
    if (!currentGroundId) return;

    try {
      const { error } = await supabase
        .from("grounds")
        .update({ images: imageUrls })
        .eq("id", currentGroundId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ground images updated successfully",
      });
      
      setIsImageDialogOpen(false);
      fetchGrounds();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ground images",
      });
      console.error("Error updating ground images:", error);
    }
  };

  useRealtimeSubscription({
    table: 'grounds',
    onEvent: handleRealtimeGround,
  });

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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openImageDialog(ground.id, ground.images)}
                    >
                      <Image className="h-4 w-4" />
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

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Ground Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Paste image URL here" 
                value={newImageUrl} 
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddImage}>Add</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Ground image ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+Image';
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              {imageUrls.length === 0 && (
                <div className="col-span-2 text-center py-4 text-muted-foreground">
                  No images added yet
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveImages}>Save Images</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGrounds;
