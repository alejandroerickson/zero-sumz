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
    const gameContainer = document.getElementById('gameContainer')
    let playButton, playerButtonsContainer, startGameButton;
    let players = [];
    let deck, discardPile;
  
    

    const zeroButton = document.getElementById('zeroButton');
    const playerInfo = document.getElementById('playerInfo');
    let activePlayer = -1; // No player is active initially

    function displayPlayerInfo() {
        playerInfo.innerHTML = ''; // Clear previous player info
        players.forEach((cardsWon, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `Player ${index + 1}: ${cardsWon} points`;
            if (index === activePlayer) {
                playerDiv.textContent += " (Active)";
            }
            playerInfo.appendChild(playerDiv);
        });
    
        // Display "None" if no active player
        if (activePlayer === -1) {
            const noActivePlayerDiv = document.createElement('div');
            noActivePlayerDiv.textContent = "Active Player: None";
            playerInfo.appendChild(noActivePlayerDiv);
        }
    }
    function showToast(message, isError = false, duration = 3000) {
       const toastContainer = document.getElementById('toastContainer');// || createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast ' + (isError ? 'toast-error' : 'toast-message');
        toast.textContent = message;
        toastContainer.appendChild(toast);
        toast.style.display = 'block';
    
        setTimeout(() => {
            toast.style.display = 'none';
            toastContainer.removeChild(toast);
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
        } else{
            displayInstructions("Hit ZERO when any player sees a Zero Sum set.");
        }
      startGameButton.style.display = 'none';
      // Initialize deck and discardPile
      deck = shuffle(generateAllCards());
      discardPile = [];
      dealCards();
      // Add player indication UI here if desired
      displayPlayerInfo(); // Update player info at the start

    }

    cardsContainer.addEventListener('click', (e) => {
        if (activePlayer === -1) {
            showToast("No active player selected.", 3000);
            e.stopPropagation(); // Prevent card selection
            return false;
        }
    }, true);
    
    function startCountdown() {
        let timeLeft = 10;
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        
        const countdown = setInterval(() => {
            timeLeft -= 1;
            timerDisplay.textContent = `Time left: ${timeLeft}s`;
    
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerDisplay.textContent = '';
                checkButton.click(); // Simulate clicking the verify button
            }
        }, 1000);
        
        checkButton.addEventListener('click', () =>{
            if (selectedCardWrappers.length > 0) {
  
            clearInterval(countdown);
            timerDisplay.textContent = '';
            }
        });
    }


    
    zeroButton.addEventListener('click', () => {
        // Inform the user to select the current player
        displayInstructions("Select the Player that claims a Zero Sum Set.");

        // Create or clear a container for active player selection buttons
        let activePlayerButtonsContainer = document.getElementById('activePlayerButtons');
        if (!activePlayerButtonsContainer) {
            activePlayerButtonsContainer = document.createElement('div');
            activePlayerButtonsContainer.id = 'activePlayerButtons';
            gameContainer.appendChild(activePlayerButtonsContainer);
        } else {
            activePlayerButtonsContainer.innerHTML = ''; // Clear existing buttons if any
        }
    
        // Generate buttons for selecting the active player
        for (let i = 1; i <= players.length; i++) {
            const activePlayerButton = document.createElement('button');
            activePlayerButton.textContent = `Player ${i}`;
            activePlayerButton.onclick = () => {
                activePlayer = i - 1; // Set the active player
                displayPlayerInfo();
                displayInstructions(`Player ${i}, show us your Zero Sum set and hit "Verify"!`);
                // Hide or remove the active player buttons after selection to prevent re-selection within the same turn
                activePlayerButtonsContainer.style.display = 'none';
                checkButton.style.display = 'block';
                giveUpButton.style.display = 'none'; // Show give up option during countdown
                zeroButton.style.display = 'none'; // Hide ZERO button
                if (players.length > 1) {
                    startCountdown();
                }
            };
            activePlayerButtonsContainer.appendChild(activePlayerButton);
        }

        // Make sure the container is visible
        activePlayerButtonsContainer.style.display = 'block';
    });
    

  
    function generateAllCards() {
      return Array.from({ length: 63 }, (_, i) =>
        Array.from({ length: 6 }, (_, k) => ((i + 1) >> k) & 1).reverse()
      );
    }
  
    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  
    function verifySelection(selectedCards) {
        const sums = selectedCards.reduce((acc, card) => {
          card.forEach((bit, i) => {
            acc[i] = (acc[i] || 0) + bit;
          });
          return acc;
        }, []);
    
        return sums.every(sum => sum % 2 === 0);
      }
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

  

    checkButton.addEventListener('click', () => {
        const selectedCardWrappers = [...cardsContainer.querySelectorAll('.card-wrapper.selected')];
        
        if (selectedCardWrappers.length === 0) {
            showToast("Please select cards first.", true);
            return;
        }

        const selectedCards = selectedCardWrappers.map(wrapper =>
          Array.from(wrapper.children).map(shape => shape.firstChild ? 1 : 0)
        );

        const isValid = verifySelection(selectedCards)
        if (isValid) {
            showToast(`Congratulations, Player ${activePlayer+1}! You found a Zero Sum Set of size ${selectedCards.length}`, false, 10000);
            // Move selected cards to discard pile and update player score
          players[activePlayer] += selectedCards.length;
          displayPlayerInfo(); // Refresh player info display
          discardPile.push(...selectedCards.map(card => card.join('')));
          selectedCardWrappers.forEach(wrapper => wrapper.remove());
    
          // Check if the deck needs to be replenished from the discard pile
          if (deck.length < 7) {
            let remainingCards = generateAllCards().filter(card => !discardPile.includes(card.join('')));
            deck = shuffle([...remainingCards]);
          }


          dealCards();
    
        } else {
            players[activePlayer] -= 1;
            showToast(`Sorry, this is not a Zero Sum Set. Select a set of cards with an even number of each type of shape. Player ${activePlayer+1} loses 1 point.`, true);
        }
    // Deselect all selected cards
    selectedCardWrappers.forEach(wrapper => wrapper.classList.remove('selected'));
              // Reset active player after verification attempt
              if (players.length != 1) {
                activePlayer = -1; 
                checkButton.style.display = 'none';
                zeroButton.style.display = 'block'; // Hide ZERO button
                document.getElementById('timerDisplay').textContent = ''; // Clear the timer display
                displayInstructions("Hit ZERO when any player sees a Zero Sum set.");
            } else{
            displayInstructions("Select a Zero Sum set and hit \"Verify\".");
        }
        giveUpButton.style.display = 'block';

        displayPlayerInfo(); // Refresh player info display to reflect score change
           // Move to the next player or end game if deck is exhausted
           if (deck.length === 0) {
            endGame(); // End the game if no cards are left
          } 
    });
  

  
    function endGame() {
      const winnerIndex = players.indexOf(Math.max(...players));
        showToast(`Congratulations, Player ${winnerIndex + 1} wins with ${players[winnerIndex]} cards!`, false, 60000);
    }
  
    setupMultiplayerGame();
  });
  