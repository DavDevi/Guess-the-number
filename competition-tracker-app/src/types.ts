export interface Player {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
}

export interface GameResult {
  gameId: string;
  // Stores player ID and their rank in this game for the game night
  // Lower rank is better (e.g., 1st, 2nd, 3rd)
  playerRankings: { playerId: string; rank: number }[];
}

export interface GameNight {
  id: string;
  date: string; // ISO string format for simplicity
  playerIds: string[]; // List of IDs of players who participated
  results: GameResult[]; // Results of games played during the night
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string; // For easier display
  score: number;
  gamesPlayed: number;
}
