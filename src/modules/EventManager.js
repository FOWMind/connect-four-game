import AudioManager from "./AudioManager.js";
import GameManager from "./GameManager.js";
import UIManager from "./UIManager.js";
import Utils from "./Utils.js";

export default class EventManager {
  constructor() {
    this.uiManager = new UIManager();
    this.utils = new Utils();
    this.gameManager = new GameManager();
    this.audioManager = new AudioManager();
  }
  /**
   * Manage what happens with each event in the application.
   */
  handleEvents() {
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
        return this.uiManager.showGame("player");
      } else if (target === gameRulesButton) {
        return console.log("opening game rules");
      } else if (target === menuButton) {
        return this.uiManager.showMenu();
      } else if (target === restartButton) {
        return this.gameManager.stopGame();
      } else if (isClickedDisc) {
        return this.handleDiscClick(target);
      }
    });
  }

  /**
   * Handles what happens when the player clicks a disc.
   * @param {HTMLElement} clickedDisc - The clicked disc.
   */
  handleDiscClick(clickedDisc) {
    if (this.gameManager.gameOver) return;
    const discPositionY = Number(clickedDisc.getAttribute("position-y"));
    const isOnFirstRow = discPositionY === 1;
    if (!isOnFirstRow) return;

    const lastAvailableDisc = this.utils.handleLastAvailableDisc(clickedDisc);
    if (!lastAvailableDisc) return;

    this.gameManager.checkWin(lastAvailableDisc);
    this.uiManager.moveArrow(clickedDisc);
    this.uiManager.fillDisc(lastAvailableDisc, this.gameManager.playerWithTurn);
    this.audioManager.playSound("pop");
    this.gameManager.handleTurnChange();
  }
}
