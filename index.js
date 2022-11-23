/*
TODO
- [x] Hide top buttons on main menu.
- Separate code into files.
- Remake game functionality:
  Connect 4 discs, either horizontal, vertical o diagonal. The discs MUST BEEN DROPPED FROM THE TOP.
*/

const root = document.getElementById("root");

const discSize = 50; // pixels
const timePerTurn = 30; // seconds
const players = {
  one: "1",
  two: "2",
};
const initialTurn = players.one;
let playerWithTurn = initialTurn;
let currentTurnTimer;
let currentTurnTimeout;
let validDiscs;

// Render
const discsPerRow = 7;
const columns = 7;
const rows = 6;
const discAmount = discsPerRow * rows;

/**
 * Handles the application initialization.
 */
function init() {
  renderMenu();
  handleEvents();
}
init();

/**
 * Handles the game render.
 * @param {string} mode - The game mode to use.
 */
function renderGame(mode) {
  renderGameWrapper();
  renderGameHeader();
  renderPlayers();
  renderColumns(columns);
  renderArrow();
  renderTurnBox();
}

/**
 * Create an arrow with default position in board top position.
 * @returns The created arrow element.
 */
function createArrow() {
  const board = document.getElementById("board");
  const boardPosition = board.getBoundingClientRect();
  const arrow = new Image();
  arrow.setAttribute("src", "./src/images/arrow-down.svg");
  arrow.classList.add("arrow");
  arrow.setAttribute("id", "arrow");
  arrow.style.top = Math.round(boardPosition.top) - discSize / 2 + "px";
  return arrow;
}

/**
 * Displays the created arrow in the board.
 */
function renderArrow() {
  const board = document.getElementById("board");
  const arrow = createArrow();
  board.appendChild(arrow);
}

/**
 * Moves the rendered arrow to the position of the disc passed.
 * @param {HTMLElement} disc - A disc to take its position and assign it to the arrow.
 */
function moveArrow(disc) {
  const discPosition = disc.getBoundingClientRect();
  const arrow = document.getElementById("arrow");
  arrow.style.top = Math.round(discPosition.top);
  arrow.style.left = Math.round(discPosition.left) + "px";
}

/**
 * Create a menu button.
 * @param {string} text - Text to use in the button.
 * @returns The button element.
 */
function createMenuButton(text) {
  if (!text) {
    throw new Error("a text must be provided for the button.");
  }
  const button = document.createElement("button");
  button.classList.add("menu-button");
  const buttonText = document.createTextNode(text);
  button.appendChild(buttonText);
  return button;
}

/**
 * Create all menu buttons.
 * @returns The button wrapper element.
 */
function createMenuButtons() {
  const wrapper = document.createElement("div");
  const playCPU = createMenuButton("Play vs CPU");
  const playPlayer = createMenuButton("Play vs Player");
  const gameRules = createMenuButton("Game rules");

  wrapper.classList.add("menu-buttons");
  playCPU.classList.add("primary");
  playCPU.setAttribute("id", "play-vs-cpu-button");
  playPlayer.classList.add("secondary");
  playPlayer.setAttribute("id", "play-vs-player-button");
  gameRules.setAttribute("id", "game-rules-button");

  wrapper.append(playCPU, playPlayer, gameRules);
  return wrapper;
}

/**
 * Displays the menu on screen and hide the game.
 */
function showMenu() {
  stopGame();
  const gameWrapper = document.getElementById("game");
  gameWrapper.remove();
  renderMenu();
}

/**
 * Displays the game layout on screen and hide the menu.
 * @param {string} mode - Game mode for the renderGame function.
 */
function showGame(mode) {
  const menu = document.getElementById("menu");
  menu.remove();
  renderGame(mode);
}

/**
 * Displays the menu on screen.
 */
function renderMenu() {
  const menuWrapper = document.createElement("div");
  const menuButtons = createMenuButtons();
  menuWrapper.setAttribute("id", "menu");
  menuWrapper.classList.add("menu");
  menuWrapper.appendChild(menuButtons);
  root.appendChild(menuWrapper);
}

/**
 * Manage what happens with each event in the application.
 */
