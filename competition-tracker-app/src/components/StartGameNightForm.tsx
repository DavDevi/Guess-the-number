import React, { useState } from 'react';
import { Player } from '../types';

interface StartGameNightFormProps {
  players: Player[];
  onStartGameNight: (selectedPlayerIds: string[]) => void;
}

const StartGameNightForm: React.FC<StartGameNightFormProps> = ({ players, onStartGameNight }) => {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  const handlePlayerSelectionChange = (playerId: string) => {
    setSelectedPlayerIds(prevSelectedIds =>
      prevSelectedIds.includes(playerId)
        ? prevSelectedIds.filter(id => id !== playerId)
        : [...prevSelectedIds, playerId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayerIds.length < 2) { // Need at least 2 players for a game
      alert('Please select at least two players for the game night.');
      return;
    }
    onStartGameNight(selectedPlayerIds);
    // Optionally reset selection, or let App manage current game night state
    // setSelectedPlayerIds([]);
  };

  if (players.length === 0) {
    return <p>Please add players before starting a game night.</p>;
  }

  return (
    <div>
      <h2>Start New Game Night</h2>
      <form onSubmit={handleSubmit}>
        <h3>Select Participating Players:</h3>
        {players.map(player => (
          <div key={player.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedPlayerIds.includes(player.id)}
                onChange={() => handlePlayerSelectionChange(player.id)}
              />
              {player.name}
            </label>
          </div>
        ))}
        <button type="submit" disabled={selectedPlayerIds.length < 2}>
          Start Game Night
        </button>
      </form>
    </div>
  );
};

export default StartGameNightForm;
