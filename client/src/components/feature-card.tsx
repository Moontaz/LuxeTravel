"use client";
import React from "react";
import { FeatureCardProps } from "@/lib/interface";

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`text-center group ${className}`}>
      <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-gray-900 w-12 h-12" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
