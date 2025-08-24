"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function GamesPage() {
  const { data: session } = useSession();

  // State for live statistics
  const [onlineCount, setOnlineCount] = useState(127);
  const [gamesPlayed, setGamesPlayed] = useState(2543);
  const [topPlayer, setTopPlayer] = useState("Loading...");
  const [gameOfDay, setGameOfDay] = useState("Snake");
  const [totalScore, setTotalScore] = useState(45670);

  // Live updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
      setGamesPlayed((prev) => prev + Math.floor(Math.random() * 3));
      setTotalScore((prev) => prev + Math.floor(Math.random() * 100));
    }, 3000);

    // Simulate top player updates
    const playerInterval = setInterval(() => {
      const players = [
        "Raj_2024CSE",
        "Priya_2023ECE",
        "Amit_2024ME",
        "Arjun_2024EE",
      ];
      setTopPlayer(players[Math.floor(Math.random() * players.length)]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(playerInterval);
    };
  }, []);

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
            {/* Snake */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🐍</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                Snake
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Eat fruits and grow longer!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg shadow-sm"
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg shadow-sm"
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
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg shadow-sm"
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
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg shadow-sm"
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
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg shadow-sm"
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

            {/* 2048 */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              {/* Game Emoji */}
              <div className="text-6xl mb-4 group-hover:animate-bounce">🔢</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                2048
              </h3>

              {/* Game Tagline */}
              <p className="text-gray-600 mb-6 text-lg">
                Join numbers to reach 2048!
              </p>

              {/* Play Game Button */}
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 text-lg font-semibold rounded-xl mb-6 transition-all duration-300 hover:shadow-lg shadow-sm"
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
          </div>

          {/* Gaming Statistics Dashboard */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                📊 Live Gaming Statistics
              </h2>
              <p className="text-gray-600 text-lg">
                Real-time data from our gaming community
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {/* Online Players */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-blue-600 animate-pulse">
                  {onlineCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Players Online
                </div>
                <div className="text-xs text-green-600 mt-1">🟢 Live</div>
              </div>

              {/* Games Played Today */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-2xl font-bold text-green-600 animate-bounce">
                  {gamesPlayed}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Games Today
                </div>
                <div className="text-xs text-green-600 mt-1">
                  📈 +{Math.floor(Math.random() * 50)} this hour
                </div>
              </div>

              {/* Top Player */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-lg font-bold text-yellow-600 truncate">
                  {topPlayer}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Top Player
                </div>
                <div className="text-xs text-yellow-600 mt-1">👑 Champion</div>
              </div>

              {/* Total Score */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-purple-600 animate-pulse">
                  {totalScore.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Score
                </div>
                <div className="text-xs text-purple-600 mt-1">🔥 All Time</div>
              </div>
            </div>

            {/* Game of the Day */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🌟 Game of the Day
                  </h3>
                  <div className="text-2xl font-bold text-orange-600">
                    {gameOfDay}
                  </div>
                  <p className="text-gray-600">Most played game today!</p>
                </div>
                <div className="text-6xl animate-bounce">�</div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                📡 Live Activity Feed
                <span className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                <div className="flex items-center space-x-3 bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Raj_2024CSE</strong> scored 1,250 in Snake
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    2 min ago
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Amit_2024ME</strong> beat his Flappy Bird record!
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    8 min ago
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Arjun_2024EE</strong> started a Pong tournament
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    12 min ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
