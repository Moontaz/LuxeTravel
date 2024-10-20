import { Separator } from "@radix-ui/react-select";
import { MailIcon, PhoneIcon } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white pt-6 pb-2 border border-t border-gray-300 text-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">LUXE TRAVEL</h4>
            <p className="text-gray-600 font-light">
              Redefining luxury in bus travel.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:underline font-light">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline font-light">
                  Our Routes
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline font-light">
                  Booking Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline font-light">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center font-light">
                <PhoneIcon size={18} className="mr-2" /> +62 (21) 456-7890
              </li>
              <li className="flex items-center font-light">
                <MailIcon size={18} className="mr-2" /> info@luxetravel.com
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-gray-600 font-light">
          © 2024 Luxe Travel. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
