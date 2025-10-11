"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DestinationCardProps } from "@/lib/interface";

const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  duration,
  price,
  features,
  onBook,
  className = "",
}) => {
  return (
    <Card className={`group ${className}`}>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600">{duration}</span>
          <span className="text-3xl font-bold text-gray-900">{price}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {features.map((feature, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
        <Button onClick={onBook} className="w-full">
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
