# Run the snake game
# Make sure you have installed the requirements first: pip install -r requirements.txt

import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import pygame
    print("Pygame is already installed.")
except ImportError:
    print("Installing pygame...")
    os.system("pip install pygame")

try:
    import snake_game
    print("Running the snake game...")
    snake_game.main()
except Exception as e:
    print(f"Error running the game: {e}")
    print("Please make sure you have Python and pygame installed correctly.")