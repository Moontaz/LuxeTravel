"use client";
import "./globals.css";
import { BookingProvider } from "./context/BookingContext";
import TokenMonitor from "@/components/TokenMonitor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BookingProvider>
          <TokenMonitor>{children}</TokenMonitor>
        </BookingProvider>
      </body>
    </html>
  );
}
