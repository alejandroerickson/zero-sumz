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
    let currentPlayerIndex = 0;
    let deck, discardPile;
  

    const zeroButton = document.getElementById('zeroButton');
    const playerInfo = document.getElementById('playerInfo');
    let activePlayer = -1; // No player is active initially

    function displayPlayerInfo() {
        playerInfo.innerHTML = ''; // Clear previous player info
        players.forEach((cardsWon, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `Player ${index + 1}: ${cardsWon} cards`;
            playerInfo.appendChild(playerDiv);
        });
    }


    function setupMultiplayerGame() {
      // Create and insert the Play Zero Sumz button
      playButton = document.createElement('button');
      playButton.textContent = 'Play Zero Sumz';
      gameInstructions.appendChild(playButton);
  
      // Create container for player number selection buttons
      playerButtonsContainer = document.createElement('div');
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

      startGameButton.style.display = 'none';
      checkButton.style.display = 'block';
      // Initialize deck and discardPile
      deck = shuffle(generateAllCards());
      discardPile = [];
      dealCards();
      currentPlayerIndex = 0; // Start with player 1
      // Add player indication UI here if desired
      displayPlayerInfo(); // Update player info at the start

    }

    zeroButton.addEventListener('click', () => {
        // Inform the user to select the current player
        alert("Select the current player and their new Zero Sum set.");
    
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
                alert(`Player ${i} is now active. Select your Zero Sum set.`);
                // Hide or remove the active player buttons after selection to prevent re-selection within the same turn
                activePlayerButtonsContainer.style.display = 'none';
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
        if (selectedCardWrappers.length === 0) return;
    
        const selectedCards = selectedCardWrappers.map(wrapper =>
          Array.from(wrapper.children).map(shape => shape.firstChild ? 1 : 0)
        );

    
        if (activePlayer === -1) {
            alert("Please select a player first.");
            return;
        }

        const isValid = verifySelection(selectedCards)
        if (isValid) {
            
          // Move selected cards to discard pile and update player score
          players[currentPlayerIndex] += selectedCards.length;
          displayPlayerInfo(); // Refresh player info display
          discardPile.push(...selectedCards.map(card => card.join('')));
          selectedCardWrappers.forEach(wrapper => wrapper.remove());
    
          // Check if the deck needs to be replenished from the discard pile
          if (deck.length < 7) {
            let remainingCards = generateAllCards().filter(card => !discardPile.includes(card.join('')));
            deck = shuffle([...remainingCards]);
          }
    
          dealCards();
    
          // Move to the next player or end game if deck is exhausted
          if (deck.length === 0) {
            endGame(); // End the game if no cards are left
          } else {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Next player's turn
            // Optionally, update the UI to indicate the current player
          }
        } else {
          alert("Incorrect, try again."); // If the selection does not sum to zero, prompt retry
        }
      });
  

  
    function endGame() {
      const winnerIndex = players.indexOf(Math.max(...players));
      alert(`Congratulations, Player ${winnerIndex + 1} wins with ${players[winnerIndex]} cards!`);
    }
  
    setupMultiplayerGame();
  });
  