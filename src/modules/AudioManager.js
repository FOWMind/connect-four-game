export default class AudioManager {
  /**
   * Create an audio instance from sound name.
   * @param {string} soundName - The desired sound name to create (example: "pop").
   * @returns The audio instance.
   */
  createAudio(soundName) {
    const paths = {
      pop: "./src/sounds/pop.mp3",
    };
    if (!paths[soundName]) {
      throw new Error("Sound name is required.");
    }
    const audio = new Audio(paths[soundName]);
    return audio;
  }

  /**
   * Plays a sound by its name.
   * @param {string} soundName - The sound name to play (example: "pop").
   */
  playSound(soundName) {
    const sound = this.createAudio(soundName);
    sound.play();
  }
}
