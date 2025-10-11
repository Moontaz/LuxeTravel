import { createContext, useContext, useState, ReactNode } from "react";
import {
  Bus,
  FoodData,
  BookingData,
  BookingContextProps,
} from "../../lib/interface";

const BookingContext = createContext<BookingContextProps | undefined>(
  undefined
);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [booking, setBooking] = useState<BookingData | null>(null);

  const clearBooking = () => setBooking(null);

  const confirmBooking = () => {
    if (booking) {
      setBooking({ ...booking, isConfirmed: true });
    }
  };

  return (
    <BookingContext.Provider
      value={{ booking, setBooking, clearBooking, confirmBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
