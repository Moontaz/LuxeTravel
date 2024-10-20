"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useBooking } from "../../context/BookingContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Footer from "@/components/footer";
import { getCookie } from "@/lib/utils";
import Header from "@/components/header";

interface Menu {
  food_id: number;
  food_name: string;
  desc: string;
  price: number;
  image_url: string;
}

const FoodBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<Menu[]>([]);
  const { booking, setBooking } = useBooking();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const router = useRouter();
  const bus_price = booking?.bus?.price ? booking.bus.price : 0;

  useEffect(() => {
    // Fetch food menu data from the API
    const fetchData = async () => {
      try {
        const token2 = getCookie("token2");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FOOD_URL}/api/food/menu`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token2}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error fetching menu data");
        }
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (menu.length > 0) {
      setQuantities(
        menu.reduce((acc, item) => {
          acc[item.food_id] = 0; // Default quantity is 0 for each food item
          return acc;
        }, {} as Record<number, number>)
      );
    }
  }, [menu]);

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

  // Handle increasing or decreasing food quantities
  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      newQuantities[id] = Math.max(0, newQuantities[id] + delta); // Prevent negative quantities
      return newQuantities;
    });
  };

  // Handle submit and store selected food items in BookingContext
  const handleSubmitFood = () => {
    setLoading(true);
    if (booking) {
      const selectedFood = menu
        .filter((item) => quantities[item.food_id] > 0) // Only include items with quantity > 0
        .map((item) => ({
          food_id: item.food_id,
          food_name: item.food_name,
          price: item.price,
          quantity: quantities[item.food_id], // Include the selected quantity
        }));

      // Update the booking context with selected food
      setBooking({
        ...booking,
        food: selectedFood,
      });

      // Navigate to the receipt or payment page
      router.push(`/booking/receipt`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Generate Receipt...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium mb-6">Select Your Food</h2>

        {/* Grid for Food Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {menu.map((item) => (
            <Card key={item.food_id} className="w-full overflow-hidden">
              <div className="relative">
                <Image
                  width={400} // Placeholder value
                  height={200} // Placeholder value
                  src={item.image_url}
                  alt={item.food_name}
                  className="w-full h-32 object-cover object-center"
                />
              </div>
              <CardHeader className="flex flex-row justify-between px-4 py-2">
                <div>
                  <CardTitle className="text-base">{item.food_name}</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    {item.desc}
                  </CardDescription>
                </div>
                <p className="font-medium text-base">Rp.{item.price}</p>
              </CardHeader>
              <CardContent className="px-4 py-2">
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.food_id, -1)}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantities[item.food_id]}
                    readOnly
                    className="w-12 text-center mx-2 text-base"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.food_id, 1)}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary and Reminder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reminder/Information */}
          <Card className="bg-gray-100">
            <CardContent className="space-y-1">
              <p className="text-sm font-medium pt-5">Important Information</p>
              <p className="text-xs text-gray-600">
                Please make sure to select your food before proceeding to
                payment. Your bus ticket includes a free drink, so make sure to
                add it to your cart.
              </p>
              <p className="text-xs text-gray-600">
                For any dietary restrictions or special requests, please contact
                customer service after your booking.
              </p>
              <p className="text-xs text-gray-600">
                We recommend arriving at the bus terminal 30 minutes before your
                scheduled departure. This will give you enough time to collect
                your food and drinks from the terminal kiosks.
              </p>
              <p className="text-xs text-gray-600">
                If you are traveling on a long-distance bus, you may order
                additional food and beverages during scheduled rest stops. Our
                staff will be happy to assist you.
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row justify-between space-y-2 pb-0">
              <div>
                <p className="text-sm">
                  Bus Ticket:{" "}
                  <span className="font-medium">Rp.{booking.bus?.price}</span>
                </p>
                <p className="text-sm">
                  Food Total:{" "}
                  <span className="font-medium">
                    Rp.
                    {Object.entries(quantities).reduce(
                      (total, [id, quantity]) =>
                        total +
                        quantity *
                          menu.find((item) => item.food_id === +id)!.price,
                      0
                    )}
                  </span>
                </p>
                <p className="text-base font-medium">
                  Total: Rp.
                  {bus_price +
                    Object.entries(quantities).reduce(
                      (total, [id, quantity]) =>
                        total +
                        quantity *
                          menu.find((item) => item.food_id === +id)!.price,
                      0
                    )}
                </p>
              </div>
              <Button
                onClick={handleSubmitFood}
                className="w-full md:w-auto  mt-5"
              >
                Proceed to Payment
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end">
              <p className="text-xs text-gray-600">*Please make sure.</p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FoodBookingPage;
