import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mocking Math.random to control the secret number
let mockMathRandom;

beforeEach(() => {
  // Default mock: always returns 0.5, so secretNumber will be 10+1 = 11
  // (Math.trunc(0.5 * 20) + 1 = 10 + 1 = 11)
  mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
  mockMathRandom.mockRestore();
});

describe('App Component - Game Logic', () => {
  test('initial render: displays default elements and values', () => {
    render(<App />);
    // Header content
    expect(screen.getByText('Guess My Number!')).toBeInTheDocument();
    expect(screen.getByText('(Between 1 and 20)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Again!/i })).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument(); // Initial secret number display

    // GuessControl content
    expect(screen.getByRole('spinbutton')).toBeInTheDocument(); // Input field
    expect(screen.getByRole('button', { name: /Check!/i })).toBeInTheDocument();

    // InfoPanel content
    expect(screen.getByText('Start guessing...')).toBeInTheDocument(); // Initial message
    expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('20'); // Initial score
    expect(screen.getByText(/🥇 Highscore:/i)).toHaveTextContent('0'); // Initial highscore
    expect(document.body).toHaveStyle('background-color: #222');
  });

  test('input validation: shows "No number" message for empty guess', () => {
    render(<App />);
    const checkButton = screen.getByRole('button', { name: /Check!/i });
    fireEvent.click(checkButton);
    expect(screen.getByText('❌ No number')).toBeInTheDocument();
  });

  describe('Guessing Logic (secretNumber is 11 due to mock)', () => {
    test('guess too high', () => {
      render(<App />);
      const guessInput = screen.getByRole('spinbutton');
      const checkButton = screen.getByRole('button', { name: /Check!/i });

      fireEvent.change(guessInput, { target: { value: '15' } });
      fireEvent.click(checkButton);

      expect(screen.getByText('📈 Too High')).toBeInTheDocument();
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('19'); // Score decreases
    });

    test('guess too low', () => {
      render(<App />);
      const guessInput = screen.getByRole('spinbutton');
      const checkButton = screen.getByRole('button', { name: /Check!/i });

      fireEvent.change(guessInput, { target: { value: '5' } });
      fireEvent.click(checkButton);

      expect(screen.getByText('📉 Too Low')).toBeInTheDocument();
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('19');
    });

    test('correct guess', () => {
      render(<App />);
      const guessInput = screen.getByRole('spinbutton');
      const checkButton = screen.getByRole('button', { name: /Check!/i });

      fireEvent.change(guessInput, { target: { value: '11' } }); // Mocked secret number
      fireEvent.click(checkButton);

      expect(screen.getByText('🎉 Correct number')).toBeInTheDocument();
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('20'); // Score remains 20 for first correct guess
      expect(screen.getByText(/🥇 Highscore:/i)).toHaveTextContent('20'); // Highscore updates
      expect(screen.getByText('11')).toBeInTheDocument(); // Secret number revealed
      expect(document.body).toHaveStyle('background-color: #60b347'); // Background changes
    });

    test('score decreases and highscore updates correctly across multiple games', () => {
      render(<App />);
      const guessInput = screen.getByRole('spinbutton');
      const checkButton = screen.getByRole('button', { name: /Check!/i });
      const againButton = screen.getByRole('button', { name: /Again!/i });

      // Game 1: Win with score 18 (secretNumber is 11)
      fireEvent.change(guessInput, { target: { value: '5' } }); // Too low
      fireEvent.click(checkButton); // Score: 19
      fireEvent.change(guessInput, { target: { value: '15' } }); // Too high
      fireEvent.click(checkButton); // Score: 18
      fireEvent.change(guessInput, { target: { value: '11' } }); // Correct
      fireEvent.click(checkButton); // Score: 18, Highscore: 18
      expect(screen.getByText('🎉 Correct number')).toBeInTheDocument();
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('18');
      expect(screen.getByText(/🥇 Highscore:/i)).toHaveTextContent('18');

      // Reset game - Math.random will be called again, still mocked to 0.5 (secretNumber 11)
      fireEvent.click(againButton);

      // Game 2: Win with score 20 (secretNumber is 11)
      fireEvent.change(guessInput, { target: { value: '11' } }); // Correct on first try
      fireEvent.click(checkButton); // Score: 20, Highscore: 20 (new highscore)
      expect(screen.getByText('🎉 Correct number')).toBeInTheDocument();
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('20');
      expect(screen.getByText(/🥇 Highscore:/i)).toHaveTextContent('20');

      // Reset game
      fireEvent.click(againButton);
       // Game 3: Win with score 19 (secretNumber is 11)
      fireEvent.change(guessInput, { target: { value: '1' } }); 
      fireEvent.click(checkButton); // Score: 19
      fireEvent.change(guessInput, { target: { value: '11' } }); // Correct
      fireEvent.click(checkButton); // Score: 19, Highscore should remain 20
      expect(screen.getByText('🎉 Correct number')).toBeInTheDocument();
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('19');
      expect(screen.getByText(/🥇 Highscore:/i)).toHaveTextContent('20'); // Highscore remains 20
    });
  });

  test('reset functionality ("Again!" button)', () => {
    render(<App />);
    const guessInput = screen.getByRole('spinbutton');
    const checkButton = screen.getByRole('button', { name: /Check!/i });
    const againButton = screen.getByRole('button', { name: /Again!/i });

    // Win the game first (secretNumber is 11)
    fireEvent.change(guessInput, { target: { value: '11' } });
    fireEvent.click(checkButton);
    expect(screen.getByText('🎉 Correct number')).toBeInTheDocument();
    expect(document.body).toHaveStyle('background-color: #60b347');
    expect(screen.getByText('11')).toBeInTheDocument(); // Number revealed

    // Click "Again!"
    // We need to ensure Math.random is called for the new secret number
    // It will still return 0.5, so new secret number will be 11 again
    mockMathRandom.mockReturnValueOnce(0.2); // Let's make the next number different: Math.trunc(0.2*20)+1 = 5
    
    act(() => {
        fireEvent.click(againButton);
    });


    // Verify reset state
    expect(screen.getByText('Start guessing...')).toBeInTheDocument();
    expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('20');
    // Highscore should persist
    expect(screen.getByText(/🥇 Highscore:/i)).toHaveTextContent('20');
    expect(guessInput.value).toBe(''); // Input field cleared
    expect(screen.getByText('?')).toBeInTheDocument(); // Secret number hidden
    expect(document.body).toHaveStyle('background-color: #222'); // Background reset

    // Test with the new secret number (5)
    fireEvent.change(guessInput, { target: { value: '5' } });
    fireEvent.click(checkButton);
    expect(screen.getByText('🎉 Correct number')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); 
  });

   test('losing the game', () => {
    render(<App />);
    const guessInput = screen.getByRole('spinbutton');
    const checkButton = screen.getByRole('button', { name: /Check!/i });

    // secretNumber is 11
    // Make 20 wrong guesses to lose
    for (let i = 0; i < 19; i++) {
      fireEvent.change(guessInput, { target: { value: '1' } }); // A wrong guess
      fireEvent.click(checkButton);
      expect(screen.getByText(/💯 Score:/i)).toHaveTextContent(`${20 - (i + 1)}`);
    }
    
    // Final wrong guess to make score 0
    fireEvent.change(guessInput, { target: { value: '1' } });
    fireEvent.click(checkButton);
    
    expect(screen.getByText('YOU LOSE')).toBeInTheDocument();
    expect(screen.getByText(/💯 Score:/i)).toHaveTextContent('0');
  });
});
