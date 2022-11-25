export default class Utils {
  lastIndex = -1;

  /**
   * Get all discs from the board.
   * @returns All discs found in the board.
   */
  getAllDiscs() {
    const discs = document.getElementsByClassName("disc");
    return [...discs];
  }

  getLastDiscAvailable(column) {
    const invalidIndex = this.lastIndex < column.children.length * -1;
    if (invalidIndex) return;

    const lastAvailable = Array.from(column.children).slice(this.lastIndex)[0];
    const currentDiscFilled = lastAvailable.classList.contains("filled");
    if (currentDiscFilled) {
      this.lastIndex--;
      return this.getLastDiscAvailable(column);
    }
    return lastAvailable;
  }
}
