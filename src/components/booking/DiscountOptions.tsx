
import { Checkbox } from "@/components/ui/checkbox";

interface DiscountOptionsProps {
  hasFeedbackHistory: boolean;
  applyFeedbackDiscount: boolean;
  toggleFeedbackDiscount: (checked: boolean) => void;
  feedbackDiscount: number;
  hasMembership: boolean;
  applyMembership: boolean;
  toggleMembership: (checked: boolean) => void;
  membershipDiscount: number;
  subtotal: number;
}

const DiscountOptions = ({
  hasFeedbackHistory,
  applyFeedbackDiscount,
  toggleFeedbackDiscount,
  feedbackDiscount,
  hasMembership,
  applyMembership,
  toggleMembership,
  membershipDiscount,
  subtotal
}: DiscountOptionsProps) => {
  return (
    <>
      {/* Feedback Discount */}
      {hasFeedbackHistory && (
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="feedback-discount" 
              checked={applyFeedbackDiscount}
              onCheckedChange={(checked) => toggleFeedbackDiscount(!!checked)}
            />
            <label 
              htmlFor="feedback-discount" 
              className="text-sm flex items-center"
            >
              <span>Apply feedback discount ({feedbackDiscount}% off)</span>
              <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                SAVE ₹{((subtotal * feedbackDiscount) / 100).toFixed(2)}
              </span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-6">
            As a valued customer who has provided feedback, you're eligible for a special discount!
          </p>
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
                SAVE ₹{((subtotal * membershipDiscount) / 100).toFixed(2)}
              </span>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountOptions;
