import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('cardsContainer');
  const checkButton = document.getElementById('checkButton');

  // Define some emojis as shapes
  const shapes = ['🔵', '🟢', '🔺', '⭐', '🔶', '🟣'];

  // Generate cards (example: 7 cards with up to 6 shapes)
  const cards = Array.from({ length: 7 }, () =>
    Array.from({ length: 6 }, () => Math.round(Math.random()))
  );

  // Render cards
  cards.forEach((card, index) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');

    // Create and append shapes based on the card's bits
    card.forEach((bit, i) => {
      const shape = document.createElement('div');
      shape.classList.add('shape');
      shape.innerHTML = bit ? shapes[i] : '';
      cardWrapper.appendChild(shape);
    });

    cardsContainer.appendChild(cardWrapper);

    // Toggle selection on click
    cardWrapper.addEventListener('click', () => {
      cardWrapper.classList.toggle('selected');
    });
  });

  checkButton.addEventListener('click', () => {
    const selectedCards = [...document.querySelectorAll('.card-wrapper.selected')].map(cardWrapper =>
      Array.from(cardWrapper.children).map(shape => shapes.indexOf(shape.innerHTML) !== -1 ? 1 : 0)
    );

    // Sum columns of selected cards
    const sums = selectedCards.reduce((acc, card) => {
      card.forEach((bit, i) => {
        acc[i] = (acc[i] || 0) + bit;
      });
      return acc;
    }, []);

    // Check if all sums are even
    const isValid = sums.every(sum => sum % 2 === 0);

    alert(isValid ? "Correct selection!" : "Incorrect, try again.");
  });
});
