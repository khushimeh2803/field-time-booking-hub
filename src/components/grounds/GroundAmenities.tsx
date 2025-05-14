
import { Check } from "lucide-react";

interface GroundAmenitiesProps {
  amenities: string[];
}

const GroundAmenities = ({ amenities }: GroundAmenitiesProps) => {
  // If no amenities provided, show a message
  if (!amenities || amenities.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <p className="text-muted-foreground">No amenities information available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroundAmenities;
