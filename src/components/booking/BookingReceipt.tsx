
import React from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingReceiptProps {
  booking: {
    id: string;
    groundName: string;
    date: Date;
    timeSlots: string[];
    price: number;
    status: string;
    address: string;
    paymentMethod: string;
  };
}

const BookingReceipt = ({ booking }: BookingReceiptProps) => {
  const { toast } = useToast();

  const generateReceipt = async () => {
    try {
      toast({
        title: "Preparing Receipt",
        description: "Please wait while we generate your receipt...",
      });
      
      const receiptElement = document.getElementById("booking-receipt");
      
      if (!receiptElement) {
        throw new Error("Receipt element not found");
      }
      
      // Make the receipt visible for html2canvas
      const origDisplay = receiptElement.style.display;
      receiptElement.style.display = "block";
      
      const canvas = await html2canvas(receiptElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      // Hide the receipt again
      receiptElement.style.display = origDisplay;
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add logo and title
      pdf.setFontSize(20);
      pdf.text("Sports Ground Booking Receipt", 105, 15, { align: "center" });
      
      // Add the receipt image
      pdf.addImage(imgData, 'PNG', 10, 30, imgWidth - 20, imgHeight - 40);
      
      // Save the PDF
      pdf.save(`booking-receipt-${booking.id}.pdf`);
      
      toast({
        title: "Receipt Downloaded",
        description: "Your booking receipt has been successfully downloaded",
      });
    } catch (error: any) {
      console.error("Error generating receipt:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error generating your receipt. Please try again.",
      });
    }
  };

  return (
    <div>
      <Button 
        onClick={generateReceipt} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        Download Receipt
      </Button>
      
      {/* Hidden receipt template that will be converted to PDF */}
      <div id="booking-receipt" className="hidden p-8 bg-white" style={{ width: '800px' }}>
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold">Booking Receipt</h1>
              <p className="text-muted-foreground">#{booking.id}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Sports Ground Booking</p>
              <p>123 Sports Avenue</p>
              <p>Stadium District</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Ground</p>
                <p className="font-medium">{booking.groundName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{format(booking.date, "EEEE, MMMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">{booking.timeSlots.join(", ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium uppercase">{booking.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{booking.address}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium">{booking.paymentMethod}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total Amount</p>
              <p className="font-bold text-xl">${booking.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4 text-center text-sm text-muted-foreground">
            <p>Thank you for your booking!</p>
            <p>For any queries, please contact support@sportsgroundbooking.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReceipt;
