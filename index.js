import UIManager from "./src/modules/UIManager.js";
import EventManager from "./src/modules/EventManager.js";

/**
 * TODO:
 * - [x] Add icons to the menu buttons.
 * - [X] Change game box color when turn changes.
 * - [x] Show the game rules when user clicks Game rules button.
 * - [x] Add favicon.
 * - When the turn time ends, the game must show a Lose game box.
 * - Add a confirm dialog when press restart if the game is not over.
 * - Find a bug where the four-in-row check doesn't work correctly.
 * and the game continue even with a four-in-row (it occurs when I try to get a tie).
 * - End with mobile/tablet/desktop design.
 * - Try to improve RAM utilization when user clicks something.
 */

/**
 * Handles the application initialization.
 */
function init() {
  UIManager.getInstance().renderMenu();
  EventManager.getInstance().handleEvents();
}

init();
