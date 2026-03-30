import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [gameState, setGameState] = useState({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    gameStarted: false,
    isPaused: false,
    obstacles: [],
    powerUps: []
  });

  const directionRef = useRef('RIGHT');
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);
  const isPausedRef = useRef(false);

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  };

  const generateObstacles = () => {
    const obstacles = [];
    for (let i = 5; i < 10; i++) {
      obstacles.push({ x: 5, y: i });
      obstacles.push({ x: 15, y: i });
    }
    obstacles.push({ x: 10, y: 15 });
    obstacles.push({ x: 10, y: 16 });
    obstacles.push({ x: 10, y: 17 });
    obstacles.push({ x: 10, y: 18 });
    obstacles.push({ x: 10, y: 19 });
    return obstacles;
  };

  const initGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      gameStarted: true,
      isPaused: false,
      obstacles: generateObstacles(),
      powerUps: []
    });
  };

  return (
    <div className="snake-game">
      <div className="game-info">
        <h2>Enhanced Snake Game</h2>
        <div className="game-stats">
          <div>Score: {gameState.score}</div>
        </div>
        <div className="game-controls">
          <button onClick={initGame} disabled={gameState.gameStarted && !gameState.gameOver}>
            {gameState.gameOver ? 'Restart Game' : 'Start Game'}
          </button>
        </div>
        <div className="game-instructions">
          <p>Use arrow keys to control the snake. Press spacebar to pause.</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;