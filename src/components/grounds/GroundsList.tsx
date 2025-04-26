
import { Skeleton } from "@/components/ui/skeleton";
import GroundCard from "./GroundCard";

interface GroundsListProps {
  grounds: any[];
  isLoading: boolean;
}

const GroundsList = ({ grounds, isLoading }: GroundsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[400px] w-full" />
        ))}
      </div>
    );
  }

  if (grounds.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2">No Grounds Found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to find more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {grounds.map((ground) => (
        <GroundCard key={ground.id} ground={ground} />
      ))}
    </div>
  );
};

export default GroundsList;
