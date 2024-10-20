"use client";
import React, { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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
import { BusFront } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getCookie } from "@/lib/utils";

const BusBookingPage = () => {
  const { booking, setBooking } = useBooking();
  const router = useRouter();

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [unavailableSeats, setUnavailableSeats] = useState<string[]>([]);
  const [loadingSeats, setLoadingSeats] = useState<boolean>(true);
  const [seatError, setSeatError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to handle seat selection
  const handleSeatSelection = (seatNumber: string) => {
    setSelectedSeat(seatNumber);
  };

  useEffect(() => {
    const token1 = getCookie("token1");
    const fetchUnavailableSeats = async () => {
      if (booking?.bus?.id) {
        try {
          setLoadingSeats(true); // Start loading
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BUS_URL}/api/bus/buses/${booking.bus.id}/seat`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token1}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch unavailable seats");
          }

          const data = await response.json();
          setUnavailableSeats(data.bookedSeats);
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
    if (booking) {
      setBooking({
        ...booking, // Spread existing booking fields
        no_seat: noSeat,
      });
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
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 flex gap-8">
        {/* Bus Map for Selecting Seats */}
        <div className="w-2/3">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Bus Details</CardTitle>
              <CardDescription>
                {booking.bus?.origin} - {booking.bus?.destination} |{" "}
                {format(
                  new Date(booking.bus?.departureTime ?? new Date()),
                  "d MMMM yyyy, HH:mm"
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : seatError ? (
            <p className="text-red-500">{seatError}</p>
          ) : (
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Select Your Seat</h2>

              <div className="flex gap-4 pl-10 pr-5 py-3 outline outline-2 outline-gray-700 h-max w-max rounded-xl">
                {/* Driver's seat at the top */}
                <div className="bg-gray-700 text-white py-3 px-3 rounded-md h-max">
                  <BusFront className="h-6 w-6" />
                </div>
                {/* Loop to generate each row */}
                <div className="flex flex-row gap-2">
                  {[...Array(totalRows)].map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 gap-3 items-center"
                    >
                      {/* Left side - Seats A and B */}
                      <div className="grid grid-rows-2">
                        {["A", "B"].map((seatType) => {
                          const seatNumber = `${seatType}${rowIndex + 1}`;
                          const isUnavailable = isSeatUnavailable(seatNumber);
                          return (
                            <Button
                              key={seatNumber}
                              variant={
                                isUnavailable
                                  ? "secondary" // Mark unavailable seats
                                  : selectedSeat === seatNumber
                                  ? "default"
                                  : "outline"
                              }
                              disabled={isUnavailable}
                              onClick={() => handleSeatSelection(seatNumber)}
                              className="h-12 w-12 flex justify-center items-center"
                            >
                              {seatNumber}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Aisle (Space between left and right seats) */}
                      <div className="w-1"></div>

                      {/* Right side - Seats C and D */}
                      <div className="grid grid-rows-2">
                        {["C", "D"].map((seatType) => {
                          const seatNumber = `${seatType}${rowIndex + 1}`;
                          const isUnavailable = isSeatUnavailable(seatNumber);
                          return (
                            <Button
                              key={seatNumber}
                              variant={
                                isUnavailable
                                  ? "secondary"
                                  : selectedSeat === seatNumber
                                  ? "default"
                                  : "outline"
                              }
                              disabled={isUnavailable}
                              onClick={() => handleSeatSelection(seatNumber)}
                              className="h-12 w-12 flex justify-center items-center"
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
          )}
        </div>

        {/* Booking Summary */}
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Selected Seat:{" "}
                  <span className="font-semibold">
                    {selectedSeat ? selectedSeat : "None"}
                  </span>
                </p>
                <p>
                  Price:{" "}
                  <span className="font-semibold">
                    {selectedSeat ? `Rp. ${booking.bus?.price}` : "Rp. 0"}
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSelectBus}
                className="w-full"
                disabled={!selectedSeat}
              >
                Continue to Food Selection
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusBookingPage;
