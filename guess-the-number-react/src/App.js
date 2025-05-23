import React, { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import GuessControl from './components/GuessControl';
import InfoPanel from './components/InfoPanel';

function App() {
  const [secretNumber, setSecretNumber] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [score, setScore] = useState(20);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState('Start guessing...');
  const [gameWon, setGameWon] = useState(false);

  const generateSecretNumber = () => {
    return Math.trunc(Math.random() * 20) + 1;
  };

  useEffect(() => {
    setSecretNumber(generateSecretNumber());
  }, []);

  useEffect(() => {
    if (gameWon) {
      document.body.style.backgroundColor = '#60b347';
    } else {
      document.body.style.backgroundColor = '#222';
    }
  }, [gameWon]);

  const handleGuessChange = (event) => {
    setCurrentGuess(event.target.value);
  };

  const checkGuess = () => {
    const guess = Number(currentGuess);

    if (!guess) {
      setMessage('❌ No number');
    } else if (guess === secretNumber) {
      setMessage('🎉 Correct number');
      setGameWon(true);
      if (score > highScore) {
        setHighScore(score);
      }
    } else if (guess !== secretNumber) {
      if (score > 1) {
        setMessage(guess > secretNumber ? '📈 Too High' : '📉 Too Low');
        setScore(score - 1);
      } else {
        setMessage('YOU LOSE');
        setScore(0);
      }
    }
  };

  const resetGame = () => {
    setSecretNumber(generateSecretNumber());
    setScore(20);
    setCurrentGuess('');
    setMessage('Start guessing...');
    setGameWon(false);
  };

  return (
    <>
      <Header
        secretNumber={gameWon ? secretNumber : '?'}
        resetGame={resetGame}
        betweenText="(Between 1 and 20)"
      />
      <main>
        <GuessControl
          currentGuess={currentGuess}
          handleGuessChange={handleGuessChange}
          checkGuess={checkGuess}
        />
        <InfoPanel message={message} score={score} highScore={highScore} />
      </main>
    </>
  );
}

export default App;
