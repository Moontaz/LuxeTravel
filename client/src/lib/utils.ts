import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DecodedToken, Ticket, FoodOrder, FoodItem } from "./interface";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "@/utils/cookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export cookie utilities from centralized location
export {
  getCookie,
  setCookie,
  deleteCookie,
  getAuthTokens,
  clearAuthTokens,
} from "@/utils/cookies";

export const getId = (name: string) => {
  const token = getCookie(name);
  const decoded = jwtDecode<DecodedToken>(token || "");
  return decoded.id;
};

export const generateTicketCode = (
  isOrderFood: boolean,
  userData?: { name: string; id: number },
  busData?: {
    name: string;
    id: number;
    origin: string;
    destination: string;
    departureTime: Date;
  }
): string => {
  // If we have user and bus data, create a meaningful ticket code
  if (userData && busData) {
    // Extract initials from user name with validation
    const userName = userData.name || "UNKNOWN";
    const userNameInitials = userName
      .split(" ")
      .filter((name) => name.trim().length > 0)
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2)
      .padEnd(2, "U"); // Pad with 'U' if less than 2 chars

    // Extract initials from bus name with validation
    const busName = busData.name || "UNKNOWN";
    const busNameInitials = busName
      .split(" ")
      .filter((name) => name.trim().length > 0)
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2)
      .padEnd(2, "B"); // Pad with 'B' if less than 2 chars

    // Extract route initials with validation
    const origin = busData.origin || "U";
    const destination = busData.destination || "U";
    const routeInitials = `${origin.charAt(0)}${destination.charAt(
      0
    )}`.toUpperCase();

    // Extract date components with validation
    let day = "01";
    let month = "01";
    let hour = "00";

    try {
      const date = new Date(busData.departureTime);
      if (!isNaN(date.getTime())) {
        day = date.getDate().toString().padStart(2, "0");
        month = (date.getMonth() + 1).toString().padStart(2, "0");
        hour = date.getHours().toString().padStart(2, "0");
      }
    } catch (error) {
      console.warn("Invalid departure time, using defaults:", error);
    }

    // Create meaningful ticket code
    const code = `LUX-${userNameInitials}${busNameInitials}${routeInitials}${day}${month}${hour}${
      isOrderFood ? "1" : "0"
    }`;

    return code;
  }

  // Fallback to random code if no data provided
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
// All interfaces moved to lib/interface.tsx

// Ticket interface moved to lib/interface.tsx
export const fetchUserTicketsWithAddons = async () => {
  const user_id = getId("token1");

  if (!user_id) {
    console.error("User ID is missing. User might not be authenticated.");
    return [];
  }

  try {
    // Import API functions dynamically to avoid circular dependencies
    const { getTicketsByUserId } = await import("@/api/ticket");
    const { getAddonOrder } = await import("@/api/addons");

    // Step 1: Get all tickets for the user
    const ticketResult = await getTicketsByUserId(user_id);

    if (!ticketResult.success) {
      console.error("Failed to fetch user tickets:", ticketResult.error);
      return [];
    }

    let tickets = ticketResult.data;

    // Step 2: Add addons for tickets that have them
    tickets = await Promise.all(
      tickets.map(async (ticket: Ticket) => {
        const { ticket_code } = ticket;

        if (ticket_code.endsWith("1")) {
          try {
            const addonResult = await getAddonOrder(ticket_code);

            if (addonResult.success) {
              return { ...ticket, addon: addonResult.data };
            } else {
              console.error(
                `Error fetching food order for ticket ${ticket_code}:`,
                addonResult.error
              );
              return ticket;
            }
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

export const fetchTicketAddons = async (
  ticketCode: string
): Promise<FoodItem[]> => {
  try {
    // Import API function dynamically to avoid circular dependencies
    const { getAddonOrder } = await import("@/api/addons");

    const result = await getAddonOrder(ticketCode);

    if (result.success) {
      const data: FoodOrder[] = result.data || [];

      // Extract food_items from all orders and flatten them
      const allFoodItems: FoodItem[] = [];
      if (Array.isArray(data)) {
        data.forEach((order: FoodOrder) => {
          if (order.food_items && Array.isArray(order.food_items)) {
            allFoodItems.push(...order.food_items);
          }
        });
      }

      return allFoodItems;
    } else {
      console.error("Error fetching ticket add-ons:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching ticket add-ons:", error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
};
