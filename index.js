import UIManager from "./src/modules/UIManager.js";
import EventManager from "./src/modules/EventManager.js";

/**
 * TODO:
 * - Add icons to the menu buttons.
 * - Change game box color when turn changes
 * - Show the game rules when user clicks Game rules button.
 * - When the turn time ends, the game must show a Lose game box
 * - Find a bug where the four-in-row check doesn't work correctly
 * and the game continue even with a four-in-row (it occurs when I try to get a tie)
 * End with mobile/tablet/desktop design
 */

/**
 * Handles the application initialization.
 */
function init() {
  UIManager.getInstance().renderMenu();
  EventManager.getInstance().handleEvents();
}

init();
