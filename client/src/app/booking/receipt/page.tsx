"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBooking } from "../../context/BookingContext";
import { format } from "date-fns";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  QrCode,
  CheckCircle,
  Download,
  MapPin,
  Clock,
  User,
  Bus as BusIcon,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";
import { getCookie } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/lib/interface";
import Header from "@/components/header";
import { createTicket } from "@/api/ticket";
import { Bus } from "@/lib/interface";

const ReceiptPage = () => {
  const { booking, confirmBooking, setBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState<string>("");

  // Refs for GSAP animations
  const pageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get user data
  useEffect(() => {
    const token1 = getCookie("token1") as string | null;
    if (token1) {
      try {
        const decoded: DecodedToken = jwtDecode(token1);
        setUserName(decoded.name || "Unknown User");
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName("Unknown User");
      }
    }
  }, []);

  // Set ticket code from server response
  useEffect(() => {
    if (booking?.ticketCode) {
      setTicketCode(booking.ticketCode);
    }
  }, [booking?.ticketCode]);

  // Debug: Log booking data to console
  useEffect(() => {
    console.log("=== BOOKING DATA DEBUG ===");
    console.log("Full booking object:", booking);
    console.log("Bus name from context:", booking?.bus_name);
    console.log("Route object from context:", booking?.route);
    console.log("Route departure_city:", booking?.route?.departure_city);
    console.log("Route arrival_city:", booking?.route?.arrival_city);
    console.log("Departure city from context:", booking?.departure_city);
    console.log("Arrival city from context:", booking?.arrival_city);
    console.log("Bus object:", booking?.bus);
    console.log("Bus origin:", booking?.bus?.origin);
    console.log("Bus destination:", booking?.bus?.destination);
    console.log("Bus name from bus object:", booking?.bus?.name);
    console.log("Bus busName from bus object:", booking?.bus?.busName);
    console.log(
      "All bus object keys:",
      booking?.bus ? Object.keys(booking.bus) : "No bus object"
    );
    console.log("=========================");
  }, [booking]);

  // Fallback: Update context with bus data if city data is missing
  useEffect(() => {
    const updateCityDataIfMissing = async () => {
      if (!booking) return;

      // Check if we have city data in context
      const hasRouteData =
        booking.route?.departure_city && booking.route?.arrival_city;
      const hasIndividualCityData =
        booking.departure_city && booking.arrival_city;
      const hasBusCityData = booking.bus?.origin && booking.bus?.destination;

      // If we have bus data but no context city data, update the context
      if (
        hasBusCityData &&
        !hasRouteData &&
        !hasIndividualCityData &&
        booking.bus
      ) {
        console.log("=== UPDATING CONTEXT WITH BUS DATA ===");
        console.log("Bus origin:", booking.bus.origin);
        console.log("Bus destination:", booking.bus.destination);
        console.log("Updating context with bus data...");

        setBooking({
          ...booking,
          departure_city: booking.bus.origin,
          arrival_city: booking.bus.destination,
          route: {
            id: booking.route?.id || booking.bus.id?.toString() || "route123",
            departure_city: booking.bus.origin,
            arrival_city: booking.bus.destination,
          },
        });
        console.log("Updated context with bus data");
        console.log("=====================================");
      } else if (!hasRouteData && !hasIndividualCityData && !hasBusCityData) {
        console.log("=== FETCHING CITY DATA FROM API ===");
        console.log("No city data found in context, fetching from API...");

        try {
          // Fetch bus data from API to get city information
          const { getAllBuses } = await import("@/api/bus");
          const result = await getAllBuses();

          if (result.success) {
            const buses = result.data as Bus[];
            const currentBus = buses.find(
              (bus: Bus) => bus.id === booking.bus?.id
            );

            if (currentBus) {
              console.log("Found bus data from API:", currentBus);
              console.log("Bus origin:", currentBus.origin);
              console.log("Bus destination:", currentBus.destination);

              // Update context with fetched data
              if (currentBus.origin && currentBus.destination) {
                setBooking({
                  ...booking,
                  departure_city: currentBus.origin,
                  arrival_city: currentBus.destination,
                  route: {
                    id:
                      booking.route?.id ||
                      currentBus.id?.toString() ||
                      "route123",
                    departure_city: currentBus.origin,
                    arrival_city: currentBus.destination,
                  },
                });
                console.log("Updated context with API data");
              }
            }
          } else {
            console.error("Error fetching bus data:", result.error);
          }
        } catch (error) {
          console.error("Error fetching city data from API:", error);
        }
        console.log("=================================");
      }
    };

    updateCityDataIfMissing();
  }, [booking, setBooking]);

  // GSAP animations on mount
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  if (!booking || !booking.food) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>No booking information available.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  // Calculate the total food price
  const foodTotal = booking.food.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = foodTotal + (booking?.bus?.price || 0);

  // Handle confirmation with GSAP animation
  // const handleConfirmBooking = () => {
  //   if (buttonRef.current) {
  //     gsap.to(buttonRef.current, {
  //       scale: 0.95,
  //       duration: 0.1,
  //       yoyo: true,
  //       repeat: 1,
  //       ease: "power2.out",
  //       onComplete: () => {
  //         confirmBooking();
  //       },
  //     });
  //   } else {
  //     confirmBooking();
  //   }
  // };

  // Handle confirmation and create ticket with rollback logic
  const handleConfirmAndCreateTicket = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLoading(true);

    try {
      // 1. Extract data
      const token1 = getCookie("token1") as string;
      const decoded: DecodedToken = jwtDecode(token1);
      const userId = decoded.id;

      const has_addons = booking.food && booking.food.length > 0;

      const ticketData = {
        user_id: userId,
        bus_id: parseInt(booking.bus?.id?.toString() || "0"),
        no_seat: booking.no_seat,
        total_price: total,
        date: booking.bus?.departureTime
          ? format(new Date(booking.bus.departureTime), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        bus_name: booking.bus_name || booking.bus?.name || "Unknown Bus",
        departure_city:
          booking.route?.departure_city ||
          booking.departure_city ||
          booking.bus?.origin ||
          "Unknown",
        arrival_city:
          booking.route?.arrival_city ||
          booking.arrival_city ||
          booking.bus?.destination ||
          "Unknown",
        has_addons: has_addons,
      };

      // 2. Create ticket
      const ticketResponse = await createTicket(ticketData);
      if (!ticketResponse.success) throw new Error("Failed to create ticket");

      const newTicketCode = (ticketResponse.data as { ticket?: { ticket_code?: string } })?.ticket?.ticket_code;
      if (!newTicketCode) throw new Error("No ticket code returned");

      setTicketCode(newTicketCode);
      setBooking({ ...booking, ticketCode: newTicketCode });

      // 3. If has addons, create addon order
      if (has_addons && booking.food.length > 0) {
        const foodTotalPrice = booking.food.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const foodOrderData = {
          ticket_code: newTicketCode,
          food_items: booking.food,
          total_price: foodTotalPrice,
        };

        const { createAddonOrder } = await import("@/api/addons");
        const addonResponse = await createAddonOrder(foodOrderData);

        if (!addonResponse.success) {
          // Rollback: delete ticket via new endpoint
          console.error("Addon creation failed, rolling back ticket...");
          const { deleteTicket } = await import("@/api/ticket");
          await deleteTicket(newTicketCode);
          throw new Error("Failed to create addons, ticket rolled back");
        }
      }

      // 4. Confirm booking in context
      confirmBooking();
    } catch (error) {
      console.error("Error in booking process:", error);
      alert(
        `Booking failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setTicketCode(null);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // Handle download ticket
  const handleDownloadTicket = async () => {
    if (!ticketCode) {
      alert("Please confirm booking first");
      return;
    }

    try {
      setLoading(true);

      // Generate PDF ticket
      const { generateTicketPDF } = await import("@/lib/pdfUtils");

      if (booking && ticketCode) {
        const pdfBlob = await generateTicketPDF({
          ticket_id: 0,
          user_id: 0,
          bus_id: booking.bus?.id || 0,
          no_seat: booking.no_seat || "Unknown",
          total_price: total,
          ticket_code: ticketCode,
          created_at: new Date().toISOString(),
          departure_city:
            booking.departure_city || booking.bus?.origin || "Unknown",
          arrival_city:
            booking.arrival_city || booking.bus?.destination || "Unknown",
          bus_name: booking.bus_name || booking.bus?.name || "Unknown Bus",
          has_addons: booking.food && booking.food.length > 0,
          date: booking.date?.toISOString() || new Date().toISOString(),
          bus_details: {
            bus_name: booking.bus_name || booking.bus?.name || "Unknown Bus",
            departure_time:
              booking.bus?.departureTime?.toISOString() ||
              new Date().toISOString(),
            price: booking.bus?.price || 0,
            route: {
              departure_city:
                booking.departure_city || booking.bus?.origin || "Unknown",
              arrival_city:
                booking.arrival_city || booking.bus?.destination || "Unknown",
            },
          },
          bus: {
            id: booking.bus?.id || 0,
            name: booking.bus_name || booking.bus?.name || "Unknown Bus",
            origin: booking.departure_city || booking.bus?.origin || "Unknown",
            destination:
              booking.arrival_city || booking.bus?.destination || "Unknown",
            departureTime: booking.bus?.departureTime || new Date(),
            price: booking.bus?.price || 0,
            available_seat: booking.bus?.available_seat || 0,
            seat_capacity: booking.bus?.seat_capacity || 0,
          },
        });

        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${ticketCode}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("Ticket PDF downloaded successfully");
      } else {
        console.error("Missing booking data or ticket code for PDF generation");
      }
    } catch (error) {
      console.error("Error in download ticket:", error);
      alert(
        `Failed to download ticket: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div ref={pageRef} className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Luxe Travel ✦ Booking Receipt
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for booking with Luxe Travel.
            </p>
          </div>

          {/* Main Receipt Card */}
          <Card className="rounded-none shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-8 space-y-8">
              {/* Ticket Code */}
              <div className="text-center border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">Ticket Code</p>
                <p className="text-xl font-bold text-gray-900">
                  {ticketCode || "LUX-AB36281"}
                </p>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Passenger Name */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-none">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Passenger
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {userName}
                    </p>
                  </div>
                </div>

                {/* Bus Name */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-none">
                  <div className="flex-shrink-0">
                    <BusIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Bus Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.bus_name || booking.bus?.name || "Unknown Bus"}
                    </p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-none">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Route
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(() => {
                        // Priority 1: Route object from context
                        if (
                          booking.route?.departure_city &&
                          booking.route?.arrival_city
                        ) {
                          console.log(
                            "Using route object data:",
                            booking.route.departure_city,
                            "→",
                            booking.route.arrival_city
                          );
                          return `${booking.route.departure_city} → ${booking.route.arrival_city}`;
                        }
                        // Priority 2: Individual city fields from context
                        if (booking.departure_city && booking.arrival_city) {
                          console.log(
                            "Using individual city fields:",
                            booking.departure_city,
                            "→",
                            booking.arrival_city
                          );
                          return `${booking.departure_city} → ${booking.arrival_city}`;
                        }
                        // Priority 3: Bus object fallback
                        if (booking.bus?.origin && booking.bus?.destination) {
                          console.log(
                            "Using bus object data:",
                            booking.bus.origin,
                            "→",
                            booking.bus.destination
                          );
                          return `${booking.bus.origin} → ${booking.bus.destination}`;
                        }
                        // Priority 4: Try other bus object fields (if they exist)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (booking.bus as any)?.departure_city &&
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (booking.bus as any)?.arrival_city
                        ) {
                          console.log(
                            "Using bus departure/destination fields:",
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (booking.bus as any).departure_city,
                            "→",
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (booking.bus as any).arrival_city
                          );
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          return `${(booking.bus as any).departure_city} → ${
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (booking.bus as any).arrival_city
                          }`;
                        }
                        // Final fallback
                        console.log("No city data found, using fallback");
                        return "Unknown → Unknown";
                      })()}
                    </p>
                  </div>
                </div>

                {/* Departure Time */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-none">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Departure
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(
                        new Date(booking.bus?.departureTime ?? new Date()),
                        "d MMM yyyy, HH:mm"
                      )}
                    </p>
                  </div>
                </div>

                {/* Seat Number */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-none md:col-span-2">
                  <div className="flex-shrink-0">
                    <QrCode className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Seat Number
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.no_seat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add-ons Section */}
              {booking.food && booking.food.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add-ons
                  </h3>
                  <div className="space-y-3">
                    {booking.food.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-none"
                      >
                        <span className="text-base text-gray-900">
                          {item.food_name} ×{item.quantity}
                        </span>
                        <span className="text-base font-semibold text-gray-900">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Price */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center p-4 bg-gray-900 text-white rounded-none">
                  <span className="text-lg font-medium">Total Price</span>
                  <span className="text-2xl font-bold">
                    Rp {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Confirmation Status */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-none">
                  {booking.isConfirmed ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="text-lg text-green-600 font-semibold">
                        Booking Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-6 w-6 border-2 border-gray-400 rounded-full"></div>
                      <span className="text-lg text-gray-600 font-medium">
                        Pending Confirmation
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-white p-8">
              {!booking.isConfirmed ? (
                <div className="w-full space-y-4">
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-none">
                    <p className="text-sm text-blue-700">
                      Please confirm your booking before downloading the ticket.
                    </p>
                  </div>
                  <Button
                    ref={buttonRef}
                    onClick={handleConfirmAndCreateTicket}
                    disabled={loading}
                    className="w-full rounded-none bg-blue-600 text-white px-8 py-4 hover:bg-blue-700 transition-colors duration-200 shadow-lg text-lg font-semibold"
                  >
                    {loading ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleDownloadTicket}
                  className="w-full rounded-none bg-green-600 text-white px-8 py-4 hover:bg-green-700 transition-colors duration-200 shadow-lg flex items-center justify-center gap-3 text-lg font-semibold"
                >
                  <Download className="h-5 w-5" />
                  Download Ticket
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReceiptPage;
