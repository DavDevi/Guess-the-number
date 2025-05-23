# Guess My Number! (React Version)

This is a simple "Guess My Number" game implemented in React. The game randomly selects a number between 1 and 20, and the player has to guess it. The game provides feedback on whether the guess is too high or too low and keeps track of the score and high score.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Installation & Running

1.  **Navigate to the React app directory:**
    ```bash
    cd guess-the-number-react
    ```

2.  **Install NPM packages:**
    This will install all the necessary dependencies for the React application.
    ```bash
    npm install
    ```

3.  **Run the application in development mode:**
    This will open the app at [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits.
    ```bash
    npm start
    ```

4.  **Run the tests:**
    This will launch the test runner in interactive watch mode.
    ```bash
    npm test
    ```

## Game Rules

- The computer will pick a secret number between 1 and 20.
- You need to guess what this number is.
- After each guess, the game will tell you if your guess was too high or too low.
- Your score starts at 20 and decreases with each wrong guess.
- If you guess the number correctly, your current score is recorded.
- The game keeps track of the highest score achieved.
- You can click the "Again!" button to reset the game and play again with a new secret number.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and then modified.
