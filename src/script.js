import './style.scss';



document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('cardsContainer');
  const checkButton = document.getElementById('checkButton');
 
  
  // Import images
const shapeImages = [
    require('./assets/1.png'),
    require('./assets/2.png'),
    require('./assets/3.png'),
    require('./assets/4.png'),
    require('./assets/5.png'),
    require('./assets/6.png'),
  ];
  
  // Generate all possible vectors (excluding the all-zero vector)
  const allCards = Array.from({ length: 63 }, (_, i) =>
    Array.from({ length: 6 }, (_, k) => ((i + 1) >> k) & 1).reverse()
  );

  // Shuffle function
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  let deck = shuffle([...allCards]); // Clone and shuffle the allCards array
  let discardPile = [];

  // Function to deal cards
  const dealCards = () => {
    // Clear current cards
    cardsContainer.innerHTML = '';

    // Deal 7 cards or remaining if less than 7
    const hand = deck.splice(0, 7);

    // Render cards
    hand.forEach((card, index) => {
      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('card-wrapper');

      card.forEach((bit, i) => {
        const shapeContainer = document.createElement('div');
        shapeContainer.classList.add('shape');
        if(bit) {
          const img = document.createElement('img'); // Use an <img> element
          img.src = shapeImages[i];
          shapeContainer.appendChild(img);
        }
        cardWrapper.appendChild(shapeContainer);
      });

      cardsContainer.appendChild(cardWrapper);
      cardWrapper.addEventListener('click', () => cardWrapper.classList.toggle('selected'));
    });
  };
  
  // Initial deal
  dealCards();

  checkButton.addEventListener('click', () => {
    const selectedCardWrappers = [...document.querySelectorAll('.card-wrapper.selected')];
    if (selectedCardWrappers.length === 0) return;

    const selectedCards = selectedCardWrappers.map(wrapper => 
      Array.from(wrapper.children).map(shape => shape.firstChild ? 1 : 0)
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

    if (isValid) {
      // Move selected cards to discard pile
      discardPile.push(...selectedCards);
      // Remove selected cards from display and deal new ones
      selectedCardWrappers.forEach(wrapper => wrapper.remove());
      if(deck.length < 7) deck = shuffle([...allCards.filter(card => !discardPile.includes(card))]);
      dealCards();
    } else {
      alert("Incorrect, try again.");
    }
  });
});
