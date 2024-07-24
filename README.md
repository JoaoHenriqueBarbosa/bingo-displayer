# Real-Time Bingo Displayer

This project is a real-time bingo game displayer built with Next.js and Supabase. It allows for a seamless bingo experience where the game can be managed on one computer and displayed on another.

## Features

- Real-time game updates
- Separate interfaces for game management and display
- Secure login system
- Responsive design for various screen sizes

## Pages

1. **Main Projector** (`/main-projector`)
   - Displays the current game in real-time
   - Ideal for projecting onto a large screen for players to view

2. **Game Projector** (`/game/[id]/projector`)
   - Shows a specific game by ID
   - Useful for reviewing or displaying a particular game

3. **Home Page** (`/`)
   - Displays a list of games
   - Requires user authentication

4. **Check Numbers** (`/game/[id]/check-numbers`)
   - Allows checking numbers for a specific game
   - Displays game details and a number grid

5. **Login** (`/login`)
   - Secure authentication page
   - Provides access to the game management features

## Setup

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Set up your Supabase project and add the necessary environment variables
4. Run the development server with `npm run dev` or `yarn dev`

## Usage

1. Log in using the provided credentials or set up your own admin account
2. Create a new game or select an existing one from the home page
3. Use the check numbers page to manage the current game
4. Open the main projector page on the computer connected to the projector
5. As you update the game, the projector display will update in real-time

## Technologies Used

- Next.js
- React
- Supabase
- TypeScript
- Tailwind CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
