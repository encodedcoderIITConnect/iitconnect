"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Star } from "lucide-react";

interface Dino {
  x: number;
  y: number;
  velocity: number;
  isJumping: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cactus" | "pterodactyl";
}

export default function DinoRunGame() {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu"
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dino, setDino] = useState<Dino>({
    x: 50,
    y: 200,
    velocity: 0,
    isJumping: false,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(4);

  // Game constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const GROUND_Y = 200;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 300;
  const DINO_WIDTH = 30;
  const DINO_HEIGHT = 40;

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dinorun-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update dino physics
    setDino((prev) => {
      let newY = prev.y + prev.velocity;
      let newVelocity = prev.velocity + GRAVITY;
      let isJumping = prev.isJumping;

      // Ground collision
      if (newY >= GROUND_Y) {
        newY = GROUND_Y;
        newVelocity = 0;
        isJumping = false;
      }

      return {
        ...prev,
        y: newY,
        velocity: newVelocity,
        isJumping,
      };
    });

    // Update obstacles
    setObstacles((prev) => {
      let newObstacles = prev.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - gameSpeed,
      }));

      // Remove obstacles that are off-screen
      newObstacles = newObstacles.filter(
        (obstacle) => obstacle.x + obstacle.width > 0
      );

      // Add new obstacle if needed
      if (
        newObstacles.length === 0 ||
        newObstacles[newObstacles.length - 1].x <
          CANVAS_WIDTH - 300 - Math.random() * 200
      ) {
        const obstacleType = Math.random() > 0.7 ? "pterodactyl" : "cactus";
        newObstacles.push({
          x: CANVAS_WIDTH,
          y: obstacleType === "pterodactyl" ? GROUND_Y - 60 : GROUND_Y - 25,
          width: obstacleType === "pterodactyl" ? 35 : 25,
          height: obstacleType === "pterodactyl" ? 25 : 25,
          type: obstacleType,
        });
      }

      return newObstacles;
    });

    // Increase score and speed
    setScore((prev) => prev + 1);
    setGameSpeed((prev) => Math.min(prev + 0.002, 8));

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, gameSpeed]);

  // Start game loop when playing
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Collision detection
  useEffect(() => {
    if (gameState !== "playing") return;

    obstacles.forEach((obstacle) => {
      if (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + DINO_WIDTH > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + DINO_HEIGHT > obstacle.y
      ) {
        endGame();
      }
    });
  }, [dino, obstacles, gameState]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with gradient sky
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, GROUND_Y + DINO_HEIGHT, CANVAS_WIDTH, 20);

    // Ground texture
    ctx.fillStyle = "#228B22";
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.fillRect(i, GROUND_Y + DINO_HEIGHT, 2, 5);
    }

    // Draw dino
    ctx.fillStyle = "#32CD32"; // Green dino
    ctx.fillRect(dino.x, dino.y, DINO_WIDTH, DINO_HEIGHT);

    // Dino details
    ctx.fillStyle = "#228B22"; // Darker green
    // Head
    ctx.fillRect(dino.x + 15, dino.y, 15, 20);
    // Eye
    ctx.fillStyle = "black";
    ctx.fillRect(dino.x + 20, dino.y + 5, 3, 3);
    // Legs (animated based on position)
    ctx.fillStyle = "#32CD32";
    const legOffset = (Math.floor(score / 5) % 2) * 3;
    ctx.fillRect(dino.x + 5 + legOffset, dino.y + 35, 5, 8);
    ctx.fillRect(dino.x + 15 - legOffset, dino.y + 35, 5, 8);

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      if (obstacle.type === "cactus") {
        // Draw cactus
        ctx.fillStyle = "#228B22";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        // Cactus spikes
        ctx.fillStyle = "#32CD32";
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(obstacle.x + i * 8, obstacle.y - 3, 3, 6);
        }
      } else {
        // Draw pterodactyl
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        // Wings (animated)
        ctx.fillStyle = "#A0522D";
        const wingFlap = Math.floor(score / 3) % 2;
        ctx.fillRect(obstacle.x - 5, obstacle.y + 5 + wingFlap * 2, 10, 15);
        ctx.fillRect(
          obstacle.x + obstacle.width - 5,
          obstacle.y + 5 + wingFlap * 2,
          10,
          15
        );
      }
    });

    // Draw clouds
    ctx.fillStyle = "white";
    ctx.globalAlpha = 0.8;
    const cloudX = ((score * 0.5) % (CANVAS_WIDTH + 100)) - 100;
    ctx.beginPath();
    ctx.arc(cloudX, 50, 15, 0, Math.PI * 2);
    ctx.arc(cloudX + 20, 45, 20, 0, Math.PI * 2);
    ctx.arc(cloudX + 40, 50, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [dino, obstacles, score]);

  // Handle jump
  const jump = useCallback(() => {
    if (gameState === "menu") {
      startGame();
    } else if (gameState === "playing" && !dino.isJumping) {
      setDino((prev) => ({
        ...prev,
        velocity: JUMP_FORCE,
        isJumping: true,
      }));
    } else if (gameState === "gameOver") {
      resetGame();
    }
  }, [gameState, dino.isJumping]);

  // Keyboard and touch controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setGameSpeed(4);
    setDino({ x: 50, y: GROUND_Y, velocity: 0, isJumping: false });
    setObstacles([]);
  };

  const endGame = () => {
    setGameState("gameOver");
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("dinorun-highscore", score.toString());
    }
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setGameSpeed(4);
    setDino({ x: 50, y: GROUND_Y, velocity: 0, isJumping: false });
    setObstacles([]);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🦕</div>
          <h1 className="text-2xl font-bold mb-4">Dino Run</h1>
          <p className="mb-6">
            Sign in to save your high scores and compete with other students!
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign In to Play
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => (window.location.href = "/games")}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center">
              <span className="text-4xl mr-2">🦕</span>
              Dino Run
            </h1>
          </div>

          <div className="flex items-center space-x-4 text-white">
            <div className="text-center">
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs opacity-80">Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-yellow-300" />
                {highScore}
              </div>
              <div className="text-xs opacity-80">Best</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Game Canvas */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-4 border-white/30 rounded-2xl shadow-2xl cursor-pointer"
                onClick={jump}
              />

              {/* Game overlays */}
              {gameState === "menu" && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🦕</div>
                    <h2 className="text-2xl font-bold mb-4">Dino Run</h2>
                    <p className="mb-6 text-white/80">
                      Jump over cacti and pterodactyls!
                    </p>
                    <div className="space-y-2 text-sm opacity-80 mb-6">
                      <p>🖱️ Click or Tap to jump</p>
                      <p>⌨️ Spacebar or ↑ arrow</p>
                      <p>Speed increases over time!</p>
                    </div>
                    <Button
                      onClick={startGame}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 text-lg"
                    >
                      Start Running
                    </Button>
                  </div>
                </div>
              )}

              {gameState === "gameOver" && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-4xl mb-4">💥</div>
                    <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                    <p className="text-lg mb-2">
                      Distance:{" "}
                      <span className="font-bold text-green-300">{score}</span>
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="text-yellow-300 mb-4 flex items-center justify-center">
                        <Star className="h-4 w-4 mr-1" />
                        New Record!
                      </p>
                    )}
                    <div className="space-y-3">
                      <Button
                        onClick={resetGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Run Again
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/games")}
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 w-full"
                      >
                        Back to Games
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Info Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Controls */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🎮</span>
                How to Play
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="font-medium mr-2">🖱️ Mouse:</span>
                  <span>Click to jump</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">📱 Touch:</span>
                  <span>Tap screen to jump</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">⌨️ Keyboard:</span>
                  <span>Spacebar or ↑ arrow</span>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 text-xs font-medium">
                    💡 The game gets faster as you progress!
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">📊</span>
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Distance:</span>
                  <span className="font-bold text-blue-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Best Distance:</span>
                  <span className="font-bold text-green-600">{highScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Speed:</span>
                  <span className="font-bold text-purple-600">
                    {gameSpeed.toFixed(1)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Player:</span>
                  <span className="font-medium text-gray-900">
                    {session.user?.name?.split(" ")[0] || "Runner"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Pro Tips
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Jump early rather than late</p>
                <p>• Watch out for flying pterodactyls!</p>
                <p>• Stay focused as speed increases</p>
                <p>• Practice your timing! 🎯</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
