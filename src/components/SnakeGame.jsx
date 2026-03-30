import React, { useState, useEffect, useCallback } from 'react'
import './SnakeGame.css'

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState({ x: 0, y: -1 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameBoard, setGameBoard] = useState(Array(20).fill().map(() => Array(20).fill(0)))

  const moveSnake = useCallback(() => {
    if (gameOver) return

    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }
      head.x += direction.x
      head.y += direction.y

      // Check if snake hits the wall
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true)
        return prevSnake
      }

      // Check if snake hits itself
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return prevSnake
      }

      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        })
        setScore(prevScore => prevScore + 1)
        newSnake.unshift(head)
        return newSnake
      }

      // Move snake forward
      newSnake.unshift(head)
      newSnake.pop()
      return newSnake
    })
  }, [direction, food, gameOver])

  useEffect(() => {
    const interval = setInterval(moveSnake, 150)
    return () => clearInterval(interval)
  }, [moveSnake])

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection({ x: 0, y: -1 })
        break
      case 'ArrowDown':
        setDirection({ x: 0, y: 1 })
        break
      case 'ArrowLeft':
        setDirection({ x: -1, y: 0 })
        break
      case 'ArrowRight':
        setDirection({ x: 1, y: 0 })
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      <div className="score">Score: {score}</div>
      <div className="game-board">
        {gameBoard.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => {
              const isSnake = snake.some(segment => segment.x === x && segment.y === y)
              const isFood = food.x === x && food.y === y
              return (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                />
              )
            })}
          </div>
        ))}
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  )
}

export default SnakeGame