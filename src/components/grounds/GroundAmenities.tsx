
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

  // Separate sports-related amenities from general amenities
  const sportsAmenities = amenities.filter(amenity => 
    ["Badminton Court", "Cricket Pitch", "Football Field", "Basketball Court"].includes(amenity)
  );
  
  const generalAmenities = amenities.filter(amenity => 
    !["Badminton Court", "Cricket Pitch", "Football Field", "Basketball Court"].includes(amenity)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {generalAmenities.map((amenity, index) => (
            <div key={index} className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>
      
      {sportsAmenities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Other Sports Available Here</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sportsAmenities.map((sport, index) => (
              <div key={index} className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>{sport}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroundAmenities;
