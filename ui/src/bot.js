import API from "./api.js"

export default class Bot {
  constructor() {
    this.api = new API()
    this.maxDepth = 10
  }

  async ask(prompt) { return await this.api.getAnswer(prompt) }

  async askYN(prompt, depth=this.maxDepth) {
    if (depth <= 0) {
      console.error(`max depth of ${this.maxDepth} reached in askYN for prompt: ${prompt}`)
      return false
    }
    const answer = await this.ask(`${prompt} (y/n)`)
    const firstChar = answer[0].toLowerCase()
    switch (firstChar) {
      case "y": return true
      case "n": return false
      default: return this.askYN(prompt, depth - 1)
    }
  }
}