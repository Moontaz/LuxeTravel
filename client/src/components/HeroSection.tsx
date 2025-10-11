"use client";
import React from "react";
import GSAPWrapper from "./GSAPWrapper";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GSAPWrapper animation="fadeIn" delay={0.2} duration={0.8}>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Book Your Luxe Travel Ticket
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience premium comfort and convenience with our luxury bus
              services. Book your journey today and travel in style.
            </p>
          </div>
        </GSAPWrapper>
      </div>
    </section>
  );
};

export default HeroSection;



