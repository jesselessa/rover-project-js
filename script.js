// Constants
const MIN_GRID_SIZE = 8;
const MAX_GRID_SIZE = 10;

// Select game elements
const startButton = document.querySelector("#start");
const grid = document.querySelector("#board-grid");
const arrowGrid = document.querySelector("#arrow-grid");
const arrowButtons = document.querySelectorAll(".arrow");
const resetButton = document.createElement("div");
const roverInfo = document.querySelector("#rover-info");
const alienImg = document.querySelector(".alien");

// Set rover object
const rover = {
  direction: "N",
  x: 0, // x = row index
  y: 0, // y = column index
};

// Other global variables
let gameStarted;
let alienFound = false;
let timerId;
let timerPaused = false;

// Display initial grid on loading page
displayInitialGrid();

function displayInitialGrid() {
  initGrid();
  updateGridAndInfo(rover.x, rover.y);
  randomlyHideAlien();
}

// Handle click on start button
startButton.addEventListener("click", () => {
  gameStarted = true;
  startTimer();
});

function startTimer() {
  if (timerPaused) return; // If timer is paused, do nothing

  timerId = setTimeout(() => {
    if (!alienFound) {
      openModalAlert(
        "GAME OVER</br>You didn't find the alien within the deadline &#128125&nbsp;!"
      );

      resetGridAndInfo();

      // End game
      gameStarted = false;
    }
  }, 30000);
}

// Randomly hide alien image under a grid cell
function randomlyHideAlien() {
  const cells = document.querySelectorAll(".cell");
  const randomIndex = Math.floor(Math.random() * cells.length);

  cells.forEach((cell, index) => {
    if (index === randomIndex) {
      cell.classList.add("has-alien");
    }
  });
}

// Get grid size depending on screen width
function getGridSize() {
  return window.innerWidth <= 485 ? MIN_GRID_SIZE : MAX_GRID_SIZE;
}

// Generate grid
function initGrid() {
  const gridSize = getGridSize();

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
    }
  }
}

// Update grid with rover position
function updateGrid() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.textContent = ""));

  // Calculate index of cell depending on rover current position
  const gridSize = getGridSize();
  const roverCellIndex = rover.x * gridSize + rover.y;
  const roverCell = cells[roverCellIndex];
  roverCell.textContent = rover.direction;

  // Check if rover is on a cell with alien
  if (roverCell.classList.contains("has-alien")) {
    alienFound = true; // User won

    // Display image
    roverCell.innerHTML =
      '<img src="./images/alien.png" class="alien" alt="alien" />';

    // Clear existing timer
    clearTimeout(timerId);

    openModalAlert(
      `CONGRATULATIONS</br>You've found an alien on Mars at position ${rover.x}/${rover.y} &#128125&#127881&nbsp;!`
    );

    // End game
    gameStarted = false;

    // // Call resetGridAndInfo after 5 seconds
    // setTimeout(() => resetGridAndInfo(), 5000);
  }
}

// Update rover information
function updateRoverInfo() {
  roverInfo.innerHTML = `
        <p>CURRENT POSITION AND DIRECTION&nbsp;:</p>
        <p>- <span>Position :</span> ${rover.x}/${rover.y}</p>
        <p>- <span>Direction :</span> ${rover.direction}</p>
      `;
}

// Update grid and info
function updateGridAndInfo(indexRow, indexColumn) {
  const gridSize = getGridSize();

  const isValidMove =
    indexRow >= 0 &&
    indexRow < gridSize &&
    indexColumn >= 0 &&
    indexColumn < gridSize;

  if (isValidMove) {
    updateGrid();
    updateRoverInfo();
  }
}

// Handle rover moves with arrow buttons
arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList[1]; // Extracts direction from 2nd class on button (1st one being 'arrow')
    pilotrover(direction.charAt(0)); // First letter of direction
  });
});

// Reset grid and info
resetButton.classList.add("reset");
resetButton.textContent = "R";
arrowGrid.append(resetButton);

const resetGridAndInfo = () => {
  // Neutralize reset button if game has not started
  if (!gameStarted) {
    openModalAlert("Click on 'Start Game' to start piloting the rover.");
    return;
  }

  // Initialize rover position and direction
  rover.x = 0;
  rover.y = 0;
  rover.direction = "N";

  updateGridAndInfo(rover.x, rover.y);
  randomlyHideAlien();
};

