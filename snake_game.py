import pygame
import random
import sys
import math

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
GRID_SIZE = 20
GRID_WIDTH = WIDTH // GRID_SIZE
GRID_HEIGHT = HEIGHT // GRID_SIZE

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (50, 205, 50)
RED = (255, 50, 50)
BLUE = (50, 150, 255)
GOLD = (255, 215, 0)
PURPLE = (180, 70, 200)
DARK_GREEN = (0, 100, 0)
DARK_RED = (139, 0, 0)

# Set up display
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Enhanced Snake Game")

# Game variables
font = pygame.font.SysFont(None, 35)
small_font = pygame.font.SysFont(None, 25)
clock = pygame.time.Clock()
start_time = pygame.time.get_ticks()

# Particle system for effects
class Particle:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color
        self.size = random.randint(2, 5)
        self.vx = random.uniform(-2, 2)
        self.vy = random.uniform(-2, 2)
        self.lifetime = 30

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.lifetime -= 1
        return self.lifetime > 0

    def draw(self, surface):
        pygame.draw.circle(surface, self.color, (int(self.x), int(self.y)), self.size)

# Particle list
particles = []

# Obstacles
obstacles = [
    (5, 5), (5, 6), (5, 7), (5, 8), (5, 9),
    (15, 5), (15, 6), (15, 7), (15, 8), (15, 9),
    (10, 15), (10, 16), (10, 17), (10, 18), (10, 19)
]

# Power-ups
power_ups = []
active_power_ups = {}

# High score
high_score = 0

def draw_grid():
    for x in range(0, WIDTH, GRID_SIZE):
        pygame.draw.line(screen, (40, 40, 40), (x, 0), (x, HEIGHT))
    for y in range(0, HEIGHT, GRID_SIZE):
        pygame.draw.line(screen, (40, 40, 40), (0, y), (WIDTH, y))

