import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DecodedToken } from "./interface";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const getId = (name: string) => {
  const token = getCookie(name);
  const decoded = jwtDecode<DecodedToken>(token || "");
  return decoded.id;
};

export const generateTicketCode = (isOrderFood: boolean): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  // Generate the first 2 alphabetic characters
  let code = "LUX-";
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    code += alphabet[randomIndex];
  }

  // Generate the next 4 numeric characters
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    code += numbers[randomIndex];
  }

  // Append '1' or '0' depending on isOrderFood
  code += isOrderFood ? "1" : "0";

  return code;
};
// FoodItem interface for ordered food
interface FoodItem {
  food_id: number;
  food_name: string;
  price: string; // Price is usually stored as string in JSON format
  quantity: number;
}

// Addon interface for food order
interface Addon {
  order_id: number;
  ticket_code: string;
  food_items: FoodItem[];
  total_price: string;
  created_at: string; // Date string
}

// Bus, Route, City interfaces remain the same
interface City {
  city_name: string;
}

interface Route {
  route_id: number;
  departure_city_id: number;
  arrival_city_id: number;
  departure_city: City;
  arrival_city: City;
}

interface Bus {
  bus_name: string;
  departure_time: string; // Date string
  price: number;
  route: Route;
}

// Ticket interface including Addon
export interface Ticket {
  ticket_id: number;
  user_id: number;
  bus_id: number;
  no_seat: string;
  total_price: number;
  ticket_code: string;
  created_at: string; // Date string
  bus: Bus;
  addon?: Addon; // Optional addon field (not all tickets have addons)
}
export const getUserTickets = async () => {
  const user_id = getId("token1");
  const token1 = getCookie("token1");

  if (!token1) {
    console.error("Token1 is missing. User might not be authenticated.");
    return [];
  }

  try {
    // Step 1: Get all tickets for the user
    const ticketResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BUS_URL}/api/bus/tickets/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (!ticketResponse.ok) {
      throw new Error("Failed to fetch user tickets.");
    }

    let tickets = await ticketResponse.json();

    // Step 2: For each ticket, check if the last digit of the ticket_code is 1
    tickets = await Promise.all(
      tickets.map(async (ticket: Ticket) => {
        const { ticket_code } = ticket;

        if (ticket_code.endsWith("1")) {
          const token2 = getCookie("token2"); // Token for the food API

          if (!token2) {
            console.error("Token2 is missing. Cannot fetch food orders.");
            return ticket;
          }

          try {
            const foodResponse = await fetch(
              `${process.env.NEXT_PUBLIC_FOOD_URL}/api/food/getorder/${ticket_code}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token2}`,
                },
              }
            );

            if (!foodResponse.ok) {
              throw new Error(
                `Failed to fetch food order for ticket ${ticket_code}`
              );
            }

            const foodOrder = await foodResponse.json();
            return { ...ticket, addon: foodOrder }; // Add food order to the ticket
          } catch (error) {
            console.error(
              `Error fetching food order for ticket ${ticket_code}:`,
              error
            );
            return ticket;
          }
        }

        return ticket;
      })
    );

    return tickets;
  } catch (error) {
    console.error("Error fetching user tickets or food orders:", error);
    return [];
  }
};
