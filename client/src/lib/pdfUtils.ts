import jsPDF from "jspdf";
import { Ticket, FoodItem } from "./interface";
import { fetchTicketAddons } from "./utils";

export const generateTicketPDF = async (ticket: Ticket): Promise<Blob> => {
  // Check if we're in browser environment (Vercel compatibility)
  if (typeof window === "undefined") {
    throw new Error("PDF generation is only available in browser environment");
  }

  const doc = new jsPDF();

  // Set font
  doc.setFont("helvetica");

  // Colors
  const primaryColor = [41, 41, 41]; // Gray-900
  const secondaryColor = [107, 114, 128]; // Gray-500
  const accentColor = [0, 0, 0]; // Black

  // Header
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("LUXE TRAVEL", 20, 30);

  doc.setFontSize(16);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("Bus Ticket", 20, 40);

  // Ticket Code
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`Ticket Code: ${ticket.ticket_code}`, 20, 55);

  // Trip Information
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("TRIP INFORMATION", 20, 75);

  // Trip details
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  const tripName = ticket.bus_name || ticket.bus?.name || "Unknown Bus";
  const origin = ticket.departure_city || ticket.bus?.origin || "Unknown";
  const destination =
    ticket.arrival_city || ticket.bus?.destination || "Unknown";
  const departureTime = ticket.bus_details?.departure_time
    ? new Date(ticket.bus_details.departure_time).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : ticket.bus?.departureTime
    ? new Date(ticket.bus.departureTime).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time not available";

  doc.text(`Trip: ${tripName}`, 20, 85);
  doc.text(`Route: ${origin} → ${destination}`, 20, 95);
  doc.text(`Departure: ${departureTime}`, 20, 105);
  doc.text(`Seat: ${ticket.no_seat}`, 20, 115);

  // Price
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("PRICE INFORMATION", 20, 135);

  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(ticket.total_price);

  doc.text(`Total Price: ${formattedPrice}`, 20, 145);

  // Add-ons section
  let yPosition = 165;
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("ADD-ONS", 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  // Fetch add-ons from API
  let foodItems: FoodItem[] = [];
  try {
    foodItems = await fetchTicketAddons(ticket.ticket_code);
  } catch (error) {
    console.error("Error fetching add-ons for PDF:", error);
  }

  if (foodItems && foodItems.length > 0) {
    // Add table header
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Food Name", 20, yPosition);
    doc.text("Qty", 80, yPosition);
    doc.text("Price", 110, yPosition);
    doc.text("Subtotal", 150, yPosition);
    yPosition += 8;

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    let totalAddonsPrice = 0;

    foodItems.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      const subtotal = price * quantity;
      totalAddonsPrice += subtotal;

      // Food name (with text wrapping)
      const foodName = item.food_name;
      const nameWidth = doc.getTextWidth(foodName);
      if (nameWidth > 55) {
        // Split long food names
        const words = foodName.split(" ");
        let currentLine = "";
        let lineY = yPosition;
        for (const word of words) {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          if (doc.getTextWidth(testLine) > 55) {
            doc.text(currentLine, 20, lineY);
            lineY += 4;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          doc.text(currentLine, 20, lineY);
        }
        yPosition = lineY + 5;
      } else {
        doc.text(foodName, 20, yPosition);
        yPosition += 5;
      }

      // Quantity
      doc.text(quantity.toString(), 80, yPosition - 5);

      // Price
      const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
      doc.text(formattedPrice, 110, yPosition - 5);

      // Subtotal
      const formattedSubtotal = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(subtotal);
      doc.text(formattedSubtotal, 150, yPosition - 5);

      yPosition += 3;
    });

    // Add total line
    yPosition += 5;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Total Add-ons:", 110, yPosition);
    const formattedTotal = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(totalAddonsPrice);
    doc.text(formattedTotal, 150, yPosition);
    yPosition += 8;
  } else {
    doc.text("No add-ons selected", 20, yPosition);
    yPosition += 5;
  }

  // Status
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("STATUS", 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text("Confirmed", 20, yPosition);

  // Current Date
  yPosition += 15;
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const currentDate = new Date().toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated on: ${currentDate}`, 20, yPosition);

  // Footer
  yPosition += 20;
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("Thank you for choosing Luxe Travel!", 20, yPosition);
  doc.text("For support, contact: support@luxetravel.com", 20, yPosition + 5);

  // Return the PDF as Blob
  return doc.output("blob");
};
