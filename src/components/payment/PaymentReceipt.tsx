
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentReceiptProps {
  bookingDetails: {
    id: string;
    groundName: string;
    date: string;
    time: string;
    totalAmount: number;
    paymentMethod: string;
    promoCode?: string;
    membershipApplied?: string;
    userName: string;
  };
}

const PaymentReceipt = ({ bookingDetails }: PaymentReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;

    try {
      toast({
        title: "Preparing PDF",
        description: "Creating your receipt..."
      });

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`booking-receipt-${bookingDetails.id}.pdf`);

      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download receipt. Please try again."
      });
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Payment Receipt</h3>
        <Button variant="outline" size="sm" onClick={downloadReceipt}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div 
        ref={receiptRef} 
        className="bg-white border rounded-lg p-6"
        style={{ minHeight: '400px' }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">Sports Ground Booking</h2>
            <p className="text-sm text-muted-foreground">123 Sports Avenue, Stadium District</p>
            <p className="text-sm text-muted-foreground">New York, NY 10001</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-semibold">Receipt #: {bookingDetails.id.substring(0, 8)}</p>
            <p className="text-sm text-muted-foreground">
              Date: {format(new Date(), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-b py-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{bookingDetails.userName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">{bookingDetails.paymentMethod}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Booking Date</p>
              <p className="font-medium">{bookingDetails.date}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Booking Time</p>
              <p className="font-medium">{bookingDetails.time}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Booking Details</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">{bookingDetails.groundName}</td>
                <td className="text-right py-3">${bookingDetails.totalAmount.toFixed(2)}</td>
              </tr>
              
              {bookingDetails.promoCode && (
                <tr className="border-b text-green-600">
                  <td className="py-2">Promo Code: {bookingDetails.promoCode}</td>
                  <td className="text-right py-2">Applied</td>
                </tr>
              )}
              
              {bookingDetails.membershipApplied && (
                <tr className="border-b text-green-600">
                  <td className="py-2">{bookingDetails.membershipApplied} Membership</td>
                  <td className="text-right py-2">Applied</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="py-3">Total</td>
                <td className="text-right py-3">${bookingDetails.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-1">Thank you for your booking!</p>
          <p>If you have any questions, please contact us at support@sportsground.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
