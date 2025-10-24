// ============================================================================
// CORE BUSINESS INTERFACES
// ============================================================================

export interface Bus {
  id: number;
  name: string;
  departureTime: Date;
  origin: string;
  destination: string;
  price: number;
  available_seat: number;
  seat_capacity: number;
  busName?: string;
  arrivalTime?: string;
  duration?: string;
  availableSeats?: number;
  amenities?: string[];
  // Alternative Bus interface from utils.ts
  bus_name?: string;
  departure_time?: string;
  route?: Route;
}

export interface City {
  city_id: number;
  city_name: string;
  // Alternative City interface from utils.ts
  city_name_alt?: string;
}

export interface Route {
  route_id: number;
  departure_city_id: number;
  arrival_city_id: number;
  departure_city: City;
  arrival_city: City;
}

export interface FoodData {
  food_id: number;
  food_name: string;
  price: number;
  quantity: number;
}

export interface FoodItem {
  food_id: number;
  food_name: string;
  price: string; // Price is usually stored as string in JSON format
  quantity: number;
  // Alternative FoodItem interface from userTickets.tsx
  food_name_alt?: string;
}

export interface Addon {
  order_id: number;
  ticket_code: string;
  food_items: FoodItem[];
  total_price: string;
  created_at: string; // Date string
}

export interface AddonItem {
  food_items: FoodItem[];
}

export interface Menu {
  food_id: number;
  food_name: string;
  desc: string;
  price: number;
  image_url: string;
}

export interface Ticket {
  ticket_id: number;
  user_id: number;
  bus_id: number;
  no_seat: string;
  total_price: number;
  ticket_code: string;
  created_at: string; // ISO string format for date-time
  departure_city: string;
  arrival_city: string;
  bus_name: string;
  has_addons: boolean;
  date: string;
  bus_details: {
    bus_name: string;
    departure_time: string;
    price: number;
    route: {
      departure_city: string;
      arrival_city: string;
    };
  };
  bus: Bus;
  addons?: AddonItem[]; // Optional addons array
  addonsLoading?: boolean; // Loading state for addons
}

export interface FoodOrder {
  order_id: number;
  ticket_code: string;
  food_items: FoodItem[];
  total_price: string;
  created_at: string;
}

export interface DecodedToken {
  id: number;
  name: string;
  email: string;
  exp: number;
}

// ============================================================================
// BOOKING & CONTEXT INTERFACES
// ============================================================================

export interface BookingData {
  bus: Bus | undefined;
  food: FoodData[];
  no_seat: string;
  total_price: number;
  date?: Date;
  passengers?: number;
  origin?: string;
  destination?: string;
  // Route information structure
  route?: {
    id: string;
    departure_city: string;
    arrival_city: string;
  };
  // New fields for receipt page
  bus_name?: string;
  departure_city?: string;
  arrival_city?: string;
  busName?: string;
  departureRoute?: string;
  departureTime?: string | Date;
  seatNumber?: string | string[];
  ticketCode?: string;
  addons?: FoodData[];
  isConfirmed?: boolean;
}

export interface BookingContextProps {
  booking: BookingData | null;
  setBooking: (data: BookingData) => void;
  clearBooking: () => void;
  confirmBooking: () => void;
}

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

export interface BookingFormProps {
  cities: City[];
  onSearch: (filters?: { origin?: string; destination?: string }) => void;
  loading?: boolean;
}

export interface Trip {
  id: string;
  busName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  amenities: string[];
  route: string;
}

export interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

export interface GSAPWrapperProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "stagger" | "none";
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  className?: string;
}

export interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
  className?: string;
}

export interface DestinationCardProps {
  name: string;
  duration: string;
  price: string;
  features: string[];
  onBook: () => void;
  className?: string;
}

export interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

// ============================================================================
// CAROUSEL TYPES
// ============================================================================

import type { UseEmblaCarouselType } from "embla-carousel-react";

export type CarouselApi = UseEmblaCarouselType[1];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseCarouselParameters = [any?, any?];
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

export type CarouselContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carouselRef: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  opts?: CarouselOptions;
  orientation?: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SearchData = {
  origin: string;
  destination: string;
  date: Date;
  passengers: number;
  class: string;
};

export type AnimationType = "fadeIn" | "slideUp" | "stagger" | "none";

export type CarouselOrientation = "horizontal" | "vertical";
