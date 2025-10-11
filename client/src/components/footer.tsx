"use client";
import React, { useEffect, useRef } from "react";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  ArrowRightIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && footerRef.current) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".footer-section",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white">
      <div className="container section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="footer-section lg:col-span-2">
            <div className="mb-6">
              <div className="text-3xl font-black text-white mb-2">
                LUXE<span className="text-gray-400">TRAVEL</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">
                Premium Bus Services
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
              Redefining luxury in bus travel with premium comfort, exceptional
              service, and unforgettable journeys across the country. Experience
              the future of transportation today.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
                aria-label="Twitter"
              >
                <TwitterIcon size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Book Now
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Sign In
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="text-lg font-bold text-white mb-6">Services</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Premium Routes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Corporate Travel
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Group Bookings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  VIP Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Travel Insurance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Concierge
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-section border-t border-gray-800 mt-12 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <PhoneIcon size={20} className="text-gray-400 mr-4" />
              <div>
                <p className="text-white font-bold">Phone</p>
                <p className="text-gray-300">+62 (21) 456-7890</p>
              </div>
            </div>
            <div className="flex items-center">
              <MailIcon size={20} className="text-gray-400 mr-4" />
              <div>
                <p className="text-white font-bold">Email</p>
                <p className="text-gray-300">info@luxetravel.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPinIcon size={20} className="text-gray-400 mr-4" />
              <div>
                <p className="text-white font-bold">Location</p>
                <p className="text-gray-300">Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-section border-t border-gray-800 mt-12 pt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive offers and travel
              updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 bg-gray-800 text-white placeholder:text-gray-400 border border-gray-700 focus:border-gray-500 focus:outline-none"
              />
              <button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3 flex items-center justify-center transition-colors duration-300">
                Subscribe
                <ArrowRightIcon size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Luxe Travel. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
