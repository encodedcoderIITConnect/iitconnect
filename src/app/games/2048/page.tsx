"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw, Trophy, Star, ArrowLeft } from "lucide-react";

// Game types
interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  isGameOver: boolean;
  hasWon: boolean;
  gameStatus: "menu" | "playing" | "gameOver" | "won";
}

// Tile colors matching the 2048 game design
const getTileColor = (value: number) => {
  const colors: Record<number, string> = {
    2: "bg-slate-100 text-slate-800 border-slate-200",
    4: "bg-slate-200 text-slate-800 border-slate-300",
    8: "bg-orange-300 text-white border-orange-400",
    16: "bg-orange-400 text-white border-orange-500",
    32: "bg-orange-500 text-white border-orange-600",
    64: "bg-orange-600 text-white border-orange-700",
    128: "bg-yellow-400 text-white border-yellow-500",
    256: "bg-yellow-500 text-white border-yellow-600",
    512: "bg-yellow-600 text-white border-yellow-700",
    1024: "bg-yellow-700 text-white border-yellow-800",
    2048: "bg-yellow-800 text-white border-yellow-900",
  };
  return colors[value] || "bg-slate-800 text-white border-slate-900";
};

export default function Game2048() {
  const { data: session } = useSession();
  const gameboardRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    score: 0,
    bestScore: 0,
    isGameOver: false,
    hasWon: false,
    gameStatus: "menu",
  });

  // Touch handling for swipe detection
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score");
    if (saved) {
      setGameState((prev) => ({ ...prev, bestScore: parseInt(saved) }));
    }
  }, []);

  // Initialize empty board
  const createEmptyBoard = (): Tile[] => {
    return [];
  };

  // Get empty cells
  const getEmptyCells = (tiles: Tile[]): { row: number; col: number }[] => {
    const occupiedCells = new Set(
      tiles.map((tile) => `${tile.row}-${tile.col}`)
    );
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!occupiedCells.has(`${row}-${col}`)) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  };

  // Add random tile
  const addRandomTile = useCallback((tiles: Tile[]): Tile[] => {
    const emptyCells = getEmptyCells(tiles);
    if (emptyCells.length === 0) return tiles;

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newTile: Tile = {
      id: Date.now() + Math.random(),
      value: Math.random() < 0.9 ? 2 : 4,
      row: randomCell.row,
      col: randomCell.col,
      isNew: true,
    };

    return [...tiles, newTile];
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    let newTiles = createEmptyBoard();
    newTiles = addRandomTile(newTiles);
    newTiles = addRandomTile(newTiles);

    setGameState((prev) => ({
      ...prev,
      tiles: newTiles,
      score: 0,
      isGameOver: false,
      hasWon: false,
      gameStatus: "playing",
    }));
  }, [addRandomTile]);

  // Check if game is over
  const checkGameOver = useCallback((tiles: Tile[]): boolean => {
    // Check if board is full
    if (tiles.length < 16) return false;

    // Create grid
    const grid: (number | null)[][] = Array(4)
      .fill(null)
      .map(() => Array(4).fill(null));
    tiles.forEach((tile) => {
      grid[tile.row][tile.col] = tile.value;
    });

    // Check for possible moves
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = grid[row][col];

        // Check right neighbor
        if (
          col < 3 &&
          (grid[row][col + 1] === null || grid[row][col + 1] === current)
        ) {
          return false;
        }

        // Check bottom neighbor
        if (
          row < 3 &&
          (grid[row + 1][col] === null || grid[row + 1][col] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  }, []);

  // Move tiles in a direction
  const moveTiles = useCallback(
    (direction: "left" | "right" | "up" | "down"): boolean => {
      if (gameState.gameStatus !== "playing") return false;

      const newTiles = [...gameState.tiles];
      let moved = false;
      let newScore = gameState.score;
      let hasWon = gameState.hasWon;

      // Clear previous merge flags
      newTiles.forEach((tile) => {
        tile.isMerged = false;
        tile.isNew = false;
      });

      // Create 4x4 grid
      const grid: (Tile | null)[][] = Array(4)
        .fill(null)
        .map(() => Array(4).fill(null));
      newTiles.forEach((tile) => {
        grid[tile.row][tile.col] = tile;
      });

      // Movement logic based on direction
      const moveInDirection = () => {
        if (direction === "left") {
          for (let row = 0; row < 4; row++) {
            const rowTiles = grid[row].filter(
              (tile) => tile !== null
            ) as Tile[];
            let newCol = 0;

            for (let i = 0; i < rowTiles.length; i++) {
              const tile = rowTiles[i];

              // Check if we can merge with the previous tile
              if (
                i > 0 &&
                rowTiles[i - 1].value === tile.value &&
                !rowTiles[i - 1].isMerged
              ) {
                // Merge tiles
                rowTiles[i - 1].value *= 2;
                rowTiles[i - 1].isMerged = true;
                newScore += rowTiles[i - 1].value;

                if (rowTiles[i - 1].value === 2048 && !hasWon) {
                  hasWon = true;
                }

                // Remove the current tile
                const tileIndex = newTiles.findIndex((t) => t.id === tile.id);
                if (tileIndex > -1) {
                  newTiles.splice(tileIndex, 1);
                  moved = true;
                }
              } else {
                // Move tile to new position
                if (tile.col !== newCol) {
                  tile.col = newCol;
                  moved = true;
                }
                newCol++;
              }
            }
          }
        } else if (direction === "right") {
          for (let row = 0; row < 4; row++) {
            const rowTiles = grid[row].filter(
              (tile) => tile !== null
            ) as Tile[];
            let newCol = 3;

            for (let i = rowTiles.length - 1; i >= 0; i--) {
              const tile = rowTiles[i];

              // Check if we can merge with the next tile
              if (
                i < rowTiles.length - 1 &&
                rowTiles[i + 1].value === tile.value &&
                !rowTiles[i + 1].isMerged
              ) {
                // Merge tiles
                rowTiles[i + 1].value *= 2;
                rowTiles[i + 1].isMerged = true;
                newScore += rowTiles[i + 1].value;

                if (rowTiles[i + 1].value === 2048 && !hasWon) {
                  hasWon = true;
                }

                // Remove the current tile
                const tileIndex = newTiles.findIndex((t) => t.id === tile.id);
                if (tileIndex > -1) {
                  newTiles.splice(tileIndex, 1);
                  moved = true;
                }
              } else {
                // Move tile to new position
                if (tile.col !== newCol) {
                  tile.col = newCol;
                  moved = true;
                }
                newCol--;
              }
            }
          }
        } else if (direction === "up") {
          for (let col = 0; col < 4; col++) {
            const colTiles = [];
            for (let row = 0; row < 4; row++) {
              if (grid[row][col]) colTiles.push(grid[row][col] as Tile);
            }

            let newRow = 0;
            for (let i = 0; i < colTiles.length; i++) {
              const tile = colTiles[i];

              // Check if we can merge with the previous tile
              if (
                i > 0 &&
                colTiles[i - 1].value === tile.value &&
                !colTiles[i - 1].isMerged
              ) {
                // Merge tiles
                colTiles[i - 1].value *= 2;
                colTiles[i - 1].isMerged = true;
                newScore += colTiles[i - 1].value;

                if (colTiles[i - 1].value === 2048 && !hasWon) {
                  hasWon = true;
                }

                // Remove the current tile
                const tileIndex = newTiles.findIndex((t) => t.id === tile.id);
                if (tileIndex > -1) {
                  newTiles.splice(tileIndex, 1);
                  moved = true;
                }
              } else {
                // Move tile to new position
                if (tile.row !== newRow) {
                  tile.row = newRow;
                  moved = true;
                }
                newRow++;
              }
            }
          }
        } else if (direction === "down") {
          for (let col = 0; col < 4; col++) {
            const colTiles = [];
            for (let row = 0; row < 4; row++) {
              if (grid[row][col]) colTiles.push(grid[row][col] as Tile);
            }

            let newRow = 3;
            for (let i = colTiles.length - 1; i >= 0; i--) {
              const tile = colTiles[i];

              // Check if we can merge with the next tile
              if (
                i < colTiles.length - 1 &&
                colTiles[i + 1].value === tile.value &&
                !colTiles[i + 1].isMerged
              ) {
                // Merge tiles
                colTiles[i + 1].value *= 2;
                colTiles[i + 1].isMerged = true;
                newScore += colTiles[i + 1].value;

                if (colTiles[i + 1].value === 2048 && !hasWon) {
                  hasWon = true;
                }

                // Remove the current tile
                const tileIndex = newTiles.findIndex((t) => t.id === tile.id);
                if (tileIndex > -1) {
                  newTiles.splice(tileIndex, 1);
                  moved = true;
                }
              } else {
                // Move tile to new position
                if (tile.row !== newRow) {
                  tile.row = newRow;
                  moved = true;
                }
                newRow--;
              }
            }
          }
        }
      };

      moveInDirection();

      if (moved) {
        // Add new random tile
        const tilesWithNewTile = addRandomTile(newTiles);

        // Check for game over
        const isGameOver = checkGameOver(tilesWithNewTile);

        // Update best score
        let newBestScore = gameState.bestScore;
        if (newScore > newBestScore) {
          newBestScore = newScore;
          localStorage.setItem("2048-best-score", newScore.toString());
        }

        setGameState((prev) => ({
          ...prev,
          tiles: tilesWithNewTile,
          score: newScore,
          bestScore: newBestScore,
          isGameOver,
          hasWon,
          gameStatus: hasWon ? "won" : isGameOver ? "gameOver" : "playing",
        }));
      }

      return moved;
    },
    [gameState, addRandomTile, checkGameOver]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameStatus === "playing") {
        let direction: "left" | "right" | "up" | "down" | null = null;

        switch (e.code) {
          case "ArrowLeft":
          case "KeyA":
            direction = "left";
            break;
          case "ArrowRight":
          case "KeyD":
            direction = "right";
            break;
          case "ArrowUp":
          case "KeyW":
            direction = "up";
            break;
          case "ArrowDown":
          case "KeyS":
            direction = "down";
            break;
        }

        if (direction) {
          e.preventDefault();
          moveTiles(direction);
        }
      } else if (e.code === "Space") {
        e.preventDefault();
        if (
          gameState.gameStatus === "menu" ||
          gameState.gameStatus === "gameOver"
        ) {
          startNewGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState.gameStatus, moveTiles, startNewGame]);

  // Touch event handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling during swipe
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

    if (gameState.gameStatus === "playing") {
      if (isLeftSwipe) {
        moveTiles("left");
      } else if (isRightSwipe) {
        moveTiles("right");
      } else if (isUpSwipe) {
        moveTiles("up");
      } else if (isDownSwipe) {
        moveTiles("down");
      }
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🔢</div>
          <h1 className="text-2xl font-bold mb-4">2048 Game</h1>
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
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <Button
            onClick={() => (window.location.href = "/games")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2 flex items-center"
          >
            <ChevronLeft className="h-6 w-6 mr-1" />
            <span className="text-2xl font-bold">2048</span>
          </Button>

          <div className="flex items-center space-x-3 text-white text-sm">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <div className="text-xs font-medium text-white/80 mb-1">
                SCORE
              </div>
              <div className="text-lg font-bold text-white">
                {gameState.score.toLocaleString()}
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <div className="text-xs font-medium text-white/80 mb-1">BEST</div>
              <div className="text-lg font-bold text-yellow-300">
                {gameState.bestScore.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-6">
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
              <span className="text-4xl mr-2">🔢</span>
              2048 Game
            </h1>
          </div>

          <div className="flex items-center space-x-6 text-white">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="text-sm font-medium text-white/80 mb-1">
                SCORE
              </div>
              <div className="text-xl font-bold text-white">
                {gameState.score.toLocaleString()}
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="text-sm font-medium text-white/80 mb-1 flex items-center justify-center">
                <Trophy className="h-4 w-4 mr-1 text-yellow-300" />
                BEST
              </div>
              <div className="text-xl font-bold text-yellow-300">
                {gameState.bestScore.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex-1 flex justify-center max-w-md mx-auto lg:mx-0">
            <div className="relative">
              <div
                ref={gameboardRef}
                className="bg-slate-300 rounded-lg p-4 shadow-2xl touch-none select-none"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                  width: "320px",
                  height: "320px",
                  touchAction: "none",
                  userSelect: "none",
                }}
              >
                {/* Grid background */}
                <div className="grid grid-cols-4 gap-3 h-full w-full">
                  {Array(16)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="bg-slate-200 rounded-md" />
                    ))}
                </div>

                {/* Tiles */}
                {gameState.tiles.map((tile) => (
                  <div
                    key={tile.id}
                    className={`absolute rounded-md flex items-center justify-center font-bold text-xl transition-all duration-200 ${getTileColor(
                      tile.value
                    )} ${tile.isNew ? "animate-pulse scale-110" : ""} ${
                      tile.isMerged ? "scale-105 shadow-lg" : ""
                    }`}
                    style={{
                      width: "70px",
                      height: "70px",
                      left: `${tile.col * 76 + 16}px`,
                      top: `${tile.row * 76 + 16}px`,
                      transform: tile.isNew
                        ? "scale(1.1)"
                        : tile.isMerged
                        ? "scale(1.05)"
                        : "scale(1)",
                    }}
                  >
                    {tile.value}
                  </div>
                ))}
              </div>

              {/* Game overlays */}
              {gameState.gameStatus === "menu" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-5xl mb-4">🔢</div>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      2048
                    </h2>
                    <p className="mb-4 text-sm text-white/90">
                      Join numbers to reach 2048!
                    </p>
                    <div className="space-y-2 text-xs text-white/80 mb-4 bg-white/10 rounded-lg p-3">
                      <p>📱 Swipe to move tiles</p>
                      <p>⌨️ Use arrow keys on desktop</p>
                      <p>🎯 Combine same numbers</p>
                    </div>
                    <Button
                      onClick={startNewGame}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-lg"
                    >
                      Start Game
                    </Button>
                  </div>
                </div>
              )}

              {gameState.gameStatus === "won" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      You Win!
                    </h2>
                    <p className="text-lg mb-4">You reached 2048!</p>
                    <p className="text-sm mb-4">
                      Score:{" "}
                      <span className="font-bold text-yellow-300">
                        {gameState.score.toLocaleString()}
                      </span>
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={() =>
                          setGameState((prev) => ({
                            ...prev,
                            gameStatus: "playing",
                          }))
                        }
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-2 rounded-lg w-full"
                      >
                        Continue Playing
                      </Button>
                      <Button
                        onClick={startNewGame}
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 w-full rounded-lg"
                      >
                        New Game
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {gameState.gameStatus === "gameOver" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-5xl mb-4">😵</div>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                      Game Over!
                    </h2>
                    <p className="text-lg mb-4">No more moves!</p>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-sm mb-2">
                        Score:{" "}
                        <span className="font-bold text-yellow-300">
                          {gameState.score.toLocaleString()}
                        </span>
                      </p>
                      {gameState.score === gameState.bestScore &&
                        gameState.score > 0 && (
                          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-2 mb-2">
                            <p className="text-yellow-300 flex items-center justify-center text-sm">
                              <Star className="h-4 w-4 mr-1" />
                              New High Score!
                              <Star className="h-4 w-4 ml-1" />
                            </p>
                          </div>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={startNewGame}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-2 rounded-lg w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/games")}
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 w-full rounded-lg"
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

          {/* Mobile Game Stats - Visible only on mobile */}
          <div className="lg:hidden w-full max-w-md mx-auto mt-6 space-y-4">
            {/* Game Stats */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center">
                <span className="text-xl mr-2">📊</span>
                Game Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-blue-50 rounded-xl p-3">
                  <div className="text-sm text-gray-600 mb-1">
                    Current Score
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {gameState.score.toLocaleString()}
                  </div>
                </div>
                <div className="text-center bg-yellow-50 rounded-xl p-3">
                  <div className="text-sm text-gray-600 mb-1">Best Score</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {gameState.bestScore.toLocaleString()}
                  </div>
                </div>
                <div className="text-center bg-green-50 rounded-xl p-3">
                  <div className="text-sm text-gray-600 mb-1">Tiles Used</div>
                  <div className="text-lg font-bold text-green-600">
                    {gameState.tiles.length}/16
                  </div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl p-3">
                  <div className="text-sm text-gray-600 mb-1">Player</div>
                  <div className="text-lg font-bold text-purple-600">
                    {session.user?.name?.split(" ")[0] || "You"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Info Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 space-y-6">
            {/* Controls */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🎮</span>
                How to Play
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">📱 Mobile:</span>
                    <span>Swipe to move tiles</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">⌨️ Desktop:</span>
                    <span>Arrow keys or WASD</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">🎯 Goal:</span>
                    <span>Reach the 2048 tile!</span>
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
                  <span className="font-bold text-blue-600">
                    {gameState.score.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Best Score:</span>
                  <span className="font-bold text-yellow-600">
                    {gameState.bestScore.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tiles:</span>
                  <span className="font-bold text-green-600">
                    {gameState.tiles.length}/16
                  </span>
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
                <p>• Keep your highest tile in a corner</p>
                <p>• Build tiles in one direction</p>
                <p>• Don&apos;t fill up the board randomly</p>
                <p>• Plan several moves ahead</p>
                <p>• Stay calm and think strategically! 🧠</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
