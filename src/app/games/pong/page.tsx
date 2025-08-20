"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";

interface GameState {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  ballVelX: number;
  ballVelY: number;
  playerScore: number;
  aiScore: number;
  gameRunning: boolean;
  gamePaused: boolean;
  gameOver: boolean;
  winner: string;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;
const WINNING_SCORE = 7;

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const [gameState, setGameState] = useState<GameState>({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVelX: BALL_SPEED,
    ballVelY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    playerScore: 0,
    aiScore: 0,
    gameRunning: false,
    gamePaused: false,
    gameOver: false,
    winner: "",
  });

  const [bestScore, setBestScore] = useState<number>(0);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pong-best-score");
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  // Save best score to localStorage
  const updateBestScore = useCallback(
    (score: number) => {
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem("pong-best-score", score.toString());
      }
    },
    [bestScore]
  );

  // Reset ball to center
  const resetBall = useCallback(() => {
    return {
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVelX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      ballVelY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    };
  }, []);

  // Start new game
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      ...resetBall(),
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      playerScore: 0,
      aiScore: 0,
      gameRunning: true,
      gamePaused: false,
      gameOver: false,
      winner: "",
    }));
  }, [resetBall]);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    if (!gameState.gameRunning || gameState.gameOver) return;

    setGameState((prev) => ({
      ...prev,
      gamePaused: !prev.gamePaused,
    }));
  }, [gameState.gameRunning, gameState.gameOver]);

  // Reset game
  const resetGame = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setGameState({
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVelX: BALL_SPEED,
      ballVelY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      playerScore: 0,
      aiScore: 0,
      gameRunning: false,
      gamePaused: false,
      gameOver: false,
      winner: "",
    });
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

      if (e.key === " " || e.key === "Escape") {
        e.preventDefault();
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [togglePause]);

  // Game update logic
  const updateGame = useCallback(() => {
    setGameState((prev) => {
      if (!prev.gameRunning || prev.gamePaused || prev.gameOver) {
        return prev;
      }

      const newState = { ...prev };

      // Move player paddle
      if (keysRef.current["arrowup"] || keysRef.current["w"]) {
        newState.playerY = Math.max(0, newState.playerY - PADDLE_SPEED);
      }
      if (keysRef.current["arrowdown"] || keysRef.current["s"]) {
        newState.playerY = Math.min(
          CANVAS_HEIGHT - PADDLE_HEIGHT,
          newState.playerY + PADDLE_SPEED
        );
      }

      // AI paddle movement (simple AI that follows the ball)
      const aiPaddleCenter = newState.aiY + PADDLE_HEIGHT / 2;
      const ballCenter = newState.ballY;
      const aiSpeed = PADDLE_SPEED * 0.8; // Make AI slightly slower

      if (ballCenter < aiPaddleCenter - 10) {
        newState.aiY = Math.max(0, newState.aiY - aiSpeed);
      } else if (ballCenter > aiPaddleCenter + 10) {
        newState.aiY = Math.min(
          CANVAS_HEIGHT - PADDLE_HEIGHT,
          newState.aiY + aiSpeed
        );
      }

      // Move ball
      newState.ballX += newState.ballVelX;
      newState.ballY += newState.ballVelY;

      // Ball collision with top and bottom walls
      if (newState.ballY <= 0 || newState.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
        newState.ballVelY = -newState.ballVelY;
        newState.ballY = Math.max(
          0,
          Math.min(CANVAS_HEIGHT - BALL_SIZE, newState.ballY)
        );
      }

      // Ball collision with player paddle
      if (
        newState.ballX <= PADDLE_WIDTH &&
        newState.ballY + BALL_SIZE >= newState.playerY &&
        newState.ballY <= newState.playerY + PADDLE_HEIGHT &&
        newState.ballVelX < 0
      ) {
        newState.ballVelX = -newState.ballVelX;
        // Add some angle based on where the ball hits the paddle
        const hitPos =
          (newState.ballY + BALL_SIZE / 2 - newState.playerY) / PADDLE_HEIGHT;
        newState.ballVelY = BALL_SPEED * (hitPos - 0.5) * 2;
        newState.ballX = PADDLE_WIDTH;
      }

      // Ball collision with AI paddle
      if (
        newState.ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH &&
        newState.ballY + BALL_SIZE >= newState.aiY &&
        newState.ballY <= newState.aiY + PADDLE_HEIGHT &&
        newState.ballVelX > 0
      ) {
        newState.ballVelX = -newState.ballVelX;
        // Add some angle based on where the ball hits the paddle
        const hitPos =
          (newState.ballY + BALL_SIZE / 2 - newState.aiY) / PADDLE_HEIGHT;
        newState.ballVelY = BALL_SPEED * (hitPos - 0.5) * 2;
        newState.ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
      }

      // Ball goes off screen (scoring)
      if (newState.ballX < 0) {
        // AI scores
        newState.aiScore += 1;
        const ballReset = {
          ballX: CANVAS_WIDTH / 2,
          ballY: CANVAS_HEIGHT / 2,
          ballVelX: BALL_SPEED,
          ballVelY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        };
        Object.assign(newState, ballReset);
      } else if (newState.ballX > CANVAS_WIDTH) {
        // Player scores
        newState.playerScore += 1;
        const ballReset = {
          ballX: CANVAS_WIDTH / 2,
          ballY: CANVAS_HEIGHT / 2,
          ballVelX: -BALL_SPEED,
          ballVelY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        };
        Object.assign(newState, ballReset);
      }

      // Check for game over
      if (
        newState.playerScore >= WINNING_SCORE ||
        newState.aiScore >= WINNING_SCORE
      ) {
        newState.gameOver = true;
        newState.gameRunning = false;
        newState.winner =
          newState.playerScore >= WINNING_SCORE ? "Player" : "AI";

        // Update best score if player won
        if (newState.playerScore >= WINNING_SCORE) {
          updateBestScore(newState.playerScore);
        }
      }

      return newState;
    });
  }, [updateBestScore]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(
      CANVAS_WIDTH - PADDLE_WIDTH,
      gameState.aiY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // Draw ball
    ctx.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = "48px monospace";
    ctx.textAlign = "center";
    ctx.fillText(gameState.playerScore.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(gameState.aiScore.toString(), (CANVAS_WIDTH * 3) / 4, 60);

    // Draw pause overlay
    if (gameState.gamePaused && !gameState.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "36px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "18px monospace";
      ctx.fillText(
        "Press SPACE to resume",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 40
      );
    }

    // Draw game over overlay
    if (gameState.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "48px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      ctx.font = "32px monospace";
      ctx.fillText(
        `${gameState.winner} Wins!`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 10
      );
      ctx.font = "18px monospace";
      ctx.fillText(
        "Click 'New Game' to play again",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 60
      );
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      render();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState.gameRunning || gameState.gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameRunning, gameState.gameOver, updateGame, render]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">🏓 Pong</h1>
            <p className="text-white/70">Classic arcade tennis game</p>
          </div>
          <div className="text-right">
            <div className="text-white/70 text-sm">Best Score</div>
            <div className="text-2xl font-bold text-white">{bestScore}</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={gameState.gameRunning && !gameState.gameOver}
              >
                <Play className="h-4 w-4 mr-2" />
                New Game
              </Button>

              <Button
                onClick={togglePause}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!gameState.gameRunning || gameState.gameOver}
              >
                {gameState.gamePaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>

              <Button
                onClick={resetGame}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-white/70 text-sm">
              First to {WINNING_SCORE} wins! • Use ↑↓ or W/S to move
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-white/20 rounded-lg bg-black max-w-full h-auto"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {gameState.playerScore}
            </div>
            <div className="text-white/70 text-sm">Your Score</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {gameState.aiScore}
            </div>
            <div className="text-white/70 text-sm">AI Score</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{bestScore}</div>
            <div className="text-white/70 text-sm">Best Score</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {gameState.gameOver
                ? "Game Over"
                : gameState.gameRunning
                ? "Playing"
                : "Ready"}
            </div>
            <div className="text-white/70 text-sm">Status</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            🎮 How to Play
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-white/80 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">Controls:</h4>
              <ul className="space-y-1">
                <li>• Use ↑/↓ arrow keys or W/S to move your paddle</li>
                <li>• Press SPACE to pause/resume</li>
                <li>• ESC also pauses the game</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Objective:</h4>
              <ul className="space-y-1">
                <li>• First player to reach {WINNING_SCORE} points wins</li>
                <li>• Hit the ball past your opponent to score</li>
                <li>• The ball angle changes based on paddle hit position</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
