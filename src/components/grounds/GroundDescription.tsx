
import { Users, Clock, CalendarDays, Star } from "lucide-react";

interface GroundDescriptionProps {
  description: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  rating: string | number;
}

const GroundDescription = ({ 
  description, 
  capacity, 
  openingTime, 
  closingTime, 
  rating 
}: GroundDescriptionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About this venue</h2>
      <p className="text-muted-foreground">
        {description || "No description available."}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
          <Users className="h-6 w-6 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Capacity</span>
          <span className="font-medium">{capacity} people</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
          <Clock className="h-6 w-6 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Hours</span>
          <span className="font-medium">{openingTime} - {closingTime}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
          <CalendarDays className="h-6 w-6 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Availability</span>
          <span className="font-medium">Daily</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
          <Star className="h-6 w-6 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Rating</span>
          <span className="font-medium">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default GroundDescription;
