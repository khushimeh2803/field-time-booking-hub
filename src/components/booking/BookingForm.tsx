
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import TimeSelection from './TimeSelection';

interface BookingFormProps {
  groundId: string;
  selectedDate: Date | undefined;
  selectedStartTime: string;
  selectedEndTime: string;
  totalAmount: number;
  promoCode: string;
  membershipApplied: boolean;
  onGroundIdChange: (id: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onTotalAmountChange: (amount: number) => void;
  onPromoCodeChange: (code: string) => void;
  onMembershipAppliedChange: (applied: boolean) => void;
  onSubmit: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  groundId,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  totalAmount,
  promoCode,
  membershipApplied,
  onGroundIdChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onTotalAmountChange,
  onPromoCodeChange,
  onMembershipAppliedChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <Label htmlFor="ground-id">Ground ID</Label>
        <Input
          id="ground-id"
          type="text"
          value={groundId}
          onChange={(e) => onGroundIdChange(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="mt-1"
        />
      </div>

      <TimeSelection
        selectedStartTime={selectedStartTime}
        selectedEndTime={selectedEndTime}
        onStartTimeChange={onStartTimeChange}
        onEndTimeChange={onEndTimeChange}
      />

      <div>
        <Label htmlFor="total-amount">Total Amount</Label>
        <Input
          id="total-amount"
          type="number"
          value={totalAmount}
          onChange={(e) => onTotalAmountChange(Number(e.target.value))}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="promo-code">Promo Code</Label>
        <Input
          id="promo-code"
          type="text"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="membership"
          checked={membershipApplied}
          onChange={(e) => onMembershipAppliedChange(e.target.checked)}
        />
        <Label htmlFor="membership">Apply Membership</Label>
      </div>

      <Button onClick={onSubmit} className="w-full">Create Booking</Button>
    </div>
  );
};

export default BookingForm;
