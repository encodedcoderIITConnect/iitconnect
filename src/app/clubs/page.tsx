import React from "react";
import { Globe, Instagram } from "lucide-react";

// List of clubs with details
const clubs = [
  {
    name: "Alfaaz Poetry Club",
    description: "Poetry and creative writing activities.",
    image: "/campus/spiral.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "Alpha Productions - Movie Making Club",
    description: "Filmmaking, editing, and production.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "DebSoc - Debating Society",
    description: "Debates, discussions, and public speaking.",
    image: "/campus/SAB.png",
    website: "",
    instagram: "",
  },
  {
    name: "Enarrators – Oratory Club",
    description: "Oratory, elocution, and speech events.",
    image: "/campus/spiral.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "Enigma – Quizzing and Puzzling Club",
    description: "Quizzes, puzzles, and trivia competitions.",
    image: "/campus/lights-on.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "Filmski – Movie Screening Club",
    description: "Movie screenings and film appreciation.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "Model United Nations (MUN)",
    description: "MUN conferences and global affairs simulation.",
    image: "/campus/SAB.png",
    website: "",
    instagram: "",
  },
  {
    name: "Vibes - The Music Club",
    description: "Music appreciation and performance.",
    image: "/campus/lights-on.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "The Fashion Society",
    description: "Fashion shows and design activities.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "The Dramatics Society",
    description: "Theatre, acting, and drama activities.",
    image: "/campus/SAB.png",
    website: "",
    instagram: "",
  },
  {
    name: "The Fine Arts Society",
    description: "Art and craft workshops and exhibitions.",
    image: "/campus/lights-on.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "TechnoXian - The Robotics Club",
    description: "Robotics design, building, and programming.",
    image: "/icon0.svg",
    website: "",
    instagram: "",
  },
  {
    name: "Finest Club",
    description: "Finance and consulting workshops and events.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "AutoNexus - The Automotive Club",
    description: "Automotive design, engineering, and discussions.",
    image: "/campus/spiral.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "CIM - Computer Integrated Manufacturing Club",
    description: "Manufacturing processes and technology integration.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "CodeCrafters - The Coding Club",
    description: "Coding, software development, and tech talks.",
    image: "/icon1.png",
    website: "",
    instagram: "",
  },
  {
    name: "GameOn - The Gaming Club",
    description: "Gaming tournaments and game development.",
    image: "/campus/SAB.png",
    website: "",
    instagram: "",
  },
  {
    name: "IOTA - The AI Club",
    description: "AI development, machine learning, and data science.",
    image: "/campus/lights-on.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "MonoChrome - The Designing Club",
    description: "Graphic design, UI/UX, and creative workshops.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "SoftSolutions - The Development Club",
    description: "Software development and programming languages.",
    image: "/campus/spiral.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "Zenith - The Astronomy Club",
    description: "Astronomy observations and space science discussions.",
    image: "/campus/lights-on.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "AeroModelling - The Aviation Club",
    description: "Aerospace design, model building, and simulations.",
    image: "/campus/pillar.png",
    website: "",
    instagram: "",
  },
  {
    name: "E-Cell - The Entrepreneurship Cell",
    description: "! Dare · Dream · Disrupt !",
    image: "/campus/spiral.jpg",
    website: "",
    instagram: "",
  },
  {
    name: "Board of Science and Technology (BOST)",
    description: "Promotes science, technology, and innovation on campus.",
    image: "/campus/SAB.png",
    website: "https://bost-19.github.io/",
    instagram: "",
  },
];

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 py-10 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg font-[var(--font-princess-sofia)]">
        Campus Clubs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {clubs.map((club) => (
          <div
            key={club.name}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all border border-teal-200 relative"
          >
            <img
              src={club.image}
              alt={club.name}
              className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-blue-300 shadow"
            />
            <h2 className="text-2xl font-semibold mb-2 text-center text-blue-900 font-[var(--font-geist-sans)]">
              {club.name}
            </h2>
            <p className="text-gray-700 text-center font-[var(--font-geist-mono)]">
              {club.description}
            </p>
            {/* Show icons in bottom right if links exist */}
            {(club.website || club.instagram) && (
              <div className="absolute bottom-4 right-4 flex gap-3">
                {club.website && (
                  <a
                    href={club.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-6 w-6 text-blue-600 hover:text-blue-800 transition" />
                  </a>
                )}
                {club.instagram && club.instagram !== "" && (
                  <a
                    href={club.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-6 w-6 text-pink-500 hover:text-pink-700 transition" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
