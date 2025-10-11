"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Users, Wifi, Coffee } from "lucide-react";
import { Trip, TripCardProps } from "@/lib/interface";

const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <Card className="rounded-none border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Bus Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {trip.busName}
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-none">
                {trip.availableSeats} seats left
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {trip.departureTime} - {trip.arrivalTime}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trip.route}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{trip.duration}</span>
              </div>
            </div>

            {/* Amenities */}
            {trip.amenities && trip.amenities.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {trip.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs text-gray-500"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(trip.price)}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>

            <Button
              onClick={() => onSelect(trip)}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-none px-6 py-2 transition-colors duration-200"
            >
              Select Trip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
