"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Ticket as TicketType, FoodItem } from "@/lib/interface";
import { fetchTicketAddons } from "@/lib/utils";

interface TicketCardProps {
  ticket: TicketType;
  onDownload: (ticket: TicketType) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDownload }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(false);
  const [addonsError, setAddonsError] = useState<string | null>(null);
  const [isAddonsExpanded, setIsAddonsExpanded] = useState(false);
  const [addonsFetched, setAddonsFetched] = useState(false);

  useEffect(() => {
    // Only fetch add-ons once per ticket
    if (!addonsFetched) {
      const loadAddons = async () => {
        setAddonsLoading(true);
        setAddonsError(null);

        try {
          const fetchedFoodItems = await fetchTicketAddons(ticket.ticket_code);
          setFoodItems(fetchedFoodItems);
          setAddonsFetched(true);
        } catch (error) {
          console.error("Error loading add-ons:", error);
          setAddonsError("Failed to load add-ons");
          setFoodItems([]);
          setAddonsFetched(true);
        } finally {
          setAddonsLoading(false);
        }
      };

      loadAddons();
    }
  }, [ticket.ticket_code, addonsFetched]);

  const toggleAddons = () => {
    setIsAddonsExpanded(!isAddonsExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="rounded-none border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {ticket.bus_name || ticket.bus?.name || "Unknown Bus"}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="rounded-none border-gray-300">
                Ticket #{ticket.ticket_code}
              </Badge>
              <Badge className="bg-gray-900 text-white rounded-none">
                Seat {ticket.no_seat}
              </Badge>
              <Badge
                className={`rounded-none border ${getStatusColor("confirmed")}`}
              >
                Confirmed
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(ticket.total_price)}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(ticket.created_at)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Trip Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Route</div>
                  <div className="font-medium text-gray-900">
                    {ticket.departure_city || ticket.bus?.origin || "Unknown"} →{" "}
                    {ticket.arrival_city ||
                      ticket.bus?.destination ||
                      "Unknown"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium text-gray-900">
                    {ticket.date
                      ? formatDate(ticket.date)
                      : ticket.bus?.departureTime
                      ? formatDate(ticket.bus.departureTime.toString())
                      : "Date not available"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Departure</div>
                  <div className="font-medium text-gray-900">
                    {ticket.bus_details?.departure_time
                      ? formatTime(ticket.bus_details.departure_time)
                      : ticket.bus?.departureTime
                      ? formatTime(ticket.bus.departureTime.toString())
                      : "Time not available"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add-ons</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAddons}
                className="rounded-none border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                {isAddonsExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Add-ons
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show Add-ons
                  </>
                )}
              </Button>
            </div>

            {isAddonsExpanded && (
              <div className="transition-all duration-300 ease-in-out">
                {addonsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="ml-2 text-sm text-gray-500">
                      Loading add-ons...
                    </span>
                  </div>
                ) : addonsError ? (
                  <div className="text-sm text-red-500 py-2">{addonsError}</div>
                ) : foodItems.length > 0 ? (
                  <div className="space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-700">
                              Food Name
                            </th>
                            <th className="text-center py-2 font-medium text-gray-700">
                              Qty
                            </th>
                            <th className="text-right py-2 font-medium text-gray-700">
                              Price
                            </th>
                            <th className="text-right py-2 font-medium text-gray-700">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {foodItems.map((item, index) => {
                            const price = parseFloat(item.price) || 0;
                            const quantity = item.quantity || 1;
                            const subtotal = price * quantity;

                            return (
                              <tr
                                key={index}
                                className="border-b border-gray-100 last:border-b-0"
                              >
                                <td className="py-2 text-gray-900">
                                  {item.food_name}
                                </td>
                                <td className="py-2 text-center text-gray-700">
                                  {quantity}
                                </td>
                                <td className="py-2 text-right text-gray-700">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  }).format(price)}
                                </td>
                                <td className="py-2 text-right font-medium text-gray-900">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  }).format(subtotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-200 font-semibold">
                            <td
                              colSpan={3}
                              className="py-2 text-right text-gray-700"
                            >
                              Total Add-ons:
                            </td>
                            <td className="py-2 text-right text-gray-900">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(
                                foodItems.reduce((total, item) => {
                                  const price = parseFloat(item.price) || 0;
                                  const quantity = item.quantity || 1;
                                  return total + price * quantity;
                                }, 0)
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2">
                    No add-ons selected
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => onDownload(ticket)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-none border-gray-300 hover:bg-gray-50"
                onClick={() =>
                  (window.location.href = `/booking/receipt?ticket=${ticket.ticket_code}`)
                }
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
