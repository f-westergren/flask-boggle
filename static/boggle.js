class Boggle{
  constructor(seconds = 60) {
    this.score = 0
    this.seconds = seconds
    this.timer
    this.words = []
    this.highscore
  }

  async checkWord(word) {
    const result = await axios.get('/check-word', {params: {word: word}})
    const res = result.data.result

    if (this.words.includes(word)) {
      return 'You have already used that word!'
    } else if (res === 'not-word') {
      return "That's not a word!"
    } else if (res === 'not-on-board') {
      return "That word is not on the board!"
    } else if (res === 'ok') {
      return "That's a word!"
    } 
  }

  addScore(word) {
      this.score += word.length
      this.words.push(word)
      return this.score
  }

  newGame() {
    this.words = []
    this.score=0
    clearInterval(this.timer)
    this.setTimer()
  }

  setTimer() {
    let time = this.seconds
    this.timer = setInterval(() => {
      $('#timer').text(`Timer: ${time}`)
      time--
      if (time < 0) {
        this.endGame()
      }
    }, 1000)
  }

  async renderHighscore() {
    const result = await axios.get('/game-over', {params: {score: this.score}})
    const res = result.data.highscore
    $('#highscore').text(` (Best: ${res})`)
  }

  async endGame() {
    clearInterval(this.timer)
    this.renderHighscore()
    $('#submit-button').prop('disabled', true)
  }
}
