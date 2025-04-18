
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
  MonitorSmartphone, 
  Building, 
  DollarSign, 
  Tag, 
  Check
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

// Simulated ground data
const groundDetails = {
  id: 1,
  name: "Green Valley Stadium",
  sport: "football",
  price: 80,
  image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
  address: "123 Sports Avenue, Stadium District",
};

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
  
  // Booking details
  const [groundId, setGroundId] = useState<string | null>(null);
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
  
  // For card payment (mock)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Parse query parameters to get booking details
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gId = params.get("groundId");
    const dateStr = params.get("date");
    const slots = params.get("slots");

    if (gId) setGroundId(gId);
    
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
      
      // Calculate initial price
      const initialSubtotal = groundDetails.price * slotArray.length;
      setSubtotal(initialSubtotal);
      setTotal(initialSubtotal);
    }
  }, [location.search]);

  // Apply promo code
  const applyPromoCode = () => {
    const foundPromo = promoCodes.find(p => p.code === promoCode);
    if (foundPromo) {
      setAppliedPromo(foundPromo);
      const discountAmount = (subtotal * foundPromo.discount) / 100;
      setTotal(subtotal - discountAmount);
    } else {
      alert("Invalid promo code");
    }
  };

  // Remove applied promo
  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setTotal(subtotal);
  };

  // Handle booking submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert("You must accept the terms and conditions to proceed.");
      return;
    }
    
    // In a real app, you would send the booking data to the server
    console.log("Booking submitted:", {
      groundId,
      date: bookingDate,
      timeSlots: selectedSlots,
      paymentMethod,
      promoCode: appliedPromo?.code || null,
      total,
      cardDetails: paymentMethod === "card" ? { cardName, cardNumber, cardExpiry, cardCvc } : null
    });
    
    // Navigate to booking confirmation
    navigate("/my-bookings");
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
                      <div className="font-medium">{groundDetails.name}</div>
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
                      <div className="font-medium">${groundDetails.price} per hour</div>
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
                    src={groundDetails.image} 
                    alt={groundDetails.name} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">{groundDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">{groundDetails.sport}</p>
                    <p className="text-sm text-muted-foreground">{groundDetails.address}</p>
                  </div>
                </div>
                
                <div className="py-4 border-b space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per hour</span>
                    <span>${groundDetails.price}</span>
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
                      <span>Discount ({appliedPromo.discount}%)</span>
                      <span>-${(subtotal * appliedPromo.discount / 100).toFixed(2)}</span>
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
