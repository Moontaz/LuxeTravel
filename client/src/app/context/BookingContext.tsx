import { createContext, useContext, useState, ReactNode } from "react";
import { Bus, FoodData } from "../../lib/interface";

interface BookingData {
  bus: Bus | undefined;
  food: FoodData[];
  no_seat: string;
  total_price: number;
}

interface BookingContextProps {
  booking: BookingData | null;
  setBooking: (data: BookingData) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(
  undefined
);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [booking, setBooking] = useState<BookingData | null>(null);

  const clearBooking = () => setBooking(null);

  return (
    <BookingContext.Provider value={{ booking, setBooking, clearBooking }}>
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
