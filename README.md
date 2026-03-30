# KlimCode Agent

An advanced AI coding assistant powered by NVIDIA NIM API integration. This application combines a modern React frontend with an Express backend to provide a seamless coding assistance experience.

## Features

- Real-time chat interface with AI assistant
- Code syntax highlighting for better readability
- Responsive design that works on all devices
- Error handling and loading states
- Clean, modern UI with smooth animations
- Integrated Snake Game for entertainment
- Python-based Snake Game implementation

## Prerequisites

- Node.js (version 16 or higher)
- Python 3.6 or higher
- NVIDIA NIM API key (get one from [NVIDIA Build](https://build.nvidia.com/explore/discover))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your NVIDIA NIM API key:
```bash
cp .env.example .env
# Edit .env to add your API key
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Visit `http://localhost:3000` in your browser
2. Start chatting with the AI assistant by typing your coding questions in the input field
3. The assistant will provide code examples, explanations, and programming help

## Project Structure

```
klimcode-agent/
├── server.js              # Express server
├── src/
│   ├── App.css           # Component styles
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # Entry point
│   └── index.css          # Global styles
├── public/               # Static assets
├── package.json          # Project dependencies
├── src/email_validator.py # Python email validator
├── snake_game.py        # Python Snake Game implementation
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variables template
```

## API Integration

The application integrates with NVIDIA NIM API for advanced AI capabilities. You'll need to:

1. Get an API key from [NVIDIA Build](https://build.nvidia.com/explore/discover)
2. Add it to your `.env` file as `NIM_API_KEY`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run server
```

## Python Snake Game

The repository also includes a Python implementation of the Snake game:

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the game:
```bash
python snake_game.py
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License