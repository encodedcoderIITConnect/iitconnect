"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";

export default function GamesPage() {
  const { data: session } = useSession();
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

        {/* Browser Games Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎮 Browser Games
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Quick games you can play right here! Challenge your friends and
              climb the leaderboards
            </p>
          </div>

          {/* Browser Games Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {/* Flappy Bird */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-3">🐦</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Flappy Bird
              </h3>
              <p className="text-xs text-gray-600 mb-3">Tap to fly!</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                onClick={() => (window.location.href = "/games/flappy-bird")}
              >
                Play Now
              </Button>
            </div>

            {/* Chrome Dino */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-3">🦕</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Dino Run
              </h3>
              <p className="text-xs text-gray-600 mb-3">Jump over cacti!</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0"
                onClick={() => (window.location.href = "/games/dino-run")}
              >
                Play Now
              </Button>
            </div>

            {/* Snake */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-3">🐍</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Snake
              </h3>
              <p className="text-xs text-gray-600 mb-3">Eat and grow!</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white border-0"
                onClick={() => (window.location.href = "/games/snake")}
              >
                Play Now
              </Button>
            </div>

            {/* 2048 */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-3">🔢</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                2048
              </h3>
              <p className="text-xs text-gray-600 mb-3">Merge tiles!</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                onClick={() => (window.location.href = "/games/2048")}
              >
                Coming Soon
              </Button>
            </div>

            {/* Tetris */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-3">🧩</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Tetris
              </h3>
              <p className="text-xs text-gray-600 mb-3">Classic puzzle!</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0"
                onClick={() => (window.location.href = "/games/tetris")}
              >
                Coming Soon
              </Button>
            </div>
          </div>

          {/* Quick Leaderboard Preview */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Campus Leaderboard
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                <div className="text-2xl mb-2">🥇</div>
                <p className="font-semibold text-gray-900">Arjun S.</p>
                <p className="text-sm text-gray-600">Flappy Bird Champion</p>
                <p className="text-lg font-bold text-yellow-600">2,847 pts</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <div className="text-2xl mb-2">🥈</div>
                <p className="font-semibold text-gray-900">Priya P.</p>
                <p className="text-sm text-gray-600">Snake Master</p>
                <p className="text-lg font-bold text-gray-600">1,943 pts</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                <div className="text-2xl mb-2">🥉</div>
                <p className="font-semibold text-gray-900">Rahul K.</p>
                <p className="text-sm text-gray-600">Dino Runner</p>
                <p className="text-lg font-bold text-orange-600">1,654 pts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 More Games Coming Soon!
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We&apos;re working hard to bring you more exciting games. Stay
              tuned for Tetris, 2048, and many more classic games!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                🧩 Tetris - Coming Soon
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                🔢 2048 - Coming Soon
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                🏓 Pong - Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
