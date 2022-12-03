import UIManager from "./src/modules/UIManager.js";
import EventManager from "./src/modules/EventManager.js";

/**
 * Handles the application initialization.
 */
function init() {
  UIManager.getInstance().renderMenu();
  EventManager.getInstance().handleEvents();
}

init();
