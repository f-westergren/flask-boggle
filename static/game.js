$('#guess-form').on('submit', (e) => checkWord(e))

CURRENT_SCORE = 0
TIMER = 60
GUESSES = []

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

const timer = setInterval(() => {
	$('#timer').text(`${TIMER}`)
	TIMER -= 1
	if (TIMER === 0) {
		$('#timer').text("TIME'S UP!")
		clearInterval(timer)
		endGame()
		$('#restart-btn').show()
	}
}, 1000)

async function endGame() {
	// Disable submit button
	$('#submit-button').prop('disabled', true)

	// Send current score to back-end
	await axios.post('/gameover', { score: CURRENT_SCORE })
}

function restartGame() {
	console.log('clicked!')
	$('#submit-button').prop('disabled', false)
	TIMER = 60
	setInterval(timer, 1000)
}
