import React, { useState } from 'react';

import type { Game } from '../types';

interface GameFormProps {
  onAddGame: (game: Game) => void;
}

const GameForm: React.FC<GameFormProps> = ({ onAddGame }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // Simple ID generation for now
    const newGame: Game = { id: Date.now().toString(), name };
    onAddGame(newGame);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter game name"
      />
      <button type="submit">Add Game</button>
    </form>
  );
};

export default GameForm;
