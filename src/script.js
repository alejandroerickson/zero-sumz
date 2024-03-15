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

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `card-${index}`;
        checkbox.classList.add('card-checkbox');

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.classList.add('card');
        label.innerHTML = card.map((bit, i) => bit ? shapes[i] : '').join('');

        cardWrapper.appendChild(checkbox);
        cardWrapper.appendChild(label);
        cardsContainer.appendChild(cardWrapper);
    });

    checkButton.addEventListener('click', () => {
        // Gather selected cards based on checkboxes
        const selectedCardsIndices = [...document.querySelectorAll('.card-checkbox:checked')].map(cb => cb.id.replace('card-', ''));
        const selectedCards = selectedCardsIndices.map(index => cards[index]);

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
