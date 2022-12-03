import AudioManager from "./AudioManager.js";
import GameManager from "./GameManager.js";
import UIManager from "./UIManager.js";
import Utils from "./Utils.js";

export default class EventManager {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new EventManager();
    }
    return this.instance;
  }

  constructor() {
    this.uiManager = UIManager.getInstance();
    this.audioManager = AudioManager.getInstance();
    this.gameManager = GameManager.getInstance();
    this.utils = Utils.getInstance();
  }

  /**
   * Manage what happens with each event in the application.
   */
  handleEvents() {
    let clickedDisc;

    document.addEventListener("click", ({ target }) => {
      // Menu
      const playCPUButton = document.getElementById("play-vs-cpu-button");
      const playPlayerButton = document.getElementById("play-vs-player-button");
      const gameRulesButton = document.getElementById("game-rules-button");

      // Game
      const menuButton = document.getElementById("menu-button");
      const restartButton = document.getElementById("restart-button");
      const playAgainButton = document.getElementById("play-again-button");
      const isClickedDisc = target.id === "disc";
      const isClickSound = target.classList.contains("click-sound");
      const isStartSound = target.classList.contains("start-sound");

      if (isClickSound) {
        this.audioManager.playSound("click");
      } else if (isStartSound) {
        this.audioManager.playSound("start");
      }

      if (target === playCPUButton) {
        // return console.log("play vs cpu");
        return;
      } else if (target === playPlayerButton) {
        console.log("play vs player");
        return this.uiManager.showGame("player");
      } else if (target === gameRulesButton) {
        return console.log("opening game rules");
      } else if (target === menuButton) {
        return this.uiManager.showMenu();
      } else if (target === restartButton || target === playAgainButton) {
        if (restartButton) restartButton.setAttribute("disabled", "");
        return this.gameManager.stopGame();
      } else if (isClickedDisc) {
        clickedDisc = target;
        if (restartButton) restartButton.removeAttribute("disabled");
        return this.handleDiscClick(target);
      }
    });

    document.addEventListener("mouseover", ({ target }) => {
      const isHoverSound = target.classList.contains("hover-sound");

      if (isHoverSound) {
        this.audioManager.playSound("hover");
      }
    });

    window.addEventListener("resize", () => {
      if (!clickedDisc) return;
      this.uiManager.moveArrow(clickedDisc);
    });
  }

  /**
   * Handles what happens when the player clicks a disc.
   * @param {HTMLElement} clickedDisc - The clicked disc.
   */
  handleDiscClick(clickedDisc) {
    if (this.gameManager.gameOver) return;
    this.gameManager.gameStarted = true;

    const lastAvailableDisc = this.utils.handleLastAvailableDisc(clickedDisc);
    if (!lastAvailableDisc) return;

    this.gameManager.checkWin(lastAvailableDisc);
    this.uiManager.moveArrow(clickedDisc);
    this.uiManager.fillDisc(lastAvailableDisc, this.gameManager.playerWithTurn);
    this.audioManager.playSound("drop");
    this.gameManager.handleTurnChange();
  }
}
