import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import UserTicketsPage from "./userTickets";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed z-50 text-primary inset-y-0 right-0 max-w-md w-full h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-row justify-between">
        <Button variant="ghost" onClick={onClose} className="mb-4 mt-2">
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold leading-10 tracking-tight m-2 mr-5">
          Bus Tickets
        </h1>
      </div>
      <div className="h-full overflow-y-auto">
        <UserTicketsPage />
      </div>
    </div>
  );
}
