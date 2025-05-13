
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DiscountState {
  // Membership details
  hasMembership: boolean;
  applyMembership: boolean;
  membershipDiscount: number;
  membershipDetails: { name: string; price: number } | null;
  
  // Feedback history
  hasFeedbackHistory: boolean;
  applyFeedbackDiscount: boolean;
  feedbackDiscount: number;
  
  // Promo code
  promoCode: string;
  appliedPromo: { code: string; discount: number } | null;
  availablePromoCodes: any[];
}

export interface DiscountActions {
  setPromoCode: (code: string) => void;
  applyPromoCode: () => void;
  removePromo: () => void;
  toggleMembership: (checked: boolean) => void;
  toggleFeedbackDiscount: (checked: boolean) => void;
  calculateTotal: (promoDiscount: number, membershipDiscount: number, feedbackDiscount: number) => void;
}

export const useDiscounts = (
  userId: string | undefined,
  subtotal: number,
  setTotal: (value: number) => void
): [DiscountState, DiscountActions] => {
  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [availablePromoCodes, setAvailablePromoCodes] = useState<any[]>([]);
  
  // Membership state
  const [hasMembership, setHasMembership] = useState(false);
  const [applyMembership, setApplyMembership] = useState(false);
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [membershipDetails, setMembershipDetails] = useState<{ name: string; price: number } | null>(null);
  
  // Feedback history
  const [hasFeedbackHistory, setHasFeedbackHistory] = useState(false);
  const [applyFeedbackDiscount, setApplyFeedbackDiscount] = useState(false);
  const [feedbackDiscount] = useState(10); // Fixed 10% discount for feedback

  // Check if user has a feedback history for discount eligibility
  const checkUserFeedbackHistory = async (userId: string) => {
    try {
      // Check if user has submitted any feedback
      const { data: feedbackData, error } = await supabase
        .from('booking_feedback')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error) throw error;
      
      // If user has feedback history, they are eligible for a 10% discount
      if (feedbackData && feedbackData.length > 0) {
        setHasFeedbackHistory(true);
      }
    } catch (error) {
      console.error("Error checking feedback history:", error);
    }
  };

  // Check if user has an active membership
  const checkUserMembership = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check for active membership
      const { data: memberships, error } = await supabase
        .from('user_memberships')
        .select('*, membership_plans(*)')
        .eq('user_id', userId)
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
        setMembershipDetails({
          name: memberships.membership_plans.name,
          price: memberships.membership_plans.price
        });
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
      calculateTotal(foundPromo.discount_percentage, applyMembership ? membershipDiscount : 0, applyFeedbackDiscount ? feedbackDiscount : 0);
      
      return true;
    }
    
    return false;
  };

  // Remove applied promo
  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    calculateTotal(0, applyMembership ? membershipDiscount : 0, applyFeedbackDiscount ? feedbackDiscount : 0);
  };

  // Toggle membership application
  const toggleMembership = (checked: boolean) => {
    setApplyMembership(checked);
    calculateTotal(appliedPromo?.discount || 0, checked ? membershipDiscount : 0, applyFeedbackDiscount ? feedbackDiscount : 0);
  };

  // Toggle feedback discount application
  const toggleFeedbackDiscount = (checked: boolean) => {
    setApplyFeedbackDiscount(checked);
    calculateTotal(appliedPromo?.discount || 0, applyMembership ? membershipDiscount : 0, checked ? feedbackDiscount : 0);
  };

  // Calculate total price with all applicable discounts
  const calculateTotal = (promoDiscount: number, membershipDiscount: number, feedbackDiscount: number) => {
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
    
    // Finally apply feedback discount if applicable
    if (feedbackDiscount > 0) {
      const feedbackDiscountAmount = (discountedTotal * feedbackDiscount) / 100;
      discountedTotal -= feedbackDiscountAmount;
    }
    
    setTotal(discountedTotal);
  };

  // Initialize discounts if userId exists
  useEffect(() => {
    if (userId) {
      checkUserMembership(userId);
      checkUserFeedbackHistory(userId);
    }
    fetchPromoCodes();
  }, [userId]);

  return [
    {
      hasMembership,
      applyMembership,
      membershipDiscount,
      membershipDetails,
      hasFeedbackHistory,
      applyFeedbackDiscount,
      feedbackDiscount,
      promoCode,
      appliedPromo,
      availablePromoCodes
    },
    {
      setPromoCode,
      applyPromoCode,
      removePromo,
      toggleMembership,
      toggleFeedbackDiscount,
      calculateTotal
    }
  ];
};
