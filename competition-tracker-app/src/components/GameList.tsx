import React from 'react';
import type { Game } from '../types';

interface GameListProps {
  games: Game[];
}

const GameList: React.FC<GameListProps> = ({ games }) => {
  if (games.length === 0) {
    return <p>No games added yet.</p>;
  }

  return (
    <div>
      <h2>Games</h2>
      <ul>
        {games.map(game => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
