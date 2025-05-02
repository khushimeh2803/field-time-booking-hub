import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarDays, 
  Clock, 
  CreditCard, 
  Building, 
  DollarSign, 
  Tag, 
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Map for time slots
const timeSlotMap: Record<string, string> = {
  "1": "08:00 - 09:00",
  "2": "09:00 - 10:00",
  "3": "10:00 - 11:00",
  "4": "11:00 - 12:00",
  "5": "12:00 - 13:00",
  "6": "13:00 - 14:00",
  "7": "14:00 - 15:00",
  "8": "15:00 - 16:00",
  "9": "16:00 - 17:00",
  "10": "17:00 - 18:00",
  "11": "18:00 - 19:00",
  "12": "19:00 - 20:00",
  "13": "20:00 - 21:00",
  "14": "21:00 - 22:00"
};

// Sample promo codes
const promoCodes = [
  { code: "FIRST10", discount: 10 },
  { code: "SPORT20", discount: 20 },
  { code: "MEMBER30", discount: 30 }
];

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Booking details
  const [groundId, setGroundId] = useState<string | null>(null);
  const [groundData, setGroundData] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  
  // Payment details
  const [paymentMethod, setPaymentMethod] = useState("venue");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number } | null>(null);
  const [total, setTotal] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Membership details
  const [hasMembership, setHasMembership] = useState(false);
  const [applyMembership, setApplyMembership] = useState(false);
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  
  // For card payment (mock)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  
  // Available promo codes from database
  const [availablePromoCodes, setAvailablePromoCodes] = useState<any[]>([]);

  // Parse query parameters to get booking details
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gId = params.get("groundId");
    const dateStr = params.get("date");
    const slots = params.get("slots");
    const priceParam = params.get("price");

    if (gId) {
      setGroundId(gId);
      fetchGroundDetails(gId);
    }
    
    if (dateStr) {
      try {
        setBookingDate(new Date(dateStr));
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    }
    
    if (slots) {
      const slotArray = slots.split(",");
      setSelectedSlots(slotArray);
      setTotalHours(slotArray.length);
    }

    // If price is passed directly from ground details
    if (priceParam) {
      const price = parseFloat(priceParam);
      if (!isNaN(price)) {
        const slotsCount = slots ? slots.split(",").length : 0;
        const initialSubtotal = price * slotsCount;
        setSubtotal(initialSubtotal);
        setTotal(initialSubtotal);
      }
    }
    
    // Check if user has membership and fetch available promo codes
    checkUserMembership();
    fetchPromoCodes();
  }, [location.search]);

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
        
        // Calculate initial price if not already set by URL param
        if (selectedSlots.length > 0 && subtotal === 0) {
          const initialSubtotal = data.price_per_hour * selectedSlots.length;
          setSubtotal(initialSubtotal);
          setTotal(initialSubtotal);
        }
      }
    } catch (error) {
      console.error("Error fetching ground details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ground details."
      });
    }
  };

  // Check if user has an active membership
  const checkUserMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Check for active membership
      const { data: memberships, error } = await supabase
        .from('user_memberships')
        .select('*, membership_plans(discount_percentage)')
        .eq('user_id', user.id)
        .gte('end_date', today)
        .lt('start_date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking membership:", error);
        return;
      }
      
      if (memberships) {
        setHasMembership(true);
        setMembershipDiscount(memberships.membership_plans.discount_percentage || 0);
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
    }
  };

  // Fetch valid promo codes from the database
  const fetchPromoCodes = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', today)
        .gte('valid_until', today);
      
      if (error) throw error;
      
      setAvailablePromoCodes(data || []);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    const foundPromo = availablePromoCodes.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    
    if (foundPromo) {
      setAppliedPromo({
        code: foundPromo.code,
        discount: foundPromo.discount_percentage
      });
      
      // Calculate new total with promo discount
      calculateTotal(foundPromo.discount_percentage, applyMembership ? membershipDiscount : 0);
      
      toast({
        title: "Promo Code Applied",
        description: `${foundPromo.code} applied with ${foundPromo.discount_percentage}% discount.`
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid or has expired."
      });
    }
  };

  // Remove applied promo
  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    calculateTotal(0, applyMembership ? membershipDiscount : 0);
  };

  // Toggle membership application
  const toggleMembership = (checked: boolean) => {
    setApplyMembership(checked);
    calculateTotal(appliedPromo?.discount || 0, checked ? membershipDiscount : 0);
  };

  // Calculate total price with all applicable discounts
  const calculateTotal = (promoDiscount: number, membershipDiscount: number) => {
    let discountedTotal = subtotal;
    
    // Apply promo code discount first
    if (promoDiscount > 0) {
      const promoDiscountAmount = (subtotal * promoDiscount) / 100;
      discountedTotal -= promoDiscountAmount;
    }
    
    // Then apply membership discount on already discounted amount if any
    if (membershipDiscount > 0) {
      const membershipDiscountAmount = (discountedTotal * membershipDiscount) / 100;
      discountedTotal -= membershipDiscountAmount;
    }
    
    setTotal(discountedTotal);
  };

  // Handle booking submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms & Conditions",
        description: "You must accept the terms and conditions to proceed."
      });
      return;
    }

    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to make a booking."
        });
        return;
      }

      if (!groundId || !bookingDate || selectedSlots.length === 0) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please ensure all booking details are filled correctly."
        });
        return;
      }

      // Example start and end times from first and last slot
      const firstSlot = timeSlotMap[selectedSlots[0]].split(" - ")[0];
      const lastSlot = timeSlotMap[selectedSlots[selectedSlots.length - 1]].split(" - ")[1];

      // Create booking in Supabase
      const { data: bookingData, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          ground_id: groundId,
          booking_date: bookingDate?.toISOString().split('T')[0],
          start_time: firstSlot,
          end_time: lastSlot,
          status: "pending",
          payment_status: paymentMethod === "card" ? "paid" : "pending",
          total_amount: total,
          promo_code: appliedPromo?.code || null,
          membership_applied: applyMembership
        })
        .select();

      if (error) {
        console.error("Booking error:", error);
        throw error;
      }

      toast({
        title: "Booking Successful",
        description: "Your booking has been successfully created!"
      });
      
      // Navigate to booking confirmation
      navigate("/my-bookings");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Failed to create your booking. Please try again."
      });
    }
  };

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Complete Your Booking</h1>
          <p className="text-xl max-w-2xl mx-auto">
            You're just a few steps away from securing your sports venue.
          </p>
        </div>
      </section>

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
                
                {/* Booking Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Venue</div>
                      <div className="font-medium">{groundData?.name || "Loading..."}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium">
                        {bookingDate ? format(bookingDate, "EEEE, MMMM d, yyyy") : "Loading..."}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time Slots</div>
                      <div className="font-medium">
                        {selectedSlots.map(slot => timeSlotMap[slot]).join(", ")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rate</div>
                      <div className="font-medium">${groundData?.price_per_hour || "0"} per hour</div>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmitBooking}>
                  {/* Payment Method */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <RadioGroup 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="venue" id="pay-venue" />
                        <Label htmlFor="pay-venue" className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Pay at Venue
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="pay-card" />
                        <Label htmlFor="pay-card" className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Credit/Debit Card
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Card Payment Details (shown only when card is selected) */}
                  {paymentMethod === "card" && (
                    <div className="mb-8 border p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="card-name">Name on Card</Label>
                          <Input 
                            id="card-name"
                            placeholder="John Smith" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input 
                            id="card-number"
                            placeholder="1234 5678 9012 3456" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="card-expiry">Expiration Date</Label>
                            <Input 
                              id="card-expiry"
                              placeholder="MM/YY" 
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              required={paymentMethod === "card"}
                            />
                          </div>
                          <div>
                            <Label htmlFor="card-cvc">CVC</Label>
                            <Input 
                              id="card-cvc"
                              placeholder="123" 
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              required={paymentMethod === "card"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Membership Discount */}
                  {hasMembership && (
                    <div className="mb-8">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="membership" 
                          checked={applyMembership}
                          onCheckedChange={(checked) => toggleMembership(!!checked)}
                        />
                        <label 
                          htmlFor="membership" 
                          className="text-sm flex items-center"
                        >
                          <span>Apply my membership discount ({membershipDiscount}% off)</span>
                          <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            SAVE ${((subtotal * membershipDiscount) / 100).toFixed(2)}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {/* Promo Code */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Promo Code</h3>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          <span>
                            <span className="font-medium">{appliedPromo.code}</span> - {appliedPromo.discount}% off
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          type="button"
                          onClick={removePromo}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Input 
                          placeholder="Enter promo code" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button 
                          type="button"
                          onClick={applyPromoCode}
                          disabled={!promoCode}
                          className="whitespace-nowrap"
                        >
                          Apply Code
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        required
                      />
                      <label 
                        htmlFor="terms" 
                        className="text-sm text-muted-foreground"
                      >
                        I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Cancellation Policy</a>
                      </label>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
                    disabled={!acceptTerms}
                  >
                    Complete Booking
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
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
                    <span>${groundData?.price_per_hour || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of hours</span>
                    <span>{totalHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-primary">
                      <span>Promo Discount ({appliedPromo.discount}%)</span>
                      <span>-${(subtotal * appliedPromo.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {applyMembership && (
                    <div className="flex justify-between text-primary">
                      <span>Membership Discount ({membershipDiscount}%)</span>
                      <span>-${((subtotal - (appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0)) * membershipDiscount / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {paymentMethod === "venue" 
                      ? "You'll pay this amount at the venue before your booking time."
                      : "Your card will be charged this amount immediately."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Booking;
