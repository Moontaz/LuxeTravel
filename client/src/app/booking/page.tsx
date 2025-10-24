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
import { getCachedCityData, getCachedBusData } from "@/lib/cookieHandler";

const BookingPage = () => {
  const { setBooking } = useBooking();
  const router = useRouter();

  const [results, setResults] = useState<Bus[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 buses per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first for better performance
        const cachedBuses = getCachedBusData();
        const cachedCities = getCachedCityData();

        if (cachedBuses) {
          setBuses(cachedBuses as Bus[]);
        } else {
          // Fetch buses (with caching)
          const busResult = await getAllBuses();
          if (busResult.success) {
            setBuses(busResult.data as Bus[]);
          } else {
            console.error("Error fetching bus data:", busResult.error);
          }
        }

        if (cachedCities) {
          setCities(cachedCities as City[]);
        } else {
          // Fetch cities (with 24h caching - optimized for frequent use)
          const cityResult = await getAllCities();
          if (cityResult.success) {
            setCities(cityResult.data as City[]);
          } else {
            console.error("Error fetching city data:", cityResult.error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const handleSearch = async (filters?: {
    origin?: string;
    destination?: string;
  }) => {
    setLoading(true);
    try {
      let filteredBuses = buses;

      if (filters?.origin && filters?.destination) {
        // Filter buses based on origin and destination
        filteredBuses = buses.filter((bus) => {
          const busOrigin = bus.origin?.toLowerCase() || "";
          const busDestination = bus.destination?.toLowerCase() || "";

          // Find city names from city IDs
          const originCity = cities.find(
            (city) => city.city_id.toString() === filters.origin
          );
          const destinationCity = cities.find(
            (city) => city.city_id.toString() === filters.destination
          );

          if (!originCity || !destinationCity) return false;

          const originName = originCity.city_name.toLowerCase();
          const destinationName = destinationCity.city_name.toLowerCase();

          return (
            busOrigin.includes(originName) &&
            busDestination.includes(destinationName)
          );
        });
      }

      setResults(filteredBuses);
      setShowResults(true);
      setCurrentPage(1); // Reset to first page when searching
    } catch (error) {
      console.error("Error searching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleTripSelect = (trip: Bus) => {
    // Find the actual bus data from the buses array
    const actualBus = buses.find(
      (bus) => bus.id.toString() === trip.id.toString()
    );

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
      arrival_city: destinationCity,
      route: {
        id: trip.id?.toString() || "route123",
        departure_city: departureCity,
        arrival_city: destinationCity,
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
      arrival_city: destinationCity,
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
                  {results.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      Showing filtered results based on your selected route
                    </div>
                  )}
                </div>
              </GSAPWrapper>

              <GSAPWrapper animation="stagger" delay={0.4} stagger={0.1}>
                <div className="space-y-4">
                  {currentResults.map((trip) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <GSAPWrapper animation="fadeIn" delay={0.6}>
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg border ${
                              currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>

                  {/* Pagination Info */}
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, results.length)} of {results.length}{" "}
                    trips
                  </div>
                </GSAPWrapper>
              )}

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
