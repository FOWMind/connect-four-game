export default class AudioManager {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new AudioManager();
    }
    return this.instance;
  }

  preloadedSounds = {};
  soundPath = "./src/sounds/";
  sounds = {
    drop: this.soundPath + "drop.mp3",
    start: this.soundPath + "start.mp3",
    click: this.soundPath + "click.mp3",
    hover: this.soundPath + "hover.mp3",
    win: this.soundPath + "win.mp3",
    timeOver: this.soundPath + "time-over.mp3",
    openModal: this.soundPath + "pop-in.mp3",
    closeModal: this.soundPath + "pop-out.mp3",
  };

  /**
   * Preloads all of the sounds that will be used in the application/game.
   */
  preloadSounds() {
    const soundList = Object.entries(this.sounds);
    soundList.forEach((sound) => {
      const soundName = sound[0];
      const soundPath = sound[1];
      const newSound = new Audio(soundPath);
      newSound.preload = "auto";

      this.preloadedSounds[soundName] = newSound;
      if (Object.entries(this.preloadedSounds).length >= soundList.length) {
        console.log("all sounds preloaded");
      }
    });
  }

  /**
   * Stops the given sound.
   * @param {Audio} sound - The sound to stop.
   */
  stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
  }

  /**
   * Plays a sound by its name.
   * @param {string} soundName - The sound name to play (example: "click").
   */
  playSound(soundName) {
    const sound = this.preloadedSounds[soundName];
    if (!sound) return;
    this.stopSound(sound);
    sound.play().catch((err) => {
      console.warn(err);
    });
  }
}
