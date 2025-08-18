"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Globe, Instagram } from "lucide-react";

// List of clubs with details organized by boards
const clubs = [
  // BOCA (Board of Cultural Affairs)
  {
    name: "Alankar",
    board: "BOCA",
    description:
      "Music Club - Focuses on vocal and instrumental performances, both classical and contemporary. They organize concerts, open mics, and represent the institute at cultural fests.",
    image: "/clubs/song.png",
    website: "",
    instagram: "https://www.instagram.com/alankar_iitrpr/?hl=en",
  },
  {
    name: "Arturo",
    board: "BOCA",
    description:
      "Art Club - A creative hub for painting, sketching, and digital art. Members work on exhibitions, wall art around campus, and design elements for institute events.",
    image: "/clubs/camera.png",
    website: "",
    instagram: "https://www.instagram.com/arturo_iitrpr/?hl=en",
  },
  {
    name: "Epicure",
    board: "BOCA",
    description:
      "Culinary Club - For food enthusiasts who love cooking and experimenting. They conduct food festivals, cooking competitions, and workshops on world cuisines.",
    image: "/clubs/chef.png",
    website: "",
    instagram: "https://www.instagram.com/epicure_iitrpr/",
  },
  {
    name: "D'Cypher",
    board: "BOCA",
    description:
      "Dance Club - Promoting various dance forms from classical to contemporary. They perform at cultural events, conduct workshops, and participate in inter-college competitions.",
    image: "/clubs/dance.png",
    website: "",
    instagram: "https://www.instagram.com/danceclub_iitrpr/?hl=en",
  },
  {
    name: "Panache",
    board: "BOCA",
    description:
      "Fashion & Lifestyle Club - Focuses on modeling, fashion shows, styling workshops, and lifestyle events during institute fests.",
    image: "/clubs/fashion.png",
    website: "",
    instagram: "https://www.instagram.com/fashion.iitrpr/",
  },
  {
    name: "Undekha",
    board: "BOCA",
    description:
      "Dramatics Club - A theatre and dramatics club that performs stage plays, street plays, and mime acts. Known for creativity in scripts and performance.",
    image: "/clubs/drama.png",
    website: "",
    instagram: "https://www.instagram.com/undekha_iitrpr/",
  },
  {
    name: "Vibgyor",
    board: "BOCA",
    description:
      "Fine Arts Club - Covers painting, sketching, creative arts, and hosts art exhibitions. Members create visual content for institute events and competitions.",
    image: "/clubs/art.png",
    website: "",
    instagram: "https://www.instagram.com/vibgyor_iitrpr/?hl=en",
  },
  // BOST (Board of Science and Technology)
  {
    name: "Aeromodelling Club",
    board: "BOST",
    description:
      "Dedicated to aerospace enthusiasts who build and test aircraft models, drones, and participate in national-level aeromodelling competitions.",
    image: "/clubs/aero.png",
    website: "",
    instagram: "https://www.instagram.com/aeromodelling_iitrpr/",
  },
  {
    name: "Automotive Club",
    board: "BOST",
    description:
      "Hands-on club for automobile lovers. They work on vehicle design, participate in Formula Student/BAJA competitions, and conduct workshops on automotive engineering.",
    image: "/clubs/automotive.png",
    website: "",
    instagram: "https://www.instagram.com/automotive_club_iitrpr/?hl=en",
  },
  {
    name: "CIM Club",
    board: "BOST",
    description:
      "Computer Integrated Manufacturing - Focuses on modern manufacturing technologies, automation, and industrial processes using computer-aided systems.",
    image: "/clubs/cim.png",
    website: "",
    instagram: "https://www.instagram.com/cim_club_iitrpr/?hl=en",
  },
  {
    name: "Coding Club",
    board: "BOST",
    description:
      "Tech-oriented club promoting coding, hackathons, competitive programming, and software development projects. Gateway to programming excellence.",
    image: "/clubs/coding.png",
    website: "",
    instagram: "https://www.instagram.com/coding_iitrpr/?hl=en",
  },
  {
    name: "ESportZ Club",
    board: "BOST",
    description:
      "E-Sports and Gaming - Organizes gaming tournaments, esports competitions, and promotes competitive gaming culture on campus.",
    image: "/clubs/esportz.png",
    website: "",
    instagram: "https://www.instagram.com/esportz.iitrpr/",
  },
  {
    name: "FinCOM",
    board: "BOST",
    description:
      "Finance and Economics Club - Explores financial markets, investment strategies, economic analysis, and hosts workshops on financial literacy.",
    image: "/clubs/fincom.png",
    website: "",
    instagram: "https://www.instagram.com/fincom_iitrpr/?hl=en",
  },
  {
    name: "Iota Cluster",
    board: "BOST",
    description:
      "Artificial Intelligence Club - Focuses on AI research, machine learning projects, data science workshops, and cutting-edge technology development.",
    image: "/clubs/iota.png",
    website: "",
    instagram: "https://www.instagram.com/aiclub_iitrpr/",
  },
  {
    name: "Monochrome Club",
    board: "BOST",
    description:
      "Photography and Creative Design - Captures campus life, creates visual content, and promotes photography skills through workshops and exhibitions.",
    image: "/clubs/camera.png",
    website: "",
    instagram: "https://www.instagram.com/monochrome_iit_ropar/",
  },
  {
    name: "Robotics Club",
    board: "BOST",
    description:
      "Robotics projects and competitions - Builds autonomous robots, participates in national robotics competitions, and conducts technical workshops.",
    image: "/clubs/robot.png",
    website: "https://bost-19.github.io/",
    instagram: "https://www.instagram.com/robotics_iitrpr/?hl=en",
  },
  {
    name: "Softcom",
    board: "BOST",
    description:
      "Software Community and Development - Promotes open-source development, software engineering practices, and collaborative coding projects.",
    image: "/clubs/softcom.png",
    website: "",
    instagram: "https://www.instagram.com/softcom_iitrpr/",
  },
  {
    name: "Zenith Club",
    board: "BOST",
    description:
      "Astronomy and Space Science - Explores celestial phenomena, organizes stargazing sessions, and promotes space science awareness among students.",
    image: "/clubs/zenith.png",
    website: "",
    instagram: "https://www.instagram.com/zenith_iit_ropar/?hl=en",
  },
  // BOLA (Board of Literary Affairs)
  {
    name: "Alfaaz",
    board: "BOLA",
    description:
      "Poetry Club - Celebrates the art of poetry in multiple languages, organizes poetry slams, open mic sessions, and promotes creative writing.",
    image: "/clubs/alfaaz.png",
    website: "",
    instagram: "https://www.instagram.com/alfaaz_iitrpr/?hl=en",
  },
  {
    name: "Alpha Productions",
    board: "BOLA",
    description:
      "Movie Making Club - Covers filmmaking, cinematography, and creative video projects. They shoot event aftermovies, short films, and documentaries.",
    image: "/clubs/alpha-productions.png",
    website: "",
    instagram: "https://www.instagram.com/alpha_productions_iitrpr/?hl=en",
  },
  {
    name: "Debsoc",
    board: "BOLA",
    description:
      "Debating Society - Promotes structured debates, parliamentary discussions, and public speaking skills through regular debate competitions and workshops.",
    image: "/clubs/debsoc.png",
    website: "",
    instagram: "https://www.instagram.com/debsoc_iitropar/?hl=en",
  },
  {
    name: "Enarrators",
    board: "BOLA",
    description:
      "Oratory Club - Focuses on public speaking, storytelling, and presentation skills. Conducts workshops and competitions to enhance communication abilities.",
    image: "/clubs/oratory.png",
    website: "",
    instagram: "",
  },
  {
    name: "Enigma",
    board: "BOLA",
    description:
      "Quizzing and Puzzling Club - Organizes quiz competitions, trivia nights, and brain teasers. Promotes general knowledge and analytical thinking.",
    image: "/clubs/enigma.png",
    website: "",
    instagram: "https://www.instagram.com/enigma_iitropar/?hl=en",
  },
  {
    name: "Filmski",
    board: "BOLA",
    description:
      "Movie and Film Screening Club - Hosts film screenings, movie discussions, film festivals, and promotes cinema appreciation among students.",
    image: "/clubs/filmski.png",
    website: "",
    instagram: "https://www.instagram.com/filmski_iitropar/?hl=en",
  },
  {
    name: "MUN Club",
    board: "BOLA",
    description:
      "Model United Nations - Simulates UN proceedings, promotes diplomatic skills, international relations awareness, and global perspective among students.",
    image: "/clubs/mun.png",
    website: "",
    instagram: "https://www.instagram.com/muniitropar/?hl=en",
  },
  // BOSA (Board of Sports Affairs)
  // Main Sports Instagram: https://www.instagram.com/sports.iitrpr/?hl=en
  {
    name: "Athletics",
    board: "BOSA",
    description:
      "Track and field athletics including running, jumping, and throwing events. Trains students for Inter-IIT and other athletic competitions, promoting fitness and competitive spirit.",
    image: "/clubs/athletics.png",
    website: "",
    instagram: "https://www.instagram.com/athletics_club_iitrpr/",
  },
  {
    name: "Aquatics",
    board: "BOSA",
    description:
      "Swimming and water sports club that organizes swimming competitions, provides training sessions, and promotes water safety awareness among students.",
    image: "/clubs/aquatics.png",
    website: "",
    instagram: "https://www.instagram.com/aarohan_iitropar/?hl=en",
  },
  {
    name: "Badminton",
    board: "BOSA",
    description:
      "Promotes badminton through regular practice sessions, tournaments, and Inter-IIT competitions. Provides coaching for all skill levels and maintains badminton courts.",
    image: "/clubs/badminton.png",
    website: "",
    instagram: "https://www.instagram.com/badminton_iitrpr/",
  },
  {
    name: "Basketball",
    board: "BOSA",
    description:
      "Organizes basketball training, matches, and tournaments. Represents IIT Ropar in Inter-IIT basketball competitions and promotes teamwork through sports.",
    image: "/clubs/basketball.png",
    website: "",
    instagram: "https://www.instagram.com/basketball_iitrpr/?hl=en",
  },
  {
    name: "Chess",
    board: "BOSA",
    description:
      "Strategic thinking and chess gameplay. Conducts chess tournaments, training sessions, and promotes analytical thinking through the game of chess for all students.",
    image: "/clubs/chess.png",
    website: "",
    instagram: "https://www.instagram.com/chess_club_iit_ropar/?hl=en",
  },
  {
    name: "Cricket",
    board: "BOSA",
    description:
      "Cricket training and matches for all formats. Organizes league tournaments, provides coaching, and represents institute in Inter-IIT cricket competitions.",
    image: "/clubs/cricket.png",
    website: "",
    instagram: "https://www.instagram.com/cricket_iitrpr/?hl=en",
  },
  {
    name: "Football",
    board: "BOSA",
    description:
      "Football training, matches, and tournaments. Promotes football culture on campus and participates in Inter-IIT and regional competitions with dedicated coaching.",
    image: "/clubs/footbal.png",
    website: "",
    instagram: "https://www.instagram.com/football_iitrpr/",
  },
  {
    name: "Hockey",
    board: "BOSA",
    description:
      "Field hockey training and competitions. Develops hockey skills, organizes matches, and represents IIT Ropar in Inter-IIT hockey tournaments.",
    image: "/clubs/hockey.png",
    website: "",
    instagram: "https://www.instagram.com/iitropar_hockey/",
  },
  {
    name: "Table Tennis",
    board: "BOSA",
    description:
      "Table tennis training and tournaments for students of all skill levels. Provides coaching and organizes Inter-IIT table tennis competitions with regular practice sessions.",
    image: "/clubs/table-tennis.png",
    website: "",
    instagram: "https://www.instagram.com/ttclub_iitropar/",
  },
  {
    name: "Tennis",
    board: "BOSA",
    description:
      "Lawn tennis coaching and tournaments. Maintains tennis courts, organizes matches, and promotes tennis culture among students with professional coaching.",
    image: "/clubs/tennis.png",
    website: "",
    instagram: "https://www.instagram.com/sports.iitrpr/?hl=en",
  },
  {
    name: "Volleyball",
    board: "BOSA",
    description:
      "Volleyball training and inter-hostel competitions. Develops teamwork skills and represents institute in Inter-IIT volleyball championships.",
    image: "/clubs/volleyball.png",
    website: "",
    instagram: "https://www.instagram.com/volley_iitrpr/?hl=en",
  },
  {
    name: "Weightlifting and Gym",
    board: "BOSA",
    description:
      "Strength training and weightlifting techniques. Provides fitness guidance, organizes powerlifting competitions, and promotes physical wellness among students.",
    image: "/clubs/gym.png",
    website: "",
    instagram: "https://www.instagram.com/weightliftingclub_iitrpr/?hl=en",
  },
  // BOWA (Board of Wellness Affairs)
  {
    name: "Wellness Committee",
    board: "BOWA",
    description:
      "Promotes mental health and overall wellness among students. Organizes counseling sessions, stress management workshops, and creates a supportive campus environment for student well-being.",
    image: "/clubs/wellness.png",
    website: "",
    instagram: "https://www.instagram.com/bowa.iitrpr/",
  },
];

