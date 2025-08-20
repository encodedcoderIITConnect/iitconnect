"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home, Trophy, Gamepad2, Pause, Play } from "lucide-react";

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-400",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "bg-purple-400",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-green-400",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-red-400",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "bg-blue-400",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "bg-orange-400",
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export default function TetrisGame() {
  const { data: session } = useSession();
  const [gameState, setGameState] = useState<
    "menu" | "playing" | "paused" | "gameOver"
  >("menu");
  const [board, setBoard] = useState<string[][]>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(""))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const gameLoopRef = useRef<number>(0);
  const dropTimeRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tetris-best-score");
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  // Save best score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("tetris-best-score", score.toString());
    }
  }, [score, bestScore]);

  const createPiece = useCallback((): Piece => {
    const pieces = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const tetromino = TETROMINOES[randomPiece];

    return {
      shape: tetromino.shape,
      x:
        Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
      color: tetromino.color,
    };
  }, []);

  const isValidPosition = useCallback(
    (piece: Piece, board: string[][], dx = 0, dy = 0): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.x + x + dx;
            const newY = piece.y + y + dy;

            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX] !== "")
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    []
  );

  const placePiece = useCallback(
    (piece: Piece, board: string[][]): string[][] => {
      const newBoard = board.map((row) => [...row]);

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.y + y;
            const boardX = piece.x + x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = piece.color;
            }
          }
        }
      }

      return newBoard;
    },
    []
  );

  const clearLines = useCallback(
    (board: string[][]): { newBoard: string[][]; linesCleared: number } => {
      const newBoard = board.filter((row) => row.some((cell) => cell === ""));
      const linesCleared = BOARD_HEIGHT - newBoard.length;

      // Add new empty rows at the top
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(""));
      }

      return { newBoard, linesCleared };
    },
    []
  );

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map((row) => row[index]).reverse()
    );

    return { ...piece, shape: rotated };
  }, []);

  const movePiece = useCallback(
    (direction: "left" | "right" | "down" | "rotate") => {
      if (!currentPiece || gameState !== "playing") return;

      let newPiece = { ...currentPiece };
      let dx = 0,
        dy = 0;

      switch (direction) {
        case "left":
          dx = -1;
          break;
        case "right":
          dx = 1;
          break;
        case "down":
          dy = 1;
          break;
        case "rotate":
          newPiece = rotatePiece(currentPiece);
          break;
      }

      if (direction === "rotate") {
        if (isValidPosition(newPiece, board)) {
          setCurrentPiece(newPiece);
        }
      } else {
        if (isValidPosition(currentPiece, board, dx, dy)) {
          setCurrentPiece((prev) =>
            prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null
          );
        } else if (direction === "down") {
          // Piece can't move down, place it and spawn new piece
          const newBoard = placePiece(currentPiece, board);
          const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

          setBoard(clearedBoard);
          setLines((prev) => prev + linesCleared);
          setScore((prev) => prev + linesCleared * 100 * level);
          setLevel(Math.floor(lines / 10) + 1);

          // Check game over
          const newPiece = nextPiece || createPiece();
          if (!isValidPosition(newPiece, clearedBoard)) {
            setGameState("gameOver");
            return;
          }

          setCurrentPiece(newPiece);
          setNextPiece(createPiece());
        }
      }
    },
    [
      currentPiece,
      board,
      gameState,
      isValidPosition,
      rotatePiece,
      placePiece,
      clearLines,
      level,
      lines,
      nextPiece,
      createPiece,
    ]
  );

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;

    let dropDistance = 0;
    while (isValidPosition(currentPiece, board, 0, dropDistance + 1)) {
      dropDistance++;
    }

    const droppedPiece = { ...currentPiece, y: currentPiece.y + dropDistance };
    const newBoard = placePiece(droppedPiece, board);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

    setBoard(clearedBoard);
    setLines((prev) => prev + linesCleared);
    setScore((prev) => prev + linesCleared * 100 * level + dropDistance * 2);
    setLevel(Math.floor(lines / 10) + 1);

    // Check game over
    const newPiece = nextPiece || createPiece();
    if (!isValidPosition(newPiece, clearedBoard)) {
      setGameState("gameOver");
      return;
    }

    setCurrentPiece(newPiece);
    setNextPiece(createPiece());
  }, [
    currentPiece,
    board,
    gameState,
    isValidPosition,
    placePiece,
    clearLines,
    level,
    lines,
    nextPiece,
    createPiece,
  ]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          movePiece("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          movePiece("right");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          movePiece("down");
          break;
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          movePiece("rotate");
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
        case "P":
          e.preventDefault();
          setGameState(gameState === "playing" ? "paused" : "playing");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, movePiece, hardDrop]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      dropTimeRef.current += deltaTime;
      const dropInterval = Math.max(50, 1000 - (level - 1) * 100);

      if (dropTimeRef.current > dropInterval) {
        movePiece("down");
        dropTimeRef.current = 0;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, level, movePiece]);

  const startGame = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(""));
    const firstPiece = createPiece();
    const secondPiece = createPiece();

    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameState("playing");
    dropTimeRef.current = 0;
    lastTimeRef.current = 0;
  }, [createPiece]);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <Gamepad2 className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Tetris Game</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to play Tetris and save your
            high scores
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-indigo-600 hover:bg-gray-100"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 max-w-4xl w-full">
        {gameState === "menu" && (
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                TETRIS
              </div>
              <p className="text-gray-600">Clear lines by completing rows!</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center">
                  <span className="text-xl mr-2">🎮</span>
                  Controls
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Arrow keys or WASD to move/rotate</p>
                  <p>• Spacebar for hard drop</p>
                  <p>• P to pause/resume</p>
                  <p>• Complete rows to clear lines! 🧩</p>
                </div>
              </div>

              {bestScore > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                    Best Score
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bestScore.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Game
            </Button>
          </div>
        )}

        {(gameState === "playing" ||
          gameState === "paused" ||
          gameState === "gameOver") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => (window.location.href = "/games")}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Games
                </Button>
                <Button
                  onClick={startGame}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {score.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Level</p>
                  <p className="text-2xl font-bold text-green-700">{level}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Lines</p>
                  <p className="text-2xl font-bold text-yellow-700">{lines}</p>
                </div>

                <div className="bg-gradient-to-r from-pink-100 to-red-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Best</p>
                  <p className="text-xl font-bold text-pink-700">
                    {bestScore.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Next Piece Preview */}
              {nextPiece && (
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Next</p>
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(
                        ...nextPiece.shape.map((row) => row.length)
                      )}, 1fr)`,
                    }}
                  >
                    {nextPiece.shape.map((row, y) =>
                      row.map((cell, x) => (
                        <div
                          key={`${y}-${x}`}
                          className={`w-4 h-4 rounded-sm ${
                            cell ? nextPiece.color : "bg-gray-200"
                          }`}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Center - Game Board */}
            <div className="relative">
              <div className="bg-gray-900 p-2 rounded-xl">
                <div
                  className="grid gap-px"
                  style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)` }}
                >
                  {renderBoard().map((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`${y}-${x}`}
                        className={`w-6 h-6 border border-gray-800 ${
                          cell || "bg-gray-800"
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Pause/Game Over Overlay */}
              {(gameState === "paused" || gameState === "gameOver") && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="bg-white rounded-2xl p-6 text-center max-w-sm mx-4">
                    <div className="text-4xl mb-4">
                      {gameState === "paused" ? "⏸️" : "😔"}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {gameState === "paused" ? "Paused" : "Game Over"}
                    </h2>
                    {gameState === "gameOver" && (
                      <p className="text-lg font-semibold text-indigo-600 mb-4">
                        Final Score: {score.toLocaleString()}
                      </p>
                    )}
                    <div className="space-y-3">
                      {gameState === "paused" ? (
                        <Button
                          onClick={() => setGameState("playing")}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                      ) : (
                        <Button
                          onClick={startGame}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                        >
                          Play Again
                        </Button>
                      )}
                      <Button
                        onClick={() => (window.location.href = "/games")}
                        variant="outline"
                        className="w-full"
                      >
                        Back to Games
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Controls */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Controls</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>⬅️➡️ Move left/right</p>
                  <p>⬇️ Soft drop</p>
                  <p>⬆️ Rotate piece</p>
                  <p>Space: Hard drop</p>
                  <p>P: Pause</p>
                </div>
              </div>

              {gameState === "playing" && (
                <div className="space-y-2">
                  <Button
                    onClick={() => setGameState("paused")}
                    variant="outline"
                    className="w-full"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Game
                  </Button>

                  <div className="grid grid-cols-3 gap-1">
                    <div></div>
                    <Button
                      onClick={() => movePiece("rotate")}
                      variant="outline"
                      size="sm"
                      className="h-10"
                    >
                      ↻
                    </Button>
                    <div></div>
                    <Button
                      onClick={() => movePiece("left")}
                      variant="outline"
                      size="sm"
                      className="h-10"
                    >
                      ←
                    </Button>
                    <Button
                      onClick={() => movePiece("down")}
                      variant="outline"
                      size="sm"
                      className="h-10"
                    >
                      ↓
                    </Button>
                    <Button
                      onClick={() => movePiece("right")}
                      variant="outline"
                      size="sm"
                      className="h-10"
                    >
                      →
                    </Button>
                  </div>

                  <Button
                    onClick={hardDrop}
                    variant="outline"
                    className="w-full"
                  >
                    Hard Drop
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
