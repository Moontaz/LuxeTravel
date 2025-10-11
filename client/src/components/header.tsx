"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, User, LogOut } from "lucide-react";
import Sidebar from "./sidebar";
import { gsap } from "gsap";
import { getCookie } from "@/lib/utils";
import { DecodedToken } from "@/lib/interface";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getCookie("token1");
        if (token) {
          // Decode JWT token to get user info
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser(payload);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "token1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token2=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Reset state
    setUser(null);
    setIsLoggedIn(false);

    // Redirect to home
    window.location.href = "/";
  };

  useEffect(() => {
    if (typeof window !== "undefined" && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-2xl font-black text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
              LUXE
            </div>
            <div className="text-2xl font-black text-gray-600 ml-1">TRAVEL</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 hover:text-gray-700"
                  : "text-white hover:text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/booking"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 hover:text-gray-700"
                  : "text-white hover:text-gray-300"
              }`}
            >
              Book Now
            </Link>
            <Link
              href="#features"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 hover:text-gray-700"
                  : "text-white hover:text-gray-300"
              }`}
            >
              Features
            </Link>
            <Link
              href="#destinations"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 hover:text-gray-700"
                  : "text-white hover:text-gray-300"
              }`}
            >
              Destinations
            </Link>
            <Link
              href="#pricing"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 hover:text-gray-700"
                  : "text-white hover:text-gray-300"
              }`}
            >
              Pricing
            </Link>

            {/* User Greeting and Menu */}
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-4">
                <div
                  className={`text-sm font-medium ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  Hi, {user.name}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href="/usertickets"
                    className={`px-3 py-2 rounded-none border transition-colors duration-300 ${
                      isScrolled
                        ? "border-gray-300 text-gray-900 hover:bg-gray-50"
                        : "border-white/30 text-white hover:bg-white/10"
                    }`}
                  >
                    <User className="h-4 w-4 mr-2 inline" />
                    My Tickets
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className={`rounded-none ${
                      isScrolled
                        ? "border-gray-300 text-gray-900 hover:bg-gray-50"
                        : "border-white/30 text-white hover:bg-white/10"
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth"
                  className={`font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-900 hover:text-gray-700"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  Sign In
                </Link>
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  className={`${
                    isScrolled
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${
                isScrolled
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-6">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/booking"
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link
                href="#features"
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#destinations"
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link
                href="#pricing"
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              {/* Mobile User Menu */}
              {isLoggedIn && user ? (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="text-sm text-gray-600 mb-3">
                      Hi, {user.name}
                    </div>
                    <Link
                      href="/usertickets"
                      className="flex items-center text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300 mb-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Tickets
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full rounded-none border-gray-300 text-gray-900 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Button
                    onClick={() => {
                      setIsSidebarOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white w-fit"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default Header;
