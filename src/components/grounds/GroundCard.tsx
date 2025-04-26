
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Users } from "lucide-react";

interface GroundCardProps {
  ground: {
    id: string;
    name: string;
    sport: string;
    price: number;
    image: string;
    address: string;
    rating: number;
    totalRatings: number;
    type: string;
    capacity: string;
    availability: string;
  };
}

const GroundCard = ({ ground }: GroundCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img 
          src={ground.image} 
          alt={ground.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-accent text-white m-2 px-2 py-1 rounded text-sm font-medium">
          {ground.type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{ground.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span>{ground.rating} ({ground.totalRatings})</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{ground.address}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="truncate">{ground.availability}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 text-muted-foreground mr-1" />
            <span>{ground.capacity}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="font-bold text-lg">
            {ground.price === 0 ? "Free" : `$${ground.price}/hr`}
          </span>
          <Link to={`/grounds/${ground.id}`}>
            <Button className="bg-primary hover:bg-primary/90">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroundCard;
