"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import { DecodedToken } from "@/lib/interface";
import { getCookie } from "@/lib/utils";
import Sidebar from "./sidebar";

// Define the structure of your token payload

const Header = () => {
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token1 = getCookie("token1"); // Get token1 from cookies
    if (token1) {
      try {
        // Decode the token1 and set user info
        const decoded = jwtDecode<DecodedToken>(token1);
        const isTokenExpired = decoded.exp * 1000 < Date.now();

        if (!isTokenExpired) {
          setUserInfo(decoded); // Set the decoded token1 details
        } else {
          document.cookie = "token1=; Max-Age=0; path=/"; // Delete cookie
          setUserInfo(null);
        }
      } catch (err) {
        console.error("Error decoding token1", err);
        setUserInfo(null); // If decoding fails, treat as logged out
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token1=; Max-Age=0; path=/"; // Delete the token1 cookie
    document.cookie = "token2=; Max-Age=0; path=/"; // Delete the token1 cookie
    setUserInfo(null); // Clear user info
    router.push("/");
  };

  const handleNavigateAuth = () => {
    router.push("/auth"); // Navigate to the login page
  };

  return (
    <header className="fixed top-0 left-0 w-full py-6 border-b border-gray-200 bg-white z-50">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/">
          <h5 className="mb-4 sm:mb-0 text-primary">LUXE TRAVEL</h5>
        </Link>
        <nav className="space-x-2 flex flex-wrap justify-center text-primary">
          {userInfo ? (
            <div className="pl-4 border border-input bg-background rounded-md">
              <span className="font-normal mr-12">{userInfo.name}</span>
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="ghost"
                className="font-medium"
              >
                My Ticket
              </Button>
              <Button size="sm" className="font-medium" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleNavigateAuth}
              className="font-medium px-5"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default Header;
