"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Utensils, Download } from "lucide-react";
import { getCookie, getUserTickets, Ticket } from "@/lib/utils";

interface FoodItem {
  food_name: string;
  quantity: number;
}

interface AddonItem {
  food_items: FoodItem[];
}

const UserTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = (ticketCode: string) => {
    console.log(`Downloading ticket ${ticketCode}`);
  };

  const fetchTickets = async () => {
    try {
      const response = await getUserTickets();

      if (response) {
        const parsedTickets = response.map((ticket: Ticket) => {
          if (ticket.addon && Array.isArray(ticket.addon)) {
            ticket.addon.forEach((addonItem: AddonItem) => {
              if (addonItem && typeof addonItem.food_items === "string") {
                try {
                  addonItem.food_items = JSON.parse(addonItem.food_items);
                } catch (err) {
                  console.error("Failed to parse food items", err);
                }
              }
            });
          }
          return ticket;
        });

        const reversedTickets = parsedTickets.reverse();
        setTickets(reversedTickets);
      } else {
        throw new Error("Invalid ticket data");
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError("Failed to fetch tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token1 = getCookie("token1");
    if (token1) {
      try {
        setLoading(true);
        fetchTickets();
      } catch (err) {
        setLoading(false);
        setError("Error Try Access Tickets");
        console.error("Error Try Access Tickets", err);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (tickets.length === 0) {
    return <p>No tickets available.</p>;
  }

  return (
    <div className="p-4 max-h-[calc(100vh-6rem)] overflow-y-auto mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download All Tickets
        </Button>
        <CardDescription>Your journey details</CardDescription>
      </div>
      {tickets.map((ticket) => (
        <Card key={ticket.ticket_id} className="mb-4">
          <CardHeader>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">
                Bus Ticket #{ticket.ticket_code}
              </h2>
              <Badge variant="outline">
                Rp {ticket.total_price.toLocaleString("id-ID")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 sm:col-span-2">
                <p className="text-xs text-gray-500">From</p>
                <p className="font-semibold">
                  {ticket.bus.route.departure_city.city_name}
                </p>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <p className="text-xs text-gray-500">To</p>
                <p className="font-semibold">
                  {ticket.bus.route.arrival_city.city_name}
                </p>
              </div>
              <div className="col-span-4 sm:col-span-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="flex flex-col">
                  <span>
                    {new Date(ticket.bus.departure_time).toLocaleDateString()}
                  </span>
                  <span className="text-xs">
                    {new Date(ticket.bus.departure_time).toLocaleTimeString()}
                  </span>
                </span>
              </div>
              <div className="col-span-4 sm:col-span-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Seat {ticket.no_seat}</span>
              </div>
              <div className="col-span-4">
                <p className="text-sm text-gray-500 mb-2">Add-ons</p>
                <div className="flex flex-wrap gap-2">
                  {ticket.addon && Array.isArray(ticket.addon) ? (
                    ticket.addon.map((addonItem: AddonItem, addonIndex) =>
                      addonItem.food_items &&
                      Array.isArray(addonItem.food_items) ? (
                        addonItem.food_items.map(
                          (foodItem: FoodItem, foodIndex: number) => {
                            return (
                              <Badge key={foodIndex} variant="secondary">
                                <Utensils className="h-3 w-3 mr-1" />
                                {foodItem.food_name} x{foodItem.quantity}
                              </Badge>
                            );
                          }
                        )
                      ) : (
                        <p key={addonIndex}>invalid data</p>
                      )
                    )
                  ) : (
                    <p>No add-ons</p>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(ticket.ticket_code)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </Button>
              </div>
            </div>
          </CardContent>
          <Separator className="my-4" />
        </Card>
      ))}
    </div>
  );
};

export default UserTicketsPage;
