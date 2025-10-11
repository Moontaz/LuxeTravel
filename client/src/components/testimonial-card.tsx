"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { TestimonialCardProps } from "@/lib/interface";

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  location,
  rating,
  text,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-lg mr-4">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{name}</h4>
            <p className="text-gray-600 text-sm">{role}</p>
          </div>
        </div>
        <div className="flex mb-4">
          {[...Array(rating)].map((_, i) => (
            <StarIcon
              key={i}
              size={20}
              className="text-yellow-400 fill-current"
            />
          ))}
        </div>
        <p className="text-gray-700 italic leading-relaxed">"{text}"</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
