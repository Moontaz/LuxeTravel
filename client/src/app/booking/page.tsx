"use client";
import React, { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { useRouter } from "next/navigation";
import { Bus, City } from "../../lib/interface";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";

const BookingPage = () => {
  const { booking, setBooking } = useBooking();
  const router = useRouter();

  const [results, setResults] = useState<Bus[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState<string | undefined>();
  const [destination, setDestination] = useState<string | undefined>();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const busResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BUS_URL}/api/bus/buses`
        );
        if (!busResponse.ok) throw new Error("Error fetching bus data");

        const busData = await busResponse.json();
        setBuses(busData);

        const cityResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BUS_URL}/api/bus/cities`
        );
        if (!cityResponse.ok) throw new Error("Error fetching city data");

        const cityData = await cityResponse.json();
        setCities(cityData);
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty array ensures this runs only once on mount

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading bus data...</p>
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
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);

    setTimeout(() => {
      const filteredResults = buses.filter((item) => {
        const itemDate = format(new Date(item.departureTime), "yyyy-MM-dd");
        const inputDate = date
          ? format(new Date(date), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        return (
          item.origin === origin &&
          item.destination === destination &&
          itemDate === inputDate
        );
      });

      setResults(filteredResults);
      setLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const handleSubmit = (bus: Bus) => {
    setLoading(true);
    if (booking) {
      setBooking({
        ...booking,
        bus: bus,
        total_price: booking.total_price + bus.price,
      });
    } else {
      // If booking is null (first time setting booking data), create a new object
      setBooking({
        bus: bus,
        food: [],
        no_seat: "",
        total_price: bus.price,
      });
    }

    // Navigate to the next step (if needed)
    router.push("/booking/bus");
  };
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Booking Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Reserve Your Seat
              </h3>
              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <div className="space-y-2">
                  <label htmlFor="from" className="text-sm font-bold">
                    From
                  </label>
                  <Select onValueChange={setOrigin}>
                    <SelectTrigger id="from">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((item) => (
                        <SelectItem key={item.city_id} value={item.city_name}>
                          {item.city_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="to" className="text-sm font-bold">
                    To
                  </label>
                  <Select onValueChange={setDestination}>
                    <SelectTrigger id="to">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((item) => (
                        <SelectItem key={item.city_id} value={item.city_name}>
                          {item.city_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-bold">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Input
                          type="date"
                          id="date"
                          className="w-full cursor-pointer z-40"
                          placeholder="Select date"
                          value={date ? format(date, "yyyy-MM-dd") : ""}
                          readOnly
                        />
                        <CalendarIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">&nbsp;</label>
                  <Button
                    type="submit"
                    className="w-full h-[40px] font-bold transition-all duration-200 hover:bg-primary/90 active:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {showResults && (
            <Card className="max-w-4xl mx-auto mt-8 shadow-lg">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-4">
                  {loading ? "Loading..." : "Search Results"}
                </h4>
                <div className="">
                  {loading ? (
                    <p>Loading...</p>
                  ) : results.length > 0 ? (
                    results.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <div className="grid grid-cols-6 justify-between gap-6">
                            <p className="text-sm text-gray-600 col-span-2">
                              {format(
                                new Date(item.departureTime),
                                "d MMMM yyyy, HH:mm"
                              )}
                            </p>
                            <p className="text-sm text-gray-600 col-span-2">
                              Available Seats: {item.available_seat}
                            </p>
                            <p className="text-sm text-gray-600 col-span-1">
                              Rp. {item.price},00
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => handleSubmit(item)} size="sm">
                          Book Now
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p>No results found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingPage;
