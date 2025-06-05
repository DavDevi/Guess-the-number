import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return <p>No leaderboard data available yet. Complete a game night to see results!</p>;
  }

  return (
    <div>
      <h2>Leaderboard</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Rank</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Player Name</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Score</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Games Played</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.playerId}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{entry.playerName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{entry.score}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{entry.gamesPlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
