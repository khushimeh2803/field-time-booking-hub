
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestBooking = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view payment details",
            variant: "destructive"
          });
          navigate('/signin');
          return;
        }

        const userId = session.session.user.id;
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setBooking(data[0]);
        } else {
          toast({
            title: "No Booking Found",
            description: "No recent booking was found",
            variant: "destructive"
          });
          navigate('/booking');
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch booking details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooking();
  }, [navigate, toast]);

  const handlePaymentSuccess = async () => {
    if (!booking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully"
      });

      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handlePaymentCancel = () => {
    navigate('/booking');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading payment details...</div>;
  }

  if (!booking) {
    return <div className="flex justify-center items-center min-h-screen">No booking found</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>Review your booking details and complete payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Booking Date:</div>
            <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
            
            <div className="font-medium">Time:</div>
            <div>{booking.start_time} - {booking.end_time}</div>
            
            <div className="font-medium">Amount:</div>
            <div>${booking.total_amount}</div>
            
            {booking.promo_code && (
              <>
                <div className="font-medium">Promo Code:</div>
                <div>{booking.promo_code}</div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePaymentCancel}>
            Cancel
          </Button>
          <Button onClick={handlePaymentSuccess}>
            Complete Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
