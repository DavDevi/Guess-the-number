import React, { useState, useEffect } from 'react'; // Added useEffect
import './App.css';
import type { Player, Game, GameResult, GameNight, LeaderboardEntry } from './types'; // Added GameNight, LeaderboardEntry
import PlayerForm from './components/PlayerForm';
import PlayerList from './components/PlayerList';
import GameForm from './components/GameForm';
import GameList from './components/GameList';
import StartGameNightForm from './components/StartGameNightForm';
import EnterScoreForm from './components/EnterScoreForm';
import LeaderboardTable from './components/LeaderboardTable'; // Added
import { generateLeaderboard } from './services/leaderboardService'; // Added

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const [allGameNights, setAllGameNights] = useState<GameNight[]>([]); // Added
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // Added

  const [currentGameNightPlayerIds, setCurrentGameNightPlayerIds] = useState<string[]>([]);
  const [isGameNightActive, setIsGameNightActive] = useState<boolean>(false);
  const [currentGameNightResults, setCurrentGameNightResults] = useState<GameResult[]>([]);

  // Effect to update leaderboard if players change (e.g., name update)
  useEffect(() => {
    if(allGameNights.length > 0 || players.length > 0) { // Avoid running if everything is empty
        setLeaderboard(generateLeaderboard(allGameNights, players));
    } else {
        setLeaderboard([]); // Clear leaderboard if no players or game nights
    }
  }, [players, allGameNights]);


  const handleAddPlayer = (player: Player) => {
    setPlayers(prevPlayers => [...prevPlayers, player]);
  };

  const handleAddGame = (game: Game) => {
    setGames(prevGames => [...prevGames, game]);
  };

  const handleStartGameNight = (selectedPlayerIds: string[]) => {
    setCurrentGameNightPlayerIds(selectedPlayerIds);
    setIsGameNightActive(true);
    setCurrentGameNightResults([]);
    alert(`Game night started with ${selectedPlayerIds.length} players!`);
  };

  const handleEndGameNight = () => {
    // Save even if no games played, to record participation for game night history
    // but leaderboard calculation naturally handles no points for 0 results.
    const newGameNight: GameNight = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      playerIds: currentGameNightPlayerIds, // These are the players who *started* the night
      results: currentGameNightResults, // These are the results *recorded*
    };

    setAllGameNights(prevNights => [...prevNights, newGameNight]);
    // generateLeaderboard will be called by useEffect due to allGameNights changing

    setIsGameNightActive(false);
    setCurrentGameNightPlayerIds([]);
    setCurrentGameNightResults([]); // Clear results for the next session
  };

  const handleAddGameResult = (result: GameResult) => {
    setCurrentGameNightResults(prevResults => [...prevResults, result]);
  };

  const getPlayerById = (id: string) => players.find(p => p.id === id);
  const getGameById = (id: string) => games.find(g => g.id === id);

  const participatingPlayersList = currentGameNightPlayerIds.map(id => getPlayerById(id)).filter(p => p !== undefined) as Player[];

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1>Competition Tracker</h1>

        <div>
          <h2>Players</h2>
          <PlayerForm onAddPlayer={handleAddPlayer} />
          <PlayerList players={players} />
        </div>

        <hr />

        <div>
          <h2>Games</h2>
          <GameForm onAddGame={handleAddGame} />
          <GameList games={games} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2>Game Night</h2>
        {!isGameNightActive ? (
          <StartGameNightForm players={players} onStartGameNight={handleStartGameNight} />
        ) : (
          <div>
            <h3>Game Night in Progress!</h3>
            <p><strong>Participants:</strong> {participatingPlayersList.map(p => p.name).join(', ')}</p>

            <EnterScoreForm
              games={games}
              participatingPlayers={participatingPlayersList}
              onAddGameResult={handleAddGameResult}
            />

            {currentGameNightResults.length > 0 && (
              <div>
                <h4>Game Results for this Night:</h4>
                <ul>
                  {currentGameNightResults.map((result, index) => (
                    <li key={index}>
                      <strong>{getGameById(result.gameId)?.name || 'Unknown Game'}:</strong>
                      <ol>
                        {result.playerRankings.map(pr => (
                          <li key={pr.playerId}>
                            {getPlayerById(pr.playerId)?.name || 'Unknown Player'} (Rank: {pr.rank})
                          </li>
                        ))}
                      </ol>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={handleEndGameNight} style={{marginTop: '20px'}}>End Game Night</button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* New column for Leaderboard */}
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
}

export default App;
