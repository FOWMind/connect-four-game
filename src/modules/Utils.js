import GameManager from "./GameManager.js";

const initialLastDiscPositionY = 6;
let lastDiscPositionY = initialLastDiscPositionY;
let currentPlayerWithTurn;

export default class Utils {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Utils();
    }
    return this.instance;
  }

  siblingsNeededToWin = 3;
  allSibling = [];

  /**
   * Gets all discs from the game.
   * @returns All discs found in the game.
   */
  getAllDiscs() {
    const discs = document.getElementsByClassName("disc");
    return [...discs];
  }

  /**
   * Checks if some disc is filled in the game.
   * @returns Whether a disc is filled or not in the game.
   */
  someDiscFilled() {
    const discs = this.getAllDiscs();
    return discs.some((disc) => disc.classList.contains("filled"));
  }

  /**
   * Checks if all discs in game are filled.
   * @returns Whether all discs in game are filled or not.
   */
  allDiscFilled() {
    const discs = this.getAllDiscs();
    const someDiscUnfilled = discs.some(
      (disc) => !disc.classList.contains("filled")
    );
    return !someDiscUnfilled; // some disc unfilled === true ? false (not all discs are filled) : true (no disc unfilled, all discs filled)
  }

  /**
   * Checks if a disc is filled.
   * @param {HTMLElement} disc - The disc to check if it's filled.
   * @param {boolean} playerWithTurn - Current player with turn to check if the a disc is filled by that player.
   * @returns Whether the disc is filled or not.
   */
  isFilled(disc, playerWithTurn) {
    const filled = disc.classList.contains("filled");
    if (!playerWithTurn) return filled;
    const filledByCurrentPlayer = disc.classList.contains(
      "filled-" + playerWithTurn
    );
    return filled && filledByCurrentPlayer;
  }

  /**
   * Handles the calls for getting the last available disc for filling.
   * @param {HTMLElement} clickedDisc - The clicked disc element.
   * @returns The last available disc for filling.
   */
  handleLastAvailableDisc(clickedDisc) {
    lastDiscPositionY = initialLastDiscPositionY;
    const lastAvailablePositionX = clickedDisc.getAttribute("position-x");
    return this.getLastAvailableDisc(lastAvailablePositionX);
  }

  /**
   * Gets the last available disc in the current column (found by the clicked disc position-x) for filling.
   * @param {number | string} positionX - The current position-x from the clicked disc. Must be an integer.
   * @returns The last available disc for filling if there is one, otherwise null.
   */
  getLastAvailableDisc(positionX) {
    const invalidPositionY = lastDiscPositionY < 1;
    if (invalidPositionY) return;

    const position = { x: positionX, y: lastDiscPositionY };
    const lastAvailable = document.querySelector(
      `[position-x="${position.x}"][position-y="${position.y}"]`
    );
    if (!lastAvailable) return null;

    const invalidLastAvailable = lastAvailable.classList.contains("filled");
    if (invalidLastAvailable) {
      lastDiscPositionY--;
      return this.getLastAvailableDisc(positionX);
    }
    return lastAvailable;
  }

  /**
   * Checks if there are enough sibling discs filled in a sibling array.
   * @param {object} siblings - The array of siblings to check.
   * @returns Whether has enough siblings or not.
   */
  checkEnoughSibling(siblings) {
    if (!siblings) return;
    const hasEnoughSiblings = siblings.length >= this.siblingsNeededToWin;
    return hasEnoughSiblings;
  }

  /**
   * Checks if there are four-in-row in the game.
   * @param {HTMLElement} disc - The disc to check its sibling discs.
   * @param {string} playerWithTurn - The player with the current game turn.
   * @returns The array of sibling if there are four-in-row, otherwise false.
   */
  checkFourInRow(disc, playerWithTurn) {
    currentPlayerWithTurn = playerWithTurn;

    // Vertical -> |
    const top = this.getFilledSibling("top", disc);
    if (this.checkEnoughSibling(top)) return top;
    const bottom = this.getFilledSibling("bottom", disc);
    if (this.checkEnoughSibling(bottom)) return bottom;
    this.allSibling = [];

    // Horizontal -> --
    const left = this.getFilledSibling("left", disc);
    if (this.checkEnoughSibling(left)) return left;
    const right = this.getFilledSibling("right", disc);
    if (this.checkEnoughSibling(right)) return right;
    this.allSibling = [];

    // Slash Reversed -> \
    const topLeft = this.getFilledSibling("topLeft", disc);
    if (this.checkEnoughSibling(topLeft)) return topLeft;
    const bottomRight = this.getFilledSibling("bottomRight", disc);
    if (this.checkEnoughSibling(bottomRight)) return bottomRight;
    this.allSibling = [];

    // Slash -> /
    const topRight = this.getFilledSibling("topRight", disc);
    if (this.checkEnoughSibling(topRight)) return topRight;
    const bottomLeft = this.getFilledSibling("bottomLeft", disc);
    if (this.checkEnoughSibling(bottomLeft)) return bottomLeft;
    this.allSibling = [];

    return false;
  }

  /**
   * Gets all siblings in an specific position, using a disc.
   * @param {string} to - Where to iterate from the passed disc.
   * @param {HTMLElement} disc - The disc to get its siblings.
   * @returns All the siblings found from the passed disc.
   */
  getFilledSibling(to, disc) {
    const currentDiscPosition = {
      x: disc.getAttribute("position-x"),
      y: disc.getAttribute("position-y"),
    };

    for (let i = 0; i < this.siblingsNeededToWin; i++) {
      if (to === "top") {
        currentDiscPosition.y--;
      } else if (to === "bottom") {
        currentDiscPosition.y++;
      } else if (to === "left") {
        currentDiscPosition.x--;
      } else if (to === "right") {
        currentDiscPosition.x++;
      } else if (to === "topRight") {
        currentDiscPosition.x++;
        currentDiscPosition.y--;
      } else if (to === "topLeft") {
        currentDiscPosition.x--;
        currentDiscPosition.y--;
      } else if (to === "bottomRight") {
        currentDiscPosition.x++;
        currentDiscPosition.y++;
      } else if (to === "bottomLeft") {
        currentDiscPosition.x--;
        currentDiscPosition.y++;
      } else {
        return;
      }

      const sibling = document.querySelector(
        `[position-x="${currentDiscPosition.x}"][position-y="${currentDiscPosition.y}"]`
      );
      if (!sibling) continue;

      const filledByCurrentPlayer = this.isFilled(
        sibling,
        currentPlayerWithTurn
      );
      if (!filledByCurrentPlayer) break; // there is a sibling, but the sibling is not filled by the player who dropped the disc
      this.allSibling.push(sibling);
    }

    return this.allSibling;
  }

  /**
   * Gets the opposite player to the one with the current game turn.
   * @returns The player opposite to the one with the current turn.
   */
  getOppositePlayerWithTurn() {
    const players = GameManager.getInstance().players;
    const opposite =
      GameManager.getInstance().playerWithTurn === players.one
        ? players.two
        : players.one;
    return opposite;
  }
}
