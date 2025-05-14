
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Image } from 'lucide-react';

interface GroundImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const GroundImageUploader = ({ images = [], onChange }: GroundImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    
    // Check if URL is already in the list
    if (images.includes(imageUrl)) {
      setImageUrl('');
      return;
    }
    
    onChange([...images, imageUrl]);
    setImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Ground Images</Label>
      
      {/* Upload from URL input */}
      <div className="flex space-x-2">
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL from Google or other source"
          className="flex-grow"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddImageUrl}
          disabled={!imageUrl.trim()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Add URL
        </Button>
      </div>
      
      {/* Images preview grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((url, index) => (
          <div key={index} className="relative group overflow-hidden rounded-md border border-gray-200">
            <img 
              src={url} 
              alt={`Ground image ${index+1}`}
              className="w-full h-40 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {images.length === 0 && (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-8 text-gray-500">
            <Image className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-sm">No images added yet</p>
            <p className="text-xs mt-1">Add image URLs above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundImageUploader;
