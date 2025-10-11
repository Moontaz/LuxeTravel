"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { getFoodMenu } from "@/api/addons";
import { Menu } from "@/lib/interface";
import { gsap } from "gsap";
import {
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  MapPin,
  Users,
  X,
  Eye,
} from "lucide-react";

const FoodBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<Menu[]>([]);
  const { booking, setBooking } = useBooking();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const router = useRouter();
  const bus_price = booking?.bus?.price ? booking.bus.price : 0;

  // Refs for GSAP animations
  const pageRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const imageModalRef = useRef<HTMLDivElement>(null);

  // State for image modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    // Fetch food menu data from the API
    const fetchData = async () => {
      try {
        const result = await getFoodMenu();

        if (result.success) {
          setMenu(result.data);
        } else {
          setError(result.error?.message || "Error fetching menu data");
        }
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

  // Handle increasing or decreasing food quantities with animation
  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      newQuantities[id] = Math.max(0, newQuantities[id] + delta); // Prevent negative quantities
      return newQuantities;
    });

    // Animate quantity change
    if (menuRef.current) {
      const itemElement = menuRef.current.querySelector(`[data-item="${id}"]`);
      if (itemElement) {
        gsap.to(itemElement, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        });
      }
    }
  };

  // Handle image modal open with animation
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  // Handle image modal close with animation
  const handleImageModalClose = () => {
    if (imageModalRef.current) {
      gsap.to(imageModalRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setIsImageModalOpen(false);
          setSelectedImage(null);
        },
      });
    } else {
      setIsImageModalOpen(false);
      setSelectedImage(null);
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

    if (menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
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

  // GSAP animation for image modal
  useEffect(() => {
    if (isImageModalOpen && imageModalRef.current) {
      gsap.fromTo(
        imageModalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isImageModalOpen]);

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

      // Debug: Log current booking data before updating
      console.log("=== ADDON SELECTION DEBUG ===");
      console.log("Current booking:", booking);
      console.log("Selected food:", selectedFood);
      console.log("Route data:", booking.route);
      console.log("Departure city:", booking.departure_city);
      console.log("Destination city:", booking.destination_city);
      console.log("=============================");

      // Update the booking context with selected food while preserving route data
      setBooking({
        ...booking,
        food: selectedFood,
        // Ensure route data is preserved
        bus_name: booking.bus_name || booking.bus?.name || "Unknown Bus",
        departure_city:
          booking.departure_city || booking.bus?.origin || "Unknown",
        destination_city:
          booking.destination_city || booking.bus?.destination || "Unknown",
        route: booking.route || {
          id: booking.bus?.id?.toString() || "route123",
          departure_city:
            booking.departure_city || booking.bus?.origin || "Unknown",
          destination_city:
            booking.destination_city || booking.bus?.destination || "Unknown",
        },
      });

      // Debug: Log what we're storing
      console.log("=== STORING FINAL BOOKING ===");
      console.log(
        "Bus name:",
        booking.bus_name || booking.bus?.name || "Unknown Bus"
      );
      console.log(
        "Departure city:",
        booking.departure_city || booking.bus?.origin || "Unknown"
      );
      console.log(
        "Destination city:",
        booking.destination_city || booking.bus?.destination || "Unknown"
      );
      console.log(
        "Route object:",
        booking.route || {
          id: booking.bus?.id?.toString() || "route123",
          departure_city:
            booking.departure_city || booking.bus?.origin || "Unknown",
          destination_city:
            booking.destination_city || booking.bus?.destination || "Unknown",
        }
      );
      console.log("===========================");

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
    <div ref={pageRef} className="min-h-screen bg-white text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Add-ons
          </h1>
          <p className="text-gray-600">
            Choose your preferred food and beverages for a comfortable journey
          </p>
        </div>

        {/* Trip Summary */}
        <Card className="mb-8 rounded-none shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Trip Summary
            </CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {booking.bus?.origin} → {booking.bus?.destination}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(
                  booking.bus?.departureTime ?? new Date()
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Seat: {booking.no_seat || "Not selected"}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vertical List for Food Items */}
          <div
            ref={menuRef}
            className="col-span-2 grid grid-cols-1 lg:grid-cols-2 space-y-3 mb-8"
          >
            {menu.map((item) => (
              <div
                key={item.food_id}
                data-item={item.food_id}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Left side - Name and Description */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {item.food_name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                  <p className="text-xs font-semibold text-gray-900 mt-1">
                    Rp. {parseInt(item.price.toString()).toLocaleString()}
                  </p>
                </div>

                {/* Right side - Quantity Controls and Eye Button */}
                <div className="flex items-center gap-3 ml-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.food_id, -1)}
                      className="rounded-none h-8 w-8 p-0 flex items-center justify-center border-gray-300 hover:border-gray-400"
                      disabled={quantities[item.food_id] === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border border-gray-300 rounded-none">
                      {quantities[item.food_id]}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.food_id, 1)}
                      className="rounded-none h-8 w-8 p-0 flex items-center justify-center border-gray-300 hover:border-gray-400"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Eye Button for Image Preview */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImageClick(item.image_url)}
                    className="rounded-none h-8 w-8 p-0 flex items-center justify-center border-gray-300 hover:border-gray-400"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary and Information */}
          <div className="space-y-5">
            {/* Important Information */}
            <Card className="rounded-none shadow-sm border border-gray-200">
              <CardHeader className="bg-gray-50 py-1">
                <CardTitle className="text-sm">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="py-1">
                <div className="text-sm text-gray-600">
                  <p className="text-xs">
                    • Your bus ticket includes a complimentary drink
                  </p>
                  <p className="text-xs">
                    • Food will be available at terminal kiosks
                  </p>
                  <p className="text-xs">
                    • Arrive 30 minutes before departure
                  </p>
                  <p className="text-xs">
                    • Contact customer service for dietary restrictions
                  </p>
                  <p className="text-xs">
                    • Additional food available during rest stops
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card
              ref={summaryRef}
              className="lg:col-span-2 rounded-none shadow-sm border border-gray-200"
            >
              <CardHeader className="bg-gray-50 py-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="">
                  <div className="flex justify-between items-center text-xs border-b border-gray-100">
                    <span className="text-gray-600">Bus Ticket:</span>
                    <span className="font-semibold text-gray-900">
                      Rp. {bus_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100">
                    <span className="text-gray-600 text-xs">
                      Food & Beverages:
                    </span>
                    <span className="font-semibold text-xs text-gray-900">
                      Rp.{" "}
                      {Object.entries(quantities)
                        .reduce(
                          (total, [id, quantity]) =>
                            total +
                            quantity *
                              menu.find((item) => item.food_id === +id)!.price,
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      Rp.{" "}
                      {(
                        bus_price +
                        Object.entries(quantities).reduce(
                          (total, [id, quantity]) =>
                            total +
                            quantity *
                              menu.find((item) => item.food_id === +id)!.price,
                          0
                        )
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 py-2">
                <Button
                  onClick={handleSubmitFood}
                  className="w-full rounded-none bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div
              ref={imageModalRef}
              className="relative max-w-2xl max-h-[90vh] bg-white rounded-none shadow-lg"
            >
              {/* Close Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleImageModalClose}
                className="absolute top-4 right-4 z-10 rounded-none h-8 w-8 p-0 flex items-center justify-center border-gray-300 hover:border-gray-400"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Image */}
              <div className="relative">
                <Image
                  width={800}
                  height={600}
                  src={selectedImage}
                  alt="Food preview"
                  className="w-full h-auto object-contain rounded-none"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FoodBookingPage;
