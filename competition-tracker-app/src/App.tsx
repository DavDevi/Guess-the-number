import React, { useState } from 'react';
import './App.css';
import { Player, Game, GameResult } from './types'; // Added GameResult
import PlayerForm from './components/PlayerForm';
import PlayerList from './components/PlayerList';
import GameForm from './components/GameForm';
import GameList from './components/GameList';
import StartGameNightForm from './components/StartGameNightForm';
import EnterScoreForm from './components/EnterScoreForm'; // Added

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [currentGameNightPlayerIds, setCurrentGameNightPlayerIds] = useState<string[]>([]);
  const [isGameNightActive, setIsGameNightActive] = useState<boolean>(false);
  const [currentGameNightResults, setCurrentGameNightResults] = useState<GameResult[]>([]); // Added

  const handleAddPlayer = (player: Player) => {
    setPlayers(prevPlayers => [...prevPlayers, player]);
  };

  const handleAddGame = (game: Game) => {
    setGames(prevGames => [...prevGames, game]);
  };

  const handleStartGameNight = (selectedPlayerIds: string[]) => {
    setCurrentGameNightPlayerIds(selectedPlayerIds);
    setIsGameNightActive(true);
    setCurrentGameNightResults([]); // Clear results from previous game night
    alert(`Game night started with ${selectedPlayerIds.length} players!`);
  };

  const handleEndGameNight = () => {
    // Later, this is where we'd persist the game night data & update leaderboard
    console.log('Game Night Ended. Results:', currentGameNightResults);
    setIsGameNightActive(false);
    setCurrentGameNightPlayerIds([]);
    // setCurrentGameNightResults([]); // Keep results for display until next night starts
  };

  const handleAddGameResult = (result: GameResult) => { // Added
    setCurrentGameNightResults(prevResults => [...prevResults, result]);
    console.log('Game Result Added:', result);
  };

  const getPlayerById = (id: string) => players.find(p => p.id === id);
  const getGameById = (id: string) => games.find(g => g.id === id);

  const participatingPlayersList = currentGameNightPlayerIds.map(id => getPlayerById(id)).filter(p => p !== undefined) as Player[];

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ flex: 1 }}>
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

      <div style={{ flex: 1 }}>
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
    </div>
  );
}

export default App;
