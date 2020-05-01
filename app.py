from boggle import Boggle
from flask import Flask, session, request, render_template, flash, redirect

app = Flask(__name__)
boggle_game = Boggle()
app.config['SECRET_KEY'] = 'folke'


@app.route('/')
def homepage():
    """ Renders empty board on first page, no need for session here as this """
    """ board won't be used."""
    
    return render_template('home.html', board=boggle_game.make_board())

@app.route('/start')
def start_game():    
    """Renders board on start page and stores board in session"""
    session['board'] = boggle_game.make_board()

    return render_template('start.html', board=session['board'])


@app.route('/check-word')
def check_word():
    word = request.args.get('word', 'no-word-submitted')   
    print(word)
    check_word = boggle_game.check_valid_word(session['board'], word)
    return ({'result': check_word})
    
@app.route('/game-over')
def game_over():

    score = int(request.args.get('score', 0))
    highscore = int(session.get('highscore', 0))
    
    if score>highscore:
        session['highscore'] = score
    
    print(session.get('highscore', 0))
    print(score)

    return ({'highscore': session['highscore']})

@app.route('/new-game')
def new_game():
    
    return redirect('/start')