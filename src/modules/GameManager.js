import AudioManager from "./AudioManager.js";
import UIManager from "./UIManager.js";
import Utils from "./Utils.js";

export default class GameManager {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new GameManager();
    }
    return this.instance;
  }

  currentTurnTimer;
  currentTurnTimeout;
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
    this.utils = Utils.getInstance();
    this.audioManager = AudioManager.getInstance();
    this.uiManager = UIManager.getInstance();
  }

  /**
   * Clear interval and timeout variables
   */
  clearTimers() {
    clearInterval(this.currentTurnTimer);
    clearTimeout(this.currentTurnTimeout);
  }

  /**
   * Reset the current turn state including time
   */
  resetTurn() {
    this.playerWithTurn = this.initialTurn;
    this.clearTimers();
    this.uiManager.resetTurn();
  }

  /**
   * Stop the current game session.
   */
  stopGame() {
    const someDiscFilled = this.utils.someDiscFilled();

    // Avoid stop if not necessary
    if (!someDiscFilled) return;

    const arrow = document.getElementById("arrow");

    arrow.classList.add("hidden");
    this.gameOver = false;
    this.resetTurn();
    this.uiManager.resetDiscs();
  }

  /**
   * Changes the current turn to opponent and show it on screen.
   */
  changeTurnToOpponent() {
    this.playerWithTurn =
      this.playerWithTurn === this.players.one
        ? this.players.two
        : this.players.one;
    this.uiManager.resetTurn();
  }

  /**
   * Updates turn time every second and shows it on screen.
   */
  updateTurnTimeEachSecond() {
    let timeLeft = this.timePerTurn;
    this.currentTurnTimer = setInterval(() => {
      // each second
      timeLeft--;
      this.uiManager.updateTurnTime(timeLeft);
    }, 1000);
  }

  /**
   * Changes the current turn to opponent when turn time ends.
   */
  changeTurnAfterTimeout() {
    this.currentTurnTimeout = setTimeout(() => {
      this.handleTurnChange();
    }, this.timePerTurn * 1000);
  }

  /**
   * Handles what happen with the game turns.
   */
  handleTurnChange() {
    if (this.gameOver) return;
    if (this.utils.allDiscFilled()) {
      // TODO: Do something elaborate
      this.stopGame();
      return;
    }
    this.changeTurnToOpponent();
    this.clearTimers();
    this.updateTurnTimeEachSecond();
    this.changeTurnAfterTimeout();
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
    this.clearTimers();
    this.audioManager.playSound("win");
    console.log("Player " + this.playerWithTurn + " wins!");
  }
}
