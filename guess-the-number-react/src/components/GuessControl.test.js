import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuessControl from './GuessControl';

describe('GuessControl Component', () => {
  test('input field value is controlled by currentGuess prop', () => {
    render(<GuessControl currentGuess="15" />);
    const inputElement = screen.getByRole('spinbutton'); // type="number"
    expect(inputElement.value).toBe("15");
  });

  test('typing in the input calls handleGuessChange prop function', () => {
    const mockHandleGuessChange = jest.fn();
    render(<GuessControl handleGuessChange={mockHandleGuessChange} />);
    const inputElement = screen.getByRole('spinbutton');
    fireEvent.change(inputElement, { target: { value: '10' } });
    expect(mockHandleGuessChange).toHaveBeenCalledTimes(1);
  });

  test('clicking the "Check!" button calls checkGuess prop function', () => {
    const mockCheckGuess = jest.fn();
    render(<GuessControl checkGuess={mockCheckGuess} />);
    const checkButton = screen.getByText(/Check!/i);
    fireEvent.click(checkButton);
    expect(mockCheckGuess).toHaveBeenCalledTimes(1);
  });
});
