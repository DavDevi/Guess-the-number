import React from 'react';

const GuessControl = (props) => {
  return (
    <section className="left">
      <input
        type="number"
        className="guess"
        value={props.currentGuess}
        onChange={props.handleGuessChange}
      />
      <button className="btn check" onClick={props.checkGuess}>Check!</button>
    </section>
  );
};

export default GuessControl;
