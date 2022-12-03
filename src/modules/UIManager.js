import GameManager from "./GameManager.js";
import Utils from "./Utils.js";

const root = document.getElementById("root");

export default class UIManager {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UIManager();
    }
    return this.instance;
  }

  constructor() {
    this.columns = 7;
    this.rows = 6;
    this.discSize = 50; // pixels
    this.utils = Utils.getInstance();
  }

  /**
   * Handles the game render.
   */
  renderGame() {
    this.renderGameWrapper();
    this.renderGameHeader();
    this.renderPlayers();
    this.renderBoard();
    this.renderArrow();
    this.renderGameBox();
    this.showTurnBox();
    this.resetTurn();
  }

  /**
   * Create an arrow with default position in board top position.
   * @returns The created arrow element.
   */
  createArrow() {
    const arrow = new Image();
    arrow.setAttribute("src", "./src/images/arrow-down.svg");
    arrow.classList.add("arrow");
    arrow.setAttribute("id", "arrow");
    arrow.classList.add("hidden");
    return arrow;
  }

  /**
   * Displays the created arrow in the board.
   */
  renderArrow() {
    const board = document.getElementById("board");
    const arrow = this.createArrow();
    board.appendChild(arrow);
  }

  /**
   * Moves the rendered arrow to the position of the disc passed.
   * @param {HTMLElement} disc - A disc to take its position and assign it to the arrow.
   */
  moveArrow(disc) {
    const arrow = document.getElementById("arrow");
    const board = document.getElementById("board");
    const boardTop = board.offsetTop - arrow.clientHeight / 2 + "px";
    const discLeft = disc.offsetLeft + "px";

    arrow.style.top = boardTop;
    arrow.style.left = discLeft;
    arrow.classList.remove("hidden");
  }

  /**
   * Create a menu button.
   * @param {string} text - Text to use in the button.
   * @param {string} sound - The sound name to be used for the button.
   * @returns The button element.
   */
  createMenuButton(text, sound) {
    if (!text) {
      throw new Error("a text must be provided for the button.");
    }
    const button = document.createElement("button");
    const buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
    if (sound === "click") {
      button.classList.add("menu-button", "click-sound", "hover-sound");
    } else {
      button.classList.add("menu-button", "start-sound", "hover-sound");
    }
    return button;
  }

  /**
   * Create all menu buttons.
   * @returns The button wrapper element.
   */
  createMenuButtons() {
    const wrapper = document.createElement("div");
    const playCPU = this.createMenuButton("Play vs CPU");
    const playPlayer = this.createMenuButton("Play vs Player");
    const gameRules = this.createMenuButton("Game rules", "click");

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
  showMenu() {
    GameManager.getInstance().stopGame();
    const gameWrapper = document.getElementById("game");
    gameWrapper.remove();
    this.renderMenu();
  }

  /**
   * Displays the game layout on screen and hide the menu.
   */
  showGame() {
    const menu = document.getElementById("menu");
    menu.remove();
    this.renderGame();
  }

  /**
   * Displays the menu on screen.
   */
  renderMenu() {
    const menuWrapper = document.createElement("div");
    const menuButtons = this.createMenuButtons();
    menuWrapper.setAttribute("id", "menu");
    menuWrapper.classList.add("menu");
    menuWrapper.appendChild(menuButtons);
    root.appendChild(menuWrapper);
  }

  /**
   * Renders a game wrapper in the DOM for the game elements.
   */
  renderGameWrapper() {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", "game");
    root.appendChild(wrapper);
  }

  /**
   * Creates the text for the win or tie box.
   * @returns The text wrapper element.
   */
  createWinOrTieBoxText(winOrTie) {
    const wrapper = document.createElement("div");

    // Player text
    const player = document.createElement("span");
    const playerWinner = GameManager.getInstance().playerWithTurn;
    const playerText = document.createTextNode(`Player ${playerWinner}`);
    player.classList.add("win-or-tie-box-player");
    player.appendChild(playerText);

    // Win or tie text
    const winOrTieContainer = document.createElement("p");
    const winOrTieText = document.createTextNode(
      winOrTie === "win" ? "Wins" : "Tie"
    );
    winOrTieContainer.classList.add("win-or-tie-box-state");
    winOrTieContainer.appendChild(winOrTieText);

    // Play again button
    const playAgain = this.createGameButton("Play again");
    playAgain.setAttribute("id", "play-again-button");

    wrapper.setAttribute("id", "win-or-tie-box-text");
    wrapper.append(player, winOrTieContainer, playAgain);
    return wrapper;
  }

  /**
   * Displays the tie box on screen.
   */
  showTieBox() {
    this.showWinOrTieBox("tie");
  }

  /**
   * Displays the win box on screen.
   */
  showWinBox() {
    this.showWinOrTieBox("win");
  }

  /**
   * Change the content of the game box. Removes existing boxes first.
   * @param {string} winOrTie - The type of state to display in game box.
   */
  showWinOrTieBox(winOrTie) {
    const turnBoxText = document.getElementById("turn-box-text");
    if (turnBoxText) turnBoxText.remove();

    const winOrTieBoxText = document.getElementById("win-or-tie-box-text");
    if (winOrTieBoxText) winOrTieBoxText.remove();

    const gameBox = document.getElementById("game-box");
    gameBox.classList.remove("turn-box", "win-box", "tie-box");

    if (winOrTie === "win") {
      const winBoxText = this.createWinOrTieBoxText("win");
      gameBox.classList.add("win-box");
      gameBox.appendChild(winBoxText);
      return;
    } else if (winOrTie === "tie") {
      const tieBoxText = this.createWinOrTieBoxText("tie");
      gameBox.classList.add("tie-box");
      gameBox.appendChild(tieBoxText);
      return;
    }
  }

  /**
   * Create the text for the turn box.
   * @returns The created wrapper element with the turn box text.
   */
  createTurnBoxText() {
    const wrapper = document.createElement("div");

    // Player text
    const player = document.createElement("p");
    player.setAttribute("id", "turn-box-player");
    player.classList.add("turn-box-player");

    // Time text
    const turnTimeContainer = document.createElement("span");
    turnTimeContainer.setAttribute("id", "turn-box-time");
    turnTimeContainer.classList.add("turn-box-time");

    wrapper.setAttribute("id", "turn-box-text");
    wrapper.append(player, turnTimeContainer);
    return wrapper;
  }

  /**
   * Converts the game box to a turn box
   */
  showTurnBox() {
    const winOrTieBoxText = document.getElementById("win-or-tie-box-text");
    if (winOrTieBoxText) winOrTieBoxText.remove();

    const turnBoxText = this.createTurnBoxText();
    const gameBox = document.getElementById("game-box");
    gameBox.classList.remove("win-box", "tie-box");
    gameBox.classList.add("turn-box");
    gameBox.appendChild(turnBoxText);
  }

  /**
   * Displays the game box on screen.
   */
  renderGameBox() {
    const gameBox = this.createGameBox();
    const gameWrapper = document.getElementById("game");
    gameWrapper.appendChild(gameBox);
  }

  /**
   * Create a game box (to use with turn box, win box, etc).
   * @returns The created game box element.
   */
  createGameBox() {
    const box = document.createElement("div");
    box.setAttribute("id", "game-box");
    box.classList.add("game-box");
    return box;
  }

  /**
   * Reset the current player turn and time on screen
   */
  resetTurn() {
    this.updateTurnPlayer(GameManager.getInstance().playerWithTurn);
    this.updateTurnTime(GameManager.getInstance().timePerTurn);
  }

  /**
   * Updates the player text in the turn box.
   * @param {string} player - The turn player's name to update.
   */
  updateTurnPlayer(player) {
    const turnPlayer = document.getElementById("turn-box-player");
    if (!turnPlayer) {
      this.showTurnBox();
      this.updateTurnPlayer(player);
      return;
    }
    turnPlayer.innerHTML = `Player ${player}'s turn`;
  }

  /**
   * Updates the time in the turn box.
   * @param {number} time - The turn time to update.
   */
  updateTurnTime(time) {
    const turnTime = document.getElementById("turn-box-time");
    if (!turnTime) {
      this.showTurnBox();
      this.updateTurnTime(time);
      return;
    }
    turnTime.innerText = time + "s";
  }

  /**
   * Create a player box.
   * @param {string} playerName - A name for the new player.
   * @param {string} playerAvatarPath - The path of the avatar image to use.
   * @returns The player container element.
   */
  createPlayer(playerName = "Player", playerAvatarPath = "") {
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
  createPlayerWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("players-wrapper");
    return wrapper;
  }

  /**
   * Displays the player boxes on screen.
   */
  renderPlayers() {
    const gameWrapper = document.getElementById("game");
    const playersWrapper = this.createPlayerWrapper();
    const playerOne = this.createPlayer(
      "Player 1",
      "./src/images/player-1.svg"
    );
    const playerTwo = this.createPlayer(
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
  createGameButton(text, disabled) {
    if (!text) {
      throw new Error("text must be provided to create a game button.");
    }
    const button = document.createElement("button");
    const buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
    button.classList.add("button", "click-sound", "hover-sound");
    if (disabled) {
      button.setAttribute("disabled", "");
    }
    return button;
  }

  /**
   * Create a game icon with circles.
   * @returns The icon element created.
   */
  createGameIcon() {
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
  renderGameHeader() {
    const gameWrapper = document.getElementById("game");
    const header = document.createElement("div");
    const menuButton = this.createGameButton("Menu");
    const restartButton = this.createGameButton("Restart", true);
    const gameIcon = this.createGameIcon();
    menuButton.setAttribute("id", "menu-button");
    restartButton.setAttribute("id", "restart-button");
    header.classList.add("game-header");
    header.append(menuButton, gameIcon, restartButton);
    gameWrapper.appendChild(header);
  }

  /**
   * Reset all discs UI state
   */
  resetDiscs() {
    const discs = this.utils.getAllDiscs();
    discs.forEach((disc) =>
      disc.classList.remove(
        "filled",
        `filled-${GameManager.getInstance().players.one}`,
        `filled-${GameManager.getInstance().players.two}`,
        `four-in-row`
      )
    );
  }

  /**
   * Fills a disc.
   * @param {HTMLElement} disc - The disc to fill.
   * @param {string} playerWithTurn - The player with the current game turn.
   */
  fillDisc(disc, playerWithTurn) {
    disc.classList.add("filled", "filled-" + playerWithTurn);
  }

  /**
   * Create a single disc.
   * @param {number | string} dataId - The ID to use for the disc.
   * @param {{ x: number, y: number }} position - An object with position Y and X for the discs. Must be integers.
   * @returns The disc element created.
   */
  createDisc(dataId, position) {
    const disc = document.createElement("div");
    disc.setAttribute("class", "disc");
    disc.setAttribute("id", "disc");
    disc.setAttribute("data-id", dataId);
    disc.setAttribute("position-x", position.x);
    disc.setAttribute("position-y", position.y);
    return disc;
  }

  /**
   * Create game discs.
   * @param amount - The amount of discs to create.
   * @returns All the discs created.
   */
  createDiscs(amount) {
    const allDiscs = document.createDocumentFragment();
    const discPosition = { x: 1, y: 1 };

    for (let i = 1; i <= amount; i++) {
      const disc = this.createDisc(i, discPosition);
      allDiscs.appendChild(disc);
      discPosition.x++;

      const onLastColumn = i % 7 === 0;
      if (onLastColumn) {
        discPosition.x = 1;
        discPosition.y++;
      }
    }
    return allDiscs;
  }

  /**
   * Create the game board.
   * @returns The board containing the discs.
   */
  createBoard() {
    const board = document.createElement("div");
    board.classList.add("board");
    board.setAttribute("id", "board");

    const discAmount = this.rows * this.columns;
    const discs = this.createDiscs(discAmount);
    board.appendChild(discs);
    return board;
  }

  /**
   * Displays the board created on screen.
   */
  renderBoard() {
    const gameWrapper = document.getElementById("game");
    const board = this.createBoard();
    gameWrapper.appendChild(board);
  }
}
