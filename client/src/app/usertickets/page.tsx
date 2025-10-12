"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GSAPWrapper from "@/components/GSAPWrapper";
import TicketCard from "@/components/TicketCard";
import { Ticket as TicketType } from "@/lib/interface";
import { fetchUserTicketsWithAddons } from "@/lib/utils";
import { generateTicketPDF } from "@/lib/pdfUtils";

const UserTicketsPage = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (ticket: TicketType) => {
    try {
      console.log("Starting PDF generation for ticket:", ticket.ticket_code);

      // Generate PDF
      const pdfBlob = await generateTicketPDF(ticket);
      console.log("PDF generated successfully, size:", pdfBlob.size);

      // Check if blob is valid
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error("Generated PDF is empty or invalid");
      }

      // Create download link with better error handling
      const url = URL.createObjectURL(pdfBlob);

      // Create link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${ticket.ticket_code}.pdf`;
      link.style.display = "none";

      // Add to DOM, click, and remove
      document.body.appendChild(link);

      // Trigger download with user interaction
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(clickEvent);

      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);

      console.log("Download initiated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const userTickets = await fetchUserTicketsWithAddons();
        setTickets(userTickets as TicketType[]);
      } catch (err) {
        setError("Failed to load tickets");
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <GSAPWrapper animation="fadeIn" delay={0.2}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your tickets...</p>
              </div>
            </GSAPWrapper>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <GSAPWrapper animation="fadeIn" delay={0.2}>
              <div className="text-center">
                <div className="text-red-500 text-lg mb-4">
                  Error loading tickets
                </div>
                <p className="text-gray-600">{error}</p>
              </div>
            </GSAPWrapper>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <GSAPWrapper animation="fadeIn" delay={0.2} duration={0.8}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Tickets
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage and view all your booked tickets in one place
              </p>
            </div>
          </GSAPWrapper>

          {/* Tickets List */}
          {tickets.length === 0 ? (
            <GSAPWrapper animation="fadeIn" delay={0.4}>
              <div className="text-center py-16">
                <div className="mb-8">
                  <Ticket className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Tickets Yet
                  </h2>
                  <p className="text-gray-600 mb-8">
                    You haven&apos;t booked any tickets yet. Start your journey
                    with us!
                  </p>
                  <Button
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-none px-8 py-3"
                    onClick={() => (window.location.href = "/booking")}
                  >
                    Book Your First Ticket
                  </Button>
                </div>
              </div>
            </GSAPWrapper>
          ) : (
            <GSAPWrapper animation="stagger" delay={0.4} stagger={0.1}>
              <div className="space-y-6">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.ticket_id}
                    ticket={ticket}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </GSAPWrapper>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserTicketsPage;
