
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroundImageManagerProps {
  groundId: string;
  currentImages: string[];
  onImagesUpdate: (newImages: string[]) => void;
}

const GroundImageManager = ({ groundId, currentImages, onImagesUpdate }: GroundImageManagerProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddImage = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Test if the image URL is valid
      const testImage = new Image();
      testImage.src = imageUrl;
      
      // Add the image URL to the current images
      const newImages = [...currentImages, imageUrl];
      
      // Update the ground record with the new images array
      const { error } = await supabase
        .from("grounds")
        .update({ images: newImages })
        .eq("id", groundId);
        
      if (error) throw error;
      
      onImagesUpdate(newImages);
      setImageUrl("");
      
      toast({
        title: "Success",
        description: "Image added successfully",
      });
    } catch (error: any) {
      console.error("Error adding image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add image",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      setIsSubmitting(true);
      
      // Create a copy of the current images array and remove the image at the specified index
      const newImages = [...currentImages];
      newImages.splice(index, 1);
      
      // Update the ground record with the modified images array
      const { error } = await supabase
        .from("grounds")
        .update({ images: newImages })
        .eq("id", groundId);
        
      if (error) throw error;
      
      onImagesUpdate(newImages);
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error: any) {
      console.error("Error removing image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove image",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ground Images</h3>
      
      <div className="flex flex-wrap gap-4">
        {currentImages.map((image, index) => (
          <div key={index} className="relative">
            <img 
              src={image} 
              alt={`Ground ${index + 1}`} 
              className="w-24 h-24 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1487466365202-1afdb86c764e";
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
              onClick={() => handleRemoveImage(index)}
              disabled={isSubmitting}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        
        {currentImages.length === 0 && (
          <div className="flex items-center justify-center w-24 h-24 bg-muted rounded-md">
            <ImageIcon className="text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button 
          onClick={handleAddImage}
          disabled={isSubmitting || !imageUrl.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Add image URLs from Google or other sources. Images will be displayed in the order they are added.
      </p>
    </div>
  );
};

export default GroundImageManager;
