"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBooking } from "../../context/BookingContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import Link from "next/link";
import { BusFront, MapPin, Clock, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getBookedSeatsByBusId } from "@/api/bus";

const BusBookingPage = () => {
  const { booking, setBooking } = useBooking();
  const router = useRouter();

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [unavailableSeats, setUnavailableSeats] = useState<string[]>([]);
  const [loadingSeats, setLoadingSeats] = useState<boolean>(true);
  const [seatError, setSeatError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Refs for GSAP animations
  const pageRef = useRef<HTMLDivElement>(null);
  const seatMapRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Function to handle seat selection with animation
  const handleSeatSelection = (seatNumber: string) => {
    setSelectedSeat(seatNumber);

    // Animate seat selection
    if (seatMapRef.current) {
      gsap.to(seatMapRef.current.querySelector(`[data-seat="${seatNumber}"]`), {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
  };

  // GSAP animations on mount
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }

    if (seatMapRef.current) {
      gsap.fromTo(
        seatMapRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    }

    if (summaryRef.current) {
      gsap.fromTo(
        summaryRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    const fetchUnavailableSeats = async () => {
      if (booking?.bus?.id) {
        try {
          setLoadingSeats(true); // Start loading
          const result = await getBookedSeatsByBusId(booking.bus.id);

          if (result.success) {
            setUnavailableSeats(
              (result.data as { bookedSeats: string[] }).bookedSeats || []
            );
          } else {
            console.error("Error fetching unavailable seats:", result.error);
            setSeatError("Failed to load seats. Please try again later.");
          }
        } catch (error) {
          console.error("Failed to fetch unavailable seats:", error);
          setSeatError("Failed to load seats. Please try again later.");
        } finally {
          setLoadingSeats(false); // Stop loading
        }
      }
    };

    fetchUnavailableSeats();
  }, [booking?.bus?.id]);

  const isSeatUnavailable = (seatNumber: string) => {
    return unavailableSeats.includes(seatNumber);
  };

  const totalRows = 10; // Define how many rows you want (A1-D10)

  // Handle bus selection and navigate to food selection
  const handleSelectBus = () => {
    setLoading(true);
    const noSeat = selectedSeat || "";

    // Debug: Log current booking data
    console.log("=== BUS SELECTION DEBUG ===");
    console.log("Current booking:", booking);
    console.log("Selected seat:", noSeat);
    console.log("Bus object:", booking?.bus);
    console.log("Bus origin:", booking?.bus?.origin);
    console.log("Bus destination:", booking?.bus?.destination);
    console.log("===========================");

    if (booking) {
      // Extract city data from bus object with fallbacks
      const departureCity =
        booking.route?.departure_city ||
        booking.departure_city ||
        booking.bus?.origin ||
        "Unknown";

      const destinationCity =
        booking.route?.destination_city ||
        booking.destination_city ||
        booking.bus?.destination ||
        "Unknown";

      const busName =
        booking.bus_name ||
        booking.bus?.name ||
        booking.bus?.busName ||
        "Unknown Bus";

      setBooking({
        ...booking, // Spread existing booking fields
        no_seat: noSeat,
        // Ensure route data is preserved and updated
        bus_name: busName,
        departure_city: departureCity,
        destination_city: destinationCity,
        route: {
          id: booking.route?.id || booking.bus?.id?.toString() || "route123",
          departure_city: departureCity,
          destination_city: destinationCity,
        },
      });

      // Debug: Log what we're storing
      console.log("=== STORING UPDATED BOOKING ===");
      console.log("Bus name:", busName);
      console.log("Departure city:", departureCity);
      console.log("Destination city:", destinationCity);
      console.log("Route object:", {
        id: booking.route?.id || booking.bus?.id?.toString() || "route123",
        departure_city: departureCity,
        destination_city: destinationCity,
      });
      console.log("=============================");
    }
    // Navigate to the addon page
    router.push(`/booking/addon`);
  };

  if (!booking) {
    // If booking data is missing or not properly populated, show a fallback
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>No booking information available.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading addon...</p>
      </div>
    );
  }
  return (
    <div ref={pageRef} className="min-h-screen bg-white text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Seat
          </h1>
          <p className="text-gray-600">
            Choose your preferred seat for a comfortable journey
          </p>
        </div>

        {/* Bus Details Card */}
        <Card className="mb-8 rounded-none shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-50 p-3 lg:p-6">
            <CardTitle className="flex items-center gap-2">
              <BusFront className="h-5 w-5" />
              Bus Details
            </CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {booking.bus?.origin} → {booking.bus?.destination}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(
                  new Date(booking.bus?.departureTime ?? new Date()),
                  "d MMMM yyyy, HH:mm"
                )}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Bus Map for Selecting Seats */}
          <div className="flex-1 lg:w-2/3">
            {loadingSeats ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-600">Loading seats...</span>
              </div>
            ) : seatError ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{seatError}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div ref={seatMapRef} className="w-full">
                <Card className="rounded-none shadow-sm border border-gray-200">
                  <CardHeader className="p-3 lg:p-6">
                    <CardTitle className="text-lg">Seat Map</CardTitle>
                    <CardDescription>
                      Click on an available seat to select it
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row p-2 justify-between lg:block">
                    {/* Desktop: Horizontal Layout */}
                    <div className="hidden lg:block">
                      <div className="flex gap-4 pl-10 pr-5 py-3 border-2 border-gray-300 h-max w-max mx-auto">
                        {/* Driver's seat at the top */}
                        <div className="bg-gray-800 text-white py-3 px-3 rounded-none h-max flex items-center justify-center">
                          <BusFront className="h-6 w-6" />
                        </div>
                        {/* Loop to generate each row */}
                        <div className="flex flex-row gap-2">
                          {[...Array(totalRows)].map((_, rowIndex) => (
                            <div
                              key={rowIndex}
                              className="grid grid-cols-1 gap-3 items-center"
                            >
                              {/* Left side - Seats C and D */}
                              <div className="grid grid-rows-2 gap-2">
                                {["D", "C"].map((seatType) => {
                                  const seatNumber = `${seatType}${
                                    rowIndex + 1
                                  }`;
                                  const isUnavailable =
                                    isSeatUnavailable(seatNumber);
                                  return (
                                    <Button
                                      key={seatNumber}
                                      data-seat={seatNumber}
                                      variant={
                                        isUnavailable
                                          ? "default"
                                          : selectedSeat === seatNumber
                                          ? "default"
                                          : "outline"
                                      }
                                      disabled={isUnavailable}
                                      onClick={() =>
                                        handleSeatSelection(seatNumber)
                                      }
                                      className="h-12 w-12 rounded-none flex justify-center items-center transition-all duration-200 hover:scale-105"
                                    >
                                      {seatNumber}
                                    </Button>
                                  );
                                })}
                              </div>

                              {/* Aisle (Space between left and right seats) */}
                              <div className="w-2"></div>

                              {/* Right side - Seats A and B */}
                              <div className="grid grid-rows-2 gap-2">
                                {["B", "A"].map((seatType) => {
                                  const seatNumber = `${seatType}${
                                    rowIndex + 1
                                  }`;
                                  const isUnavailable =
                                    isSeatUnavailable(seatNumber);
                                  return (
                                    <Button
                                      key={seatNumber}
                                      data-seat={seatNumber}
                                      variant={
                                        isUnavailable
                                          ? "default"
                                          : selectedSeat === seatNumber
                                          ? "default"
                                          : "outline"
                                      }
                                      disabled={isUnavailable}
                                      onClick={() =>
                                        handleSeatSelection(seatNumber)
                                      }
                                      className="h-12 w-12 rounded-none flex justify-center items-center transition-all duration-200 hover:scale-105"
                                    >
                                      {seatNumber}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile: Vertical Layout */}
                    <div className="lg:hidden w-fit">
                      <div className="flex flex-col gap-4 p-4 w-fit h-fit border-2 border-gray-300">
                        {/* Driver's seat at the top */}
                        <div className="bg-gray-800 text-white py-3 px-3 rounded-none flex items-center justify-center ml-auto w-16">
                          <BusFront className="h-6 w-6" />
                        </div>

                        {/* Vertical seat grid - 2 columns layout */}
                        <div className="grid grid-cols-1 gap-1">
                          {[...Array(totalRows)].map((_, rowIndex) => (
                            <div
                              key={rowIndex}
                              className="grid grid-cols-2 space-x-2"
                            >
                              {/* Left side - Seats A and B (no gap between them) */}
                              <div className="flex gap-0">
                                {["A", "B"].map((seatType) => {
                                  const seatNumber = `${seatType}${
                                    rowIndex + 1
                                  }`;
                                  const isUnavailable =
                                    isSeatUnavailable(seatNumber);
                                  return (
                                    <Button
                                      key={seatNumber}
                                      data-seat={seatNumber}
                                      variant={
                                        isUnavailable
                                          ? "default"
                                          : selectedSeat === seatNumber
                                          ? "default"
                                          : "outline"
                                      }
                                      disabled={isUnavailable}
                                      onClick={() =>
                                        handleSeatSelection(seatNumber)
                                      }
                                      className="h-10 w-10 rounded-none flex justify-center items-center transition-all duration-200 hover:scale-105 text-xs"
                                    >
                                      {seatNumber}
                                    </Button>
                                  );
                                })}
                              </div>

                              {/* Right side - Seats C and D (no gap between them) */}
                              <div className="flex gap-0">
                                {["C", "D"].map((seatType) => {
                                  const seatNumber = `${seatType}${
                                    rowIndex + 1
                                  }`;
                                  const isUnavailable =
                                    isSeatUnavailable(seatNumber);
                                  return (
                                    <Button
                                      key={seatNumber}
                                      data-seat={seatNumber}
                                      variant={
                                        isUnavailable
                                          ? "default"
                                          : selectedSeat === seatNumber
                                          ? "default"
                                          : "outline"
                                      }
                                      disabled={isUnavailable}
                                      onClick={() =>
                                        handleSeatSelection(seatNumber)
                                      }
                                      className="h-10 w-10 rounded-none flex justify-center items-center transition-all duration-200 hover:scale-105 text-xs"
                                    >
                                      {seatNumber}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex flex-col lg:flex-row flex-wrap justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 btn-outline"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 btn-primary"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400"></div>
                        <span>Unavailable</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div ref={summaryRef} className="w-full lg:w-1/3">
            <Card className="rounded-none shadow-sm border border-gray-200">
              <CardHeader className="bg-gray-50 space-y-0 p-3 lg:p-6">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-6 pt-0">
                <div className="">
                  <div className="flex justify-between items-center border-b border-gray-100">
                    <span className="text-gray-600">Selected Seat:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedSeat ? selectedSeat : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedSeat
                        ? `Rp. ${booking.bus?.price?.toLocaleString()}`
                        : "Rp. 0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100">
                    <span className="text-gray-600">Route:</span>
                    <span className="text-sm text-gray-700">
                      {booking.bus?.origin} → {booking.bus?.destination}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Departure:</span>
                    <span className="text-sm text-gray-700">
                      {format(
                        new Date(booking.bus?.departureTime ?? new Date()),
                        "d MMM, HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50">
                <Button
                  onClick={handleSelectBus}
                  className="w-full rounded-none bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={!selectedSeat}
                >
                  Continue to Food Selection
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusBookingPage;
