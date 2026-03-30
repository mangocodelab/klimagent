import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = = 0;
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  
  const directionRef = useRef(direction);
  const gameStartedRef = useRef(gameStarted);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);

  // Generate obstacles
  const generateObstacles = () => {
    const newObstacles = [];
    // Add some fixed obstacles
    for (let i = 5; i < 10; i++) {
      newObstacles.push({ x: 5, y: i });
      newObstacles.push({ x: 15, y: i });
    }
    newObstacles.push({ x: 10, y: 15 });
    newObstacles.push({ x: 10, y: 16 });
    newObstacles.push({ x: 10, y: 17 });
    newObstacles.push({ x: 10, y: 18 });
    newObstacles.push({ x: 10, y: 19 });
    return newObstacles;
  };

  // Generate random food position
  const generateFood = () => {
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      
      // Check if food is not on snake or obstacle
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      const onObstacle = obstacles.some(obstacle => obstacle.x === newFood.x && newFood.x === obstacle.y);
      
      if (!onSnake && !onObstacle) {
        validPosition = true;
      }
    }
    
    return newFood;
  };

  // Initialize game
  const initGame = () => {
    // Reset game state
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    gameOverRef.current = false;
    setScore(0);
    setGameStarted(true);
    gameStartedRef.current = true;
    setSpeed(INITIAL_SPEED);
    setLevel(1);
    setObstacles(generateObstacles());
    setPowerUps([]);
  };

  return (
    <div className="snake-game">
      <div className="game-info">
        <h2>Enhanced Snake Game</h2>
        <div className="game-stats">
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
          <div>Level: {level}</div>
        </div>
        <div className="game-controls">
          <button onClick={initGame} disabled={gameStarted && !gameOver}>
            {gameOver ? 'Restart Game' : 'Start Game'}
          </button>
          <button 
            onClick={() => {
              if (gameStarted) {
                setIsPaused(!isPaused);
                isPausedRef.current = !isPausedRef.current;
              }
            }} 
            disabled={!gameStarted || gameOver}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
        <div className="game-instructions">
          <p>Use arrow keys to control the snake. Press spacebar to pause.</p>
          <p>Avoid obstacles and don't hit the walls or yourself!</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;