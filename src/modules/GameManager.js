import AudioManager from "./AudioManager.js";
import Utils from "./Utils.js";

let currentTurnTimer;
let currentTurnTimeout;

export default class GameManager {
  players = {
    one: "1",
    two: "2",
  };
  initialTurn = this.players.one;
  playerWithTurn = this.initialTurn;
  timePerTurn = 30; // seconds
  gameStarted = false;

  constructor() {
    this.gameOver = false;
    this.utils = new Utils();
    this.audioManager = new AudioManager();
  }

  clearTimers() {
    clearInterval(currentTurnTimer);
    clearTimeout(currentTurnTimeout);
  }

  clearTurn() {
    this.playerWithTurn = this.initialTurn;
    this.updateTurnPlayer(this.playerWithTurn);
    this.updateTurnTime(this.timePerTurn);
  }

  resetDiscs(discs) {
    discs.forEach((disc) =>
      disc.classList.remove(
        "filled",
        `filled-${this.players.one}`,
        `filled-${this.players.two}`,
        `four-in-row`
      )
    );
  }

  /**
   * Stop the current game session.
   */
  stopGame() {
    const discs = this.utils.getAllDiscs();
    const someDiscFilled = discs.some((disc) => {
      return disc.classList.contains("filled");
    });

    // Avoid stop if not necessary
    if (!someDiscFilled) return;

    const arrow = document.getElementById("arrow");

    arrow.classList.add("hidden");
    this.gameOver = false;
    this.clearTimers();
    this.clearTurn();
    this.resetDiscs(discs);
  }

  /**
   * Updates the player text in the turn box.
   * @param {string} player - The turn player's name to update.
   */
  updateTurnPlayer(player) {
    const turnPlayer = document.getElementById("turn-box-player");
    turnPlayer.innerHTML = `Player ${player}'s turn`;
  }

  /**
   * Updates the time in the turn box.
   * @param {number} time - The turn time to update.
   */
  updateTurnTime(time) {
    const turnTime = document.getElementById("turn-box-time");
    turnTime.innerText = time + "s";
  }

  /**
   * Changes the current turn to opponent and show it on screen.
   */
  changeTurnToOpponent() {
    this.playerWithTurn =
      this.playerWithTurn === this.players.one
        ? this.players.two
        : this.players.one;
    this.updateTurnPlayer(this.playerWithTurn);
    this.updateTurnTime(this.timePerTurn);
  }

  /**
   * Updates turn time every second and shows it on screen.
   * @returns The turn interval identifier.
   */
  updateTurnTimeEachSecond() {
    let timeLeft = this.timePerTurn;
    const timer = setInterval(() => {
      // each second
      timeLeft--;
      this.updateTurnTime(timeLeft);
    }, 1000);
    return timer;
  }

  /**
   * Changes the current turn to opponent when turn time ends.
   * @returns The turn timeout identifier.
   */
  changeTurnAfterTimeout() {
    const timeout = setTimeout(() => {
      this.handleTurnChange();
    }, this.timePerTurn * 1000);
    return timeout;
  }

  /**
   * Handles what happen with the game turns.
   */
  handleTurnChange() {
    this.changeTurnToOpponent();
    clearInterval(currentTurnTimer);
    clearTimeout(currentTurnTimeout);

    currentTurnTimer = this.updateTurnTimeEachSecond();
    currentTurnTimeout = this.changeTurnAfterTimeout();
  }

  /**
   * Checks if the game is won or not, and set win if it's won.
   * @param {HTMLElement} disc - The disc that will be used to check a four-in-row.
   */
  checkWin(disc) {
    const fourInRow = this.utils.checkFourInRow(disc, this.playerWithTurn);
    if (fourInRow) {
      const fourInRowDiscs = [disc, ...fourInRow];
      fourInRowDiscs.forEach((disc) => disc.classList.add("four-in-row"));
      this.setWin();
    }
    return;
  }

  setWin() {
    this.gameOver = true;
    console.log("Player " + this.playerWithTurn + " wins!");
    this.audioManager.playSound("win");

    console.log({ currentTurnTimer, currentTurnTimeout });
  }
}
