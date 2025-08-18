"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Phone, Car, Copy, Check } from "lucide-react";

// Sample drivers data - in a real app, this would come from your database
const sampleDrivers = [
  {
    id: "1",
    name: "Banne",
    phone: "+91 86998 20043",
    rating: 4.8,
    pricePerKm: 12,
    location: "IIT Ropar Main Gate",
    description:
      "Experienced local driver with excellent knowledge of IIT Ropar campus and surrounding areas. Reliable service for students.",
    totalRides: 450,
    carModel: "Maruti Swift Dzire",
    carType: "Sedan",
    availability: "24/7",
    specialties: ["Campus Trips", "City Routes", "AC Available"],
    languages: ["Hindi", "Punjabi", "English"],
    verified: true,
    responseTime: "5 mins",
    joinedDate: "2020-03-15",
    priceBreakdown: {
      baseRate: 12,
      nightCharge: 15,
      airportRate: 18,
    },
    badges: ["Top Rated", "Quick Response", "Campus Expert"],
  },
  {
    id: "2",
    name: "Rajvir",
    phone: "+91 98142 14458",
    rating: 4.7,
    pricePerKm: 11,
    location: "Near Admin Block",
    description:
      "Friendly driver with good knowledge of local routes. Preferred by students for daily commutes and city trips.",
    totalRides: 380,
    carModel: "Hyundai Grand i10",
    carType: "Hatchback",
    availability: "6 AM - 11 PM",
    specialties: ["Student Friendly", "Local Routes", "Daily Commute"],
    languages: ["Hindi", "Punjabi"],
    verified: true,
    responseTime: "7 mins",
    joinedDate: "2021-07-22",
    priceBreakdown: {
      baseRate: 11,
      nightCharge: 13,
      airportRate: 16,
    },
    badges: ["Student Choice", "Local Expert"],
  },
  {
    id: "3",
    name: "Sonu",
    phone: "7626886478",
    rating: 4.6,
    pricePerKm: 10,
    location: "Boys Hostel Area",
    description:
      "Budget-friendly driver offering affordable rates for students. Good for short trips within campus and nearby areas.",
    totalRides: 520,
    carModel: "Tata Tiago",
    carType: "Hatchback",
    availability: "7 AM - 10 PM",
    specialties: ["Budget Friendly", "Hostel Pickup", "Short Trips"],
    languages: ["Hindi", "Punjabi"],
    verified: true,
    responseTime: "10 mins",
    joinedDate: "2019-11-08",
    priceBreakdown: {
      baseRate: 10,
      nightCharge: 12,
      airportRate: 14,
    },
    badges: ["Most Affordable", "High Volume"],
  },
  {
    id: "4",
    name: "Aman Singh",
    phone: "7986631811",
    rating: 4.9,
    pricePerKm: 15,
    location: "IIT Ropar Main Gate",
    description:
      "Premium service driver with luxury vehicle. Best choice for airport trips, long distances, and special occasions.",
    totalRides: 280,
    carModel: "Toyota Innova Crysta",
    carType: "SUV",
    availability: "24/7",
    specialties: ["Premium Service", "Airport Trips", "Long Distance"],
    languages: ["Hindi", "English", "Punjabi"],
    verified: true,
    responseTime: "3 mins",
    joinedDate: "2020-01-12",
    priceBreakdown: {
      baseRate: 15,
      nightCharge: 18,
      airportRate: 20,
    },
    badges: ["Premium", "Most Reliable", "Airport Specialist"],
  },
  {
    id: "5",
    name: "Rajinder",
    phone: "8196067387",
    rating: 4.5,
    pricePerKm: 11,
    location: "Academic Block",
    description:
      "Reliable driver with good punctuality. Available for regular bookings and offers monthly packages for frequent travelers.",
    totalRides: 350,
    carModel: "Honda City",
    carType: "Sedan",
    availability: "6 AM - 11 PM",
    specialties: ["Regular Bookings", "Monthly Packages", "Punctual Service"],
    languages: ["Hindi", "Punjabi"],
    verified: true,
    responseTime: "8 mins",
    joinedDate: "2021-12-05",
    priceBreakdown: {
      baseRate: 11,
      nightCharge: 13,
      airportRate: 16,
    },
    badges: ["Reliable", "Package Deals"],
  },
  {
    id: "6",
    name: "Harpreet Singh",
    phone: "+91 87654 32109",
    rating: 4.6,
    pricePerKm: 10,
    location: "Girls Hostel Area",
    description:
      "Local driver, knows all shortcuts. Good for quick trips to Ropar city. Student-friendly rates for regular commutes.",
    totalRides: 320,
    carModel: "Maruti Swift",
    carType: "Hatchback",
    availability: "6 AM - 10 PM",
    specialties: ["City Trips", "Student Friendly", "Local Routes"],
    languages: ["Hindi", "Punjabi"],
    verified: true,
    responseTime: "8 mins",
    joinedDate: "2021-07-22",
    priceBreakdown: {
      baseRate: 10,
      nightCharge: 12,
      airportRate: 15,
    },
    badges: ["Student Choice", "Local Expert"],
  },
];

export default function Drivers() {
  const { data: session } = useSession();
  const [drivers] = useState(sampleDrivers);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, driverId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(driverId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <Car className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Auto Drivers Directory</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to access driver contacts and
            book rides
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Auto Drivers Directory
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Find reliable drivers for your transportation needs
          </p>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Driver Header */}
              <div className="p-6 text-center">
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {getInitials(driver.name)}
                </div>

                {/* Driver Name */}
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  {driver.name}
                </h3>

                {/* Phone Number with Copy Button */}
                <div className="flex items-center justify-center gap-2 mb-6 bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 font-medium">{driver.phone}</p>
                  <button
                    onClick={() => copyToClipboard(driver.phone, driver.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Copy phone number"
                  >
                    {copiedId === driver.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Contact Button */}
                <Button
                  onClick={() => window.open(`tel:${driver.phone}`, "_self")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg font-semibold"
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Call Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
