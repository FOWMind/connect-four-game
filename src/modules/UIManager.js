import GameManager from "./GameManager.js";

export default class UIManager {
  constructor() {
    this.columns = 7;
    this.rows = 6;
    this.discSize = 50; // pixels
    this.root = document.getElementById("root");
    this.gameManager = new GameManager();
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
    this.renderTurnBox();
  }

  /**
   * Create an arrow with default position in board top position.
   * @returns The created arrow element.
   */
  createArrow() {
    const board = document.getElementById("board");
    const boardPosition = board.getBoundingClientRect();
    const arrow = new Image();
    arrow.setAttribute("src", "./src/images/arrow-down.svg");
    arrow.classList.add("arrow");
    arrow.setAttribute("id", "arrow");
    arrow.style.top = Math.round(boardPosition.top) - this.discSize / 2 + "px";
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
    const discPosition = disc.getBoundingClientRect();
    const arrow = document.getElementById("arrow");
    arrow.style.top = Math.round(discPosition.top);
    arrow.style.left = Math.round(discPosition.left) + "px";
  }

  /**
   * Create a menu button.
   * @param {string} text - Text to use in the button.
   * @returns The button element.
   */
  createMenuButton(text) {
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
  createMenuButtons() {
    const wrapper = document.createElement("div");
    const playCPU = this.createMenuButton("Play vs CPU");
    const playPlayer = this.createMenuButton("Play vs Player");
    const gameRules = this.createMenuButton("Game rules");

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
    this.gameManager.stopGame();
    const gameWrapper = document.getElementById("game");
    gameWrapper.remove();
    this.renderMenu();
  }

  /**
   * Displays the game layout on screen and hide the menu.
   * @param {string} mode - Game mode for the renderGame
   */
  showGame(mode) {
    const menu = document.getElementById("menu");
    menu.remove();
    this.renderGame(mode);
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
    this.root.appendChild(menuWrapper);
  }

  /**
   * Render a game wrapper in DOM for the game elements.
   */
  renderGameWrapper() {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", "game");
    this.root.appendChild(wrapper);
  }

  /**
   * Create the text for the turn box.
   * @returns The created wrapper element with the turn box text.
   */
  createTurnBoxText() {
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
  createTurnBox() {
    const box = document.createElement("div");
    box.setAttribute("id", "turn-box");
    box.classList.add("turn-box");

    const background = new Image();
    background.setAttribute("src", "./src/images/turn-box.svg");
    background.classList.add("turn-box-background");

    const text = this.createTurnBoxText();
    box.append(background, text);
    return box;
  }

  /**
   * Displays the turn box on screen.
   */
  renderTurnBox() {
    const turnBox = this.createTurnBox();
    const gameWrapper = document.getElementById("game");
    gameWrapper.appendChild(turnBox);
    this.gameManager.updateTurnPlayer(this.gameManager.playerWithTurn);
    this.gameManager.updateTurnTime(this.gameManager.timePerTurn);
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
  createGameButton(text) {
    if (!text) {
      throw new Error("text must be provided to create a game button.");
    }
    const button = document.createElement("button");
    const buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
    button.classList.add("button");
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
    const restartButton = this.createGameButton("Restart");
    const gameIcon = this.createGameIcon();
    menuButton.setAttribute("id", "menu-button");
    restartButton.setAttribute("id", "restart-button");
    header.classList.add("game-header");
    header.append(menuButton, gameIcon, restartButton);
    gameWrapper.appendChild(header);
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
