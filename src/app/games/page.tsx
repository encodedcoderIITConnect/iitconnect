"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, MapPin, Clock, Star } from "lucide-react";

interface Game {
  id: string;
  name: string;
  type: "physical" | "video";
  availability: "available" | "occupied" | "maintenance";
  location: string;
  maxPlayers: number;
  currentPlayers: number;
  rating: number;
  description: string;
  image: string;
  organizer: {
    name: string;
    avatar: string;
  };
  scheduledTime?: string;
  tags: string[];
}

export default function GamesPage() {
  const { data: session } = useSession();

  // Sample games data
  const [games] = useState<Game[]>([
    {
      id: "1",
      name: "Badminton Court 1",
      type: "physical",
      availability: "available",
      location: "Sports Complex",
      maxPlayers: 4,
      currentPlayers: 2,
      rating: 4.8,
      description: "Professional badminton court with good lighting",
      image: "https://images.unsplash.com/photo-1544717684-4d7d3f0b0d1e?w=400",
      organizer: {
        name: "Rahul Sharma",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      },
      scheduledTime: "2025-07-26T18:00:00",
      tags: ["indoor", "racket-sport", "competitive"],
    },
    {
      id: "2",
      name: "FIFA 24 Tournament",
      type: "video",
      availability: "available",
      location: "Gaming Room",
      maxPlayers: 8,
      currentPlayers: 5,
      rating: 4.6,
      description: "Weekly FIFA tournament with prizes",
      image:
        "https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=400",
      organizer: {
        name: "Priya Patel",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
      },
      scheduledTime: "2025-07-26T20:00:00",
      tags: ["esports", "tournament", "football"],
    },
    {
      id: "3",
      name: "Table Tennis",
      type: "physical",
      availability: "occupied",
      location: "Recreation Center",
      maxPlayers: 4,
      currentPlayers: 4,
      rating: 4.7,
      description: "Fast-paced table tennis matches",
      image: "https://images.unsplash.com/photo-1544717684-4d7d3f0b0d1e?w=400",
      organizer: {
        name: "Arjun Singh",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      },
      tags: ["indoor", "racket-sport", "quick-game"],
    },
    {
      id: "4",
      name: "CS:GO Tournament",
      type: "video",
      availability: "available",
      location: "Computer Lab",
      maxPlayers: 10,
      currentPlayers: 3,
      rating: 4.9,
      description: "Counter-Strike tournament for all skill levels",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
      organizer: {
        name: "Vikash Kumar",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      },
      scheduledTime: "2025-07-27T16:00:00",
      tags: ["esports", "fps", "strategy"],
    },
    {
      id: "5",
      name: "Cricket Practice",
      type: "physical",
      availability: "available",
      location: "Main Ground",
      maxPlayers: 22,
      currentPlayers: 8,
      rating: 4.5,
      description: "Casual cricket practice session",
      image:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
      organizer: {
        name: "Suresh Yadav",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      },
      scheduledTime: "2025-07-26T17:00:00",
      tags: ["outdoor", "team-sport", "practice"],
    },
    {
      id: "6",
      name: "Among Us Night",
      type: "video",
      availability: "available",
      location: "Online",
      maxPlayers: 10,
      currentPlayers: 6,
      rating: 4.4,
      description: "Fun social deduction game night",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      organizer: {
        name: "Anita Reddy",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
      },
      scheduledTime: "2025-07-26T21:00:00",
      tags: ["online", "social", "casual"],
    },
  ]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "text-green-600 bg-green-100";
      case "occupied":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "video" ? "🎮" : "🏃‍♂️";
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <Gamepad2 className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Gaming Hub</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to access games and
            tournaments
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
              <Gamepad2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gaming Hub
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover and join physical games and esports tournaments
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(
                      game.availability
                    )}`}
                  >
                    {game.availability}
                  </span>
                </div>
                <div className="absolute top-4 right-4 text-2xl">
                  {getTypeIcon(game.type)}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {game.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {game.rating}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{game.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {game.location}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {game.currentPlayers}/{game.maxPlayers} players
                  </div>

                  {game.scheduledTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Today at {formatTime(game.scheduledTime)}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={game.organizer.avatar}
                      alt={game.organizer.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      {game.organizer.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  disabled={
                    game.availability === "occupied" ||
                    game.availability === "maintenance"
                  }
                >
                  {game.availability === "available"
                    ? "Join Game"
                    : "Unavailable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
