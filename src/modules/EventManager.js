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
    this.clickedDisc;
  }

  /**
   * Manage what happens with each event in the application.
   */
  handleEvents() {
    document.addEventListener("click", ({ target }) => {
      if (target.getAttribute("disabled")) return;

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

      // General
      const closeModalButton = document.getElementById("close-modal");
      const targetAction = target.getAttribute("action");

      if (isClickSound) {
        this.audioManager.playSound("click");
      } else if (isStartSound) {
        this.audioManager.playSound("start");
      }

      if (target === playCPUButton) {
        // return console.log("play vs cpu");
        return;
      } else if (target === playPlayerButton) {
        this.handlePlayPlayerClick();
      } else if (target === gameRulesButton) {
        this.handleGameRulesClick();
      } else if (target === menuButton) {
        this.clickedDisc = null;
        this.uiManager.showMenu();
      } else if (target === restartButton) {
        this.handleRestartButtonClick();
      } else if (target === playAgainButton) {
        this.gameManager.restartGame();
      } else if (targetAction === "restart-game") {
        this.gameManager.restartGame();
      } else if (isClickedDisc) {
        this.handleDiscClick(target);
      } else if (target === closeModalButton) {
        this.handleCloseModalClick();
      }
    });

    document.addEventListener("mouseover", ({ target }) => {
      const isHoverSound = target.classList.contains("hover-sound");

      if (isHoverSound) {
        this.audioManager.playSound("hover");
      }
    });

    window.addEventListener("resize", () => {
      if (!this.clickedDisc) return;
      this.uiManager.moveArrow(this.clickedDisc);
    });
  }

  /**
   * Handles what happens when the user clicks the Restart button.
   */
  handleRestartButtonClick() {
    if (this.gameManager.gameOver) {
      this.gameManager.restartGame();
    } else {
      this.uiManager.showConfirmDialog("Are you sure you want to restart?");
    }
  }

  /**
   * Handles what happens when the user clicks the Play vs Player button.
   */
  handlePlayPlayerClick() {
    this.audioManager.playSound("start");
    this.uiManager.showGame("player");
  }

  /**
   * Handles what happens when the user clicks the Game Rules button.
   */
  handleGameRulesClick() {
    this.audioManager.playSound("openModal");
    this.uiManager.showRules();
  }

  /**
   * Handles what happen when the user clicks the Close Modal button.
   */
  handleCloseModalClick() {
    this.uiManager.closeModal();
  }

  /**
   * Handles what happens when the player clicks a disc.
   * @param {HTMLElement} clickedDisc - The clicked disc.
   */
  handleDiscClick(clickedDisc) {
    if (this.gameManager.gameOver) return;
    this.gameManager.gameStarted = true;
    this.clickedDisc = clickedDisc;
    this.uiManager.setRestartButtonDisabled(false);

    const lastAvailableDisc = this.utils.handleLastAvailableDisc(clickedDisc);
    if (!lastAvailableDisc) return;

    this.gameManager.checkWin(lastAvailableDisc);
    this.uiManager.moveArrow(clickedDisc);
    this.uiManager.changeArrowColor();
    this.uiManager.fillDisc(lastAvailableDisc, this.gameManager.playerWithTurn);
    this.audioManager.playSound("drop");
    this.gameManager.handleTurnChange();
  }
}
