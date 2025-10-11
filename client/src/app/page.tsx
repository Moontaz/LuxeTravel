"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBookingClick = () => {
    setLoading(true);
    router.push("/booking");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
            LUXURY TRAVEL
            <span className="block text-gray-300 mt-2">REDEFINED</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Experience premium bus services with unparalleled comfort,
            cutting-edge technology, and exceptional service that sets the
            standard for luxury travel.
          </p>

          <Button
            size="xl"
            onClick={handleBookingClick}
            disabled={loading}
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl hover:shadow-white/25 transition-all duration-300"
          >
            {loading ? "Loading..." : "Book Your Journey"}
            <ArrowRightIcon className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              THE LUXE EXPERIENCE
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every detail crafted for your comfort and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                  📍
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Prime Locations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Exclusive pick-up and drop-off points in premium locations
                across the city
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                  ⏰
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Precision Timing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Military-grade punctuality with real-time tracking and updates
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                  👤
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Personal Concierge
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated service team for personalized travel assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="section bg-gray-900">
        <div className="container text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            READY TO EXPERIENCE LUXURY?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Join thousands of satisfied customers who have chosen Luxe Travel
            for their premium bus service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              onClick={handleBookingClick}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Book Your Journey
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
