export interface Bus {
  id: number;
  name: string;
  departureTime: Date;
  origin: string;
  destination: string;
  price: number;
  available_seat: number;
  seat_capacity: number;
}

export interface City {
  city_id: number;
  city_name: string;
}

export interface FoodData {
  food_id: number;
  food_name: string;
  price: number;
  quantity: number;
}
export interface DecodedToken {
  id: number;
  name: string;
  email: string;
  exp: number;
}

export interface Ticket {
  ticket_id: number;
  user_id: number;
  bus_id: number;
  no_seat: string;
  total_price: number;
  ticket_code: string;
  created_at: string; // ISO string format for date-time
  bus: Bus;
}
