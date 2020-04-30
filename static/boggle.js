class Boggle{
  constructor(seconds = 60) {
    this.score = 0
    this.seconds = seconds
    this.timer
    this.words = []
    // this.highscore = this.getHighscore()
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
      this.addScore(word)
      return "That's a word!"
    } 
  }

  addScore(word) {
      this.score += word.length
      this.words.push(word)
      $('#score').text(`Score: ${this.score} `)
      console.log(this.score)
  }

  newGame() {
    this.words = []
    this.score=0
    this.setTimer()
    $('td').css('color', '#141414')
  }

  setTimer() {
    let time = this.seconds
    this.timer = setInterval(() => {
      $('#timer').text(`Timer: ${time}`)
      time--
      if (time < 0) {
        clearInterval(this.timer)
      }
    }, 1000)
  }

  async getHighscore() {
    const result = await axios.get('/game-over', {params: {score: this.score}})
    return result.data.highscore
  }

}

let game = new Boggle()

$('#submit-button').on('click', async function(e) {
  e.preventDefault()

  let word = $('#word').val()
  let result = await game.checkWord(word)

  $('#word').val('')

  $('.result').html(`<p>${result}</p>`)
}) 