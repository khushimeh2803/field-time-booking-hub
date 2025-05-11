
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface GroundHeaderProps {
  name: string;
  sportName: string | undefined;
  address: string;
}

const GroundHeader = ({ name, sportName, address }: GroundHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{name}</h1>
      <div className="flex items-center mt-2">
        <Badge variant="outline" className="mr-2">
          {sportName || "Sports"}
        </Badge>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
};

export default GroundHeader;
