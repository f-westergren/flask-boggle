let game = new Boggle()

$('#submit-button').on('click', (e) => submitWord(e)) 
$('#restart-button').on('click', (e) => restartGame(e))

async function submitWord(e) {
  e.preventDefault()

  let word = $('#word').val()
  let result = await game.checkWord(word)

  if (result === "That's a word!") {
    $('#score').text(`Score: ${game.addScore(word)}`)
  }

  $('#word').val('')
  $('.result').html(`<p>${result}</p>`)
}

function restartGame(e) {
  e.preventDefault;
  $('#submit-button').prop('disabled', false)
  $('#restart-button').text('Restart Game')
  $('td').css('color', '#141414')
  $('#score').text('Score: 0')

  game.newGame()
}