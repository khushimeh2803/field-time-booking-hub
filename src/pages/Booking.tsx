
import React from 'react';
import BookingForm from '@/components/booking/BookingForm';
import { useBooking } from '@/hooks/useBooking';

const Booking = () => {
  const {
    groundId,
    setGroundId,
    selectedDate,
    setSelectedDate,
    selectedStartTime,
    setSelectedStartTime,
    selectedEndTime,
    setSelectedEndTime,
    totalAmount,
    setTotalAmount,
    promoCode,
    setPromoCode,
    membershipApplied,
    setMembershipApplied,
    handleBooking,
  } = useBooking();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Booking Page</h1>
      <BookingForm
        groundId={groundId}
        selectedDate={selectedDate}
        selectedStartTime={selectedStartTime}
        selectedEndTime={selectedEndTime}
        totalAmount={totalAmount}
        promoCode={promoCode}
        membershipApplied={membershipApplied}
        onGroundIdChange={setGroundId}
        onDateChange={setSelectedDate}
        onStartTimeChange={setSelectedStartTime}
        onEndTimeChange={setSelectedEndTime}
        onTotalAmountChange={setTotalAmount}
        onPromoCodeChange={setPromoCode}
        onMembershipAppliedChange={setMembershipApplied}
        onSubmit={handleBooking}
      />
    </div>
  );
};

export default Booking;
