from flask import Flask, request, render_template, redirect, flash, session, jsonify
# from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'folke'

# debug = DebugToolbarExtension(app)

@app.route('/')
def start_game():
    """ Generate game html"""

    # Create board and store it in session
    session['board'] = boggle_game.make_board()

    # If player has played before, add session info for highest score and times played.
    highscore = session.get('highscore', 0)
    times_played = session.get('times_played', 0)

    return render_template('game.html', board = session['board'], times_played = times_played, highscore = highscore)
  
@app.route('/check-word')
def check_word():
    word = request.args['word']
    check_word = boggle_game.check_valid_word(session['board'], word)

    return ({'result': check_word})


@app.route('/gameover', methods=['POST'])
def get_score():
    """ Add highscore and times_played to session """

    # If highscore exists, check if current score from front-end is higher or not.
    if 'highscore' in session:
        if session['highscore'] < request.json['score']:
            session['highscore'] = request.json['score']
    else:
        session['highscore'] = request.json['score']

    # Increment times_played by one
    session['times_played'] = session.get('times_played', 0) + 1

    return ''