// Handle click on reset button
resetButton.addEventListener("click", resetGridAndInfo);

// rover directions and moves
function turnLeft() {
  switch (rover.direction) {
    case "N":
      rover.direction = "W";
      break;
    case "W":
      rover.direction = "S";
      break;
    case "S":
      rover.direction = "E";
      break;
    case "E":
      rover.direction = "N";
      break;
    default:
      return;
  }
}

function turnRight() {
  switch (rover.direction) {
    case "N":
      rover.direction = "E";
      break;
    case "E":
      rover.direction = "S";
      break;
    case "S":
      rover.direction = "W";
      break;
    case "W":
      rover.direction = "N";
      break;
    default:
      return;
  }
}

function moveForward(rover) {
  const gridSize = getGridSize();

  switch (rover.direction) {
    case "N":
      if (rover.x === 0) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "E":
      if (rover.y === gridSize - 1) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    case "S":
      if (rover.x === gridSize - 1) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.x++;
      break;

    case "W":
      if (rover.y === 0) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.y--;
      break;

    default:
      return;
  }
}

function moveBackward(rover) {
  const gridSize = getGridSize();

  switch (rover.direction) {
    case "N":
      if (rover.x === gridSize - 1) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.x++;
      break;

    case "E":
      if (rover.y === 0) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.y--;
      break;

    case "S":
      if (rover.x === 0) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "W":
      if (rover.y === gridSize - 1) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    default:
      return;
  }
}

// rover driving
function pilotrover(move) {
  // Neutralize arrow buttons if game has not started
  if (!gameStarted) {
    openModalAlert("Click on 'Start Game' to start piloting the rover.");
    return;
  }

  switch (move) {
    case "l":
      turnLeft();
      break;

    case "r":
      turnRight();
      break;

    case "f":
      moveForward(rover);
      break;

    case "b":
      moveBackward(rover);
      break;

    default:
      return;
  }

  updateGridAndInfo(rover.x, rover.y);
}

// Add year to footer
const year = document.querySelector(".year");
const date = new Date().getFullYear();
year.append(date);

// Handle alert message
const modalContainer = document.querySelector("#modal-container");
const alertMessage = document.querySelector(".alert-message");
const closeButtons = document.querySelectorAll(".close-button");

function openModalAlert(message) {
  modalContainer.style.display = "block";
  alertMessage.innerHTML = message;
  timerPaused = true; // Pause timer

  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModalAlert)
  );
}

function closeModalAlert() {
  modalContainer.style.display = "none";
  timerPaused = false; // Resume timer
}

// Handle orientation change depending on screen width
function handleOrientationChange() {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isSmallScreen = window.innerWidth <= 1000;

  if (isLandscape && isSmallScreen) {
    // Custom modal
    closeButtons.forEach((button) => (button.style.display = "none"));
    alertMessage.style.marginBottom = "0";

    openModalAlert("Landscape mode is not allowed.");
    // Force portrait mode
    screen.orientation.lock("portrait");
  } else {
    // Custom modal
    closeButtons.forEach((button) => (button.style.display = "block"));
    alertMessage.style.marginBottom = "20px";

    // In portrait mode, close modal
    closeModalAlert();
  }
}

window.addEventListener("orientationchange", handleOrientationChange);
// Force message to appear as soon as screen width changes
window.addEventListener("resize", handleOrientationChange);

// Handle background music
const backgroundMusic = document.querySelector("#background-music");
const toggleDiv = document.querySelector("#toggle");
const toggleMusicBtn = document.querySelector("#toggle-music");
const caption = document.querySelector("figcaption");

function handleMusicBg() {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    toggleMusicBtn.src = "./images/sound-off.png";
    updateCaption();
  } else {
    backgroundMusic.pause();
    toggleMusicBtn.src = "./images/sound-on.png";
    updateCaption();
  }
}

function updateCaption() {
  if (window.innerWidth <= 700) {
    caption.textContent = "";
  } else {
    caption.textContent = backgroundMusic.paused ? "Sound on" : "Sound off";
  }
}
updateCaption(); // Actualize caption on loading page

toggleDiv.addEventListener("click", handleMusicBg);
window.addEventListener("resize", updateCaption);
