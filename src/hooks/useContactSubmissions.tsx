
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string | null;
}

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      console.error("Error fetching contact submissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load contact submissions",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteSubmission = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Update the local state by removing the deleted submission
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      
      toast({
        title: "Submission Deleted",
        description: "The contact submission has been deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete submission",
      });
    }
  }, [toast]);

  // Fetch submissions when the component mounts
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    isLoading,
    fetchSubmissions,
    deleteSubmission,
  };
}
