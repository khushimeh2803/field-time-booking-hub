
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

interface MembershipPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number;
  discount_percentage: number;
  created_at: string;
}

const Membership = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    const fetchMembershipPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .select('*')
          .order('price', { ascending: true });
          
        if (error) throw error;
        
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load membership plans.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    fetchMembershipPlans();
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a membership plan.",
      });
      navigate('/signin?redirect=membership');
      return;
    }
    
    // Navigate to checkout or implement subscription logic here
    console.log(`Subscribe to plan: ${planId}`);
    
    toast({
      title: "Subscription initiated",
      description: "You will be redirected to complete your subscription.",
    });
  };

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Membership Plans</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Join our membership program and get exclusive benefits, including discounts on bookings and priority access to premium facilities.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground">
                We offer flexible membership options to suit your needs and preferences.
              </p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading membership plans...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12">
                <p>No membership plans available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card key={plan.id} className="border-2 hover:border-primary/50 transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/{plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                          <span>{plan.discount_percentage}% discount on all bookings</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                          <span>Priority booking access</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                          <span>Extended booking hours</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                          <span>Access to premium facilities</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        Subscribe Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">How do membership discounts work?</h3>
                <p className="text-muted-foreground">
                  Once you subscribe to a membership plan, your discount will automatically be applied to all eligible bookings. The discount percentage depends on your membership tier.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Can I upgrade my membership plan?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade your membership plan at any time. The price difference will be prorated based on the remaining time in your current subscription.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">How do I cancel my membership?</h3>
                <p className="text-muted-foreground">
                  You can cancel your membership from your account settings. Cancellations will take effect at the end of your current billing period.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Are there any refunds for cancelled memberships?</h3>
                <p className="text-muted-foreground">
                  We don't offer refunds for cancelled memberships, but you can continue to use your membership benefits until the end of your billing period.
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
