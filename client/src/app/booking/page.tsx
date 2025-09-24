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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ArrowLeftRight, ArrowRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("bus");
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
    <div className="min-w-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Booking Section */}
      <section className="min-h-screen w-full py-16 flex items-end align-bottom justify-end">
        <Image
          src="/images/bg3.png"
          alt="Login BG-Luxe Travel"
          fill
          className="object-cover"
          priority
        />
        <div className="container max-w-[1416px] max-h-[376px] mx-auto px-4 z-10 relative">
          <Tabs defaultValue="bus">
            <TabsList className="rounded-none h-[56px] p-0">
              <TabsTrigger
                value="bus"
                className="rounded-none w-[160px] h-full flex flex-row gap-5 items-center justify-start pl-6"
              >
                <Image
                  src="/icons/guidance_bus.svg"
                  alt="guidance_bus"
                  width={24}
                  height={24}
                />
                <h5 className="font-normal text-xl">Bus</h5>
              </TabsTrigger>
              <TabsTrigger
                value="plane"
                className="rounded-none w-[160px] h-full flex flex-row gap-5 items-center justify-start pl-6 bg-black"
                disabled
              >
                <Image
                  src="/icons/guidance_plane.svg"
                  alt="guidance_plane"
                  width={24}
                  height={24}
                />
                <h5 className="font-normal text-xl">Plane</h5>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bus" className="m-0">
              <Card className="rounded-none shadow-sm w-full">
                <CardContent className="p-6 h-full">
                  <form
                    onSubmit={handleSearch}
                    className="relative w-full h-full flex flex-col items-end gap-4 justify-between"
                  >
                    <div className="relative w-full h-full flex flex-row justify-between">
                      <div className="relative flex flex-col lg:flex-row gap-8 items-center">
                        {/* From */}
                        <div className="border border-gray-400 p-6 rounded-none flex flex-col gap-4 w-[25rem]">
                          <label
                            htmlFor="from"
                            className="text-base uppercase text-gray-500"
                          >
                            FROM
                          </label>
                          <Select onValueChange={setOrigin}>
                            <SelectTrigger
                              id="from"
                              className="text-h4 text-[2.5rem] font-semibold border-none p-0 focus:ring-0"
                            >
                              <SelectValue placeholder="Select origin" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((item: any) => (
                                <SelectItem
                                  key={item.city_id}
                                  value={item.city_name}
                                >
                                  {item.city_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-base text-gray-500">
                            SBY, East Java, Indonesia
                          </span>
                        </div>

                        {/* Swap Icon */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[4.5rem] h-[4.5rem] rounded-full border border-gray-400 flex items-center justify-center text-gray-500">
                          <ArrowLeftRight size={32} />
                        </div>

                        {/* To */}
                        <div className="border border-gray-400 p-6 rounded-none flex flex-col gap-4 w-[25rem]">
                          <label
                            htmlFor="to"
                            className="text-base uppercase text-gray-500"
                          >
                            TO
                          </label>
                          <Select onValueChange={setDestination}>
                            <SelectTrigger
                              id="to"
                              className="text-h4 text-[2.5rem] font-semibold border-none p-0 focus:ring-0"
                            >
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((item: any) => (
                                <SelectItem
                                  key={item.city_id}
                                  value={item.city_name}
                                >
                                  {item.city_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-base text-gray-500">
                            MLG, East Java, Indonesia
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="border border-gray-400 p-6 rounded-none flex flex-col gap-4 w-[25rem] h-full">
                        <label
                          htmlFor="date"
                          className="text-base uppercase text-gray-500"
                        >
                          Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="relative">
                              <Input
                                type="text"
                                id="date"
                                className="text-h4 text-[2.5rem] font-semibold border-none p-0 focus:ring-0"
                                value={date ? format(date, "EEE, dd MMM") : ""}
                                placeholder="Select date"
                                readOnly
                              />
                              <CalendarIcon
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={32}
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
                        <div className="flex flex-row justify-between w-1/4">
                          <span className="text-base text-gray-500">Prev</span>
                          <span className="text-base text-gray-500">Next</span>
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="lg:col-span-4">
                      <Button
                        type="submit"
                        className="w-full h-[50px] flex flex-row justify-between gap-10 rounded-none p-6 font-normal bg-[#CBFF3E] text-primary hover:bg-[#CBFF3E]/80 hover:text-primary/80 text-lg transition-all duration-200"
                      >
                        Search
                        <ArrowRight size={20} />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
