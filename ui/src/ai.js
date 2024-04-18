import TaskManager from './task_manager.js'
import Task from './task.js'

export default class AI extends TaskManager {
  constructor(config, bot) {
    super(config)
    this.bot = bot
    this.recent = ["spawned"]
    this.maxDepth = 10
    // aliases
    this.stateAttributes = Object.keys(config.state)
  }

  // external

  async nextTask(state) {
    // TODO
    const name = await this._nameNextTask(state)
    const task = this.tasks[name] ?? await this._genTask(name)
    this._track(task)
    return task
  }

  // internal

  async _genTask(name) {
    // i assume it knows that:
    // - the method should compile
    // - elements from the state should not be removed/added
    const prompt = `given ${this._scenario(true)}, write a method for the task "${name}" that returns the next state`
    const code = await this.bot.ask(prompt)
    // TODO hyperparam or check; make sure the bot doesnt remember everything or remember nothing, ie that this method doesnt always return the same value
    const worthRemembering = await this.bot.askYN(`given ${this._scenario()}, is it worth remembering that I just "${name}"?`)
    const task = new Task(name, code, worthRemembering)
    this.tasks[name] = task
    return task
  }

  async _nameNextTask(state, depth=this.maxDepth) {
    if (depth <= 0) {
      console.error(`max depth of ${this.maxDepth} reached in _nameNextTask for prompt: ${prompt}`)
      return null
    }
    const prompt = `given ${this._scenario(true, true)}, what task should be done next?`
    const name = await this.bot.ask(prompt)
    if (this.tasks[name]) return name
    // try again if theres a close match, until a repeat indicision then fallback to previous
    const closeMatch = await this.bot.askYN(`did you mean to do the same task you did before?`)
    if (closeMatch) {
      newName = await this._nameNextTask(state, depth - 1)
      if (newName) name = newName 
    }
    return name
  }

  // descriptions
  
  _scenario(includeRecent=false, includeTasks=false) {
    var conditions = [
      'you win if ' + this.config.winDescription,
      'you lose if ' + this.config.failDescription,
      'your actions include ' + this._actionsDescription(),
    ]
    if (includeRecent) conditions.push('you recently ' + this._recentDescription())
    if (includeTasks) conditions.push('previous task names include' + this._comma(Object.keys(this.tasks)))
    return `a world with attributes ${this._stateDescription()} where ${this._comma(conditions)}`
  }
  _stateDescription() { return this._comma(this.config.stateAttributes()) }
  _actionsDescription() { return `${this._comma(this.config.actionInputs)} with float values ranging from -1 to 1` }
  _recentDescription() { return this._comma(this.recent) }

  // helpers

  _track(task) {
    if (!task.worthRemembering) return
    this.recent.push(task.name)
    if (this.recent.length <= this.config.recentTasks) return
    this.recent.shift()
  }

  _comma(arr) { //  "x, y, and z"
    if (arr.length == 1) return arr[0]
    if (arr.length == 2) return `${arr[0]} and ${arr[1]}`
    return `${arr.slice(0, -1).join(", ")}, and ${arr.slice(-1)}`
  }
}