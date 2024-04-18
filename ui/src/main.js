import Config from './config.js'
import AI from './ai.js'
import Bot from './bot.js'
import Game from './game.js'

function setup() {
  const config = new Config(
    // state
    { x: 0, y: 0 },
    // actionInputs
    ['horizontal', 'vertical'],
    // task cycleLength
    3,
    // hasWon
    (state) => state.y > 10,
    // hasFailed
    (state) => state.y < -10,
    // winDescription
    "your y is greater than 10",
    // failDescription
    "your y is less than -10",
    // onWin
    () => {
      console.log('you win')
      return true // done playing
    },
    // onFail
    () => {
      console.log('game over')
      return false // not done playing
    }
  )

  // start
  new Game(config, new AI(config, new Bot())).start()
}


window.onload = setup
