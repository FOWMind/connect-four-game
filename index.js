const root = document.getElementById("root");
const timePerTurn = 5; // seconds
const players = {
  one: "one",
  two: "two",
};
let playerWithTurn = players.one;
let currentTurnTimer;
let currentTurnTimeout;

// Render
const discsPerRow = 7;
const rows = 6;
const discAmount = discsPerRow * rows;

function render() {
  renderDiscWrapper();
  renderDiscs(discAmount);
  handleDiscClick(discsPerRow, playerWithTurn);
}

render();

/*
START DEBUG
START DEBUG
START DEBUG
START DEBUG
START DEBUG
START DEBUG
START DEBUG
START DEBUG
START DEBUG
START DEBUG
*/
const currentP = document.getElementById("current-player");
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
currentP.innerHTML = "Player with turn: " + playerWithTurn;
/*
END DEBUG
END DEBUG
END DEBUG
END DEBUG
END DEBUG
END DEBUG
END DEBUG
END DEBUG
END DEBUG
END DEBUG
*/

/**
 * Create a wrapper for the discs that will be rendered.
 */
function renderDiscWrapper() {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("class", "disc-wrapper");
  wrapper.setAttribute("id", "disc-wrapper");
  root.appendChild(wrapper);
}

/**
 * Create a single disc as HTMLElement.
 * @returns The disc created.
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
 * Appends all the discs created to disc wrapper.
 * @param {number} amount - The desired amount of discs to render. Must be an integer.
 */
function renderDiscs(amount) {
  const discList = createDiscList(amount);
  const discWrapper = document.getElementById("disc-wrapper");

  discList.forEach((disc) => {
    discWrapper.appendChild(disc);
  });
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
 * Play a sound by its name.
 * @param {string} soundName - The sound name to play (example: "pop").
 */
function playSound(soundName) {
  const sound = createAudio(soundName);
  sound.play();
}

function changeTurnToOpponent() {
  playerWithTurn = playerWithTurn === players.one ? players.two : players.one;
  currentP.innerHTML = "Player with turn: " + playerWithTurn;
}

function updateTurnTimeEachSecond() {
  let timeLeft = timePerTurn;
  console.log("time left: ", timeLeft);
  timer = setInterval(() => {
    // each second
    timeLeft--;
    console.log("time left: ", timeLeft);
  }, 1000);
  return timer;
}

function changeTurnAfterTimeout() {
  timeout = setTimeout(() => {
    console.log("timeout.");
    changeTurnToOpponent();
    clearInterval(currentTurnTimer);
  }, timePerTurn * 1000);
  return timeout;
}

function handleTurnChange() {
  changeTurnToOpponent();
  if (currentTurnTimer !== undefined) clearInterval(currentTurnTimer);
  if (currentTurnTimeout !== undefined) clearTimeout(currentTurnTimeout);

  currentTurnTimer = updateTurnTimeEachSecond();
  currentTurnTimeout = changeTurnAfterTimeout();
}

/**
 * Handles the visual and sound effects of a clicked disc.
 * @param {number} discsPerRow - number of discs rendered in a row. Must be an integer.
 */
function handleDiscClick(discsPerRow) {
  document.addEventListener("click", (e) => {
    const clickedDisc = e.target.id === "disc" ? e.target : null;
    const previouslyClicked = clickedDisc?.classList.contains("clicked");
    if (!clickedDisc || previouslyClicked) return;

    playSound("pop");
    clickedDisc.classList.add("clicked", "clicked-" + playerWithTurn);
    handleTurnChange();

    const siblingDiscs = getSiblingDiscs(clickedDisc, discsPerRow);
    const canContinue = turnCanContinue(siblingDiscs);
    console.log({ clickedDisc, ...siblingDiscs });
    console.log({ canContinue });
  });
}
