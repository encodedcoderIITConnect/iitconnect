"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Star } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu"
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");

  // Game constants
  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const INITIAL_SPEED = 150;

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Generate random food position
  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
      };
    } while (
      snakeBody.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    setDirection(nextDirection);

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      // Move head in current direction
      switch (nextDirection) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= CANVAS_WIDTH / GRID_SIZE ||
        head.y < 0 ||
        head.y >= CANVAS_HEIGHT / GRID_SIZE
      ) {
        setGameState("gameOver");
        return prevSnake;
      }

      // Check self collision
      if (
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameState("gameOver");
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, nextDirection, food, generateFood]);

  // Start game interval
  useEffect(() => {
    if (gameState === "playing") {
      const speed = Math.max(INITIAL_SPEED - Math.floor(score / 50) * 10, 80);
      gameIntervalRef.current = setInterval(gameLoop, speed);
    } else {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    }

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [gameState, gameLoop, score]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a5d1a"; // Dark green background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = "#2d8f2d";
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Snake head
        ctx.fillStyle = "#90EE90"; // Light green
        ctx.fillRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        );

        // Eyes
        ctx.fillStyle = "black";
        const eyeSize = 2;
        const eyeOffset = 4;
        if (direction === "RIGHT" || direction === "LEFT") {
          ctx.fillRect(
            segment.x * GRID_SIZE + (direction === "RIGHT" ? GRID_SIZE - 6 : 4),
            segment.y * GRID_SIZE + eyeOffset,
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * GRID_SIZE + (direction === "RIGHT" ? GRID_SIZE - 6 : 4),
            segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
        } else {
          ctx.fillRect(
            segment.x * GRID_SIZE + eyeOffset,
            segment.y * GRID_SIZE + (direction === "DOWN" ? GRID_SIZE - 6 : 4),
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize,
            segment.y * GRID_SIZE + (direction === "DOWN" ? GRID_SIZE - 6 : 4),
            eyeSize,
            eyeSize
          );
        }
      } else {
        // Snake body
        ctx.fillStyle = "#32CD32"; // Green
        ctx.fillRect(
          segment.x * GRID_SIZE + 2,
          segment.y * GRID_SIZE + 2,
          GRID_SIZE - 4,
          GRID_SIZE - 4
        );
      }
    });

    // Draw food
    ctx.fillStyle = "#FF6347"; // Red tomato
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Food highlight
    ctx.fillStyle = "#FF4500";
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2 - 2,
      food.y * GRID_SIZE + GRID_SIZE / 2 - 2,
      3,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food, direction]);

  // Handle direction change
  const changeDirection = useCallback(
    (newDirection: Direction) => {
      // Prevent reverse direction
      if (
        (direction === "UP" && newDirection === "DOWN") ||
        (direction === "DOWN" && newDirection === "UP") ||
        (direction === "LEFT" && newDirection === "RIGHT") ||
        (direction === "RIGHT" && newDirection === "LEFT")
      ) {
        return;
      }
      setNextDirection(newDirection);
    },
    [direction]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === "playing") {
        switch (e.code) {
          case "ArrowUp":
          case "KeyW":
            e.preventDefault();
            changeDirection("UP");
            break;
          case "ArrowDown":
          case "KeyS":
            e.preventDefault();
            changeDirection("DOWN");
            break;
          case "ArrowLeft":
          case "KeyA":
            e.preventDefault();
            changeDirection("LEFT");
            break;
          case "ArrowRight":
          case "KeyD":
            e.preventDefault();
            changeDirection("RIGHT");
            break;
        }
      } else if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "menu") {
          startGame();
        } else if (gameState === "gameOver") {
          resetGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, changeDirection]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    setNextDirection("RIGHT");
  };

  const endGame = () => {
    setGameState("gameOver");
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snake-highscore", score.toString());
    }
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection("RIGHT");
    setNextDirection("RIGHT");
  };

  // Game over effect
  useEffect(() => {
    if (gameState === "gameOver") {
      endGame();
    }
  }, [gameState, score, highScore]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🐍</div>
          <h1 className="text-2xl font-bold mb-4">Snake Game</h1>
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
              <span className="text-4xl mr-2">🐍</span>
              Snake Game
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
                className="border-4 border-white/30 rounded-2xl shadow-2xl"
              />

              {/* Game overlays */}
              {gameState === "menu" && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🐍</div>
                    <h2 className="text-2xl font-bold mb-4">Snake Game</h2>
                    <p className="mb-6 text-white/80">
                      Eat the food and grow your snake!
                    </p>
                    <div className="space-y-2 text-sm opacity-80 mb-6">
                      <p>⌨️ Arrow keys or WASD to move</p>
                      <p>🍎 Eat red food to grow</p>
                      <p>❌ Don&apos;t hit walls or yourself!</p>
                    </div>
                    <Button
                      onClick={startGame}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 text-lg"
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
                      <span className="font-bold text-green-300">{score}</span>
                    </p>
                    <p className="text-sm mb-4">
                      Length:{" "}
                      <span className="font-bold text-yellow-300">
                        {snake.length}
                      </span>
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
                Controls
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div></div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => changeDirection("UP")}
                    disabled={gameState !== "playing"}
                  >
                    ↑
                  </Button>
                  <div></div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => changeDirection("LEFT")}
                    disabled={gameState !== "playing"}
                  >
                    ←
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => changeDirection("DOWN")}
                    disabled={gameState !== "playing"}
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => changeDirection("RIGHT")}
                    disabled={gameState !== "playing"}
                  >
                    →
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">⌨️ Keyboard:</span>
                    <span>Arrow keys or WASD</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">📱 Touch:</span>
                    <span>Use buttons above</span>
                  </div>
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
                  <span className="text-gray-700">Score:</span>
                  <span className="font-bold text-blue-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Length:</span>
                  <span className="font-bold text-green-600">
                    {snake.length}
                  </span>
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
                <p>• Plan your path carefully</p>
                <p>• Stay away from walls and your tail</p>
                <p>• Game speeds up as you grow!</p>
                <p>• Use the center area for safety</p>
                <p>• Practice makes perfect! 🎯</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