function handleEvents() {
  document.addEventListener("click", ({ target }) => {
    // Menu
    const playCPUButton = document.getElementById("play-vs-cpu-button");
    const playPlayerButton = document.getElementById("play-vs-player-button");
    const gameRulesButton = document.getElementById("game-rules-button");

    // Game
    const menuButton = document.getElementById("menu-button");
    const restartButton = document.getElementById("restart-button");
    const isClickedDisc = target.id === "disc";

    if (target === playCPUButton) {
      return console.log("play vs cpu");
    } else if (target === playPlayerButton) {
      console.log("play vs player");
      return showGame("player");
    } else if (target === gameRulesButton) {
      return console.log("opening game rules");
    } else if (target === menuButton) {
      return showMenu();
    } else if (target === restartButton) {
      return restart();
    } else if (isClickedDisc) {
      return handleDiscClick(target);
    }
  });
}

/**
 * Stop the current game session.
 */
function stopGame() {
  const discs = getAllDiscs();
  const someDiscClicked = discs.some((disc) => {
    return disc.classList.contains("clicked");
  });

  // Avoid stop if not necessary
  if (!someDiscClicked) return;

  // Clear timers
  clearInterval(currentTurnTimer);
  clearTimeout(currentTurnTimeout);

  // Clear turn
  playerWithTurn = initialTurn;
  validDiscs = undefined;
  updateTurnPlayer(playerWithTurn);
  updateTurnTime(timePerTurn);

  // Clear classes
  discs.forEach((disc) =>
    disc.classList.remove(
      "clicked",
      `clicked-${players.one}`,
      `clicked-${players.two}`
    )
  );
}

/**
 * Render a game wrapper in DOM for the game elements.
 */
function renderGameWrapper() {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", "game");
  root.appendChild(wrapper);
}

/**
 * Create the text for the turn box.
 * @returns The created wrapper element with the turn box text.
 */
function createTurnBoxText() {
  const wrapper = document.createDocumentFragment();

  // Player text
  const player = document.createElement("p");
  player.setAttribute("id", "turn-box-player");
  player.classList.add("turn-box-player");

  // Time text
  const turnTimeContainer = document.createElement("span");
  turnTimeContainer.setAttribute("id", "turn-box-time");
  turnTimeContainer.classList.add("turn-box-time");

  wrapper.append(player, turnTimeContainer);
  return wrapper;
}

/**
 * Create a turn box with its text.
 * @returns The created turn box element.
 */
function createTurnBox() {
  const box = document.createElement("div");
  box.setAttribute("id", "turn-box");
  box.classList.add("turn-box");

  const background = new Image();
  background.setAttribute("src", "./src/images/turn-box.svg");
  background.classList.add("turn-box-background");

  const text = createTurnBoxText();
  box.append(background, text);
  return box;
}

/**
 * Updates the player text in the turn box.
 * @param {string} player - The turn player's name to update.
 */
function updateTurnPlayer(player) {
  const turnPlayer = document.getElementById("turn-box-player");
  turnPlayer.innerHTML = `Player ${player}'s turn`;
}

/**
 * Updates the time in the turn box.
 * @param {number} time - The turn time to update.
 */
function updateTurnTime(time) {
  const turnTime = document.getElementById("turn-box-time");
  turnTime.innerText = time + "s";
}

/**
 * Displays the turn box on screen.
 */
function renderTurnBox() {
  const turnBox = createTurnBox();
  const gameWrapper = document.getElementById("game");
  gameWrapper.appendChild(turnBox);
  updateTurnPlayer(playerWithTurn);
  updateTurnTime(timePerTurn);
}

/**
 * Create a player box.
 * @param {string} playerName - A name for the new player.
 * @param {string} playerAvatarPath - The path of the avatar image to use.
 * @returns The player container element.
 */
function createPlayer(playerName = "Player", playerAvatarPath = "") {
  const container = document.createElement("div");
  container.setAttribute("class", "player");

  const avatarContainer = document.createElement("div");
  const avatarImage = new Image();
  avatarContainer.classList.add("player-avatar");
  avatarContainer.appendChild(avatarImage);
  avatarImage.setAttribute("src", playerAvatarPath);
  avatarImage.classList.add("player-avatar-img");

  const nameContainer = document.createElement("span");
  const nameText = document.createTextNode(playerName);
  nameContainer.classList.add("player-name");
  nameContainer.appendChild(nameText);

  container.append(avatarContainer, nameContainer);
  return container;
}

/**
 * Create a wrapper for the player elements that will be rendered.
 * @returns The player wrapper element.
 */
function createPlayerWrapper() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("players-wrapper");
  return wrapper;
}

