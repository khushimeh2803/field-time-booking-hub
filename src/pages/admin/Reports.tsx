
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const downloadReport = async (reportType: string) => {
    setIsLoading(true);
    try {
      let reportData;
      switch(reportType) {
        case 'users':
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("id, full_name, email, role, created_at");
          if (userError) throw userError;
          reportData = userData;
          break;
        case 'grounds':
          const { data: groundData, error: groundError } = await supabase
            .from("grounds")
            .select("*, sports(name)");
          if (groundError) throw groundError;
          reportData = groundData;
          break;
        case 'bookings':
          const { data: bookingData, error: bookingError } = await supabase
            .from("bookings")
            .select("*, grounds(name), profiles(full_name)");
          if (bookingError) throw bookingError;
          reportData = bookingData;
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Convert data to CSV
      const csvContent = convertToCSV(reportData);
      downloadCSV(csvContent, `${reportType}_report.csv`);

      toast({
        title: "Report Generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report downloaded successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${reportType} report`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers
          .map(header => {
            const cell = row[header];
            return cell === null || cell === undefined ? '' 
              : `"${String(cell).replace(/"/g, '""')}"`;
          })
          .join(',')
      )
    ];

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generate Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Users Report</h2>
          <Button 
            onClick={() => downloadReport('users')} 
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Grounds Report</h2>
          <Button 
            onClick={() => downloadReport('grounds')} 
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Bookings Report</h2>
          <Button 
            onClick={() => downloadReport('bookings')} 
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
