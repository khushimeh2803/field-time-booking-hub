
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X } from "lucide-react";

interface AddGroundFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sport_id: z.string().min(1, "Please select a sport"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  price_per_hour: z.string().refine(val => !isNaN(parseFloat(val)), "Price must be a number"),
  capacity: z.string().refine(val => !isNaN(parseInt(val)), "Capacity must be a number"),
  opening_time: z.string().min(1, "Opening time is required"),
  closing_time: z.string().min(1, "Closing time is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});

const AddGroundForm = ({ open, onOpenChange, onSuccess }: AddGroundFormProps) => {
  const [sports, setSports] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const { toast } = useToast();
  
  // Available amenities with sports facilities
  const availableAmenities = [
    "Parking", "Changing Rooms", "Showers", "Floodlights", "Spectator Seating", 
    "Drinking Water", "Equipment Rental", "Refreshments", "Toilets", "First Aid",
    "Badminton Court", "Cricket Pitch", "Football Field", "Basketball Court",
    "Tennis Court", "Swimming Pool", "Gym", "Volleyball Court", "Table Tennis"
  ];

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sport_id: "",
      address: "",
      price_per_hour: "",
      capacity: "",
      opening_time: "",
      closing_time: "",
      description: "",
      is_active: true,
      images: [],
      amenities: [],
    },
  });

  // Fetch sports for the dropdown
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data, error } = await supabase
          .from("sports")
          .select("id, name")
          .order("name");
        
        if (error) throw error;
        setSports(data || []);
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };

    if (open) {
      fetchSports();
      setImageUrls([]);
      setNewImageUrl("");
      form.reset(); // Reset form when opened
    }
  }, [open, form]);

  // Update the form value when imageUrls changes
  useEffect(() => {
    form.setValue("images", imageUrls);
  }, [imageUrls, form]);

  // Add image URL to the list
  const handleAddImage = () => {
    if (newImageUrl && newImageUrl.trim() !== "") {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  // Remove image URL from the list
  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("grounds")
        .insert({
          name: values.name,
          sport_id: values.sport_id,
          address: values.address,
          price_per_hour: parseFloat(values.price_per_hour),
          capacity: parseInt(values.capacity),
          opening_time: values.opening_time,
          closing_time: values.closing_time,
          description: values.description || null,
          is_active: values.is_active,
          images: imageUrls.length > 0 ? imageUrls : null,
          amenities: values.amenities || null,
        });
      
      if (error) throw error;
      
      toast({
        title: "Ground Added",
        description: "New ground has been successfully added."
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add ground"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    const currentAmenities = form.getValues("amenities") || [];
    const amenityExists = currentAmenities.includes(amenity);
    
    if (amenityExists) {
      form.setValue("amenities", currentAmenities.filter(a => a !== amenity));
    } else {
      form.setValue("amenities", [...currentAmenities, amenity]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Ground</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new sports ground.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ground Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Central Football Ground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sport_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport.id} value={sport.id}>
                              {sport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full address of the ground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_per_hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Hour (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 22" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="opening_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="closing_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the ground features and highlights" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Gallery Section */}
            <div className="space-y-2">
              <FormLabel>Ground Images</FormLabel>
              <FormDescription>
                Add image URLs for the ground. These will be displayed to users.
              </FormDescription>
              
              <div className="flex gap-2 mb-2">
                <Input 
                  placeholder="Enter image URL" 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleAddImage}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group border rounded-md overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Ground preview ${index+1}`} 
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Invalid+Image";
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {imageUrls.length === 0 && (
                  <div className="border border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center text-gray-500">
                    No images added yet
                  </div>
                )}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Set as active to make this ground bookable for users.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities & Available Sports Facilities</FormLabel>
                  <FormDescription>
                    Select all amenities and sports facilities available at this ground.
                  </FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity}`}
                          checked={(field.value || []).includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label 
                          htmlFor={`amenity-${amenity}`}
                          className="text-sm cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Ground"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroundForm;
