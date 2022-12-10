import UIManager from "./modules/UIManager.js";
import EventManager from "./modules/EventManager.js";

/**
 * TODO:
 * - [x] Add icons to the menu buttons.
 * - [X] Change game box color when turn changes.
 * - [x] Show the game rules when user clicks Game rules button.
 * - [x] Add favicon.
 * - [x] When the turn time ends, the game must show a Time Over game box.
 * - [x] The user cannot click the menu button if they clicks the button icon.
 * - [x] Add sound when a modal is opened.
 * - [x] Add a confirm dialog when press restart if the game is not over.
 * - [x] Find a bug where the four-in-row check doesn't work correctly.
 * and the game continue even with a four-in-row (it occurs when I try to get a tie).
 * - [x] Change scrollbar style
 * - End with mobile/tablet/desktop design.
 * - Try to improve RAM utilization when user clicks something.
 * - Preload sounds to remove the delay.
 */

/**
 * Handles the application initialization.
 */
function init() {
  UIManager.getInstance().renderMenu();
  EventManager.getInstance().handleEvents();
}

init();