export default function ClubsPage() {
  const [selectedBoard, setSelectedBoard] = useState<string>("ALL");

  // Group clubs by board
  const clubsByBoard = clubs.reduce((acc, club) => {
    if (!acc[club.board]) {
      acc[club.board] = [];
    }
    acc[club.board].push(club);
    return acc;
  }, {} as Record<string, typeof clubs>);

  const boardNames = {
    BOCA: "BOCA - Board of Cultural Affairs",
    BOST: "BOST - Board of Science and Technology",
    BOLA: "BOLA - Board of Literary Affairs",
    BOSA: "BOSA - Board of Sports Affairs",
    BOWA: "BOWA - Board of Wellness Affairs",
  };

  const boardDescriptions = {
    BOCA: "Promotes cultural activities, arts, music, dance, drama, and creative expression on campus.",
    BOST: "Oversees technical clubs, innovation, research, coding, robotics, and technological advancement.",
    BOLA: "Manages literary activities, debates, poetry, writing, quizzing, and intellectual discourse.",
    BOSA: "Coordinates sports activities, athletics, fitness, and physical wellness programs.",
    BOWA: "Focuses on student wellness, mental health support, and overall well-being initiatives.",
  };

  // Filter clubs based on selected board
  const filteredClubsByBoard =
    selectedBoard === "ALL"
      ? clubsByBoard
      : clubsByBoard[selectedBoard]
      ? { [selectedBoard]: clubsByBoard[selectedBoard] }
      : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 py-10 px-4 flex flex-col items-center pb-20 lg:pb-10">
      <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">
        Clubs
      </h1>

      {/* Board Filter */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setSelectedBoard("ALL")}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            selectedBoard === "ALL"
              ? "bg-white text-blue-600 shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          All Boards
        </button>
        {Object.entries(boardNames).map(([board, name]) => (
          <button
            key={board}
            onClick={() => setSelectedBoard(board)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedBoard === board
                ? "bg-white text-blue-600 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {Object.entries(filteredClubsByBoard).map(([board, boardClubs]) => (
        <div key={board} className="w-full max-w-6xl mb-12">
          <h2 className="text-2xl font-semibold text-white mb-3 text-center">
            {boardNames[board as keyof typeof boardNames] || board}
          </h2>
          <p className="text-white/80 text-center mb-6 max-w-4xl mx-auto">
            {boardDescriptions[board as keyof typeof boardDescriptions]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {boardClubs.map((club) => (
              <div
                key={club.name}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all border border-teal-200 relative"
              >
                <Image
                  src={club.image}
                  alt={club.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-blue-300 shadow"
                />
                <h3 className="text-2xl font-semibold mb-2 text-center text-blue-900">
                  {club.name}
                </h3>
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
      ))}
    </div>
  );
}
