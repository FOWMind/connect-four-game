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

/**
 * Handles the visual and sound effects of a clicked disc.
 * @param {HTMLElement} clickedDisc - The clicked disc captured by the event disc.
 */
// function handleDiscClick(clickedDisc) {
//   const previouslyClicked = clickedDisc.classList.contains("clicked");
//   const validClick =
//     validDiscs &&
//     Object.entries(validDiscs).some((entry) => entry[1] === clickedDisc);
//   if (previouslyClicked) return;
//   if (validClick === false) return;
//   console.log("valid element");

//   playSound("pop");
//   clickedDisc.classList.add("clicked", "clicked-" + playerWithTurn);
//   handleTurnChange();

//   validDiscs = getSiblingDiscs(clickedDisc, discsPerRow);
//   // const canContinue = turnCanContinue(validDiscs);
//   // console.log({ canContinue });
//   // console.log({ clickedDisc, ...validDiscs });
//   moveArrow(clickedDisc);
// }

/**
 * Calc if it is possible to continue the player turn.
 * @param {object} siblingDiscs - All the sibling discs of a specific disc.
 * @returns Whether the turn can continue or not.
 */
// function turnCanContinue(siblingDiscs) {
//   const turnCanContinue = Object.entries(siblingDiscs).some((sibling) => {
//     const siblingElement = sibling[1];
//     const siblingPreviouslyClicked =
//       siblingElement?.classList.contains("clicked");
//     return siblingPreviouslyClicked ? false : true;
//   });
//   return turnCanContinue;
// }

/**
 * Get all sibling discs around the disc passed.
 * @param {HTMLElement} disc - A specific disc element with data-id attribute.
 * @param {number} discsPerRow - number of discs rendered in a row. Must be an integer.
 * @returns All sibling discs.
 */
// function getSiblingDiscs(disc, discsPerRow) {
//   const allDiscs = document.getElementsByClassName("disc");
//   const dataId = Number(disc.getAttribute("data-id"));
//   if (dataId === undefined || isNaN(dataId)) {
//     throw new Error("the disc passed must have data-id attribute.");
//   }
//   // left and right side
//   const leftCondition = dataId % discsPerRow !== 0; // First disc in a row
//   const left = leftCondition && allDiscs[dataId - 1];
//   const rightCondition = (dataId + 1) % discsPerRow !== 0; // Last disc in a row
//   const right = rightCondition && allDiscs[dataId + 1];

//   // top side
//   const topId = dataId - discsPerRow;
//   const top = allDiscs[topId];
//   const topLeft = top && left && allDiscs[topId - 1];
//   const topRight = top && right && allDiscs[topId + 1];

//   // bottom side
//   const bottomId = dataId + discsPerRow;
//   const bottom = allDiscs[bottomId];
//   const bottomLeft = bottom && left && allDiscs[bottomId - 1];
//   const bottomRight = bottom && right && allDiscs[bottomId + 1];

//   /**
//    * Contains only valid siblings (not empty)
//    */
//   let allSibling = Object.entries({
//     left,
//     right,
//     top,
//     topLeft,
//     topRight,
//     bottom,
//     bottomLeft,
//     bottomRight,
//   });
//   allSibling = allSibling.filter((entry) => entry[1]);
//   allSibling = Object.fromEntries(allSibling);
//   return allSibling;
// }
