
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const [companyName, setCompanyName] = useState('Pitch Perfect');
  const [supportEmail, setSupportEmail] = useState('support@pitchperfect.com');
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    try {
      // In a real app, you'd save these settings to a database
      toast({
        title: "Settings Updated",
        description: "Application settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Application Settings</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <Label htmlFor="company-name">Company Name</Label>
          <Input 
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <Label htmlFor="support-email">Support Email</Label>
          <Input 
            id="support-email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            placeholder="Enter support email"
          />
        </div>

        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
