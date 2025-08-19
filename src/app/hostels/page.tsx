"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  ExternalLink,
  MapPin,
  Users,
  Wifi,
  Phone,
  Shield,
  Utensils,
  BookOpen,
  Dumbbell,
  Globe,
  Calendar,
} from "lucide-react";

export default function HostelsPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    document.title = "Hostels & Guest House - IIT Connect";
  }, []);

  interface HostelInfo {
    name: string;
    description: string;
    facilities: string[];
    capacity: string;
    lastUpdated: string;
    warden?: string;
    contact?: string;
    website?: string;
  }

  const hostelCategories = [
    {
      title: "Boys Hostels",
      key: "BOYS",
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-600 to-blue-800",
      hostels: [
        {
          name: "Sutlej",
          description:
            "One of the premier boys hostels at IIT Ropar with excellent facilities and modern amenities for comfortable living.",
          facilities: ["Wi-Fi", "Mess", "Common Room", "Laundry", "Study Hall"],
          capacity: "200+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Vyas",
          description:
            "Modern accommodation with excellent facilities for undergraduate students, featuring spacious rooms and recreational areas.",
          facilities: [
            "Wi-Fi",
            "Mess",
            "Study Hall",
            "Recreation Room",
            "Gym Access",
          ],
          capacity: "180+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Chenab",
          description:
            "Comfortable living spaces with modern amenities and recreational facilities for a vibrant hostel life.",
          facilities: [
            "Wi-Fi",
            "Mess",
            "Common Areas",
            "Sports Facilities",
            "Library Access",
          ],
          capacity: "160+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Brahmaputra",
          description:
            "Well-equipped hostel with modern amenities and study facilities, providing a conducive environment for academic excellence.",
          facilities: [
            "Wi-Fi",
            "Mess",
            "Library",
            "Gym Access",
            "24/7 Security",
          ],
          capacity: "220+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Jul 2025",
        },
      ] as HostelInfo[],
    },
    {
      title: "Girls Hostels",
      key: "GIRLS",
      icon: <Users className="h-6 w-6" />,
      color: "from-pink-600 to-pink-800",
      hostels: [
        {
          name: "T6",
          description:
            "Secure and comfortable accommodation for female students with modern facilities and 24/7 security.",
          facilities: [
            "Wi-Fi",
            "Mess",
            "Common Room",
            "24/7 Security",
            "Study Areas",
          ],
          capacity: "120+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Ravi",
          description:
            "Modern hostel with excellent living facilities and recreational amenities for female students.",
          facilities: [
            "Wi-Fi",
            "Mess",
            "Study Areas",
            "Recreation Room",
            "Security",
          ],
          capacity: "100+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Brahmaputra",
          description:
            "Co-ed hostel with separate wings for girls, offering secure accommodation with modern amenities.",
          facilities: [
            "Wi-Fi",
            "Mess",
            "Common Areas",
            "24/7 Security",
            "Gym Access",
          ],
          capacity: "150+ Students",
          warden: "Dr. Faculty Name",
          lastUpdated: "Jul 2025",
        },
      ] as HostelInfo[],
    },
    {
      title: "Guest House",
      key: "GUEST",
      icon: <Building className="h-6 w-6" />,
      color: "from-green-600 to-green-800",
      hostels: [
        {
          name: "IIT Ropar Guest House",
          description:
            "Comfortable accommodation for visitors, guests, and short-term stays with modern amenities and services.",
          facilities: [
            "AC Rooms",
            "Wi-Fi",
            "Restaurant",
            "Conference Hall",
            "Parking",
            "24/7 Service",
          ],
          capacity: "50+ Rooms",
          contact: "+91-1881-242xxx",
          website: "https://www.iitrpr.ac.in/guest-house",
          lastUpdated: "Aug 2025",
        },
      ] as HostelInfo[],
    },
  ];

  const categoryNames = {
    BOYS: "Boys Hostels",
    GIRLS: "Girls Hostels",
    GUEST: "Guest House",
  };

  const filteredCategories =
    selectedCategory === "ALL"
      ? hostelCategories
      : hostelCategories.filter(
          (category) => category.key === selectedCategory
        );

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case "wi-fi":
        return <Wifi className="w-4 h-4" />;
      case "mess":
        return <Utensils className="w-4 h-4" />;
      case "gym access":
        return <Dumbbell className="w-4 h-4" />;
      case "library":
      case "library access":
        return <BookOpen className="w-4 h-4" />;
      case "24/7 security":
      case "security":
        return <Shield className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Building className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Hostels & Guest House
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Discover comfortable and modern residential facilities at IIT Ropar
            campus. Find information about hostels, guest house, and
            accommodation services.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === "ALL"
                  ? "bg-white text-blue-600 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All Categories
            </button>
            {Object.entries(categoryNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === key
                    ? "bg-white text-blue-600 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                <div
                  className={`bg-gradient-to-r ${category.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mr-4`}
                >
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {category.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.hostels.map((hostel, hostelIndex) => (
                  <div
                    key={hostelIndex}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-gray-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {hostel.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {hostel.description}
                        </p>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            Capacity: {hostel.capacity}
                          </div>
                          {hostel.warden && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Building className="h-3 w-3 mr-1" />
                              Warden: {hostel.warden}
                            </div>
                          )}
                          {hostel.contact && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              Contact: {hostel.contact}
                            </div>
                          )}
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Updated: {hostel.lastUpdated}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Facilities:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {hostel.facilities.map((facility, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {getFacilityIcon(facility)}
                                <span>{facility}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {hostel.website ? (
                        <a
                          href={hostel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 bg-gradient-to-r ${category.color} text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2 text-sm`}
                        >
                          <Globe className="h-4 w-4" />
                          Visit Website
                        </a>
                      ) : (
                        <div
                          className={`flex-1 bg-gradient-to-r ${category.color} text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 text-sm`}
                        >
                          <Building className="h-4 w-4" />
                          Campus Hostel
                        </div>
                      )}
                      <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center">
                        <MapPin className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Important Information */}
        <div className="mt-12 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Important Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Hostel Guidelines
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• All hostels provide 24/7 Wi-Fi connectivity</li>
                <li>• Mess facilities available in all hostels</li>
                <li>• Security is maintained round the clock</li>
                <li>• Common areas for recreation and study</li>
                <li>• Laundry facilities available</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                Contact Information
              </h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>• BOHA Office: boha@iitrpr.ac.in</p>
                <p>• Hostel Administration: hostel@iitrpr.ac.in</p>
                <p>• Guest House: guesthouse@iitrpr.ac.in</p>
                <p>• Main Office: +91-1881-242000</p>
                <div className="flex gap-4 mt-4">
                  <a
                    href="https://iitrpr.ac.in/student-council/boha.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    BOHA Website
                  </a>
                  <a
                    href="https://www.iitrpr.ac.in/guest-house"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Guest House
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
