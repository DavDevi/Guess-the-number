import type { GameNight, Player, LeaderboardEntry, GameResult } from '../types';

// calculateLeaderboardPoints function (as previously defined and verified)
export const calculateLeaderboardPoints = (numberOfPlayers: number, rank: number): number => {
  if (numberOfPlayers <= 1) return 0;
  if (rank < 1 || rank > numberOfPlayers) {
    console.error('Invalid rank provided to calculateLeaderboardPoints');
    return 0;
  }

  let calculatedScore;
  if (numberOfPlayers >= 4) {
    calculatedScore = 2 - (rank - 1); // Base for 5+ players: 2, 1, 0, -1, -2 ...
    if (numberOfPlayers === 4) {
      // Adjust for 4-player case: 2, 1, -1, -2
      if (rank === 3) calculatedScore = -1;
      else if (rank === 4) calculatedScore = -2;
    }
  } else if (numberOfPlayers === 3) {
    calculatedScore = 1 - (rank - 1); // 1, 0, -1
  } else { // numberOfPlayers === 2
    calculatedScore = (rank === 1) ? 1 : -1; // 1, -1
  }
  return calculatedScore;
};

export const generateLeaderboard = (allGameNights: GameNight[], players: Player[]): LeaderboardEntry[] => {
  const leaderboardMap = new Map<string, LeaderboardEntry>();

  // Initialize leaderboard for all players
  players.forEach(player => {
    leaderboardMap.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      score: 0,
      gamesPlayed: 0,
    });
  });

  // Process each game night
  allGameNights.forEach(gameNight => {
    // Iterate over each game result in the game night
    gameNight.results.forEach(gameResult => {
      const numberOfPlayersInGame = gameResult.playerRankings.length;

      // Iterate over each player's ranking in that game result
      gameResult.playerRankings.forEach(ranking => {
        const playerEntry = leaderboardMap.get(ranking.playerId);
        if (playerEntry) {
          const points = calculateLeaderboardPoints(numberOfPlayersInGame, ranking.rank);
          playerEntry.score += points;
          playerEntry.gamesPlayed += 1;
        }
      });
    });
  });

  // Convert map to array and sort by score (descending), then by gamesPlayed (ascending), then by name (ascending)
  return Array.from(leaderboardMap.values()).sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.gamesPlayed !== b.gamesPlayed) {
      return a.gamesPlayed - b.gamesPlayed; // Fewer games played is better for a tie in score
    }
    return a.playerName.localeCompare(b.playerName);
  });
};
