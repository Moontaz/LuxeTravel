"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPinIcon, ClockIcon, UserIcon } from "lucide-react";
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
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Elevate Your Journey
          </h2>
          <p className="text-lg sm:text-xl mb-12 text-gray-600 max-w-2xl mx-auto font-light">
            Experience luxury travel with our premium bus services. Comfort,
            style, and reliability in every journey.
          </p>

          <Button
            size="lg"
            className="px-8 py-6 text-lg font-bold"
            onClick={handleBookingClick}
            disabled={loading}
          >
            {loading ? "Loading..." : "Book Your Luxury Ride"}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">
            The Luxe Travel Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <MapPinIcon size={32} />,
                title: "Prime Locations",
                description: "Access to exclusive pick-up and drop-off points",
              },
              {
                icon: <ClockIcon size={32} />,
                title: "Punctuality",
                description: "Precision timing for your peace of mind",
              },
              {
                icon: <UserIcon size={32} />,
                title: "Personal Service",
                description: "Tailored attention to your travel needs",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-400 font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-12">What Our Clients Say</h3>
          <blockquote className="text-2xl italic max-w-3xl mx-auto font-light">
            &quot;An unparalleled travel experience. Luxe Travel has redefined
            luxury bus journeys.&quot;
          </blockquote>
          <p className="mt-4 text-gray-600 font-bold">
            - Jane Doe, Frequent Traveler
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
