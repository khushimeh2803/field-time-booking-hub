import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AddGroundFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Ground name must be at least 2 characters"),
  sport_id: z.string().uuid("Invalid sport selection"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  capacity: z.coerce.number().int().positive("Capacity must be a positive number"),
  price_per_hour: z.coerce.number().positive("Price must be a positive number"),
  description: z.string().optional(),
  opening_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  closing_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  amenities: z.array(z.string()).optional(),
  additional_sports: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// List of available amenities
const availableAmenities = [
  { id: "changing-rooms", label: "Changing Rooms" },
  { id: "showers", label: "Showers" },
  { id: "floodlights", label: "Floodlights" },
  { id: "parking", label: "Parking" },
  { id: "spectator-seating", label: "Spectator Seating" },
  { id: "scoreboard", label: "Scoreboard" },
  { id: "cafeteria", label: "Cafeteria" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "locker", label: "Lockers" },
  { id: "equipment-rental", label: "Equipment Rental" },
];

const AddGroundForm: React.FC<AddGroundFormProps> = ({ open, onOpenChange, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<any[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sport_id: "",
      address: "",
      capacity: 0,
      price_per_hour: 0,
      description: "",
      opening_time: "08:00",
      closing_time: "22:00",
      amenities: [],
      additional_sports: [],
    },
  });

  useEffect(() => {
    if (open) {
      fetchSports();
      form.reset({
        name: "",
        sport_id: "",
        address: "",
        capacity: 0,
        price_per_hour: 0,
        description: "",
        opening_time: "08:00",
        closing_time: "22:00",
        amenities: [],
        additional_sports: [],
      });
    }
  }, [open, form]);

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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("grounds")
        .insert([
          {
            name: values.name,
            sport_id: values.sport_id,
            address: values.address,
            capacity: values.capacity,
            price_per_hour: values.price_per_hour,
            description: values.description || null,
            opening_time: values.opening_time,
            closing_time: values.closing_time,
            amenities: values.amenities && values.amenities.length > 0 
              ? values.amenities.map(a => availableAmenities.find(am => am.id === a)?.label || a) 
              : null,
            additional_sports: values.additional_sports && values.additional_sports.length > 0
              ? values.additional_sports.map(sportId => {
                  const sport = sports.find(s => s.id === sportId);
                  return sport ? sport.name : null;
                }).filter(Boolean)
              : null,
          },
        ]);

      if (error) throw error;
      
      toast({
        title: "Ground Added",
        description: `${values.name} has been successfully added`,
      });
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Add Ground",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get the selected additional sports
  const getSelectedAdditionalSports = () => {
    const additionalSports = form.watch('additional_sports') || [];
    return sports
      .filter(sport => additionalSports.includes(sport.id))
      .map(sport => ({
        id: sport.id,
        name: sport.name
      }));
  };

  // Remove a sport from additional sports
  const removeAdditionalSport = (sportId: string) => {
    const currentSports = form.getValues('additional_sports') || [];
    form.setValue(
      'additional_sports',
      currentSports.filter(id => id !== sportId)
    );
  };

  // Add a sport to additional sports
  const addAdditionalSport = (sportId: string) => {
    const primarySportId = form.getValues('sport_id');
    if (sportId === primarySportId) {
      toast({
        variant: "destructive",
        title: "Invalid Selection",
        description: "You cannot add the primary sport as an additional sport",
      });
      return;
    }
    
    const currentSports = form.getValues('additional_sports') || [];
    if (!currentSports.includes(sportId)) {
      form.setValue('additional_sports', [...currentSports, sportId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Ground</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ground Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Central Park Field" {...field} />
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
                    <FormLabel>Primary Sport Type</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        // Remove from additional sports if it's now the primary sport
                        const additionalSports = form.getValues('additional_sports') || [];
                        if (additionalSports.includes(value)) {
                          form.setValue(
                            'additional_sports', 
                            additionalSports.filter(id => id !== value)
                          );
                        }
                        field.onChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Additional Sports Section */}
            <FormField
              control={form.control}
              name="additional_sports"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">Additional Sports Available</FormLabel>
                    <FormDescription>
                      Select other sports that can be played at this ground
                    </FormDescription>
                  </div>
                  
                  {/* Display selected sports as badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getSelectedAdditionalSports().map(sport => (
                      <Badge key={sport.id} variant="secondary" className="px-2 py-1">
                        {sport.name}
                        <button 
                          type="button" 
                          onClick={() => removeAdditionalSport(sport.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {getSelectedAdditionalSports().length === 0 && (
                      <p className="text-sm text-muted-foreground">No additional sports selected</p>
                    )}
                  </div>
                  
                  {/* Dropdown to add more sports */}
                  <Select
                    onValueChange={(value) => {
                      addAdditionalSport(value);
                    }}
                    value=""
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Add another sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sports
                        .filter(sport => sport.id !== form.getValues('sport_id'))
                        .filter(sport => !(form.getValues('additional_sports') || []).includes(sport.id))
                        .map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_per_hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Hour</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Amenities</FormLabel>
                    <FormDescription>
                      Select the amenities available at this ground
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableAmenities.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amenity.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValues, amenity.id])
                                      : field.onChange(
                                          currentValues.filter((value) => value !== amenity.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {amenity.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter ground description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Ground
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroundForm;
