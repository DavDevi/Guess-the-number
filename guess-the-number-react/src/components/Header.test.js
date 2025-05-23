import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  test('renders the title "Guess My Number!"', () => {
    render(<Header />);
    expect(screen.getByText(/Guess My Number!/i)).toBeInTheDocument();
  });

  test('displays the "between" text passed as a prop', () => {
    const betweenText = "(Between 1 and 50)";
    render(<Header betweenText={betweenText} />);
    expect(screen.getByText(betweenText)).toBeInTheDocument();
  });

  test('displays the number (or "?") passed as a prop', () => {
    render(<Header secretNumber="10" />);
    expect(screen.getByText("10")).toBeInTheDocument();

    render(<Header secretNumber="?" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  test('the "Again!" button is present and calls the resetGame prop function when clicked', () => {
    const mockResetGame = jest.fn();
    render(<Header resetGame={mockResetGame} />);
    const againButton = screen.getByText(/Again!/i);
    expect(againButton).toBeInTheDocument();
    fireEvent.click(againButton);
    expect(mockResetGame).toHaveBeenCalledTimes(1);
  });
});
