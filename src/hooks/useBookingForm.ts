
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { timeSlotMap } from "@/utils/timeSlotUtils";

interface BookingFormState {
  groundId: string | null;
  groundData: any;
  bookingDate: Date | null;
  selectedSlots: string[];
  totalHours: number;
  subtotal: number;
  paymentMethod: string;
  promoCode: string;
  appliedPromo: { code: string, discount: number } | null;
  total: number;
  acceptTerms: boolean;
  hasMembership: boolean;
  applyMembership: boolean;
  membershipDiscount: number;
  membershipDetails: { name: string, price: number } | null;
  hasFeedbackHistory: boolean;
  applyFeedbackDiscount: boolean;
  feedbackDiscount: number;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  availablePromoCodes: any[];
}

export const useBookingForm = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  // Initialize state with default values
  const [state, setState] = useState<BookingFormState>({
    groundId: null,
    groundData: null,
    bookingDate: null,
    selectedSlots: [],
    totalHours: 0,
    subtotal: 0,
    paymentMethod: "venue",
    promoCode: "",
    appliedPromo: null,
    total: 0,
    acceptTerms: false,
    hasMembership: false,
    applyMembership: false,
    membershipDiscount: 0,
    membershipDetails: null,
    hasFeedbackHistory: false,
    applyFeedbackDiscount: false,
    feedbackDiscount: 10,
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    availablePromoCodes: []
  });

  // Update specific state properties
  const updateState = (updates: Partial<BookingFormState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Initialize booking data from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gId = params.get("groundId");
    const dateStr = params.get("date");
    const slots = params.get("slots");
    const priceParam = params.get("price");

    if (gId) {
      updateState({ groundId: gId });
      fetchGroundDetails(gId);
    }
    
    if (dateStr) {
      try {
        updateState({ bookingDate: new Date(dateStr) });
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    }
    
    if (slots) {
      const slotArray = slots.split(",");
      updateState({ 
        selectedSlots: slotArray,
        totalHours: slotArray.length
      });
    }

    // If price is passed directly from ground details
    if (priceParam) {
      const price = parseFloat(priceParam);
      if (!isNaN(price)) {
        const slotsCount = slots ? slots.split(",").length : 0;
        const initialSubtotal = price * slotsCount;
        updateState({ 
          subtotal: initialSubtotal,
          total: initialSubtotal
        });
      }
    }
    
    // Check if user has membership and fetch available promo codes
    checkUserMembership();
    fetchPromoCodes();
    checkUserFeedbackHistory();
  }, [location.search]);

  // Fetch ground details
  const fetchGroundDetails = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('grounds')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        updateState({ groundData: data });
        
        // Calculate initial price if not already set by URL param
        if (state.selectedSlots.length > 0 && state.subtotal === 0) {
          const initialSubtotal = data.price_per_hour * state.selectedSlots.length;
          updateState({
            subtotal: initialSubtotal,
            total: initialSubtotal
          });
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
        .select('*, membership_plans(*)')
        .eq('user_id', user.id)
        .gte('end_date', today)
        .lte('start_date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking membership:", error);
        return;
      }
      
      if (memberships) {
        updateState({
          hasMembership: true,
          membershipDiscount: memberships.membership_plans.discount_percentage || 0,
          membershipDetails: {
            name: memberships.membership_plans.name,
            price: memberships.membership_plans.price
          }
        });
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
    }
  };

  // Check if user has feedback history
  const checkUserFeedbackHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has submitted any feedback
      const { data: feedbackData, error } = await supabase
        .from('booking_feedback')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) throw error;
      
      // If user has feedback history, they are eligible for a 10% discount
      if (feedbackData && feedbackData.length > 0) {
        updateState({ hasFeedbackHistory: true });
      }
    } catch (error) {
      console.error("Error checking feedback history:", error);
    }
  };

  // Fetch available promo codes
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
      
      updateState({ availablePromoCodes: data || [] });
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    const foundPromo = state.availablePromoCodes.find(
      p => p.code.toLowerCase() === state.promoCode.toLowerCase()
    );
    
    if (foundPromo) {
      updateState({ appliedPromo: {
        code: foundPromo.code,
        discount: foundPromo.discount_percentage
      }});
      
      // Calculate new total with promo discount
      calculateTotal(
        foundPromo.discount_percentage, 
        state.applyMembership ? state.membershipDiscount : 0, 
        state.applyFeedbackDiscount ? state.feedbackDiscount : 0
      );
      
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
    updateState({
      appliedPromo: null,
      promoCode: ""
    });
    calculateTotal(
      0, 
      state.applyMembership ? state.membershipDiscount : 0, 
      state.applyFeedbackDiscount ? state.feedbackDiscount : 0
    );
  };

  // Toggle membership application
  const toggleMembership = (checked: boolean) => {
    updateState({ applyMembership: checked });
    calculateTotal(
      state.appliedPromo?.discount || 0,
      checked ? state.membershipDiscount : 0, 
      state.applyFeedbackDiscount ? state.feedbackDiscount : 0
    );
  };

  // Toggle feedback discount
  const toggleFeedbackDiscount = (checked: boolean) => {
    updateState({ applyFeedbackDiscount: checked });
    calculateTotal(
      state.appliedPromo?.discount || 0, 
      state.applyMembership ? state.membershipDiscount : 0,
      checked ? state.feedbackDiscount : 0
    );
  };

  // Calculate total price with all applicable discounts
  const calculateTotal = (promoDiscount: number, membershipDiscount: number, feedbackDiscount: number) => {
    let discountedTotal = state.subtotal;
    
    // Apply promo code discount first
    if (promoDiscount > 0) {
      const promoDiscountAmount = (state.subtotal * promoDiscount) / 100;
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
    
    updateState({ total: discountedTotal });
  };

  // Set card details (from payment form)
  const setCardDetails = {
    setCardName: (name: string) => updateState({ cardName: name }),
    setCardNumber: (number: string) => updateState({ cardNumber: number }),
    setCardExpiry: (expiry: string) => updateState({ cardExpiry: expiry }),
    setCardCvc: (cvc: string) => updateState({ cardCvc: cvc }),
  };

  // Set other form fields
  const setPromoCode = (code: string) => updateState({ promoCode: code });
  const setPaymentMethod = (method: string) => updateState({ paymentMethod: method });
  const setAcceptTerms = (accept: boolean) => updateState({ acceptTerms: accept });

  // Card details object for the PaymentMethodSelector component
  const cardDetails = {
    cardName: state.cardName,
    cardNumber: state.cardNumber,
    cardExpiry: state.cardExpiry,
    cardCvc: state.cardCvc
  };

  return {
    ...state,
    setPromoCode,
    setPaymentMethod,
    setAcceptTerms,
    applyPromoCode,
    removePromo,
    toggleMembership,
    toggleFeedbackDiscount,
    cardDetails,
    setCardDetails,
    timeSlotMap
  };
};
