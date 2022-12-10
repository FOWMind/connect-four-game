import AudioManager from "./AudioManager.js";
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
    this.modalCloseAnimationTime = 0.35; // seconds
    this.utils = Utils.getInstance();
  }

  /**
   * Handles the game render.
   */
  renderGame() {
    // General
    this.renderGameWrapper();

    // Game screen
    this.renderGameHeader();
    this.renderPlayersAndBoardWrapper();
    this.renderPlayers();
    this.renderBoard();
    this.renderArrow();
    this.renderGameShadow();

    // Game box
    this.renderGameBox();
    this.showTurnBox();
    this.resetTurn();
  }

  /**
   * Displays a shadow in the screen
   */
  renderGameShadow() {
    const shadow = document.createElement("div");
    shadow.classList.add("game-shadow");
    shadow.setAttribute("id", "game-shadow");

    const gameWrapper = document.getElementById("game");
    gameWrapper.appendChild(shadow);
  }

  /**
   * Changes the game shadow color depending on the winner player.
   * @param {string} winner - The winner player of the game.
   */
  changeGameShadowColor(winner) {
    const gameShadow = this.resetGameShadow();
    gameShadow.classList.add("player-" + winner);
  }

  /**
   * Resets the game shadow element to its initial state.
   * @returns The game shadow element.
   */
  resetGameShadow() {
    const gameShadow = document.getElementById("game-shadow");
    gameShadow.classList.remove("player-1", "player-2");
    return gameShadow;
  }

  /**
   * Create an arrow with default position in board top position.
   * @returns The created arrow element.
   */
  createArrow() {
    const arrow = new Image();
    arrow.setAttribute("src", "./src/images/arrow.svg");
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
    const arrowMargin = (25 * arrow.clientHeight) / 100;
    const board = document.getElementById("board");
    const boardTop =
      board.offsetTop - arrow.clientHeight / 2 - arrowMargin + "px";
    const discLeft = disc.offsetLeft + "px";

    arrow.style.top = boardTop;
    arrow.style.left = discLeft;
    arrow.classList.remove("hidden");
  }

  /**
   * Create a menu button.
   * @param {string} text - Text to use in the button.
   * @param {string} icon - The icon image path to use in the button.
   * @returns The created button element.
   */
  createMenuButton(text, icon) {
    if (!text) {
      throw new Error("a text must be provided for the button.");
    }
    const button = document.createElement("button");
    const buttonText = document.createTextNode(text);
    button.classList.add("menu-button", "hover-sound");
    button.appendChild(buttonText);

    if (icon) {
      const buttonIcon = new Image();
      buttonIcon.setAttribute("src", icon);
      buttonIcon.classList.add("menu-button-icon");
      button.appendChild(buttonIcon);
      button.classList.add("has-icon");
    }

    return button;
  }

  /**
   * Create all menu buttons.
   * @returns The created button wrapper element.
   */
  createMenuButtons() {
    const wrapper = document.createElement("div");
    const playCPU = this.createMenuButton(
      "Play vs CPU",
      "./src/images/play-vs-cpu.svg"
    );
    const playPlayer = this.createMenuButton(
      "Play vs Player",
      "./src/images/play-vs-player.svg"
    );
    const gameRules = this.createMenuButton("Game rules");

    wrapper.classList.add("menu-buttons");
    playCPU.classList.add("primary");
    playCPU.setAttribute("disabled", "");
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
    const menuIcon = this.createGameIcon();
    const menuButtons = this.createMenuButtons();
    menuWrapper.setAttribute("id", "menu");
    menuWrapper.classList.add("menu");
    menuWrapper.append(menuIcon, menuButtons);
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
   * Sets the disabled attribute or remove it from the restart button depending on value.
   * @param {boolean} value - The value that will be used to disable or enable the restart button. Must be true or false
   */
  setRestartButtonDisabled(value) {
    const restartButton = document.getElementById("restart-button");
    if (!restartButton) return;

    if (value === true) {
      restartButton.setAttribute("disabled", "");
    } else if (value === false) {
      restartButton.removeAttribute("disabled");
    }
  }

  /**
   * Closes the one opened modal.
   */
  closeModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;
    modal.classList.add("closing");
    AudioManager.getInstance().playSound("closeModal");

    const removeAfter = setTimeout(() => {
      modal.remove();
      clearTimeout(removeAfter);
    }, this.modalCloseAnimationTime * 1000);
  }

  /**
   * Creates a modal with the given content.
   * @param {HTMLElement} content - The HTML content that the modal will contain.
   * @param {string} type - The type of modal to create (example: "confirmDialog").
   * @returns The modal element created.
   */
  createModal(content, type, actionName) {
    if (!content) {
      throw new Error("Content must be provided to create a modal.");
    }

    const modal = document.createElement("div");
    modal.setAttribute("id", "modal");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.appendChild(content);
    modal.append(modalContent);

    if (type === "confirmDialog" && actionName) {
      const acceptButton = this.createGameButton("Yes");
      acceptButton.classList.add("accept-button");
      acceptButton.setAttribute("action", actionName);

      const rejectButton = this.createGameButton("No");
      rejectButton.classList.add("reject-button");
      rejectButton.setAttribute("id", "close-modal");

      modal.append(acceptButton, rejectButton);
      modal.classList.add("auto-size", "confirm-dialog");
    } else {
      const modalCloseIcon = new Image();
      modalCloseIcon.setAttribute("src", "./src/images/check.svg");
      modalCloseIcon.setAttribute("alt", "Close modal");
      modalCloseIcon.classList.add("modal-close-img");

      const modalCloseButton = document.createElement("button");
      modalCloseButton.setAttribute("id", "close-modal");
      modalCloseButton.setAttribute("title", "Close modal");
      modalCloseButton.classList.add("modal-close");
      modalCloseButton.appendChild(modalCloseIcon);
      modal.appendChild(modalCloseButton);
    }

    return modal;
  }

  /**
   * Creates a subheading element for the modal.
   * @param {string} text - The text to use in the modal subheading.
   * @returns The created subheading element.
   */
  createModalSubheading(text) {
    const subheading = document.createElement("h3");
    const subheadingText = document.createTextNode(text);
    subheading.appendChild(subheadingText);
    subheading.classList.add("modal-subheading");
    return subheading;
  }

  /**
   * Creates a paragraph element for the modal.
   * @param {string} text - The text to use in the modal paragraph.
   * @returns The created paragraph element.
   */
  createModalParagraph(text) {
    const paragraphText = document.createTextNode(text);
    const paragraph = document.createElement("p");
    paragraph.classList.add("modal-paragraph");
    paragraph.appendChild(paragraphText);
    return paragraph;
  }

  /**
   * Creates a list for the modal.
   * @param {object} items - An array with a list of texts that will be used as list items.
   * @returns The created list element.
   */
  createModalList(items) {
    const list = document.createElement("ul");
    list.classList.add("modal-list");

    items.forEach((item, i) => {
      if (typeof item !== "string") {
        throw new Error(
          "Items must be strings in order to use them in the modal."
        );
      }

      const listItem = document.createElement("li");
      const listItemNumber = document.createElement("span");
      const listItemNumberText = document.createTextNode(i + 1);
      const listItemText = document.createTextNode(item);
      listItemNumber.appendChild(listItemNumberText);
      listItemNumber.classList.add("modal-list-item-number");
      listItem.append(listItemNumber, listItemText);
      listItem.classList.add("modal-list-item");
      list.appendChild(listItem);
    });

    return list;
  }

  /**
   * Creates a confirm dialog in form of modal with the provided text.
   * @param {string} text - The text to use in the confirm dialog.
   * @returns The created confirm dialog modal element.
   */
  createConfirmDialog(text) {
    if (!text) {
      throw new Error(
        "Text must be provided in order to create a confirm dialog."
      );
    }

    const dialogTextContainer = document.createElement("p");
    const dialogText = document.createTextNode(text);
    dialogTextContainer.appendChild(dialogText);
    dialogTextContainer.classList.add("confirm-dialog-text");

    const dialogModal = this.createModal(
      dialogTextContainer,
      "confirmDialog",
      "restart-game"
    );
    return dialogModal;
  }

  /**
   * Displays a confirm dialog modal with the provided text on screen.
   * @param {string} text - The text to use in the confirm dialog.
   */
  showConfirmDialog(text) {
    const dialog = this.createConfirmDialog(text);
    AudioManager.getInstance().playSound("openModal");
    root.appendChild(dialog);
  }

  /**
   * Creates the HTML content for the rules.
   * @returns The created content.
   */
  createRulesContent() {
    const content = document.createDocumentFragment();

    const heading = document.createElement("h2");
    const headingText = document.createTextNode("Rules");
    heading.appendChild(headingText);
    heading.classList.add("modal-heading", "big");

    const objectiveSubheading = this.createModalSubheading("Objective");
    const objectiveParagraphText =
      "Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).";
    const objectiveParagraph = this.createModalParagraph(
      objectiveParagraphText
    );

    const howToPlaySubheading = this.createModalSubheading("How to play");
    const howToPlayListText = [
      "Red goes first in the first game.",
      "Players must alternate turns, and only one disc can be dropped in each turn.",
      "The game ends when there is a 4-in-a-row or a stalemate.",
      "The starter of the previous game goes second on the next game.",
    ];
    const howToPlayList = this.createModalList(howToPlayListText);

    content.append(
      heading,
      objectiveSubheading,
      objectiveParagraph,
      howToPlaySubheading,
      howToPlayList
    );
    return content;
  }

  /**
   * Displays the rules modal on screen.
   */
  showRules() {
    const rulesContent = this.createRulesContent();
    const rulesModal = this.createModal(rulesContent);
    root.appendChild(rulesModal);
  }

  /**
   * Creates a button with the text "Play Again"
   * @returns The created Play Again button.
   */
  createPlayAgainButton() {
    const playAgain = this.createGameButton("Play again");
    playAgain.setAttribute("id", "play-again-button");
    return playAgain;
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
    player.classList.add("game-box-player");
    player.appendChild(playerText);

    // Win or tie text
    const winOrTieContainer = document.createElement("p");
    const winOrTieText = document.createTextNode(
      winOrTie === "win" ? "Wins" : "Tie"
    );
    winOrTieContainer.classList.add("game-box-state");
    winOrTieContainer.appendChild(winOrTieText);

    // Play again button
    const playAgain = this.createPlayAgainButton();

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
    player.classList.add("game-box-player");

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

    const timeOverText = document.getElementById("time-over-box-text");
    if (timeOverText) timeOverText.remove();

    const turnBoxText = this.createTurnBoxText();
    const gameBox = document.getElementById("game-box");
    gameBox.classList.remove("win-box", "tie-box", "time-over-box");
    gameBox.classList.add("turn-box");
    gameBox.appendChild(turnBoxText);
  }

  /**
   * Creates the content for the Time Over game box.
   * @returns A wrapper with the created content.
   */
  createTimeOverContent() {
    const content = document.createElement("div");

    // Time Over text
    const timeOver = document.createElement("p");
    const timeOverText = document.createTextNode("Time over!");
    timeOver.appendChild(timeOverText);
    timeOver.classList.add("game-box-state", "small");

    // Player X wins text
    const playerWinner = this.utils.getOppositePlayerWithTurn();
    const playerWins = document.createElement("p");
    const playerWinsText = document.createTextNode(
      `Player ${playerWinner} wins`
    );
    playerWins.appendChild(playerWinsText);
    playerWins.classList.add("game-box-player");

    // Play again button
    const playAgain = this.createPlayAgainButton();

    content.setAttribute("id", "time-over-box-text");
    content.append(timeOver, playerWins, playAgain);
    return content;
  }

  /**
   * Displays the Time Over game box on screen.
   */
  showTimeOverBox() {
    const turnBoxText = document.getElementById("turn-box-text");
    if (turnBoxText) turnBoxText.remove();

    const timeOverContent = this.createTimeOverContent();
    const gameBox = document.getElementById("game-box");
    gameBox.classList.remove("turn-box", "player-1", "player-2");
    gameBox.classList.add("time-over-box");
    gameBox.appendChild(timeOverContent);
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
   * Changes the background of the turn box depending of the player with the turn.
   * @param {string} player - The name of the player with the current turn.
   */
  changeTurnBoxColor(player) {
    if (!player) {
      throw new Error("A player is needed to change the turn box color.");
    }

    const turnBox = document.getElementsByClassName("turn-box")[0];
    turnBox.classList.remove("player-1", "player-2");
    turnBox.classList.add("player-" + player);
  }

  /**
   * Resets the turn box color.
   */
  resetTurnBoxColor() {
    const turnBox = document.getElementsByClassName("turn-box")[0];
    turnBox.classList.remove("player-1", "player-2");
  }

  /**
   * Resets the current player turn and time on screen
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
   * Renders a wrapper for both players and board in the game on screen.
   */
  renderPlayersAndBoardWrapper() {
    const gameWrapper = document.getElementById("game");
    const wrapper = document.createElement("div");
    wrapper.classList.add("players-and-board-wrapper");
    wrapper.setAttribute("id", "players-and-board-wrapper");
    gameWrapper.appendChild(wrapper);
  }

  /**
   * Create a player box.
   * @param {string} playerName - A name for the new player.
   * @param {string} playerAvatarPath - The path of the avatar image to use.
   * @returns The player container element.
   */
  createPlayer(playerName = "Player", playerAvatarPath = "") {
    const container = document.createElement("div");
    container.classList.add("player", "player-" + playerName);

    const avatarContainer = document.createElement("div");
    const avatarImage = new Image();
    avatarContainer.classList.add("player-avatar");
    avatarContainer.appendChild(avatarImage);
    avatarImage.setAttribute("src", playerAvatarPath);
    avatarImage.classList.add("player-avatar-img");

    const nameContainer = document.createElement("span");
    const nameText = document.createTextNode(`Player ${playerName}`);
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
    const wrapper = document.getElementById("players-and-board-wrapper");
    const playerWrapper = this.createPlayerWrapper();
    const players = GameManager.getInstance().players;
    const playerOne = this.createPlayer(
      players.one,
      "./src/images/player-1.svg"
    );
    const playerTwo = this.createPlayer(
      players.two,
      "./src/images/player-2.svg"
    );
    playerWrapper.append(playerOne, playerTwo);
    wrapper.appendChild(playerWrapper);
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
    const wrapper = document.getElementById("players-and-board-wrapper");
    const board = this.createBoard();
    wrapper.appendChild(board);
  }
}
