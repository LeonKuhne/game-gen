export default class Game {
  constructor(config, taskManager) {
    this.config = config
    this.taskManager = taskManager
    this.state = { ...config.state }
    this.task = null
    this.playing = false
  }

  async start() { 
    let isDonePlaying = false
    while (!isDonePlaying) {
      isDonePlaying = await this._play() 
    }
  }

  stop() { this.playing = false }

  // internal
  
  // @returns true if done playing, false otherwise
  async _play() {
    this.playing = true
    while (this.playing) {
      this.task = await this.taskManager.nextTask(this.state)
      this.state = this.task.do(this.state)
      if (this.config.hasWon   (this.state)) return this.config.onWin()
      if (this.config.hasFailed(this.state)) return this.config.onFail()
    }
    return true
  }
}