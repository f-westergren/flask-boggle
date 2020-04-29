class Boggle{
  constructor(seconds = 5) {
    this.score = 0
    this.seconds = seconds
    this.timer
  }

  async checkWord(word) {
    const res = await axios.get('/check-word', {params: {word: word}})
    if (res.data.result === 'ok') {
      console.log(res.data.result)
      this.addScore(word)
    } 
    
    return res.data.result
  }

  addScore(word) {
      this.score += word.length
      $('#score').text(`Score: ${this.score}`)
  }

  newGame() {
    this.score=0
  }

  setTimer() {
    let time = this.seconds
    this.timer = setInterval(() => {
      $('#timer').text(`Timer: ${time}`)
      console.log(time)
      time--
      if (time < 0) {
        clearInterval(this.timer)
      }
    }, 1000)
  }
}

let game = new Boggle()

$('#submit-button').on('click', async function(e) {
  e.preventDefault()

  let word = $('#word').val()
  let result = await game.checkWord(word)

  $('.result').html(`<p>${result}</p>`)
}) 