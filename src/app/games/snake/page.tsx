"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Star } from "lucide-react";

// Add custom CSS animations
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes bounce-in {
    0% { transform: scale(0.3) translateY(50px); opacity: 0; }
    50% { transform: scale(1.05) translateY(-10px); }
    70% { transform: scale(0.95) translateY(0px); }
    100% { transform: scale(1) translateY(0px); opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

interface Position {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
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

  // Animation state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationTime, setAnimationTime] = useState(0);
  const [foodPulse, setFoodPulse] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(false);

  // Game constants
  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 500;
  const INITIAL_SPEED = 150;

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Animation loop for smooth effects
  useEffect(() => {
    const animationLoop = () => {
      setAnimationTime((prev) => prev + 0.1);
      setFoodPulse((prev) => Math.sin(prev + 0.3) * 0.5 + 0.5);

      // Random eye blink
      if (Math.random() < 0.005) {
        setEyeBlink(true);
        setTimeout(() => setEyeBlink(false), 150);
      }

      // Update particles
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.1, // gravity
          }))
          .filter((particle) => particle.life > 0)
      );
    };

    const interval = setInterval(animationLoop, 50);
    return () => clearInterval(interval);
  }, []);

  // Create particle burst when eating food
  const createFoodParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        x: x * GRID_SIZE + GRID_SIZE / 2,
        y: y * GRID_SIZE + GRID_SIZE / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 60,
        maxLife: 60,
        color: `hsl(${Math.random() * 60 + 15}, 100%, ${
          Math.random() * 30 + 50
        }%)`,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
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
        createFoodParticles(food.x, food.y);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, nextDirection, food, generateFood, createFoodParticles]);

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

    // Clear canvas with animated background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    gradient.addColorStop(
      0,
      `hsl(120, 40%, ${20 + Math.sin(animationTime * 0.5) * 3}%)`
    );
    gradient.addColorStop(
      1,
      `hsl(140, 35%, ${15 + Math.cos(animationTime * 0.3) * 2}%)`
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw animated grid with subtle glow
    ctx.strokeStyle = `rgba(45, 143, 45, ${
      0.3 + Math.sin(animationTime * 0.2) * 0.1
    })`;
    ctx.lineWidth = 1;
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 2;

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

    ctx.shadowBlur = 0;

    // Draw snake with glow and gradient
    snake.forEach((segment, index) => {
      const intensity = 1 - (index / snake.length) * 0.6;

      if (index === 0) {
        // Snake head with glow
        ctx.shadowColor = "#90EE90";
        ctx.shadowBlur = 15;

        const headGradient = ctx.createRadialGradient(
          segment.x * GRID_SIZE + GRID_SIZE / 2,
          segment.y * GRID_SIZE + GRID_SIZE / 2,
          0,
          segment.x * GRID_SIZE + GRID_SIZE / 2,
          segment.y * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE / 2
        );
        headGradient.addColorStop(0, "#98fb98");
        headGradient.addColorStop(1, "#32cd32");

        ctx.fillStyle = headGradient;
        ctx.fillRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        );

        // Animated eyes
        if (!eyeBlink) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = "#000";
          ctx.fillStyle = "black";
          const eyeSize = 3;
          const eyeOffset = 4;

          if (direction === "RIGHT" || direction === "LEFT") {
            // Horizontal movement eyes
            ctx.fillRect(
              segment.x * GRID_SIZE +
                (direction === "RIGHT" ? GRID_SIZE - 8 : 5),
              segment.y * GRID_SIZE + eyeOffset,
              eyeSize,
              eyeSize
            );
            ctx.fillRect(
              segment.x * GRID_SIZE +
                (direction === "RIGHT" ? GRID_SIZE - 8 : 5),
              segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize,
              eyeSize,
              eyeSize
            );

            // Eye shine
            ctx.fillStyle = "white";
            ctx.fillRect(
              segment.x * GRID_SIZE +
                (direction === "RIGHT" ? GRID_SIZE - 7 : 6),
              segment.y * GRID_SIZE + eyeOffset + 1,
              1,
              1
            );
            ctx.fillRect(
              segment.x * GRID_SIZE +
                (direction === "RIGHT" ? GRID_SIZE - 7 : 6),
              segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize + 1,
              1,
              1
            );
          } else {
            // Vertical movement eyes
            ctx.fillRect(
              segment.x * GRID_SIZE + eyeOffset,
              segment.y * GRID_SIZE +
                (direction === "DOWN" ? GRID_SIZE - 8 : 5),
              eyeSize,
              eyeSize
            );
            ctx.fillRect(
              segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize,
              segment.y * GRID_SIZE +
                (direction === "DOWN" ? GRID_SIZE - 8 : 5),
              eyeSize,
              eyeSize
            );

            // Eye shine
            ctx.fillStyle = "white";
            ctx.fillRect(
              segment.x * GRID_SIZE + eyeOffset + 1,
              segment.y * GRID_SIZE +
                (direction === "DOWN" ? GRID_SIZE - 7 : 6),
              1,
              1
            );
            ctx.fillRect(
              segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize + 1,
              segment.y * GRID_SIZE +
                (direction === "DOWN" ? GRID_SIZE - 7 : 6),
              1,
              1
            );
          }
        }
      } else {
        // Snake body with gradient and glow
        ctx.shadowColor = `rgba(50, 205, 50, ${intensity * 0.7})`;
        ctx.shadowBlur = 8 * intensity;

        const bodyGradient = ctx.createRadialGradient(
          segment.x * GRID_SIZE + GRID_SIZE / 2,
          segment.y * GRID_SIZE + GRID_SIZE / 2,
          0,
          segment.x * GRID_SIZE + GRID_SIZE / 2,
          segment.y * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE / 2
        );
        bodyGradient.addColorStop(0, `rgba(50, 205, 50, ${intensity})`);
        bodyGradient.addColorStop(1, `rgba(34, 139, 34, ${intensity * 0.8})`);

        ctx.fillStyle = bodyGradient;
        ctx.fillRect(
          segment.x * GRID_SIZE + 2,
          segment.y * GRID_SIZE + 2,
          GRID_SIZE - 4,
          GRID_SIZE - 4
        );
      }
    });

    ctx.shadowBlur = 0;

    // Draw animated food with pulsing glow
    const foodSize = GRID_SIZE / 2 - 2 + foodPulse * 3;
    const foodGlow = 10 + foodPulse * 15;

    ctx.shadowColor = "#ff6347";
    ctx.shadowBlur = foodGlow;

    const foodGradient = ctx.createRadialGradient(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      0,
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      foodSize
    );
    foodGradient.addColorStop(0, "#ff7f7f");
    foodGradient.addColorStop(0.7, "#ff6347");
    foodGradient.addColorStop(1, "#ff4500");

    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      foodSize,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Food sparkle effect
    const sparkleAngle = animationTime * 2;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    for (let i = 0; i < 3; i++) {
      const angle = sparkleAngle + (i * Math.PI * 2) / 3;
      const sparkleX =
        food.x * GRID_SIZE + GRID_SIZE / 2 + Math.cos(angle) * (foodSize * 0.7);
      const sparkleY =
        food.y * GRID_SIZE + GRID_SIZE / 2 + Math.sin(angle) * (foodSize * 0.7);

      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw particles
    particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color
        .replace(")", `, ${alpha})`)
        .replace("hsl", "hsla");
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 5 * alpha;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2 * alpha, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }, [snake, food, direction, particles, animationTime, foodPulse, eyeBlink]);

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
    setGameState("playing");
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection("RIGHT");
    setNextDirection("RIGHT");
  };

  const goToMenu = () => {
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
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-fade-in">
                  <div className="text-center text-white p-8 transform animate-bounce-in">
                    <div className="text-6xl mb-4 animate-pulse">🐍</div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                      Snake Game
                    </h2>
                    <p className="mb-6 text-white/90 text-lg">
                      Eat the food and grow your snake!
                    </p>
                    <div className="space-y-2 text-sm text-white/80 mb-6 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <p className="flex items-center justify-center">
                        <span className="mr-2">⌨️</span> Arrow keys or WASD to
                        move
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="mr-2 animate-bounce">🍎</span> Eat red
                        food to grow
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="mr-2">❌</span> Don&apos;t hit walls or
                        yourself!
                      </p>
                    </div>
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="flex items-center">
                        <span className="mr-2">🎮</span>
                        Start Game
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              {gameState === "gameOver" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-fade-in">
                  <div className="text-center text-white p-8 transform animate-bounce-in">
                    <div className="text-6xl mb-4 animate-pulse">💥</div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                      Game Over!
                    </h2>
                    <div className="bg-white/10 rounded-xl p-6 mb-6 backdrop-blur-sm">
                      <p className="text-2xl mb-3">
                        Score:{" "}
                        <span className="font-bold text-green-300 text-3xl animate-pulse">
                          {score}
                        </span>
                      </p>
                      <p className="text-lg mb-3">
                        Length:{" "}
                        <span className="font-bold text-yellow-300 text-xl">
                          {snake.length}
                        </span>
                      </p>
                      {score === highScore && score > 0 && (
                        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-3 mb-3">
                          <p className="text-yellow-300 flex items-center justify-center animate-bounce">
                            <Star className="h-5 w-5 mr-2 animate-spin" />
                            New High Score!
                            <Star className="h-5 w-5 ml-2 animate-spin" />
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 w-full rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Play Again
                      </Button>
                      <Button
                        onClick={goToMenu}
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 w-full rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      >
                        Back to Menu
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/games")}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
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
