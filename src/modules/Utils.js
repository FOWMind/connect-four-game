const initialLastDiscPositionY = 6;
let lastDiscPositionY = initialLastDiscPositionY;

export default class Utils {
  /**
   * Get all discs from the board.
   * @returns All discs found in the board.
   */
  getAllDiscs() {
    const discs = document.getElementsByClassName("disc");
    return [...discs];
  }

  /**
   * Handle the calls for getting the last available disc for filling.
   * @param {HTMLElement} clickedDisc - The clicked disc element.
   * @returns The last available disc for filling.
   */
  handleLastAvailableDisc(clickedDisc) {
    lastDiscPositionY = initialLastDiscPositionY;
    const lastAvailablePositionX = clickedDisc.getAttribute("position-x");
    return this.getLastAvailableDisc(lastAvailablePositionX);
  }

  /**
   * Get the last available disc in the current column (found by the clicked disc position-x) for filling.
   * @param {number | string} positionX - The current position-x from the clicked disc. Must be an integer.
   * @returns The last available disc for filling if there is one, otherwise null.
   */
  getLastAvailableDisc(positionX) {
    const invalidPositionY = lastDiscPositionY < 1;
    if (invalidPositionY) return;

    const position = { x: positionX, y: lastDiscPositionY };
    const lastAvailable = document.querySelector(
      `[position-x="${position.x}"][position-y="${position.y}"]`
    );
    if (!lastAvailable) return null;

    const invalidLastAvailable = lastAvailable.classList.contains("filled");
    if (invalidLastAvailable) {
      lastDiscPositionY--;
      return this.getLastAvailableDisc(positionX);
    }
    return lastAvailable;
  }
}
