'use strict';
// console.log(document.querySelector('.message').textContent);

// document.querySelector('.message').textContent = '🎉Correct number!';

// document.querySelector('.number').textContent = 13;

// document.querySelector('.score').textContent = 12;
// document.querySelector('.guess').value = 17;

const secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highScore = score;
// document.querySelector('.number').textContent = secretNumber;

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);

  if (!guess) {
    document.querySelector('.message').textContent = '❌ No number';
  } else if (guess === secretNumber) {
    document.querySelector('.message').textContent = '🎉 Correct number';
    highScore === score;
    document.querySelector('.highscore').textContent = score;
  } else if (guess < secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent = '📉 Too Low';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'YOU LOSE';
      score = 0;
    }
  } else if (guess > secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent = '📈 Too High';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'YOU LOSE';
      score = 0;
    }
  }
});
