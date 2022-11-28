import UIManager from "./src/modules/UIManager.js";
import EventManager from "./src/modules/EventManager.js";

/*
TODO
- [x] Hide top buttons on main menu.
- [x] Separate code into files.
- [x] Remake game functionality:
  Connect 4 discs, either horizontal, vertical o diagonal. The discs MUST BEEN DROPPED FROM THE TOP.
- [x] Each disc must have a position Y and X:
  Position Y will be first 1, then if data-id % columns === 0, the Y will be current Y + 1
- [x] When player clicks a disc, search 3 filled sibling discs of the disc filled by that click.
*/

/**
 * Handles the application initialization.
 */
function init() {
  const uiManager = new UIManager();
  const eventManager = new EventManager();
  uiManager.renderMenu();
  eventManager.handleEvents();
}
init();
