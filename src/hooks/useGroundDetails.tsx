
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGroundDetails = (groundId: string | null) => {
  const [groundData, setGroundData] = useState<any>(null);
  const { toast } = useToast();

  // Fetch ground details from Supabase
  const fetchGroundDetails = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('grounds')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setGroundData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching ground details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ground details."
      });
      return null;
    }
  };

  useEffect(() => {
    if (groundId) {
      fetchGroundDetails(groundId);
    }
  }, [groundId]);

  return { groundData };
};
