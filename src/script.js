import './style.scss';

// Dynamically import images using require
const shapeImages = [
  require('./assets/1.png'),
  require('./assets/2.png'),
  require('./assets/3.png'),
  require('./assets/4.png'),
  require('./assets/5.png'),
  require('./assets/6.png'),
];

document.addEventListener('DOMContentLoaded', () => {
  const gameInstructions = document.getElementById('gameInstructions');
  const cardsContainer = document.getElementById('cardsContainer');
  const checkButton = document.getElementById('checkButton');
  let playButton, playerButtonsContainer, startGameButton;
  let players = [];
  let deck;
  let countdown, timerDisplay, activePlayerButtonsContainer;



  const zeroButton = document.getElementById('zeroButton');
  const playerInfo = document.getElementById('playerInfo');
  const gameInfo = document.getElementById('gameInfo');
  let activePlayer = -1; // No player is active initially

  function displayInfo() {
    playerInfo.innerHTML = ''; // Clear previous player info
    players.forEach((cardsWon, index) => {
      const playerDiv = document.createElement('div');
      playerDiv.textContent = `Player ${index + 1}: ${cardsWon} points`;
      if (index === activePlayer) {
        playerDiv.textContent += " (Active)";
      }
      playerInfo.appendChild(playerDiv);
    });
    gameInfo.textContent = `Cards left: ${deck.length}`;
  }
  let toastId = 0;

  function showToast(message, isError, duration) {
    console.log("showing toast");

    const toast = document.createElement('div');
    toast.className = 'toast ' + (isError ? 'toast-error' : 'toast-message');
    toast.textContent = message;
    toast.id = 'toast' + toastId++; // Add a unique ID to the toast
    toast.style.display = 'none'; // Initially hide the toast
    toastContainer.appendChild(toast);

    toast.style.display = 'block';

    const animationDuration = duration / 1000;
    const fadeinDuration = 0.5;
    const fadeoutDelay = animationDuration - fadeinDuration; 

    toast.style.animation = `fadein ${fadeinDuration}s, fadeout ${fadeinDuration}s ${fadeoutDelay}s`;

    setTimeout(() => {
      console.log("removing toast");
      const toastToRemove = document.getElementById('toast' + --toastId);
      if (toastToRemove) {
        toastContainer.removeChild(toastToRemove);
      }
    }, duration);
  }
  // Function to display messages
  function displayInstructions(message) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
  }


  function setupMultiplayerGame() {
    // Create and insert the Play Zero Sumz button
    playButton = document.createElement('button');
    playButton.textContent = 'Play Zero Sumz';
    gameInstructions.appendChild(playButton);

    // Create container for player number selection buttons
    playerButtonsContainer = document.getElementById('playerSelection');
    gameInstructions.appendChild(playerButtonsContainer);
    for (let i = 1; i <= 6; i++) {
      const playerButton = document.createElement('button');
      playerButton.textContent = i;
      playerButton.addEventListener('click', () => selectNumberOfPlayers(i));
      playerButtonsContainer.appendChild(playerButton);
    }
    playerButtonsContainer.style.display = 'none';

    // Create Start Game button
    startGameButton = document.createElement('button');
    startGameButton.textContent = 'Start Game';
    startGameButton.addEventListener('click', startGame);
    startGameButton.style.display = 'none';
    gameInstructions.appendChild(startGameButton);

    playButton.addEventListener('click', () => {
      playerButtonsContainer.style.display = 'block';
      playButton.style.display = 'none';
    });
  }

  function selectNumberOfPlayers(number) {
    players = new Array(number).fill(0); // Initialize players' scores
    playerButtonsContainer.style.display = 'none';
    startGameButton.style.display = 'block';
  }

  function startGame() {
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('welcomeScreen').style.display = 'none';
    checkButton.style.display = 'none';

    // Auto-select Player 1 if only one player
    if (players.length === 1) {
      activePlayer = 0; // Automatically set Player 1 as active
      zeroButton.style.display = 'none';
      checkButton.style.display = 'block';
      displayInstructions("Select a Zero Sum set and hit \"Verify\".");
    } else {
      zeroButton.style.display = 'block';
      displayInstructions("Hit ZERO when any player sees a Zero Sum set.");
      // Create a container for active player selection buttons
      activePlayerButtonsContainer = document.getElementById('activePlayerButtons');

      // Generate buttons for selecting the active player
      for (let i = 1; i <= players.length; i++) {
        const activePlayerButton = document.createElement('button');
        activePlayerButton.textContent = `Player ${i}`;
        activePlayerButton.onclick = () => {
          activePlayer = i - 1; // Set the active player
          displayInfo();
          displayInstructions(`Player ${i}, show us your Zero Sum set and hit "Verify"!`);
          // Hide or remove the active player buttons after selection to prevent re-selection within the same turn
          activePlayerButtonsContainer.style.display = 'none';
          checkButton.style.display = 'block';
          zeroButton.style.display = 'none'; // Hide ZERO button
          if (players.length > 1) {
            startCountdown();
          }
        };
        activePlayerButtonsContainer.appendChild(activePlayerButton);
      }

      // Initially hide the player buttons
      activePlayerButtonsContainer.style.display = 'none';
    }

    startGameButton.style.display = 'none';
    deck = shuffle(generateAllCards());
    dealCards(true);
    displayInfo();
  }

  cardsContainer.addEventListener('click', (e) => {
    if (activePlayer === -1) {
      showToast("No active player selected.", true, 3000);
      e.stopPropagation(); // Prevent card selection
      return false;
    }
  }, true);

  function startCountdown() {
    let timeLeft = 30;
    timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    countdown = setInterval(() => {
      timeLeft -= 1;
      timerDisplay.textContent = `Time left: ${timeLeft}s`;
      
      if(timeLeft <= 10){
        timerDisplay.style.color = 'red';
      }
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.textContent = '';
        checkButton.click(); // Simulate clicking the verify button
        timerDisplay.style.color = 'white';
      }
    }, 1000);

  }

  zeroButton.addEventListener('click', () => {
    zeroButton.style.display = 'none';
    activePlayerButtonsContainer.style.display = 'block';
  });



  function generateAllCards() {
    // Create an array of length 63
    return Array.from({ length: 63 }, (_, i) =>
      // For each element in the array, create a new array of length 6
      Array.from({ length: 6 }, (_, k) => 
        // For each element in the inner array, calculate a binary value
        // The binary value is calculated by shifting the outer index (i + 1) to the right by the inner index (k)
        // The result is then bitwise ANDed with 1 to get the least significant bit
        ((i + 1) >> k) & 1
      // Reverse the inner array to get the binary representation of (i + 1)
      ).reverse()
    );
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function findZeroSumSet() {
    const cardWrappers = [...cardsContainer.querySelectorAll('.card-wrapper')];
    const cards = cardWrappers.map(wrapper =>
      Array.from(wrapper.children).map(shape => shape.firstChild ? 1 : 0)
    );

    const n = cards.length;
    for (let i = 0; i < (1 << n); i++) {
      let subset = [];
      for (let j = 0; j < n; j++) {
        if (i & (1 << j)) {
          subset.push(cards[j]);
        }
      }
      if (verifySelection(subset)) {
        return subset;
      }
    }
    throw new Error("Zero Sum Set not found!");
  }

  function verifySelection(selectedCards) {
    if (selectedCards.length === 0) {
      return false;
    }

    const sums = selectedCards.reduce((acc, card) => {
      card.forEach((bit, i) => {
        acc[i] = (acc[i] || 0) + bit;
      });
      return acc;
    }, []);

    return sums.every(sum => sum % 2 === 0);
  }

  // Function to render a card
  const renderCard = (cardData) => {
    console.log('rendering card');
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');

    cardData.forEach((bit, i) => {
      const shapeContainer = document.createElement('div');
      shapeContainer.classList.add('shape');
      if (bit) {
        const img = document.createElement('img'); // Use an <img> element
        img.src = shapeImages[i];
        shapeContainer.appendChild(img);
      }
      cardWrapper.appendChild(shapeContainer);
    });

    cardWrapper.addEventListener('click', () => cardWrapper.classList.toggle('selected'));
    return cardWrapper;
  };

  // Function to deal cards
  const dealCards = (isFirstHand = false) => {
    if (isFirstHand) {
      cardsContainer.innerHTML = '';

      const hand = deck.splice(0, 7);

      // Render cards
      hand.forEach((card) => {
        const cardWrapper = renderCard(card);
        cardsContainer.appendChild(cardWrapper);
      });
    } else {
      const cards = Array.from(cardsContainer.getElementsByClassName('card-wrapper'));

      cards.forEach((card) => {
        if (card.classList.contains('selected')) {
          if (deck.length > 0) {
            const newCard = deck.splice(0, 1)[0];

            const cardWrapper = renderCard(newCard);

            cardsContainer.replaceChild(cardWrapper, card);
          } else {
            card.remove();
          }
        }
      });
    }
  };
  checkButton.removeEventListener('click', checkButtonClickHandler);
  checkButton.addEventListener('click', checkButtonClickHandler);

  function checkButtonClickHandler() {
    clearInterval(countdown);
    if (timerDisplay) {
      timerDisplay.textContent = '';
    }

    const selectedCardWrappers = [...cardsContainer.querySelectorAll('.card-wrapper.selected')];

    const selectedCards = selectedCardWrappers.map(wrapper =>
      Array.from(wrapper.children).map(shape => shape.firstChild ? 1 : 0)
    );

    const isValid = verifySelection(selectedCards) || true;
    if (isValid) {
      console.log(`Congratulations, Player ${activePlayer + 1}! You found a Zero Sum Set of size ${selectedCards.length}`);
      showToast(`Congratulations, Player ${activePlayer + 1}! You found a Zero Sum Set of size ${selectedCards.length}`, false, 10000);
      // Move selected cards to discard pile and update player score
      players[activePlayer] += selectedCards.length;
      displayInfo();

      dealCards(false);

    } else {
      players[activePlayer] -= 1;
      showToast(`Sorry, this is not a Zero Sum Set. Select a set of cards with an even number of each type of shape. Player ${activePlayer + 1} loses 1 point.`, true, 3000);
    }

    selectedCardWrappers.forEach(wrapper => wrapper.classList.remove('selected'));
    // Reset active player after verification attempt
    if (players.length != 1) {
      activePlayer = -1;
      checkButton.style.display = 'none';
      zeroButton.style.display = 'block';
      document.getElementById('timerDisplay').textContent = ''; // Clear the timer display
      displayInstructions("Hit ZERO when any player sees a Zero Sum set.");
    } else {
      displayInstructions("Select a Zero Sum set and hit \"Verify\".");
    }

    displayInfo(); // Refresh player info display to reflect score change
    // Move to the next player or end game if deck is exhausted
    if (deck.length === 0) {
      endGame(); // End the game if no cards are left
    }
  }

  function endGame() {
    displayInstructions("Game over! Refresh the page to play again.")
    const winnerIndex = players.indexOf(Math.max(...players));
    showToast(`Congratulations, Player ${winnerIndex + 1} wins with ${players[winnerIndex]} points!`, false, 60000);
    zeroButton.style.display = 'none';
  }

  setupMultiplayerGame();
});
