
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CheckCircle, IndianRupee } from "lucide-react";
import { format, addMonths } from "date-fns";

const Membership = () => {
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [userMembership, setUserMembership] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Card payment state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembershipPlans();
    checkUserMembership();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .order("price");

      if (error) throw error;
      setMembershipPlans(data || []);
    } catch (error) {
      console.error("Error fetching membership plans:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load membership plans.",
      });
    }
  };

  const checkUserMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*, membership_plans(*)")
        .eq("user_id", user.id)
        .gte("end_date", today)
        .lte("start_date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }
      
      setUserMembership(data);
    } catch (error) {
      console.error("Error checking user membership:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to purchase a membership."
        });
        navigate("/signin");
        return;
      }

      const today = new Date();
      const endDate = addMonths(today, selectedPlan.duration_months);

      const { error } = await supabase
        .from("user_memberships")
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          start_date: today.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Membership Activated",
        description: `Your ${selectedPlan.name} membership has been successfully activated.`
      });

      setIsDialogOpen(false);
      checkUserMembership(); // Refresh membership status
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process your membership purchase."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getMembershipEndDate = () => {
    if (!userMembership) return "";
    return format(new Date(userMembership.end_date), "MMMM d, yyyy");
  };

  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Membership Plans</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our membership program to get exclusive discounts on all ground bookings and priority access to popular venues.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        {isLoading ? (
          <div className="text-center">Loading membership plans...</div>
        ) : userMembership ? (
          <div className="max-w-md mx-auto bg-primary/5 rounded-xl p-8 border border-primary/20 text-center">
            <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Active Membership</h2>
            <p className="text-primary font-semibold text-xl mb-1">
              {userMembership.membership_plans.name}
            </p>
            <p className="text-muted-foreground mb-4">
              Your membership is active until {getMembershipEndDate()}
            </p>
            <div className="bg-primary/10 p-4 rounded-lg mb-6">
              <p className="font-medium">Booking Discount</p>
              <p className="text-2xl font-bold text-primary">
                {userMembership.membership_plans.discount_percentage}% OFF
              </p>
              <p className="text-sm text-muted-foreground">
                on all sports ground bookings
              </p>
            </div>
            <Button onClick={() => navigate("/grounds")} className="w-full">
              Book Grounds Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan) => (
              <Card key={plan.id} className={plan.name === "Premium" ? "border-primary shadow-lg" : ""}>
                {plan.name === "Premium" && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="ml-1 text-muted-foreground">/{plan.duration_months} months</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <span>{plan.discount_percentage}% discount on all bookings</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <span>Priority booking access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <span>No cancellation fees</span>
                    </div>
                    {plan.name !== "Basic" && (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span>Exclusive event invitations</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSelectPlan(plan)} 
                    className="w-full"
                    variant={plan.name === "Premium" ? "default" : "outline"}
                  >
                    Get {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase {selectedPlan?.name} Membership</DialogTitle>
              <DialogDescription>
                Complete your payment to activate your membership.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span>Membership Plan:</span>
                <span className="font-medium">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Duration:</span>
                <span className="font-medium">{selectedPlan?.duration_months} months</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Discount:</span>
                <span className="font-medium">{selectedPlan?.discount_percentage}% on bookings</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                <span>Total:</span>
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {selectedPlan?.price}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-name">Name on Card</Label>
                <Input 
                  id="card-name"
                  placeholder="John Smith" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input 
                  id="card-number"
                  placeholder="1234 5678 9012 3456" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input 
                    id="card-cvc"
                    placeholder="123" 
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handlePaymentSubmit}
                disabled={!cardName || !cardNumber || !cardExpiry || !cardCvc || isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Purchase"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Membership Benefits</h2>
            <p className="text-muted-foreground mb-8">
              Take advantage of these exclusive benefits available to all our members.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Save on Every Booking</h3>
                <p className="text-muted-foreground">
                  Members get discount on all ground bookings, which can save you thousands of rupees annually.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Priority Access</h3>
                <p className="text-muted-foreground">
                  Get priority booking access during peak hours and for popular venues and events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Membership;
