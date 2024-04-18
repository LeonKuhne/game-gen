export default class Config {
  constructor(state, actionInputs, cycleLength, hasWon, hasFailed, winDescription, failDescription, onWin, onFail) {
    this.state = state                     // initial state
    this.actionInputs = actionInputs       // names mapping to float input values ranging -1 to 1
    this.cycleLength = cycleLength         // how many tasks back to use to compute the next task
    this.hasWon = hasWon                   // given the state returns true on win condition
    this.hasFailed = hasFailed             // given the state returns true on fail condition
    this.winDescription = winDescription   // description following the prompt format, you win if x
    this.failDescription = failDescription // description following the prompt format, you fail if x
    this.onWin = onWin                     // method to display game win
    this.onFail = onFail                   // method to display gameover
  }

  stateAttributes() { return Object.keys(this.state) }
}