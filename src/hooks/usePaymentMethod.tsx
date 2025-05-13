
import { useState } from "react";

export interface CardDetails {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface CardDetailSetters {
  setCardName: (name: string) => void;
  setCardNumber: (number: string) => void;
  setCardExpiry: (expiry: string) => void;
  setCvc: (cvc: string) => void;
}

export const usePaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState("venue");
  
  // Card payment details (mock)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Card details object
  const cardDetails: CardDetails = {
    cardName,
    cardNumber,
    cardExpiry,
    cardCvc
  };

  // Card details setters
  const setCardDetails: CardDetailSetters = {
    setCardName,
    setCardNumber,
    setCardExpiry,
    setCvc: setCardCvc
  };

  return {
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails
  };
};
