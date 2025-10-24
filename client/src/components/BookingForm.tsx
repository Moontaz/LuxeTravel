"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { BookingFormProps } from "@/lib/interface";

const BookingForm: React.FC<BookingFormProps> = ({
  cities,
  onSearch,
  loading = false,
}) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [passengers, setPassengers] = useState<number>(1);
  const [travelClass, setTravelClass] = useState<string>("economy");
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      alert("Please select both departure and destination cities");
      return;
    }

    // Pass filter data to parent component
    onSearch({
      origin,
      destination,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin City */}
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
            Departure City
          </Label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger className="rounded-none border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500">
              <SelectValue placeholder="Select departure city" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-white border border-gray-200 shadow-lg">
              {cities.map((city) => (
                <SelectItem key={city.city_id} value={city.city_id.toString()}>
                  {city.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destination City */}
        <div className="space-y-2">
          <Label
            htmlFor="destination"
            className="text-sm font-medium text-gray-700"
          >
            Destination City
          </Label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="rounded-none border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500">
              <SelectValue placeholder="Select destination city" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-white border border-gray-200 shadow-lg">
              {cities.map((city) => (
                <SelectItem key={city.city_id} value={city.city_id.toString()}>
                  {city.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Travel Date
          </Label>
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal rounded-none border-gray-300 hover:bg-gray-50"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-none bg-white border border-gray-200 shadow-lg"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setOpenCalendar(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <Label
            htmlFor="passengers"
            className="text-sm font-medium text-gray-700"
          >
            Passengers
          </Label>
          <Select
            value={passengers.toString()}
            onValueChange={(value) => setPassengers(parseInt(value))}
          >
            <SelectTrigger className="rounded-none border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-white border border-gray-200 shadow-lg">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Travel Class */}
        <div className="space-y-2">
          <Label htmlFor="class" className="text-sm font-medium text-gray-700">
            Class
          </Label>
          <Select value={travelClass} onValueChange={setTravelClass}>
            <SelectTrigger className="rounded-none border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-white border border-gray-200 shadow-lg">
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-none py-3 text-base font-medium transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Buses"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