/**
 * Displays the player boxes on screen.
 */
function renderPlayers() {
  const gameWrapper = document.getElementById("game");
  const playersWrapper = createPlayerWrapper();
  const playerOne = createPlayer("Player 1", "./src/images/player-1.svg");
  const playerTwo = createPlayer(
    "Player 2",
    "./src/images/player-2-reversed.svg"
  );
  playersWrapper.append(playerOne, playerTwo);
  gameWrapper.appendChild(playersWrapper);
}

/**
 * Create a game button.
 * @param {string} text - The text to use in the game button.
 * @returns The created button element.
 */
function createGameButton(text) {
  if (!text) {
    throw new Error("text must be provided to create a game button.");
  }
  const button = document.createElement("button");
  const buttonText = document.createTextNode(text);
  button.appendChild(buttonText);
  button.classList.add("button");
  return button;
}

/**
 * Create a game icon with circles.
 * @returns The icon element.
 */
function createGameIcon() {
  const icon = document.createElement("div");
  icon.classList.add("game-icon");
  for (let i = 0; i < 4; i++) {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    icon.appendChild(circle);
  }
  return icon;
}

/**
 * Displays the game header on screen.
 */
function renderGameHeader() {
  const gameWrapper = document.getElementById("game");
  const header = document.createElement("div");
  const menuButton = createGameButton("Menu");
  const restartButton = createGameButton("Restart");
  const gameIcon = createGameIcon();
  header.classList.add("game-header");
  menuButton.setAttribute("id", "menu-button");
  restartButton.setAttribute("id", "restart-button");
  header.append(menuButton, gameIcon, restartButton);
  gameWrapper.appendChild(header);
}

/**
 * Create a single disc.
 * @param {number | string} dataId - The desired data-id for the disc.
 * @returns The disc created element.
 */
function createDisc(dataId) {
  const disc = document.createElement("div");
  disc.setAttribute("class", "disc");
  disc.setAttribute("id", "disc");
  disc.setAttribute("data-id", dataId);
  return disc;
}

/**
 * Create a column.
 * @returns The created column element.
 */
function createColumn() {
  const column = document.createElement("div");
  column.classList.add("column");
  for (let i = 1; i <= rows; i++) {
    const disc = createDisc(i);
    column.appendChild(disc);
  }
  return column;
}

/**
 * Create a list of columns.
 * @param {number} amount - The desired amount of columns to create. Must be an integer.
 * @returns The board that contains the columns.
 */
function createColumns(amount) {
  const board = document.createElement("div");
  board.classList.add("board");
  board.setAttribute("id", "board");
  for (let i = 1; i <= amount; i++) {
    const column = createColumn();
    board.appendChild(column);
  }
  return board;
}

/**
 * Displays all columns created on screen.
 * @param {number} amount - The desired amount of columns to create. Must be an integer.
 */
function renderColumns(amount) {
  const gameWrapper = document.getElementById("game");
  const board = createColumns(amount);
  gameWrapper.appendChild(board);
}

/**
 * Get all discs from the board.
 * @returns All discs found in the board.
 */
function getAllDiscs() {
  const board = document.getElementById("board");
  const allDiscs = [...board.children];
  return allDiscs;
}

/**
 * Create an audio instance from sound name.
 * @param {string} soundName - The desired sound name to create (example: "pop").
 * @returns The audio instance.
 */
function createAudio(soundName) {
  const paths = {
    pop: "./src/sounds/pop.mp3",
  };
  if (!paths[soundName]) {
    throw new Error("Sound name is required.");
  }
  const audio = new Audio(paths[soundName]);
  return audio;
}

/**
 * Plays a sound by its name.
 * @param {string} soundName - The sound name to play (example: "pop").
 */
function playSound(soundName) {
  const sound = createAudio(soundName);
  sound.play();
}

/**
 * Changes the current turn to opponent and show it on screen.
 */
function changeTurnToOpponent() {
  playerWithTurn = playerWithTurn === players.one ? players.two : players.one;
  updateTurnPlayer(playerWithTurn);
  updateTurnTime(timePerTurn);
}

/**
 * Updates turn time every second and shows it on screen.
 * @returns The turn interval identifier.
 */
function updateTurnTimeEachSecond() {
  let timeLeft = timePerTurn;
  timer = setInterval(() => {
    // each second
    timeLeft--;
    updateTurnTime(timeLeft);
  }, 1000);
  return timer;
}