def draw_snake(snake, invincible):
    for i, segment in enumerate(snake):
        color = GREEN if not invincible else GOLD
        rect = pygame.Rect(segment[0] * GRID_SIZE, segment[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(screen, color, rect)
        
        # Draw eyes on the head
        if i == 0:
            # Determine eye positions based on direction
            eye_size = GRID_SIZE // 5
            if len(snake) > 1:
                dx = snake[1][0] - segment[0]
                dy = snake[1][1] - segment[1]
                
                # Draw snake head in the direction of movement
                head_rect = pygame.Rect(segment[0] * GRID_SIZE, segment[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
                pygame.draw.rect(screen, DARK_GREEN, head_rect)
                
                # Draw eyes
                if dx == 0 and dy == -1:  # Moving up
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + GRID_SIZE//3, segment[1]*GRID_SIZE + GRID_SIZE//3), eye_size)
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + 2*GRID_SIZE//3, segment[1]*GRID_SIZE + GRID_SIZE//3), eye_size)
                elif dx == 0 and dy == 1:  # Moving down
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + GRID_SIZE//3, segment[1]*GRID_SIZE + 2*GRID_SIZE//3), eye_size)
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + 2*GRID_SIZE//3, segment[1]*GRID_SIZE + 2*GRID_SIZE//3), eye_size)
                elif dx == -1 and dy == 0:  # Moving left
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + GRID_SIZE//3, segment[1]*GRID_SIZE + GRID_SIZE//3), eye_size)
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + GRID_SIZE//3, segment[1]*GRID_SIZE + 2*GRID_SIZE//3), eye_size)
                else:  # Moving right or default
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + 2*GRID_SIZE//3, segment[1]*GRID_SIZE + GRID_SIZE//3), eye_size)
                    pygame.draw.circle(screen, WHITE, (segment[0]*GRID_SIZE + 2*GRID_SIZE//3, segment[1]*GRID_SIZE + 2*GRID_SIZE//3), eye_size)

def draw_food(food):
    # Draw a shiny apple
    rect = pygame.Rect(food[0] * GRID_SIZE, food[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
    pygame.draw.rect(screen, RED, rect)
    
    # Draw a shine effect
    pygame.draw.circle(screen, (255, 200, 200), 
                     (food[0] * GRID_SIZE + GRID_SIZE//2, food[1] * GRID_SIZE + GRID_SIZE//2),
                     GRID_SIZE//4)

def draw_obstacles():
    for obs in obstacles:
        rect = pygame.Rect(obs[0] * GRID_SIZE, obs[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(screen, (80, 80, 80), rect)

def draw_power_ups():
    for power_up in power_ups:
        if power_up['type'] == 'speed':
            color = BLUE
        else:
            color = PURPLE
        rect = pygame.Rect(power_up['pos'][0] * GRID_SIZE, power_up['pos'][1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(screen, color, rect)

def draw_particles():
    for particle in particles[:]:
        if not particle.update():
            particles.remove(particle)
        else:
            particle.draw(screen)

def spawn_power_up():
    if random.random() < 0.005:  # 0.5% chance each frame
        if len(power_ups) < 3:  # Max 3 power-ups on screen
            x = random.randint(0, GRID_WIDTH - 1)
            y = random.randint(0, GRID_HEIGHT - 1)
            power_type = random.choice(['speed', 'slow'])
            power_ups.append({'pos': (x, y), 'type': power_type, 'spawn_time': pygame.time.get_ticks()})

def display_score(score):
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (10, 10))
    
    high_score_text = font.render(f"High Score: {high_score}", True, WHITE)
    screen.blit(high_score_text, (WIDTH - 200, 10))

def display_game_over(score):
    game_over_text = font.render("GAME OVER", True, WHITE)
    score_text = font.render(f"Final Score: {score}", True, WHITE)
    restart_text = font.render("Press R to Restart or Q to Quit", True, WHITE)
    screen.blit(game_over_text, (WIDTH // 2 - 100, HEIGHT // 2 - 50))
    screen.blit(score_text, (WIDTH // 2 - 100, HEIGHT // 2 - 10))
    screen.blit(restart_text, (WIDTH // 2 - 200, HEIGHT // 2 + 30))

def display_hud(score, level, speed_level):
    # Display score
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (10, 10))
    
    # Display level
    level_text = small_font.render(f"Level: {level}", True, WHITE)
    screen.blit(level_text, (WIDTH - 100, 10))
    
    # Display speed level
    speed_text = small_font.render(f"Speed: {speed_level}x", True, WHITE)
    screen.blit(speed_text, (WIDTH - 100, 40))
    
    # Display high score
    high_score_text = font.render(f"High Score: {high_score}", True, WHITE)
    screen.blit(high_score_text, (WIDTH // 2 - 100, 10))

def check_collision(snake, food, score, level):
    global high_score
    head_x, head_y = snake[0]
    
    # Check if snake hits the walls
    if (head_x < 0 or head_x >= GRID_WIDTH or
        head_y < 0 or head_y >= GRID_HEIGHT):
        return True, score, level
    
    # Check if snake hits itself
    if snake[0] in snake[1:]:
        return True, score, level
    
    # Check if snake hits obstacle
    if snake[0] in obstacles:
        return True, score, level
    
    # Check if snake eats food
    if snake[0] == food:
        # Create particles
        for _ in range(10):
            particles.append(Particle(food[0]*GRID_SIZE + GRID_SIZE//2, 
                                  food[1]*GRID_SIZE + GRID_SIZE//2, 
                                  RED))
        
        # Generate new food
        new_food = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        while new_food in snake or new_food in obstacles or new_food in [p['pos'] for p in power_ups]:
            new_food = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        
        # Increase score
        score += 10
        if score > high_score:
            high_score = score
            
        # Every 100 points, increase level
        level = score // 100 + 1
        
        return False, new_food, score, level
    
    return False, food, score, level

def main():
    global particles, power_ups, high_score, obstacles
    snake = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
    food = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
    while food in snake or food in obstacles:
        food = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
    direction = (0, -1)  # Start moving up
    next_direction = direction
    score = 0
    game_over = False
    level = 1
    speed_level = 1
    frame_count = 0
    invincible = False
    invincibility_timer = 0
    speed_boost = 1
    base_speed = 10
    speed = base_speed

    # Initialize obstacles in a pattern
    obstacles = []
    for i in range(5, 10):
        obstacles.append((5, i))
        obstacles.append((15, i))
    obstacles.append((10, 15))
    obstacles.append((10, 16))
    obstacles.append((10, 17))
    obstacles.append((10, 18))
    obstacles.append((10, 19))

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and direction != (0, 1):
                    next_direction = (0, -1)
                elif event.key == pygame.K_DOWN and direction != (0, -1):
                    next_direction = (0, 1)
                elif event.key == pygame.K_LEFT and direction != (1, 0):
                    next_direction = (-1, 0)
                elif event.key == pygame.K_RIGHT and direction != (-1, 0):
                    next_direction = (1, 0)
                elif event.key == pygame.K_r and game_over:
                    return main()
                elif event.key == pygame.K_q and game_over:
                    pygame.quit()
                    sys.exit()
                elif event.key == pygame.K_p:  # Pause functionality
                    paused = True
                    while paused:
                        for pause_event in pygame.event.get():
                            if pause_event.type == pygame.KEYDOWN and pause_event.key == pygame.K_p:
                                paused = False
                        # Display pause message
                        pause_text = font.render("PAUSED", True, WHITE)
                        screen.blit(pause_text, (WIDTH // 2 - 50, HEIGHT // 2))
                        pygame.display.update()

        if not game_over:
            direction = next_direction

            # Move snake
            head_x, head_y = snake[0]
            new_head = (head_x + direction[0], head_y + direction[1])
            snake.insert(0, new_head)

            # Check for collisions
            game_over, food, score, level = check_collision(snake, food, score, level)

            # Check for power-up collection
            for power_up in power_ups[:]:
                if power_up['pos'] == new_head:
                    if power_up['type'] == 'speed':
                        speed_boost = 2
                        base_speed = 20
                    else:  # slow
                        speed_boost = 0.5
                        base_speed = 5
                    power_ups.remove(power_up)
                    # Create particles for effect
                    for _ in range(20):
                        particles.append(Particle(new_head[0]*GRID_SIZE + GRID_SIZE//2, 
                                              new_head[1]*GRID_SIZE + GRID_SIZE//2, 
                                              BLUE if power_up['type'] == 'speed' else PURPLE))
            
            # Update speed based on level and power-ups
            speed = base_speed + (level - 1) * 2
            if speed_boost != 1:
                speed = int(speed * speed_boost)

            # Remove collected power-ups
            power_ups = [p for p in power_ups if p['pos'] != new_head]
            
            # Spawn new power-ups occasionally
            spawn_power_up()
            
            # Update particles
            for particle in particles[:]:
                if not particle.update():
                    particles.remove(particle)
            
            # Update invincibility timer
            if invincibility_timer > 0:
                invincibility_timer -= 1
                if invincibility_timer == 0:
                    invincible = False

        # Draw everything
        screen.fill(BLACK)
        draw_grid()
        draw_snake(snake, invincible)
        draw_food(food)
        draw_obstacles()
        draw_power_ups()
        draw_particles()
        display_hud(score, level, speed_level)

        if game_over:
            display_game_over(score)

        pygame.display.update()
        clock.tick(speed)

if __name__ == "__main__":
    main()