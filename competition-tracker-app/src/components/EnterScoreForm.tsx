import React, { useState, useEffect } from 'react';
import type { Game, Player, GameResult } from '../types';

interface EnterScoreFormProps {
  games: Game[];
  participatingPlayers: Player[]; // Players in the current game night
  onAddGameResult: (result: GameResult) => void;
}

const EnterScoreForm: React.FC<EnterScoreFormProps> = ({ games, participatingPlayers, onAddGameResult }) => {
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  // Stores rank assignments: { rank: playerId }
  const [rankAssignments, setRankAssignments] = useState<Record<number, string>>({});

  useEffect(() => {
    // Reset ranks if participating players change
    setRankAssignments({});
    setSelectedGameId(games.length > 0 ? games[0].id : '');
  }, [participatingPlayers, games]);

  if (participatingPlayers.length === 0) {
    return <p>No players in the current game night.</p>;
  }

  if (games.length === 0) {
    return <p>No games available. Please add games first.</p>;
  }

  const handleRankChange = (rank: number, playerId: string) => {
    setRankAssignments(prev => {
      const newAssignments = { ...prev };
      // Remove player from other ranks if they were previously assigned
      for (const r in newAssignments) {
        if (newAssignments[r] === playerId) {
          delete newAssignments[r];
        }
      }
      if (playerId) { // If a player is selected (not 'Select...')
        newAssignments[rank] = playerId;
      } else { // If 'Select...' is chosen, clear the rank
        delete newAssignments[rank];
      }
      return newAssignments;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameId) {
      alert('Please select a game.');
      return;
    }

    const numPlayers = participatingPlayers.length;
    const assignedPlayerIds = Object.values(rankAssignments);

    if (assignedPlayerIds.length !== numPlayers || new Set(assignedPlayerIds).size !== numPlayers) {
      alert(`Please assign a unique rank to all ${numPlayers} participating players.`);
      return;
    }

    const playerRankings = participatingPlayers.map(player => {
      const rank = Object.keys(rankAssignments).find(r => rankAssignments[parseInt(r)] === player.id);
      return { playerId: player.id, rank: rank ? parseInt(rank) : 0 }; // Rank should be 1-indexed
    }).filter(pr => pr.rank > 0) // Ensure only ranked players are included
      .sort((a, b) => a.rank - b.rank);

    if (playerRankings.length !== numPlayers) {
        alert('Error in processing ranks. Ensure all players are ranked.');
        return;
    }

    const gameResult: GameResult = {
      gameId: selectedGameId,
      playerRankings: playerRankings,
    };
    onAddGameResult(gameResult);
    // Reset form for next entry
    setRankAssignments({});
    // setSelectedGameId(games.length > 0 ? games[0].id : ''); // Optionally reset game
  };

  const ranks = Array.from({ length: participatingPlayers.length }, (_, i) => i + 1); // 1st, 2nd, ...

  return (
    <div>
      <h3>Enter Game Scores</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="game-select">Select Game:</label>
          <select
            id="game-select"
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
          >
            <option value="">--Select Game--</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>

        <h4>Assign Ranks:</h4>
        {ranks.map(rank => (
          <div key={rank}>
            <label htmlFor={`rank-${rank}`}>{rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} Place:</label>
            <select
              id={`rank-${rank}`}
              value={rankAssignments[rank] || ''}
              onChange={(e) => handleRankChange(rank, e.target.value)}
            >
              <option value="">--Select Player--</option>
              {participatingPlayers.map(player => {
                // Allow selecting a player if they are not already assigned to another rank
                const isAssignedElsewhere = Object.entries(rankAssignments)
                                                .some(([r, pId]) => parseInt(r) !== rank && pId === player.id);
                if (rankAssignments[rank] === player.id || !isAssignedElsewhere) {
                  return <option key={player.id} value={player.id}>{player.name}</option>;
                }
                return null;
              })}
            </select>
          </div>
        ))}

        <button type="submit" style={{ marginTop: '10px' }}>Add Game Result</button>
      </form>
    </div>
  );
};

export default EnterScoreForm;
