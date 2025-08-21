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

          {/* Browser Games Grid - 3 cards per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Flappy Bird */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🐦</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Flappy Bird
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Tap to fly through the pipes!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg"
                onClick={() => (window.location.href = "/games/flappy-bird")}
              >
                🎮 Play Game
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Leaderboard */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  🏆 Leaderboard
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-2">🥇</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-gray-400 mr-2">🥈</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-orange-400 mr-2">🥉</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chrome Dino */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🦕</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                Dino Run
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Jump over cacti and survive!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg"
                onClick={() => (window.location.href = "/games/dino-run")}
              >
                🎮 Play Game
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Leaderboard */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  🏆 Leaderboard
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-2">🥇</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-gray-400 mr-2">🥈</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-orange-400 mr-2">🥉</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Snake */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🐍</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                Snake
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Eat fruits and grow longer!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg"
                onClick={() => (window.location.href = "/games/snake")}
              >
                🎮 Play Game
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Leaderboard */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  🏆 Leaderboard
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-2">🥇</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-gray-400 mr-2">🥈</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-orange-400 mr-2">🥉</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2048 */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🔢</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                2048
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Merge tiles to reach 2048!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg"
                onClick={() => (window.location.href = "/games/2048")}
              >
                🎮 Play Game
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Leaderboard */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  🏆 Leaderboard
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-2">🥇</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-gray-400 mr-2">🥈</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-orange-400 mr-2">🥉</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tetris */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🧩</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                Tetris
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Classic block puzzle game!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg"
                onClick={() => (window.location.href = "/games/tetris")}
              >
                🎮 Play Game
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Leaderboard */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  🏆 Leaderboard
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-2">🥇</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-gray-400 mr-2">🥈</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-orange-400 mr-2">🥉</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pong */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🏓</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Pong
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Classic arcade table tennis!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg"
                onClick={() => (window.location.href = "/games/pong")}
              >
                🎮 Play Game
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Leaderboard */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  🏆 Leaderboard
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-2">🥇</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-gray-400 mr-2">🥈</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 rounded-lg p-2">
                    <span className="flex items-center">
                      <span className="text-orange-400 mr-2">🥉</span>Coming
                      Soon...
                    </span>
                    <span className="text-gray-500">--- pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
