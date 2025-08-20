"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home, Trophy, Gamepad2 } from "lucide-react";

export default function Game2048() {
  const { data: session } = useSession();
  const [gameState, setGameState] = useState<
    "menu" | "playing" | "gameOver" | "won"
  >("menu");
  const [grid, setGrid] = useState<number[][]>(() =>
    Array(4)
      .fill(null)
      .map(() => Array(4).fill(0))
  );
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score");
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  // Save best score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("2048-best-score", score.toString());
    }
  }, [score, bestScore]);

  const addRandomTile = useCallback((currentGrid: number[][]) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];
      const newGrid = currentGrid.map((row) => [...row]);
      newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
      return newGrid;
    }
    return currentGrid;
  }, []);

  const initializeGame = useCallback(() => {
    let newGrid = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setHasWon(false);
    setGameState("playing");
  }, [addRandomTile]);

  const moveLeft = (grid: number[][]) => {
    const newGrid = grid.map((row) => [...row]);
    let moved = false;
    let scoreIncrease = 0;

    for (let i = 0; i < 4; i++) {
      // Remove zeros
      let row = newGrid[i].filter((val) => val !== 0);

      // Merge tiles
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          scoreIncrease += row[j];
          row[j + 1] = 0;
          if (row[j] === 2048 && !hasWon) {
            setHasWon(true);
            setGameState("won");
          }
        }
      }

      // Remove zeros again after merging
      row = row.filter((val) => val !== 0);

      // Fill with zeros
      while (row.length < 4) {
        row.push(0);
      }

      // Check if row changed
      for (let j = 0; j < 4; j++) {
        if (newGrid[i][j] !== row[j]) {
          moved = true;
        }
      }

      newGrid[i] = row;
    }

    return { grid: newGrid, moved, scoreIncrease };
  };

  const moveRight = (grid: number[][]) => {
    const rotatedGrid = grid.map((row) => [...row].reverse());
    const { grid: movedGrid, moved, scoreIncrease } = moveLeft(rotatedGrid);
    const finalGrid = movedGrid.map((row) => [...row].reverse());
    return { grid: finalGrid, moved, scoreIncrease };
  };

  const moveUp = (grid: number[][]) => {
    // Transpose
    const transposed = grid[0].map((_, colIndex) =>
      grid.map((row) => row[colIndex])
    );
    const { grid: movedGrid, moved, scoreIncrease } = moveLeft(transposed);
    // Transpose back
    const finalGrid = movedGrid[0].map((_, colIndex) =>
      movedGrid.map((row) => row[colIndex])
    );
    return { grid: finalGrid, moved, scoreIncrease };
  };

  const moveDown = (grid: number[][]) => {
    // Transpose and reverse
    const transposed = grid[0].map((_, colIndex) =>
      grid.map((row) => row[colIndex]).reverse()
    );
    const { grid: movedGrid, moved, scoreIncrease } = moveLeft(transposed);
    // Reverse and transpose back
    const finalGrid = movedGrid
      .map((row) => [...row].reverse())[0]
      .map((_, colIndex) =>
        movedGrid.map((row) => [...row].reverse()).map((row) => row[colIndex])
      );
    return { grid: finalGrid, moved, scoreIncrease };
  };

  const isGameOver = (grid: number[][]) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = grid[i][j];
        if (
          (i > 0 && grid[i - 1][j] === current) ||
          (i < 3 && grid[i + 1][j] === current) ||
          (j > 0 && grid[i][j - 1] === current) ||
          (j < 3 && grid[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const handleMove = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (gameState !== "playing") return;

      let result;
      switch (direction) {
        case "left":
          result = moveLeft(grid);
          break;
        case "right":
          result = moveRight(grid);
          break;
        case "up":
          result = moveUp(grid);
          break;
        case "down":
          result = moveDown(grid);
          break;
      }

      if (result.moved) {
        const newGrid = addRandomTile(result.grid);
        setGrid(newGrid);
        setScore((prev) => prev + result.scoreIncrease);

        if (isGameOver(newGrid)) {
          setTimeout(() => setGameState("gameOver"), 100);
        }
      }
    },
    [grid, gameState, addRandomTile]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          handleMove("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          handleMove("right");
          break;
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          handleMove("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          handleMove("down");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, handleMove]);

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: "bg-gray-200",
      2: "bg-red-100 text-red-800",
      4: "bg-red-200 text-red-900",
      8: "bg-orange-200 text-orange-900",
      16: "bg-orange-300 text-orange-900",
      32: "bg-yellow-200 text-yellow-900",
      64: "bg-yellow-300 text-yellow-900",
      128: "bg-green-200 text-green-900",
      256: "bg-green-300 text-green-900",
      512: "bg-blue-200 text-blue-900",
      1024: "bg-blue-300 text-blue-900",
      2048: "bg-purple-300 text-purple-900",
      4096: "bg-pink-300 text-pink-900",
    };
    return (
      colors[value] ||
      "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
    );
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <Gamepad2 className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">2048 Game</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to play 2048 and save your
            high scores
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {gameState === "menu" && (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                2048
              </div>
              <p className="text-gray-600">Merge tiles to reach 2048!</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center">
                  <span className="text-xl mr-2">🎮</span>
                  How to Play
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Use arrow keys or WASD to move tiles</p>
                  <p>• Tiles with same numbers merge when they touch</p>
                  <p>• Get to 2048 to win!</p>
                  <p>• Keep going for higher scores! 🎯</p>
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
              onClick={initializeGame}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Game
            </Button>
          </div>
        )}

        {(gameState === "playing" ||
          gameState === "gameOver" ||
          gameState === "won") && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={() => (window.location.href = "/games")}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Games
              </Button>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                2048
              </h1>
              <Button
                onClick={initializeGame}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-600"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Score */}
            <div className="flex gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 flex-1 text-center">
                <p className="text-sm text-gray-600 mb-1">Score</p>
                <p className="text-xl font-bold text-purple-700">
                  {score.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 flex-1 text-center">
                <p className="text-sm text-gray-600 mb-1">Best</p>
                <p className="text-xl font-bold text-yellow-700">
                  {bestScore.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Game Grid */}
            <div className="bg-gray-300 rounded-xl p-3 mb-6">
              <div className="grid grid-cols-4 gap-2">
                {grid.flat().map((cell, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-150 ${getTileColor(
                      cell
                    )}`}
                  >
                    {cell !== 0 && cell}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Use arrow keys or WASD to move
              </p>
              <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
                <div></div>
                <Button
                  onClick={() => handleMove("up")}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  disabled={gameState !== "playing"}
                >
                  ↑
                </Button>
                <div></div>
                <Button
                  onClick={() => handleMove("left")}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  disabled={gameState !== "playing"}
                >
                  ←
                </Button>
                <Button
                  onClick={() => handleMove("down")}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  disabled={gameState !== "playing"}
                >
                  ↓
                </Button>
                <Button
                  onClick={() => handleMove("right")}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  disabled={gameState !== "playing"}
                >
                  →
                </Button>
              </div>
            </div>

            {/* Game Over/Won Modal */}
            {(gameState === "gameOver" || gameState === "won") && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
                  <div className="text-4xl mb-4">
                    {gameState === "won" ? "🎉" : "😔"}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {gameState === "won" ? "You Won!" : "Game Over"}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {gameState === "won"
                      ? "Congratulations! You reached 2048!"
                      : "No more moves available!"}
                  </p>
                  <p className="text-lg font-semibold text-purple-600 mb-6">
                    Final Score: {score.toLocaleString()}
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={initializeGame}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Play Again
                    </Button>
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
        )}
      </div>
    </div>
  );
}
