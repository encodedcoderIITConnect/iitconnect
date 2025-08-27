"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

// Departments and their courses based on the official IIT Ropar structure
const departments = [
  // Engineering Departments
  {
    name: "Artificial Intelligence and Data Engineering",
    shortName: "AI&DE",
    category: "Engineering",
    courses: [
      "B.Tech in Artificial Intelligence and Data Engineering",
      "M.Tech in Artificial Intelligence and Data Engineering",
      "Ph.D in Artificial Intelligence and Data Engineering",
    ],
    description:
      "Focuses on AI, machine learning, data science, and intelligent systems development.",
    image: "/campus/spiral.jpg",
    website: "https://www.iitrpr.ac.in/saide/",
  },
  {
    name: "BioMedical Engineering",
    shortName: "BME",
    category: "Engineering",
    courses: [
      "B.Tech in BioMedical Engineering",
      "M.Tech in BioMedical Engineering",
      "Ph.D in BioMedical Engineering",
    ],
    description:
      "Integrates engineering with biological and medical sciences for healthcare solutions.",
    image: "/campus/SAB.png",
    website: "https://www.iitrpr.ac.in/cbme/",
  },
  {
    name: "Chemical Engineering",
    shortName: "Chemical",
    category: "Engineering",
    courses: [
      "B.Tech in Chemical Engineering",
      "M.Tech in Chemical Engineering",
      "Ph.D in Chemical Engineering",
    ],
    description:
      "Involves process design, chemical reactions, and industrial chemistry applications.",
    image: "/campus/lights-on.jpg",
    website: "https://www.iitrpr.ac.in/chemical/Index/index.php",
  },
  {
    name: "Civil Engineering",
    shortName: "Civil",
    category: "Engineering",
    courses: [
      "B.Tech in Civil Engineering",
      "M.Tech in Civil Engineering",
      "Ph.D in Civil Engineering",
    ],
    description:
      "Covers structural engineering, transportation, and infrastructure development.",
    image: "/campus/SAB.png",
    website: "https://www.iitrpr.ac.in/civil/",
  },
  {
    name: "Computer Science and Engineering",
    shortName: "CSE",
    category: "Engineering",
    courses: [
      "B.Tech in Computer Science and Engineering",
      "M.Tech in Computer Science and Engineering",
      "Ph.D in Computer Science and Engineering",
    ],
    description:
      "Focuses on software development, algorithms, artificial intelligence, and computer systems.",
    image: "/campus/spiral.jpg",
    website: "https://cse.iitrpr.ac.in/",
  },
  {
    name: "Electrical Engineering",
    shortName: "Electrical",
    category: "Engineering",
    courses: [
      "B.Tech in Electrical Engineering",
      "M.Tech in Electrical Engineering",
      "Ph.D in Electrical Engineering",
    ],
    description:
      "Covers power systems, electronics, control systems, and electrical machines.",
    image: "/campus/lights-on.jpg",
    website: "https://www.iitrpr.ac.in/ee/",
  },
  {
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    category: "Engineering",
    courses: [
      "B.Tech in Mechanical Engineering",
      "M.Tech in Mechanical Engineering",
      "Ph.D in Mechanical Engineering",
    ],
    description:
      "Deals with design, manufacturing, thermal systems, and mechanical systems.",
    image: "/campus/Academics.jpg",
    website: "https://mech.iitrpr.ac.in/",
  },
  {
    name: "Metallurgical and Materials Engineering",
    shortName: "MME",
    category: "Engineering",
    courses: [
      "B.Tech in Metallurgical and Materials Engineering",
      "M.Tech in Metallurgical and Materials Engineering",
      "Ph.D in Metallurgical and Materials Engineering",
    ],
    description:
      "Studies materials science, metallurgy, and advanced materials development.",
    image: "/campus/SAB.png",
    website: "https://mme.iitrpr.ac.in/",
  },
  // Science Departments
  {
    name: "Chemistry",
    shortName: "Chemistry",
    category: "Sciences",
    courses: ["M.Sc in Chemistry", "Ph.D in Chemistry"],
    description:
      "Focuses on organic, inorganic, physical, and analytical chemistry research.",
    image: "/campus/Leaves.jpg",
    website: "https://www.iitrpr.ac.in/chemistry",
  },
  {
    name: "Physics",
    shortName: "Physics",
    category: "Sciences",
    courses: ["M.Sc in Physics", "Ph.D in Physics"],
    description:
      "Covers theoretical and experimental physics, quantum mechanics, and applied physics.",
    image: "/campus/spiral.jpg",
    website: "https://www.iitrpr.ac.in/physics/",
  },
  {
    name: "Mathematics",
    shortName: "Mathematics",
    category: "Sciences",
    courses: ["M.Sc in Mathematics", "Ph.D in Mathematics"],
    description:
      "Combines pure mathematics, applied mathematics, and computational methods.",
    image: "/campus/Sunset.jpg",
    website: "https://www.iitrpr.ac.in/math/",
  },
  // Humanities Department
  {
    name: "Humanities and Social Sciences",
    shortName: "HSS",
    category: "Humanities",
    courses: [
      "M.A in English",
      "M.A in Economics",
      "Ph.D in Humanities and Social Sciences",
    ],
    description:
      "Covers literature, economics, psychology, philosophy, and social sciences.",
    image: "/campus/SAB.png",
    website: "https://www.iitrpr.ac.in/hss/",
  },
];

