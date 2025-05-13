
interface OrderSummaryProps {
  groundData: any;
  subtotal: number;
  total: number;
  totalHours: number;
  appliedPromo: { code: string, discount: number } | null;
  applyMembership: boolean;
  membershipDiscount: number;
  membershipDetails?: { name: string, price: number } | null;
  applyFeedbackDiscount: boolean;
  feedbackDiscount: number;
  paymentMethod: string;
}

const OrderSummary = ({
  groundData,
  subtotal,
  total,
  totalHours,
  appliedPromo,
  applyMembership,
  membershipDiscount,
  membershipDetails,
  applyFeedbackDiscount,
  feedbackDiscount,
  paymentMethod
}: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      <div className="flex items-center gap-4 pb-4 border-b">
        <img 
          src={groundData?.images?.[0] || "https://images.unsplash.com/photo-1487466365202-1afdb86c764e"} 
          alt={groundData?.name || "Sports Ground"} 
          className="w-20 h-20 object-cover rounded-md"
        />
        <div>
          <h3 className="font-medium">{groundData?.name || "Loading..."}</h3>
          <p className="text-sm text-muted-foreground">{groundData?.sport_id || "Sports"}</p>
          <p className="text-sm text-muted-foreground">{groundData?.address || "Address unavailable"}</p>
        </div>
      </div>
      
      <div className="py-4 border-b space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price per hour</span>
          <span>₹{groundData?.price_per_hour || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Number of hours</span>
          <span>{totalHours}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        {appliedPromo && (
          <div className="flex justify-between text-primary">
            <span>Promo Discount ({appliedPromo.discount}%)</span>
            <span>-₹{(subtotal * appliedPromo.discount / 100).toFixed(2)}</span>
          </div>
        )}
        
        {applyMembership && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-primary">
              <span>Membership Discount ({membershipDiscount}%)</span>
              <span>-₹{((subtotal - (appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0)) * membershipDiscount / 100).toFixed(2)}</span>
            </div>
            {membershipDetails && (
              <div className="text-xs text-muted-foreground pl-2">
                {membershipDetails.name} Membership (₹{membershipDetails.price})
              </div>
            )}
          </div>
        )}
        
        {applyFeedbackDiscount && (
          <div className="flex justify-between text-primary">
            <span>Feedback Discount ({feedbackDiscount}%)</span>
            <span>-₹{((subtotal - 
              (appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0) - 
              (applyMembership ? ((subtotal - (appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0)) * membershipDiscount / 100) : 0)
            ) * feedbackDiscount / 100).toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {paymentMethod === "venue" 
            ? "You'll pay this amount at the venue before your booking time."
            : "Your card will be charged this amount immediately."}
        </p>
        
        {membershipDetails && applyMembership && (
          <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
            <p className="text-xs text-green-800">
              Your {membershipDetails.name} membership is being applied for this booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
