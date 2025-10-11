"use client";
import React, { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { useRouter } from "next/navigation";
import { Bus, City } from "../../lib/interface";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import BookingForm from "@/components/BookingForm";
import TripCard from "@/components/TripCard";
import GSAPWrapper from "@/components/GSAPWrapper";
import { getAllBuses, getAllCities } from "@/api/bus";

const BookingPage = () => {
  const { setBooking } = useBooking();
  const router = useRouter();

  const [results, setResults] = useState<Bus[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("=== ENVIRONMENT VARIABLES DEBUG ===");
        console.log("NEXT_PUBLIC_BUS_URL:", process.env.NEXT_PUBLIC_BUS_URL);
        console.log("NEXT_PUBLIC_FOOD_URL:", process.env.NEXT_PUBLIC_FOOD_URL);
        console.log(
          "All env vars:",
          Object.keys(process.env).filter((key) =>
            key.startsWith("NEXT_PUBLIC")
          )
        );
        console.log("===================================");

        // Fetch buses (with caching)
        const busResult = await getAllBuses();
        if (busResult.success) {
          setBuses(busResult.data as Bus[]);
        } else {
          console.error("Error fetching bus data:", busResult.error);
        }

        // Fetch cities (with 24h caching - optimized for frequent use)
        const cityResult = await getAllCities();
        if (cityResult.success) {
          setCities(cityResult.data as City[]);
        } else {
          console.error("Error fetching city data:", cityResult.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Filter buses based on search criteria
      const filteredBuses = buses.filter(() => {
        // Add your filtering logic here based on origin, destination, date, etc.
        return true; // For now, return all buses
      });

      setResults(filteredBuses);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripSelect = (trip: Bus) => {
    // Debug: Log the trip data to see what we're working with
    console.log("=== TRIP SELECTION DEBUG ===");
    console.log("Selected trip:", trip);
    console.log("Trip origin:", trip.origin);
    console.log("Trip destination:", trip.destination);
    console.log("Trip busName:", trip.busName);
    console.log("Trip name:", trip.name);
    console.log("Trip id:", trip.id);
    console.log("Full trip object keys:", Object.keys(trip));
    console.log("===========================");

    // Find the actual bus data from the buses array
    const actualBus = buses.find(
      (bus) => bus.id.toString() === trip.id.toString()
    );
    console.log("=== ACTUAL BUS DATA ===");
    console.log("Found bus:", actualBus);
    console.log("Bus origin:", actualBus?.origin);
    console.log("Bus destination:", actualBus?.destination);
    console.log("Bus name:", actualBus?.name);
    console.log("Bus busName:", actualBus?.busName);
    console.log("======================");

    // Extract city data with better fallbacks - prioritize actual bus data
    const departureCity =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      actualBus?.origin || trip.origin || "Unknown";
    const destinationCity =
      actualBus?.destination ||
      trip.destination ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "Unknown";
    const busName =
      actualBus?.name ||
      actualBus?.busName ||
      trip.busName ||
      trip.name ||
      "Luxe Bus";

    setBooking({
      bus: actualBus || trip, // Use actual bus data if available
      food: [],
      no_seat: "",
      total_price: 0,
      date: new Date(),
      passengers: 1,
      // Store complete route information
      bus_name: busName,
      departure_city: departureCity,
      destination_city: destinationCity,
      route: {
        id: trip.id?.toString() || "route123",
        departure_city: departureCity,
        destination_city: destinationCity,
      },
    });

    // Debug: Log what we're storing in context
    console.log("=== STORING IN CONTEXT ===");
    console.log("Bus name:", busName);
    console.log("Departure city:", departureCity);
    console.log("Destination city:", destinationCity);
    console.log("Route object:", {
      id: trip.id?.toString() || "route123",
      departure_city: departureCity,
      destination_city: destinationCity,
    });
    console.log("=========================");

    router.push("/booking/bus");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Booking Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <GSAPWrapper animation="slideUp" delay={0.4} duration={0.8}>
              <Card className="rounded-none border border-gray-200 shadow-lg">
                <CardHeader className="bg-white border-b border-gray-200">
                  <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                    Find Your Perfect Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <BookingForm
                    cities={cities}
                    onSearch={handleSearch}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </GSAPWrapper>
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <GSAPWrapper animation="fadeIn" delay={0.2} duration={0.6}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Available Trips
                  </h2>
                  <p className="text-gray-600">
                    {results.length} trips found for your search
                  </p>
                </div>
              </GSAPWrapper>

              <GSAPWrapper animation="stagger" delay={0.4} stagger={0.1}>
                <div className="space-y-4">
                  {results.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={{
                        id: trip.id.toString(),
                        busName: trip.busName || trip.name || "Luxe Bus",
                        departureTime:
                          trip.departureTime?.toString() || "08:00",
                        arrivalTime: trip.arrivalTime || "12:00",
                        duration: trip.duration || "4h 00m",
                        price: trip.price || 150000,
                        availableSeats:
                          trip.availableSeats || trip.available_seat || 20,
                        amenities: trip.amenities || ["Wifi", "Coffee"],
                        route: `${trip.origin || "Jakarta"} → ${
                          trip.destination || "Bandung"
                        }`,
                      }}
                      onSelect={
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        handleTripSelect as (trip: any) => void
                      }
                    />
                  ))}
                </div>
              </GSAPWrapper>

              {results.length === 0 && (
                <GSAPWrapper animation="fadeIn" delay={0.6}>
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                      No trips found for your search criteria.
                    </div>
                    <p className="text-gray-400 mt-2">
                      Try adjusting your search parameters.
                    </p>
                  </div>
                </GSAPWrapper>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
