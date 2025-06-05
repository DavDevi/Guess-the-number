import React, { useState } from 'react';
import { Player } from '../types';

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // Simple ID generation for now, consider UUIDs later
    const newPlayer: Player = { id: Date.now().toString(), name };
    onAddPlayer(newPlayer);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter player name"
      />
      <button type="submit">Add Player</button>
    </form>
  );
};

export default PlayerForm;
