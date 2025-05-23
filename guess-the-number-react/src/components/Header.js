import React from 'react';

const Header = (props) => {
  return (
    <header>
      <h1>Guess My Number!</h1>
      <p className="between">{props.betweenText}</p>
      <button className="btn again" onClick={props.resetGame}>Again!</button>
      <div className="number">{props.secretNumber}</div>
    </header>
  );
};

export default Header;
