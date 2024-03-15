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
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;

        // Add shapes based on the card vector
        cardElement.innerHTML = card.map((bit, i) => bit ? shapes[i] : '').join('');
        cardsContainer.appendChild(cardElement);

        cardElement.addEventListener('click', () => {
            cardElement.classList.toggle('selected');
        });
    });

    checkButton.addEventListener('click', () => {
        // Gather selected cards
        const selectedCards = [...document.querySelectorAll('.selected')].map(el =>
            cards[el.dataset.index]
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
