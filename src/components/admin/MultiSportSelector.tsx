
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

interface Sport {
  id: string;
  name: string;
}

interface MultiSportSelectorProps {
  selectedSportId: string;
  additionalSportIds: string[];
  onSportsChange: (mainSportId: string, additionalSportIds: string[]) => void;
}

const MultiSportSelector = ({
  selectedSportId,
  additionalSportIds,
  onSportsChange
}: MultiSportSelectorProps) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("sports")
          .select("id, name")
          .order("name");
          
        if (error) throw error;
        setSports(data || []);
      } catch (error) {
        console.error("Error fetching sports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSports();
  }, []);

  const handleSelectMainSport = (sportId: string) => {
    // Ensure the main sport isn't in the additional sports list
    const newAdditionalSports = additionalSportIds.filter(id => id !== sportId);
    onSportsChange(sportId, newAdditionalSports);
  };

  const handleToggleAdditionalSport = (sportId: string) => {
    // Don't allow selecting the main sport as an additional sport
    if (sportId === selectedSportId) return;
    
    const newAdditionalSports = [...additionalSportIds];
    const index = newAdditionalSports.indexOf(sportId);
    
    if (index === -1) {
      // Add the sport
      newAdditionalSports.push(sportId);
    } else {
      // Remove the sport
      newAdditionalSports.splice(index, 1);
    }
    
    onSportsChange(selectedSportId, newAdditionalSports);
  };

  const getSelectedSportName = (id: string) => {
    const sport = sports.find(s => s.id === id);
    return sport ? sport.name : "Select Sport";
  };
  
  const getAvailableSports = () => {
    return sports.filter(sport => sport.id !== selectedSportId);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Primary Sport</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              disabled={isLoading}
            >
              {selectedSportId 
                ? getSelectedSportName(selectedSportId) 
                : "Select primary sport"}
              <PlusCircle className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {sports.map((sport) => (
                    <CommandItem
                      key={sport.id}
                      value={sport.id}
                      onSelect={() => handleSelectMainSport(sport.id)}
                    >
                      {sport.name}
                      {selectedSportId === sport.id && (
                        <CheckIcon className="h-4 w-4 ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Additional Sports Available</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              disabled={isLoading || !selectedSportId}
            >
              Select additional sports
              <PlusCircle className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {getAvailableSports().map((sport) => (
                    <CommandItem
                      key={sport.id}
                      value={sport.id}
                      onSelect={() => handleToggleAdditionalSport(sport.id)}
                    >
                      {sport.name}
                      {additionalSportIds.includes(sport.id) && (
                        <CheckIcon className="h-4 w-4 ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {additionalSportIds.map((sportId) => (
            <Badge 
              key={sportId} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getSelectedSportName(sportId)}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleToggleAdditionalSport(sportId)}
              >
                ×
              </Button>
            </Badge>
          ))}
          
          {additionalSportIds.length === 0 && selectedSportId && (
            <p className="text-xs text-muted-foreground">
              No additional sports selected. The ground will be listed only under {getSelectedSportName(selectedSportId)}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSportSelector;
