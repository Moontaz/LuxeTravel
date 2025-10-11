"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  ArrowRight,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
} from "lucide-react";
import { gsap } from "gsap";
import Link from "next/link";
import { SidebarProps } from "@/lib/interface";

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        // Animate sidebar in
        if (sidebarRef.current) {
          gsap.fromTo(
            sidebarRef.current,
            { x: "100%" },
            { x: 0, duration: 0.3, ease: "power3.out" }
          );
        }
        if (overlayRef.current) {
          gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power3.out" }
          );
        }
      } else {
        // Animate sidebar out
        if (sidebarRef.current) {
          gsap.to(sidebarRef.current, {
            x: "100%",
            duration: 0.3,
            ease: "power3.in",
          });
        }
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
          });
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-black text-gray-900">
              LUXE<span className="text-gray-600">TRAVEL</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="p-2 hover:bg-gray-100"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-4 mb-8">
            <Link
              href="/"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
              onClick={onClose}
            >
              <span className="font-medium text-gray-900">Home</span>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link
              href="/booking"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
              onClick={onClose}
            >
              <span className="font-medium text-gray-900">Book Now</span>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
              onClick={onClose}
            >
              <span className="font-medium text-gray-900">Features</span>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link
              href="#destinations"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
              onClick={onClose}
            >
              <span className="font-medium text-gray-900">Destinations</span>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link
              href="#pricing"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
              onClick={onClose}
            >
              <span className="font-medium text-gray-900">Pricing</span>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link
              href="/auth"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
              onClick={onClose}
            >
              <span className="font-medium text-gray-900">Sign In</span>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                U
              </div>
              <div>
                <p className="font-bold text-gray-900">Welcome Back</p>
                <p className="text-sm text-gray-600">Sign in to your account</p>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onClose();
                window.location.href = "/auth";
              }}
            >
              Sign In
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start font-medium"
              onClick={() => {
                onClose();
                window.location.href = "/booking";
              }}
            >
              <CreditCardIcon size={20} className="mr-3" />
              Book a Trip
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start font-medium"
              onClick={() => {
                onClose();
                window.location.href = "/auth";
              }}
            >
              <UserIcon size={20} className="mr-3" />
              My Account
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start font-medium"
            >
              <SettingsIcon size={20} className="mr-3" />
              Settings
            </Button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              © 2024 Luxe Travel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