/**
 * Changes the current turn to opponent when turn time ends.
 * @returns The turn timeout identifier.
 */
function changeTurnAfterTimeout() {
  timeout = setTimeout(() => {
    handleTurnChange();
  }, timePerTurn * 1000);
  return timeout;
}

/**
 * Handles what happen with the turns.
 */
function handleTurnChange() {
  changeTurnToOpponent();
  clearInterval(currentTurnTimer);
  clearTimeout(currentTurnTimeout);

  currentTurnTimer = updateTurnTimeEachSecond();
  currentTurnTimeout = changeTurnAfterTimeout();
}

/**
 * Handles what happens when the player clicks a disc.
 * @param {HTMLElement} clickedDisc - The clicked disc.
 */
function handleDiscClick(clickedDisc) {
  const discId = Number(clickedDisc.getAttribute("data-id"));
  const isOnFirstRow = discId === 1;
  if (!isOnFirstRow) return;
  playSound("pop");
  moveArrow(clickedDisc);
  console.log("dropping dame");
}

/**
 * Handles the visual and sound effects of a clicked disc.
 * @param {HTMLElement} clickedDisc - The clicked disc captured by the event disc.
 */
// function handleDiscClick(clickedDisc) {
//   const previouslyClicked = clickedDisc.classList.contains("clicked");
//   const validClick =
//     validDiscs &&
//     Object.entries(validDiscs).some((entry) => entry[1] === clickedDisc);
//   if (previouslyClicked) return;
//   if (validClick === false) return;
//   console.log("valid element");

//   playSound("pop");
//   clickedDisc.classList.add("clicked", "clicked-" + playerWithTurn);
//   handleTurnChange();

//   validDiscs = getSiblingDiscs(clickedDisc, discsPerRow);
//   // const canContinue = turnCanContinue(validDiscs);
//   // console.log({ canContinue });
//   // console.log({ clickedDisc, ...validDiscs });
//   moveArrow(clickedDisc);
// }

/**
 * Calc if it is possible to continue the player turn.
 * @param {object} siblingDiscs - All the sibling discs of a specific disc.
 * @returns Whether the turn can continue or not.
 */
// function turnCanContinue(siblingDiscs) {
//   const turnCanContinue = Object.entries(siblingDiscs).some((sibling) => {
//     const siblingElement = sibling[1];
//     const siblingPreviouslyClicked =
//       siblingElement?.classList.contains("clicked");
//     return siblingPreviouslyClicked ? false : true;
//   });
//   return turnCanContinue;
// }

/**
 * Get all sibling discs around the disc passed.
 * @param {HTMLElement} disc - A specific disc element with data-id attribute.
 * @param {number} discsPerRow - number of discs rendered in a row. Must be an integer.
 * @returns All sibling discs.
 */
// function getSiblingDiscs(disc, discsPerRow) {
//   const allDiscs = document.getElementsByClassName("disc");
//   const dataId = Number(disc.getAttribute("data-id"));
//   if (dataId === undefined || isNaN(dataId)) {
//     throw new Error("the disc passed must have data-id attribute.");
//   }
//   // left and right side
//   const leftCondition = dataId % discsPerRow !== 0; // First disc in a row
//   const left = leftCondition && allDiscs[dataId - 1];
//   const rightCondition = (dataId + 1) % discsPerRow !== 0; // Last disc in a row
//   const right = rightCondition && allDiscs[dataId + 1];

//   // top side
//   const topId = dataId - discsPerRow;
//   const top = allDiscs[topId];
//   const topLeft = top && left && allDiscs[topId - 1];
//   const topRight = top && right && allDiscs[topId + 1];

//   // bottom side
//   const bottomId = dataId + discsPerRow;
//   const bottom = allDiscs[bottomId];
//   const bottomLeft = bottom && left && allDiscs[bottomId - 1];
//   const bottomRight = bottom && right && allDiscs[bottomId + 1];

//   /**
//    * Contains only valid siblings (not empty)
//    */
//   let allSibling = Object.entries({
//     left,
//     right,
//     top,
//     topLeft,
//     topRight,
//     bottom,
//     bottomLeft,
//     bottomRight,
//   });
//   allSibling = allSibling.filter((entry) => entry[1]);
//   allSibling = Object.fromEntries(allSibling);
//   return allSibling;
// }
