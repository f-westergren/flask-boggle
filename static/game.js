$('#guess-form').on('submit', (e) => checkWord(e))

const CURRENT_SCORE = 0
let TIME = 5
let GUESSES = []
let timer

async function checkWord(e) {
	e.preventDefault()

	const word = $('#guess').val()
	// Send guess to server and await result (ok, not-a-word or not-on-board)
	const request = await axios.get('/check-word', { params: { word: word } })
	const response = request.data.result

	renderResult(response, word)
}

// Check response and render to base.html depending on word and result
function renderResult(response, word) {
	$('#current-guess').html(`Your guess is: <strong>${word}</strong>`)
	if (response === 'ok' && GUESSES.indexOf(word) === -1) {
		$('#guess-result').text("Great guess! That's a valid word!")
		CURRENT_SCORE += word.length
		GUESSES.push(word)
		$('#guess-list').append(` ${word}, `)
		$('#current-score').text(`Score: ${CURRENT_SCORE}`)
	} else if (response === 'not-on-board') {
		$('#guess-result').text("Not too shabby. It's a word alright, but it's not on the board. Try again!")
	} else if (response === 'not-word') {
		$('#guess-result').text("C'mon, that's not even a word!")
	}
	$('#guess').val('')
}

async function counter() {
	TIME--
	if (TIME === 0) {
		$('#submit-btn').prop('disabled', true)
		$('#restart-btn').text('Restart Game')
		clearTimeout(timer)
		await axios.post('/gameover', { score: CURRENT_SCORE })
	}
	$('#timer').text(TIME)
	timer = setTimeout(() => {
		counter()
	}, 1000)

}

async function endGame() {
	// Disable submit button
	$('#submit-btn').prop('disabled', true)

	// Send current score to back-end
	
}

function restartGame() {
	console.log('clicked!')
	$('#submit-btn').prop('disabled', false)
	clearInterval(timer, 1000)
}

$('#restart-btn').on('click', function() {
	$('#submit-btn').prop('disabled', false)
	counter()
	
})