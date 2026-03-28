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
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const gameStartedRef = useRef(gameStarted);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);

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
  };

  // Generate random food position
  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (!gameStartedRef.current) return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (directionRef.current !== 'DOWN') {
          directionRef.current = 'UP';
          setDirection('UP');
        }
        break;
      case 'ArrowDown':
        if (directionRef.current !== 'UP') {
          directionRef.current = 'DOWN';
          setDirection('DOWN');
        }
        break;
      case 'ArrowLeft':
        if (directionRef.current !== 'RIGHT') {
          directionRef.current = 'LEFT';
          setDirection('LEFT');
        }
        break;
      case 'ArrowRight':
        if (directionRef.current !== 'LEFT') {
          directionRef.current = 'RIGHT';
          setDirection('RIGHT');
        }
        break;
      case ' ':
        if (gameStartedRef.current && !gameOverRef.current) {
          setIsPaused(prev => {
            isPausedRef.current = !prev;
            return !prev;
          });
        }
        break;
      default:
        break;
    }
  }, []);

  // Game logic
  useEffect(() => {
    const moveSnake = () => {
      if (isPausedRef.current || gameOverRef.current || !gameStartedRef.current) return;
      
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        
        // Move head based on direction
        switch (directionRef.current) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
          default:
            break;
        }
        
        // Check if game over (hit wall)
        if (
          head.x < 0 || 
          head.x >= GRID_SIZE || 
          head.y < 0 || 
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          gameOverRef.current = true;
          return prevSnake;
        }
        
        // Check if snake hits itself
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          gameOverRef.current = true;
          return prevSnake;
        }
        
        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          // Grow snake
          newSnake.unshift(head);
          setFood(generateFood());
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
            }
            return newScore;
          });
          return [head, ...newSnake];
        } else {
          // Move snake
          newSnake.unshift(head);
          newSnake.pop();
          return newSnake;
        }
      });
    };
    
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snake, food, speed]);

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Update high score in localStorage
  useEffect(() => {
    localStorage.setItem('snakeHighScore', highScore.toString());
  }, [highScore]);

  return (
    <div className="snake-game">
      <div className="game-info">
        <h2>Snake Game</h2>
        <div className="game-stats">
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
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
        </div>
      </div>
      
      <div 
        className="game-board"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {Array(GRID_SIZE * GRID_SIZE)
          .fill()
          .map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = isSnake && snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;
            
            let cellClass = 'grid-cell';
            if (isHead) cellClass += ' snake-head';
            else if (isSnake) cellClass += ' snake-body';
            if (isFood) cellClass += ' food';
            
            return (
              <div 
                key={i} 
                className={cellClass}
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1
                }}
              />
            );
          })}
      </div>
      
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Your score: {score}</p>
          <button onClick={initGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;