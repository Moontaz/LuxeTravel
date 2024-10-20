"use client";
import React, { useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QrCode, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";
import { generateTicketCode, getCookie, getId } from "@/lib/utils";
import Header from "@/components/header";

const ReceiptPage = () => {
  const { booking } = useBooking();
  const [isConfirmVisible, setIsConfirmVisible] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    setLoading(true);
    if (!booking || !booking.bus || !booking.no_seat) {
      setLoading(false);
      console.error("Booking information is incomplete.");
      return;
    }

    const isOrderFood = booking.food.length > 0; // Check if any food is ordered
    const ticket_code = generateTicketCode(isOrderFood);

    const token1 = getCookie("token1");
    if (!token1) {
      console.error("Token1 is missing. User might not be authenticated.");
      setLoading(false);
      return;
    } else {
      const ticketData = {
        user_id: getId("token1"), // Assuming getId extracts the user ID from the token
        bus_id: booking.bus.id,
        no_seat: booking.no_seat,
        total_price: total, // Ensure `total` is calculated beforehand
        ticket_code: ticket_code,
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BUS_URL}/api/bus/book-ticket`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token1}`,
            },
            body: JSON.stringify(ticketData),
          }
        );

        if (response.ok) {
          setAlertStatus("success");
          setAlertMessage("Ticket created successfully!");
          setTimeout(() => {
            setAlertMessage("");
            setAlertStatus(null);
          }, 2000);
          setIsConfirmVisible(false);
          setTicketCode(ticket_code); // Store the ticket code in the state

          // Proceed with food order if food is ordered
          if (isOrderFood) {
            const OrderData = {
              ticket_code: ticket_code,
              food_items: booking.food,
              total_price: foodTotal, // Ensure `foodTotal` is calculated beforehand
            };

            const token2 = getCookie("token2");
            if (!token2) {
              console.error("Token2 is missing. Cannot place food order.");
              setLoading(false);
              return;
            }

            try {
              const foodResponse = await fetch(
                `${process.env.NEXT_PUBLIC_FOOD_URL}/api/food/order-food`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token2}`,
                  },
                  body: JSON.stringify(OrderData),
                }
              );

              if (foodResponse.ok) {
                setLoading(false);
                setIsConfirmVisible(false);
                setAlertStatus("success");
                setAlertMessage("Ticket created successfully!");
                setTimeout(() => {
                  setAlertMessage("");
                  setAlertStatus(null);
                }, 2000);
              } else {
                setLoading(false);
                const errorResponse = await foodResponse.json();
                console.error("Failed to create food order:", errorResponse);
                setAlertStatus("error");
                setAlertMessage("Failed to create food order.");
                setTimeout(() => {
                  setAlertMessage("");
                  setAlertStatus(null);
                }, 2000);
              }
            } catch (error) {
              setLoading(false);
              console.error("Error creating food order:", error);
              setAlertStatus("error");
              setAlertMessage("Error creating food order.");
              setTimeout(() => {
                setAlertMessage("");
                setAlertStatus(null);
              }, 2000);
            }
          }
        } else {
          setLoading(false);
          setAlertStatus("error");
          setAlertMessage("Failed to create ticket.");
          const errorResponse = await response.json();
          console.error("Failed to create ticket:", errorResponse);
          setTimeout(() => {
            setAlertMessage("");
            setAlertStatus(null);
          }, 2000);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error creating ticket:", error);
        setAlertStatus("error");
        setAlertMessage("Error creating ticket.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Show success or error message */}
        {alertStatus && (
          <div
            className={`mb-1 max-w-2xl mx-auto p-4 rounded-lg text-white ${
              alertStatus === "success" ? "bg-green-500" : "bg-red-500"
            } flex items-center gap-2`}
          >
            {alertStatus === "success" ? (
              <CheckCircle size={24} />
            ) : (
              <XCircle size={24} />
            )}
            <span>{alertMessage}</span>
          </div>
        )}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Booking Receipt</CardTitle>
            {ticketCode && (
              <p className="text-gray-500">Order ID: {ticketCode}</p>
            )}
            {/* Display the dynamic ticket code if available, else show the default */}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Ticket Information</h3>
                <p>
                  <span className="font-medium">Bus Name:</span>{" "}
                  {booking.bus?.name}
                </p>
                <p>
                  <span className="font-medium">Rute Keberangkatan:</span>{" "}
                  {booking.bus?.origin}-{booking.bus?.destination},{" "}
                </p>
                <p>
                  <span className="font-medium">Waktu Keberangkatan:</span>{" "}
                  {format(
                    new Date(booking.bus?.departureTime ?? new Date()),
                    "d MMMM yyyy, HH:mm"
                  )}
                </p>
                <p>
                  <span className="font-medium">Seat Number:</span>{" "}
                  {booking.no_seat}
                </p>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <QrCode size={120} />
                  <p className="mt-2 text-sm text-gray-500">
                    Scan for digital ticket
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Bus Ticket</span>
                  <span>Rp {booking.bus?.price.toLocaleString("id-ID")}</span>
                </div>
                {booking.food.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.food_name} x{item.quantity}
                    </span>
                    <span>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Link href="/">
              <Button size="lg" variant="outline">
                Home
              </Button>
            </Link>
            {isConfirmVisible && (
              <Button
                size="lg"
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? "Loading..." : "Confirm"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ReceiptPage;
