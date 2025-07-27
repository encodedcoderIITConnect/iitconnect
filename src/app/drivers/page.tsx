"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Phone, MapPin, Car } from "lucide-react";

// Sample drivers data - in a real app, this would come from your database
const sampleDrivers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    pricePerKm: 12,
    location: "IIT Ropar Main Gate",
    description:
      "Experienced driver with 8+ years. Safe driving, always on time. AC car available.",
    totalRides: 450,
    carModel: "Maruti Swift",
  },
  {
    id: "2",
    name: "Harpreet Singh",
    phone: "+91 87654 32109",
    rating: 4.6,
    pricePerKm: 10,
    location: "Near Admin Block",
    description:
      "Local driver, knows all shortcuts. Good for quick trips to Ropar city.",
    totalRides: 320,
    carModel: "Hyundai i10",
  },
  {
    id: "3",
    name: "Suresh Sharma",
    phone: "+91 76543 21098",
    rating: 4.9,
    pricePerKm: 15,
    location: "IIT Ropar Main Gate",
    description:
      "Premium service, luxury car. Best for airport trips and long distances.",
    totalRides: 280,
    carModel: "Toyota Innova",
  },
  {
    id: "4",
    name: "Mandeep Kaur",
    phone: "+91 65432 10987",
    rating: 4.7,
    pricePerKm: 11,
    location: "Boys Hostel Area",
    description:
      "Female driver, preferred by many female students. Very punctual and safe.",
    totalRides: 190,
    carModel: "Maruti Alto",
  },
  {
    id: "5",
    name: "Gurpreet Singh",
    phone: "+91 54321 09876",
    rating: 4.5,
    pricePerKm: 9,
    location: "Academic Block",
    description:
      "Budget-friendly rides, good for daily commutes. Student-friendly pricing.",
    totalRides: 520,
    carModel: "Tata Indica",
  },
];

export default function Drivers() {
  const [drivers] = useState(sampleDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filteredDrivers = drivers
    .filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.pricePerKm - b.pricePerKm;
      if (sortBy === "rides") return b.totalRides - a.totalRides;
      return 0;
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i === Math.floor(rating) && rating % 1 >= 0.5
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auto Drivers Directory
          </h1>
          <p className="text-gray-600">
            Find reliable drivers with transparent pricing and ratings
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by driver name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="rides">Sort by Experience</option>
              </select>
              <Button>
                <Car className="h-4 w-4 mr-2" />
                Book Ride
              </Button>
            </div>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Driver Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {driver.name}
                  </h3>
                  <p className="text-sm text-gray-600">{driver.carModel}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(driver.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {driver.rating}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({driver.totalRides} rides)
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{driver.location}</span>
              </div>

              {/* Price */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{driver.pricePerKm}
                  </span>
                  <span className="text-sm text-green-600 ml-1">per km</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {driver.description}
              </p>

              {/* Contact Button */}
              <Button className="w-full" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact {driver.phone}
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No drivers found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Add Driver CTA */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Are you a driver?
          </h3>
          <p className="text-blue-700 mb-4">
            Join our network and connect with IIT Ropar students
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Register as Driver
          </Button>
        </div>
      </div>
    </div>
  );
}
