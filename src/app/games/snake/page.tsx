"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  Star,
  Play,
  Pause,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  nextDirection: Position;
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
  gridSize: number;
}

interface TouchPosition {
  x: number;
  y: number;
}

export default function SnakePage() {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  // Touch handling
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);
  const minSwipeDistance = 50;

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    isPlaying: false,
    isGameOver: false,
    isPaused: false,
    speed: 300, // milliseconds between moves
    gridSize: 25,
  });

  // High score persistence
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("snake-best-score");
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
      localStorage.setItem("snake-best-score", gameState.score.toString());
    }
  }, [gameState.score, bestScore]);

  // Generate random food position
  const generateFood = useCallback(
    (snake: Position[], gridSize: number): Position => {
      let newFood: Position;
      do {
        newFood = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
      } while (
        snake.some(
          (segment) => segment.x === newFood.x && segment.y === newFood.y
        )
      );
      return newFood;
    },
    []
  );

  // Check collision
  const checkCollision = useCallback(
    (head: Position, snake: Position[], gridSize: number): boolean => {
      // Wall collision
      if (
        head.x < 0 ||
        head.x >= gridSize ||
        head.y < 0 ||
        head.y >= gridSize
      ) {
        return true;
      }
      // Self collision
      return snake.some(
        (segment) => segment.x === head.x && segment.y === head.y
      );
    },
    []
  );

  // Game loop
  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
        return;
      }

      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= gameState.speed) {
        setGameState((prevState) => {
          const newSnake = [...prevState.snake];
          const head = { ...newSnake[0] };

          // Move head
          head.x += prevState.nextDirection.x;
          head.y += prevState.nextDirection.y;

          // Check collision
          if (checkCollision(head, newSnake, prevState.gridSize)) {
            return {
              ...prevState,
              isGameOver: true,
              isPlaying: false,
            };
          }

          newSnake.unshift(head);

          let newFood = prevState.food;
          let newScore = prevState.score;
          let newSpeed = prevState.speed;

          // Check food collision
          if (head.x === prevState.food.x && head.y === prevState.food.y) {
            newScore += 10;
            newFood = generateFood(newSnake, prevState.gridSize);
            // Increase speed slightly (more gradual acceleration)
            newSpeed = Math.max(120, prevState.speed - 1);
          } else {
            newSnake.pop(); // Remove tail if no food eaten
          }

          return {
            ...prevState,
            snake: newSnake,
            food: newFood,
            score: newScore,
            speed: newSpeed,
            direction: prevState.nextDirection,
          };
        });

        lastTimeRef.current = currentTime;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [
      gameState.isPlaying,
      gameState.isPaused,
      gameState.isGameOver,
      gameState.speed,
      checkCollision,
      generateFood,
    ]
  );

  // Start game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameLoop]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = canvas.width / gameState.gridSize;

    // Clear canvas
    ctx.fillStyle = "#1e293b"; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gameState.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;

      if (index === 0) {
        // Head - brighter green with glow
        const gradient = ctx.createRadialGradient(
          x + cellSize / 2,
          y + cellSize / 2,
          0,
          x + cellSize / 2,
          y + cellSize / 2,
          cellSize / 2
        );
        gradient.addColorStop(0, "#22c55e");
        gradient.addColorStop(1, "#16a34a");
        ctx.fillStyle = gradient;
      } else {
        // Body - darker green
        ctx.fillStyle = `hsl(142, ${70 - index * 2}%, ${50 - index}%)`;
      }

      ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

      // Add rounded corners effect
      ctx.strokeStyle = "#065f46";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
    });

    // Draw food with glow effect
    const foodX = gameState.food.x * cellSize;
    const foodY = gameState.food.y * cellSize;

    const foodGradient = ctx.createRadialGradient(
      foodX + cellSize / 2,
      foodY + cellSize / 2,
      0,
      foodX + cellSize / 2,
      foodY + cellSize / 2,
      cellSize / 2
    );
    foodGradient.addColorStop(0, "#ef4444");
    foodGradient.addColorStop(1, "#dc2626");

    ctx.fillStyle = foodGradient;
    ctx.fillRect(foodX + 3, foodY + 3, cellSize - 6, cellSize - 6);

    // Food sparkle effect
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(foodX + cellSize / 2 - 2, foodY + cellSize / 2 - 2, 4, 4);
  }, [gameState]);

  // Start new game
  const startNewGame = useCallback(() => {
    const initialFood = generateFood([{ x: 10, y: 10 }], 25);
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: initialFood,
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      isPlaying: true,
      isGameOver: false,
      isPaused: false,
      speed: 220,
      gridSize: 25,
    });
    lastTimeRef.current = 0;
  }, [generateFood]);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // Change direction
  const changeDirection = useCallback((newDirection: Position) => {
    setGameState((prev) => {
      // Prevent reverse direction
      if (
        prev.direction.x === -newDirection.x &&
        prev.direction.y === -newDirection.y
      ) {
        return prev;
      }
      return {
        ...prev,
        nextDirection: newDirection,
      };
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying && !gameState.isGameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          changeDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          changeDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          changeDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          changeDirection({ x: 1, y: 0 });
          break;
        case " ":
          e.preventDefault();
          if (gameState.isPlaying) {
            togglePause();
          }
          break;
        case "Enter":
          e.preventDefault();
          if (gameState.isGameOver) {
            startNewGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState.isPlaying,
    gameState.isGameOver,
    changeDirection,
    togglePause,
    startNewGame,
  ]);

  // Touch controls
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe) {
      changeDirection({ x: -1, y: 0 });
    } else if (isRightSwipe) {
      changeDirection({ x: 1, y: 0 });
    } else if (isUpSwipe) {
      changeDirection({ x: 0, y: -1 });
    } else if (isDownSwipe) {
      changeDirection({ x: 0, y: 1 });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🐍</div>
          <h1 className="text-2xl font-bold mb-4">Snake Game</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to play Snake and save your
            high scores
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
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => (window.location.href = "/games")}
            className="bg-white/20 backdrop-blur-xl border border-white/40 text-white hover:bg-white/30"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Games
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center">
              <span className="text-4xl mr-3">🐍</span>
              Snake Game
            </h1>
          </div>

          <div className="w-32"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex-1 flex justify-center max-w-lg mx-auto lg:mx-0 px-4">
            <div className="relative w-full max-w-[500px]">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="bg-slate-800 rounded-lg shadow-2xl border-4 border-white/20 touch-none select-none w-full h-auto"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                  touchAction: "none",
                  userSelect: "none",
                  maxWidth: "min(90vw, 500px)",
                  maxHeight: "min(90vw, 500px)",
                  aspectRatio: "1 / 1",
                }}
              />

              {/* Game overlays */}
              {!gameState.isPlaying && !gameState.isGameOver && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🐍</div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Ready to Play?
                    </h2>
                    <Button
                      onClick={startNewGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Start Game
                    </Button>
                  </div>
                </div>
              )}

              {gameState.isPaused && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Game Paused
                    </h2>
                    <Button
                      onClick={togglePause}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Resume
                    </Button>
                  </div>
                </div>
              )}

              {gameState.isGameOver && (
                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💀</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Game Over!
                    </h2>
                    <p className="text-white/80 mb-4">
                      Score: {gameState.score}
                    </p>
                    {gameState.score === bestScore && gameState.score > 0 && (
                      <p className="text-yellow-400 font-bold mb-4">
                        🎉 New High Score!
                      </p>
                    )}
                    <Button
                      onClick={startNewGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                    >
                      <RotateCcw className="h-6 w-6 mr-2" />
                      Play Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Info Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 space-y-6">
            {/* Score Cards */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Current Score
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {gameState.score.toLocaleString()}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Best Score
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bestScore.toLocaleString()}
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Snake Length
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {gameState.snake.length}
                    </p>
                  </div>
                  <div className="text-2xl">🐍</div>
                </div>
              </div>
            </div>

            {/* Game Controls */}
            {gameState.isPlaying && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Game Controls</h3>
                <Button
                  onClick={togglePause}
                  className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {gameState.isPaused ? (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  onClick={startNewGame}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Restart Game
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center">
                <span className="text-xl mr-2">💡</span>
                How to Play
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center bg-gray-50 rounded-lg p-2">
                  <span className="mr-2">🖱️</span>
                  <span>Use arrow keys or WASD to control</span>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-2">
                  <span className="mr-2">📱</span>
                  <span>Swipe to change direction on mobile</span>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-2">
                  <span className="mr-2">🍎</span>
                  <span>Eat red food to grow and score</span>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-2">
                  <span className="mr-2">⚠️</span>
                  <span>Don&apos;t hit walls or yourself</span>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-2">
                  <span className="mr-2">⏸️</span>
                  <span>Press SPACE to pause</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Game Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 lg:hidden">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-4 text-center">
              <div className="text-lg font-bold text-gray-900">
                {gameState.score.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-4 text-center">
              <div className="text-lg font-bold text-gray-900">
                {bestScore.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Best</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-4 text-center">
              <div className="text-lg font-bold text-gray-900">
                {gameState.snake.length}
              </div>
              <div className="text-xs text-gray-600">Length</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
