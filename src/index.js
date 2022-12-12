import UIManager from "./modules/UIManager.js";
import EventManager from "./modules/EventManager.js";
import AudioManager from "./modules/AudioManager.js";

/**
 * Handles the application initialization.
 */
function init() {
  AudioManager.getInstance().preloadSounds();
  UIManager.getInstance().renderMenu();
  EventManager.getInstance().handleEvents();
}

init();
