export default class AudioManager {
  soundPath = "./src/sounds/";
  sounds = {
    drop: this.soundPath + "drop.mp3",
    start: this.soundPath + "start.mp3",
    click: this.soundPath + "click.mp3",
    hover: this.soundPath + "hover.mp3",
    win: this.soundPath + "win.mp3",
  };

  /**
   * Create an audio instance from sound name.
   * @param {string} soundName - The desired sound name to create (example: "click").
   * @returns The audio instance.
   */
  createAudio(soundName) {
    if (!this.sounds[soundName]) {
      throw new Error("Invalid sound name.");
    }
    const audio = new Audio(this.sounds[soundName]);
    return audio;
  }

  /**
   * Plays a sound by its name.
   * @param {string} soundName - The sound name to play (example: "click").
   */
  playSound(soundName) {
    const sound = this.createAudio(soundName);
    sound.play().catch((err) => {
      console.warn(err);
    });
  }
}
