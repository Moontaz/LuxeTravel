"use client";
import "./globals.css";
import { BookingProvider } from "./context/BookingContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
