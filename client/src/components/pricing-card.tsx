"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { PricingCardProps } from "@/lib/interface";

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  features,
  popular = false,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gray-900 text-white px-6 py-2 text-sm font-bold">
            MOST POPULAR
          </span>
        </div>
      )}
      <Card className={`h-full ${popular ? "ring-2 ring-gray-900" : ""}`}>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
          <div className="mb-6">
            <span className="text-4xl font-black text-gray-900">{price}</span>
            <span className="text-gray-600 ml-2">{period}</span>
          </div>
          <ul className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <CheckIcon size={20} className="text-gray-900 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={onSelect}
            className={`w-full ${
              popular
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "btn-outline"
            }`}
          >
            Choose Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCard;
