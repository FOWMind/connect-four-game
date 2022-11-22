/*
TODO
- Hide top buttons on main menu.
- Separate code into files.
- Remake game functionality:
  Connect 4 discs, either horizontal, vertical o diagonal. The discs MUST BEEN DROPPED FROM THE TOP.
*/

const root = document.getElementById("root");
const menuButton = document.getElementById("menu-button");
const restartButton = document.getElementById("restart-button");

const timePerTurn = 30; // seconds
const players = {
  one: "1",
  two: "2",
};
const initialTurn = players.one;
let playerWithTurn = initialTurn;
let currentTurnTimer;
let currentTurnTimeout;

// Render
const discsPerRow = 7;
const rows = 6;
const discAmount = discsPerRow * rows;

/**
 * Handles the game render.
 */
function renderGame(mode) {
  renderGameWrapper();
  renderPlayers();
  renderDiscs(discAmount);
  renderTurnBox();
}

init();

/**
 * Handles the application initialization.
 */
function init() {
  renderMenu();
  handleEvents();
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
  menuWrapper.appendChild(menuButtons);
  root.appendChild(menuWrapper);
}

/**
 * Manage what happens with each event in the application.
 */
function handleEvents() {
  document.addEventListener("click", ({ target }) => {
    const playCPUButton = document.getElementById("play-vs-cpu-button");
    const playPlayerButton = document.getElementById("play-vs-player-button");
    const gameRulesButton = document.getElementById("game-rules-button");
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
 * Restart the current game session.
 */
function restart() {
  const discs = getAllDiscs();
  const someDiscClicked = discs.some((disc) => {
    return disc.classList.contains("clicked");
  });

  // Avoid restart if not necessary
  if (!someDiscClicked) return;

  // Clear timers
  clearInterval(currentTurnTimer);
  clearTimeout(currentTurnTimeout);

  // Clear turn
  playerWithTurn = initialTurn;
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
 *
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
 * Create a wrapper for the discs that will be rendered.
 * @returns The disc wrapper element.
 */
function createDiscWrapper() {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("class", "disc-wrapper");
  wrapper.setAttribute("id", "disc-wrapper");
  return wrapper;
}

/**
 * Create a single disc.
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
 * Create a list of discs.
 * @param {number} amount - The desired amount of discs to create. Must be an integer.
 * @returns A list containing all the discs.
 */
function createDiscList(amount) {
  const discList = [];
  for (let i = 0; i < amount; i++) {
    const disc = createDisc(i);
    discList.push(disc);
  }

  return discList;
}

/**
 * Displays all the discs created on screen.
 * @param {number} amount - The desired amount of discs to render. Must be an integer.
 */
function renderDiscs(amount) {
  const gameWrapper = document.getElementById("game");
  const discList = createDiscList(amount);
  const discWrapper = createDiscWrapper();

  discList.forEach((disc) => {
    discWrapper.appendChild(disc);
  });
  gameWrapper.appendChild(discWrapper);
}

/**
 * Get all sibling discs around the disc passed.
 * @param {HTMLElement} disc - A specific disc element with data-id attribute.
 * @param {number} discsPerRow - number of discs rendered in a row. Must be an integer.
 * @returns All sibling discs.
 */
function getSiblingDiscs(disc, discsPerRow) {
  const allDiscs = document.getElementsByClassName("disc");
  const dataId = Number(disc.getAttribute("data-id"));
  if (dataId === undefined || isNaN(dataId)) {
    throw new Error("the disc passed must have data-id attribute.");
  }
  // left and right side
  const leftCondition = dataId % discsPerRow !== 0; // First disc in a row
  const left = leftCondition && allDiscs[dataId - 1];
  const rightCondition = (dataId + 1) % discsPerRow !== 0; // Last disc in a row
  const right = rightCondition && allDiscs[dataId + 1];

  // top side
  const topId = dataId - discsPerRow;
  const top = allDiscs[topId];
  const topLeft = top && left && allDiscs[topId - 1];
  const topRight = top && right && allDiscs[topId + 1];

  // bottom side
  const bottomId = dataId + discsPerRow;
  const bottom = allDiscs[bottomId];
  const bottomLeft = bottom && left && allDiscs[bottomId - 1];
  const bottomRight = bottom && right && allDiscs[bottomId + 1];

  /**
   * Contains only valid siblings (not empty)
   */
  let allSibling = Object.entries({
    left,
    right,
    top,
    topLeft,
    topRight,
    bottom,
    bottomLeft,
    bottomRight,
  });
  allSibling = allSibling.filter((entry) => entry[1]);
  allSibling = Object.fromEntries(allSibling);
  return allSibling;
}

/**
 * Get all discs from disc wrapper.
 * @returns All discs found from disc wrapper.
 */
function getAllDiscs() {
  const discsWrapper = document.getElementById("disc-wrapper");
  const allDiscs = [...discsWrapper.children];
  return allDiscs;
}

/**
 * Calc if it is possible to continue the player turn.
 * @param {object} siblingDiscs - All the sibling discs of a specific disc.
 * @returns Whether the turn can continue or not.
 */
function turnCanContinue(siblingDiscs) {
  const turnCanContinue = Object.entries(siblingDiscs).some((sibling) => {
    const siblingElement = sibling[1];
    const siblingPreviouslyClicked =
      siblingElement?.classList.contains("clicked");
    return siblingPreviouslyClicked ? false : true;
  });
  return turnCanContinue;
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

let validDiscs;
/**
 * Handles the visual and sound effects of a clicked disc.
 * @param {HTMLElement} clickedDisc - The clicked disc captured by the event disc.
 */
function handleDiscClick(clickedDisc) {
  const previouslyClicked = clickedDisc.classList.contains("clicked");
  const validClick =
    validDiscs &&
    Object.entries(validDiscs).some((entry) => entry[1] === clickedDisc);
  if (previouslyClicked) return;
  if (validClick === false) return;
  console.log("valid element");

  playSound("pop");
  clickedDisc.classList.add("clicked", "clicked-" + playerWithTurn);
  handleTurnChange();

  validDiscs = getSiblingDiscs(clickedDisc, discsPerRow);
  // const canContinue = turnCanContinue(validDiscs);
  // console.log({ canContinue });
  // console.log({ clickedDisc, ...validDiscs });
}
