import React from 'react';
import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  if (players.length === 0) {
    return <p>No players added yet.</p>;
  }

  return (
    <div>
      <h2>Players</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