// Research Centers
const centers = [
  {
    name: "Center for Artificial Intelligence and Robotics in Defense Systems",
    shortName: "CARDS",
    description:
      "Advanced research in AI and robotics for defense applications and security systems.",
    image: "/campus/spiral.jpg",
    website: "https://www.iitrpr.ac.in/datascience/",
  },
  {
    name: "Center of Excellence for Sustainable Agriculture and Rural Development Systems",
    shortName: "CoE-SARDS",
    description:
      "Promoting sustainable agriculture practices and rural development through technology.",
    image: "/campus/Leaves.jpg",
    website: "https://www.iitrpr.ac.in/coe-sards/",
  },
  {
    name: "Center for Engineering Education",
    shortName: "CEE",
    description:
      "Enhancing engineering education through innovative teaching methods and curriculum development.",
    image: "/campus/Academics.jpg",
    website: "https://www.iitrpr.ac.in/center-engineering-education",
  },
  {
    name: "Indo-Taiwan Joint Research Center",
    shortName: "IT JRC",
    description:
      "Collaborative research center fostering Indo-Taiwan academic and industrial partnerships.",
    image: "/campus/SAB.png",
    website: "https://www.iitrpr.ac.in/indo-taiwan/",
  },
  {
    name: "Center for Research in Energy and Environment for Development",
    shortName: "CREED",
    description:
      "Research focused on sustainable energy solutions and environmental development.",
    image: "/campus/Sunset.jpg",
    website: "https://iitrpr.ac.in/creed",
  },
];

export default function DepartmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Group departments by category
  const departmentsByCategory = departments.reduce((acc, dept) => {
    if (!acc[dept.category]) {
      acc[dept.category] = [];
    }
    acc[dept.category].push(dept);
    return acc;
  }, {} as Record<string, typeof departments>);

  const categories = ["ALL", "Engineering", "Sciences", "Humanities"];

  // Filter departments based on selected category
  const filteredDepartmentsByCategory =
    selectedCategory === "ALL"
      ? departmentsByCategory
      : departmentsByCategory[selectedCategory]
      ? { [selectedCategory]: departmentsByCategory[selectedCategory] }
      : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 py-10 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">
        Departments
      </h1>
      <p className="text-white/80 text-center mb-8 max-w-4xl mx-auto">
        Explore the various academic departments at IIT Ropar and the courses
        they offer.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === category
                ? "bg-white text-blue-600 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {category === "ALL" ? "All Departments" : category}
          </button>
        ))}
      </div>

      {/* Departments by Category */}
      {Object.entries(filteredDepartmentsByCategory).map(
        ([category, categoryDepts]) => (
          <div key={category} className="w-full max-w-7xl mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryDepts.map((dept) => (
                <div
                  key={dept.shortName}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col hover:scale-[1.02] hover:shadow-2xl transition-all border border-teal-200"
                >
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-32 object-cover rounded-xl mb-4 border-2 border-blue-300"
                  />
                  <h3 className="text-2xl font-semibold mb-2 text-blue-900">
                    {dept.shortName}
                  </h3>
                  <h4 className="text-lg font-medium mb-3 text-gray-800">
                    {dept.name}
                  </h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    {dept.description}
                  </p>
                  <div className="mt-auto">
                    <h5 className="font-semibold text-blue-800 mb-2">
                      Courses Offered:
                    </h5>
                    <ul className="space-y-1 mb-4">
                      {dept.courses.map((course, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-blue-500 mr-2">•</span>
                          {course}
                        </li>
                      ))}
                    </ul>

                    {/* Website Link Button */}
                    <a
                      href={dept.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Research Centers Section */}
      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Centers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {centers.map((center) => (
            <div
              key={center.shortName}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col hover:scale-[1.02] hover:shadow-2xl transition-all border border-teal-200"
            >
              <img
                src={center.image}
                alt={center.name}
                className="w-full h-32 object-cover rounded-xl mb-4 border-2 border-blue-300"
              />
              <h3 className="text-2xl font-semibold mb-2 text-blue-900">
                {center.shortName}
              </h3>
              <h4 className="text-lg font-medium mb-3 text-gray-800">
                {center.name}
              </h4>
              <p className="text-gray-600 text-sm mb-4">{center.description}</p>

              {/* Website Link Button */}
              <div className="mt-auto">
                <a
                  href={center.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
