import API from "./api.js"

export default class Bot {
  constructor(config) {
    this.sampleState = config.state
    this.api = new API("http://localhost:3000")
    this.maxCodeTries = 10
  }

  async ask(prompt) { return await this.api.getAnswer(prompt) }
  async askYN(prompt) { return await this.api.getAnswerYN(`${prompt} (y/n)`) }
  async askCode(prompt, tries=this.maxCodeTries) {
    if (tries <= 0) {
      console.error(`max tries of ${this.maxCodeTries} reached in askCode for prompt: ${prompt}`)
      return null
    }
    const code = await this.ask(prompt)
    if (this._isValidCode(code)) return code
    return await this.askCode(prompt, tries - 1)
  }

  // internal

  _isValidCode(code) {
    try {
      const newState = new Function(code)(this.sampleState)
      // verify returns updated state with same attributes
      if (!newState) return false
      for (const key in this.sampleState) {
        if (!newState.hasOwnProperty(key)) {
          throw new Error(`new state missing key: ${key}`)
        }
      }
      for (const key in newState) {
        if (!this.sampleState.hasOwnProperty(key)) {
          throw new Error(`new state has extra key: ${key}`)
        }
      }
      return true
    } catch (e) {
      console.warn(e)
      return false
    }
  }
}