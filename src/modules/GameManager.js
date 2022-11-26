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

  constructor() {
    this.utils = new Utils();
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

    // Clear timers
    clearInterval(currentTurnTimer);
    clearTimeout(currentTurnTimeout);

    // Clear turn
    this.playerWithTurn = this.initialTurn;
    this.updateTurnPlayer(this.playerWithTurn);
    this.updateTurnTime(this.timePerTurn);

    // Clear classes
    discs.forEach((disc) =>
      disc.classList.remove(
        "filled",
        `filled-${this.players.one}`,
        `filled-${this.players.two}`
      )
    );
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
}
