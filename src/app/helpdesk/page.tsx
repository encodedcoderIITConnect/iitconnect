"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Wrench,
  Monitor,
} from "lucide-react";

export default function HelpDeskPage() {
  const helpDeskServices = [
    {
      title: "Works & Estate Helpdesk",
      description:
        "Submit tickets for infrastructure, facilities, maintenance, and estate-related issues",
      icon: <Wrench className="h-8 w-8" />,
      features: [
        "Infrastructure maintenance requests",
        "Facility issues and repairs",
        "Estate and housing concerns",
        "Campus facility bookings",
        "Maintenance complaints",
      ],
      submitUrl: "https://www.iitrpr.ac.in/estatehelpdesk/index.php?a=add",
      viewUrl: "https://www.iitrpr.ac.in/estatehelpdesk/ticket.php",
      websiteUrl: "https://www.iitrpr.ac.in/estatehelpdesk/",
      color: "from-blue-600 to-blue-800",
    },
    {
      title: "IT Support",
      description:
        "Get technical support for computers, networks, software, and IT-related issues",
      icon: <Monitor className="h-8 w-8" />,
      features: [
        "Computer and laptop issues",
        "Network connectivity problems",
        "Software installation and updates",
        "Email and account support",
        "Campus Wi-Fi assistance",
      ],
      submitUrl: "https://www.iitrpr.ac.in/itsupport/index.php?a=add",
      viewUrl: "https://www.iitrpr.ac.in/itsupport/ticket.php",
      websiteUrl: "https://www.iitrpr.ac.in/itsupport/",
      color: "from-green-600 to-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Help Desk Services
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Get support for campus facilities, IT issues, and technical
            problems. Submit tickets and track your requests through our
            dedicated help desk systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {helpDeskServices.map((service, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 hover:scale-[1.02] transition-all"
            >
              <div
                className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}
              >
                {service.icon}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {service.title}
              </h2>

              <p className="text-gray-600 mb-6">{service.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Services Include:
                </h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <a
                  href={service.submitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2`}
                >
                  Submit New Ticket
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  href={service.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  View Existing Tickets
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  href={service.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 transition flex items-center justify-center gap-2"
                >
                  Visit Help Desk Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Emergency Contacts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Emergency</h3>
              <p className="text-gray-600">Security: 01881-242000</p>
              <p className="text-gray-600">Medical: 01881-242020</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                General Support
              </h3>
              <p className="text-gray-600">support@iitrpr.ac.in</p>
              <p className="text-gray-600">admin@iitrpr.ac.in</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
              <p className="text-gray-600">IIT Ropar Campus</p>
              <p className="text-gray-600">Rupnagar, Punjab 140001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
