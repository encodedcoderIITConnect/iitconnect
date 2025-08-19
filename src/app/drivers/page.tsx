"use client";

import React, { useState, useEffect } from "react";
import { Car, Phone, Star, MapPin, Copy, Check } from "lucide-react";

export default function AutoDriversPage() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Auto Drivers - IIT Connect";
  }, []);

  const drivers = [
    {
      id: "1",
      name: "Banne",
      phone: "+91 86998 20043",
      rating: "",
      pricePerKm: 12,
      location: "IIT Ropar Main Gate",
      avatar: "👨🏻‍🦳",
      carModel: "Maruti Swift Dzire",
    },
    {
      id: "2",
      name: "Rajvir",
      phone: "+91 98142 14458",
      rating: 4.7,
      pricePerKm: 11,
      location: "Near Admin Block",
      avatar: "👨🏻",
      carModel: "Hyundai Grand i10",
    },
    {
      id: "3",
      name: "Sukhdev",
      phone: "+91 94172 85632",
      rating: 4.9,
      pricePerKm: 14,
      location: "Campus Gate 2",
      avatar: "👨🏽‍🦱",
      carModel: "Honda City",
    },
    {
      id: "4",
      name: "Gurpreet",
      phone: "+91 97798 45123",
      rating: 4.5,
      pricePerKm: 10,
      location: "Near Hostel Area",
      avatar: "👨🏻‍🦲",
      carModel: "Maruti Alto",
    },
    {
      id: "5",
      name: "Harjeet",
      phone: "+91 94635 78912",
      rating: 4.6,
      pricePerKm: 11,
      location: "Academic Block",
      avatar: "👨🏽",
      carModel: "Tata Tiago",
    },
  ];

  const copyPhoneNumber = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };

  const callDriver = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Auto Drivers</h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Connect with verified auto drivers for safe and reliable
            transportation around IIT Ropar campus and nearby areas.
          </p>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
            >
              {/* Driver Avatar and Info */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{driver.avatar}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {driver.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {driver.rating}
                  </span>
                </div>
              </div>

              {/* Driver Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {driver.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Car className="h-4 w-4 mr-2 text-gray-400" />
                  {driver.carModel}
                </div>
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ₹{driver.pricePerKm}/km
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => callDriver(driver.phone)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </button>
                <button
                  onClick={() => copyPhoneNumber(driver.phone)}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition flex items-center justify-center min-w-[50px]"
                  title={driver.phone}
                >
                  {copiedPhone === driver.phone ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Phone Number Display */}
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-500">{driver.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
