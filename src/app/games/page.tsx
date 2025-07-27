"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Gamepad2,
  Users,
  MapPin,
  Clock,
  Star,
  Plus,
  Search,
  Trophy,
  Heart,
  Share,
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "physical" | "video"
  >("all");

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

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || game.type === selectedType;
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center poppins-bold">
                <Gamepad2 className="h-8 w-8 mr-3 text-blue-600" />
                Gaming Hub
              </h1>
              <p className="text-gray-800 mt-1 poppins-regular">
                Discover and join physical games and esports tournaments
              </p>
            </div>

            <Button
              onClick={() => console.log("Create game modal")}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Game
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={selectedType === "physical" ? "default" : "outline"}
              onClick={() => setSelectedType("physical")}
              size="sm"
            >
              🏃‍♂️ Physical
            </Button>
            <Button
              variant={selectedType === "video" ? "default" : "outline"}
              onClick={() => setSelectedType("video")}
              size="sm"
            >
              🎮 Video Games
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Gamepad2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Games</p>
                <p className="text-2xl font-bold text-gray-900">
                  {games.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Players</p>
                <p className="text-2xl font-bold text-gray-900">
                  {games.reduce((sum, game) => sum + game.currentPlayers, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tournaments</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
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
                  <h3 className="text-lg font-semibold text-gray-900">
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

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={
                      game.availability === "occupied" ||
                      game.availability === "maintenance"
                    }
                  >
                    {game.availability === "available"
                      ? "Join Game"
                      : "Unavailable"}
                  </Button>

                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              No games found matching your criteria
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
