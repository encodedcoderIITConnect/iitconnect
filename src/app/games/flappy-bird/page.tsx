"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Star } from "lucide-react";

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

export default function FlappyBirdGame() {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu"
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bird, setBird] = useState<Bird>({ x: 50, y: 150, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);

  // Game constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 120;
  const PIPE_SPEED = 2;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flappybird-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update bird physics
    setBird((prev) => ({
      ...prev,
      y: prev.y + prev.velocity,
      velocity: prev.velocity + GRAVITY,
    }));

    // Update pipes
    setPipes((prev) => {
      let newPipes = prev.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }));

      // Remove pipes that are off-screen
      newPipes = newPipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0);

      // Add new pipe if needed
      if (
        newPipes.length === 0 ||
        newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 200
      ) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
        newPipes.push({
          x: CANVAS_WIDTH,
          topHeight,
          bottomY: topHeight + PIPE_GAP,
          passed: false,
        });
      }

      return newPipes;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

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

    // Check if bird hits ground or ceiling
    if (bird.y > CANVAS_HEIGHT - 20 || bird.y < 0) {
      endGame();
      return;
    }

    // Check pipe collisions
    pipes.forEach((pipe) => {
      if (
        bird.x + 15 > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (bird.y < pipe.topHeight || bird.y + 15 > pipe.bottomY)
      ) {
        endGame();
      }

      // Check if bird passed pipe (for scoring)
      if (!pipe.passed && bird.x > pipe.x + PIPE_WIDTH) {
        pipe.passed = true;
        setScore((prev) => prev + 1);
      }
    });
  }, [bird, pipes, gameState]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#87CEEB"; // Sky blue
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = "white";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(80, 100, 25, 0, Math.PI * 2);
    ctx.arc(100, 90, 35, 0, Math.PI * 2);
    ctx.arc(120, 100, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(250, 150, 30, 0, Math.PI * 2);
    ctx.arc(280, 140, 40, 0, Math.PI * 2);
    ctx.arc(310, 150, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw pipes
    ctx.fillStyle = "#228B22"; // Green
    pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(
        pipe.x,
        pipe.bottomY,
        PIPE_WIDTH,
        CANVAS_HEIGHT - pipe.bottomY
      );

      // Pipe caps
      ctx.fillStyle = "#32CD32"; // Lighter green
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
      ctx.fillStyle = "#228B22";
    });

    // Draw bird
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = "#FF6347"; // Orange-red
    ctx.beginPath();
    ctx.moveTo(bird.x + 15, bird.y);
    ctx.lineTo(bird.x + 25, bird.y - 2);
    ctx.lineTo(bird.x + 25, bird.y + 2);
    ctx.fill();
  }, [bird, pipes]);

  // Handle jump
  const jump = useCallback(() => {
    if (gameState === "menu") {
      startGame();
    } else if (gameState === "playing") {
      setBird((prev) => ({ ...prev, velocity: JUMP_FORCE }));
    } else if (gameState === "gameOver") {
      resetGame();
    }
  }, [gameState]);

  // Keyboard controls
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
    setBird({ x: 50, y: 150, velocity: 0 });
    setPipes([]);
  };

  const endGame = () => {
    setGameState("gameOver");
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("flappybird-highscore", score.toString());
    }
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setBird({ x: 50, y: 150, velocity: 0 });
    setPipes([]);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🐦</div>
          <h1 className="text-2xl font-bold mb-4">Flappy Bird</h1>
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
              <span className="text-4xl mr-2">🐦</span>
              Flappy Bird
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
                    <div className="text-6xl mb-4">🐦</div>
                    <h2 className="text-2xl font-bold mb-4">Flappy Bird</h2>
                    <p className="mb-6 text-white/80">
                      Tap to flap your wings and avoid the pipes!
                    </p>
                    <div className="space-y-2 text-sm opacity-80 mb-6">
                      <p>🖱️ Click or Tap to jump</p>
                      <p>⌨️ Spacebar or ↑ arrow</p>
                    </div>
                    <Button
                      onClick={startGame}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 text-lg"
                    >
                      Start Game
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
                      Score:{" "}
                      <span className="font-bold text-yellow-300">{score}</span>
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="text-yellow-300 mb-4 flex items-center justify-center">
                        <Star className="h-4 w-4 mr-1" />
                        New High Score!
                      </p>
                    )}
                    <div className="space-y-3">
                      <Button
                        onClick={resetGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Play Again
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
                  <span className="text-gray-700">Current Score:</span>
                  <span className="font-bold text-blue-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">High Score:</span>
                  <span className="font-bold text-yellow-600">{highScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Player:</span>
                  <span className="font-medium text-gray-900">
                    {session.user?.name?.split(" ")[0] || "Player"}
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
                <p>• Time your taps - don&apos;t spam click!</p>
                <p>• Stay calm and focused</p>
                <p>• Aim for the middle of gaps</p>
                <p>• Practice makes perfect! 🎯</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
