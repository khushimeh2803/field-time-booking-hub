
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportPDFProps {
  contentId: string;
  fileName: string;
  buttonText: string;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ contentId, fileName, buttonText }) => {
  const { toast } = useToast();

  const generatePDF = async () => {
    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your PDF...",
      });
      
      const contentElement = document.getElementById(contentId);
      
      if (!contentElement) {
        throw new Error("Content element not found");
      }
      
      const canvas = await html2canvas(contentElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions based on the content aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add a title to the PDF
      pdf.setFontSize(16);
      pdf.text(`Sports Ground Booking - ${buttonText}`, 20, 20);
      
      // Add a timestamp
      const date = new Date();
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${date.toLocaleString()}`, 20, 30);
      
      // Add the image to the PDF
      let heightLeft = imgHeight;
      let position = 40; // Starting position after title and timestamp
      
      // Add the first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
      heightLeft -= pageHeight - position;
      
      // Add additional pages if content is larger than one page
      while (heightLeft > 0) {
        position = 0;
        pdf.addPage();
        pdf.addImage(
          imgData,
          'PNG',
          10,
          position - (pageHeight - 40),
          imgWidth - 20,
          imgHeight
        );
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`${fileName}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your PDF has been successfully downloaded",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
      });
    }
  };

  return (
    <Button onClick={generatePDF} variant="outline" className="ml-2">
      <Download className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );
};

export default ExportPDF;
