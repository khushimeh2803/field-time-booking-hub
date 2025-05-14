import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import AddGroundForm from "@/components/admin/forms/AddGroundForm";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AdminGrounds = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGround, setSelectedGround] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Edit form state
  const [editedGround, setEditedGround] = useState({
    name: "",
    address: "",
    sport_id: "",
    price_per_hour: "",
    capacity: "",
    opening_time: "",
    closing_time: "",
    description: "",
    is_active: true,
    amenities: [] as string[],
    images: [] as string[] // Add images array to edited ground
  });

  // Available amenities with both facilities and sports grounds
  const availableAmenities = [
    "Parking", "Changing Rooms", "Showers", "Floodlights", "Spectator Seating", 
    "Drinking Water", "Equipment Rental", "Refreshments", "Toilets", "First Aid",
    "Badminton Court", "Cricket Pitch", "Football Field", "Basketball Court",
    "Tennis Court", "Swimming Pool", "Gym", "Volleyball Court", "Table Tennis"
  ];

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

  const handleOpenEditForm = (ground: any) => {
    setSelectedGround(ground);
    setEditedGround({
      name: ground.name || "",
      address: ground.address || "",
      sport_id: ground.sport_id || "",
      price_per_hour: String(ground.price_per_hour) || "",
      capacity: String(ground.capacity) || "",
      opening_time: ground.opening_time || "",
      closing_time: ground.closing_time || "",
      description: ground.description || "",
      is_active: ground.is_active || true,
      amenities: ground.amenities || [],
      images: ground.images || [] // Include existing images
    });
    setIsEditFormOpen(true);
  };

  const handleOpenDeleteDialog = (ground: any) => {
    setSelectedGround(ground);
    setIsDeleteDialogOpen(true);
  };

  const handleEditGround = async () => {
    setIsLoading(true);
    try {
      // Create update object from editedGround
      const updateData = {
        name: editedGround.name,
        address: editedGround.address,
        sport_id: editedGround.sport_id,
        price_per_hour: parseFloat(editedGround.price_per_hour),
        capacity: parseInt(editedGround.capacity),
        opening_time: editedGround.opening_time,
        closing_time: editedGround.closing_time,
        description: editedGround.description,
        is_active: editedGround.is_active,
        amenities: editedGround.amenities,
        images: editedGround.images
      };

      const { error } = await supabase
        .from("grounds")
        .update(updateData)
        .eq("id", selectedGround.id);

      if (error) throw error;

      toast({
        title: "Ground Updated",
        description: "The ground information has been updated successfully."
      });
      
      setIsEditFormOpen(false);
      fetchGrounds(); // Refresh the grounds list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update ground"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGround = async () => {
    setIsLoading(true);
    try {
      // First check if there are any bookings for this ground
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("id")
        .eq("ground_id", selectedGround.id)
        .limit(1);

      if (bookingsError) throw bookingsError;

      if (bookings && bookings.length > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: "This ground has bookings associated with it. Please cancel or delete the bookings first."
        });
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      const { error } = await supabase
        .from("grounds")
        .delete()
        .eq("id", selectedGround.id);

      if (error) throw error;

      toast({
        title: "Ground Deleted",
        description: "The ground has been successfully deleted."
      });
      
      setIsDeleteDialogOpen(false);
      fetchGrounds(); // Refresh the grounds list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete ground"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setEditedGround(prev => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  // New function to add image URL
  const handleAddImage = () => {
    const imageUrl = window.prompt("Enter image URL:");
    if (imageUrl) {
      setEditedGround(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl]
      }));
    }
  };

  // New function to remove image
  const handleRemoveImage = (index: number) => {
    setEditedGround(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRealtimeGround = useCallback((payload: any) => {
    console.log("Realtime ground update:", payload);
    fetchGrounds(); // Refresh grounds list when changes occur
  }, []);

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
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditForm(ground)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleOpenDeleteDialog(ground)}>
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

      {/* Edit Ground Dialog */}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Ground</DialogTitle>
            <DialogDescription>
              Update the ground information below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ground Name</Label>
                <Input 
                  id="name" 
                  value={editedGround.name} 
                  onChange={(e) => setEditedGround({...editedGround, name: e.target.value})}
                  placeholder="Enter ground name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sportId">Sport</Label>
                <Select 
                  value={editedGround.sport_id} 
                  onValueChange={(value) => setEditedGround({...editedGround, sport_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Hour (₹)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={editedGround.price_per_hour} 
                  onChange={(e) => setEditedGround({...editedGround, price_per_hour: e.target.value})}
                  placeholder="Enter price per hour"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  type="number"
                  value={editedGround.capacity} 
                  onChange={(e) => setEditedGround({...editedGround, capacity: e.target.value})}
                  placeholder="Enter capacity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingTime">Opening Time</Label>
                <Input 
                  id="openingTime" 
                  type="time"
                  value={editedGround.opening_time} 
                  onChange={(e) => setEditedGround({...editedGround, opening_time: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingTime">Closing Time</Label>
                <Input 
                  id="closingTime" 
                  type="time"
                  value={editedGround.closing_time} 
                  onChange={(e) => setEditedGround({...editedGround, closing_time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={editedGround.address} 
                onChange={(e) => setEditedGround({...editedGround, address: e.target.value})}
                placeholder="Enter full address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={editedGround.description || ""} 
                onChange={(e) => setEditedGround({...editedGround, description: e.target.value})}
                placeholder="Enter ground description"
              />
            </div>

            {/* Ground Images Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ground Images</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                  Add Image URL
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {editedGround.images && editedGround.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imageUrl} 
                      alt={`Ground image ${index+1}`}
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                      }}
                    />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(!editedGround.images || editedGround.images.length === 0) && (
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                    No images added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive"
                checked={editedGround.is_active}
                onCheckedChange={(checked) => setEditedGround({...editedGround, is_active: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="space-y-2">
              <Label>Amenities & Available Sports Facilities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`}
                      checked={editedGround.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFormOpen(false)}>Cancel</Button>
            <Button onClick={handleEditGround} disabled={isLoading}>
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
              Are you sure you want to delete the ground "{selectedGround?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteGround} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Ground"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGrounds;
