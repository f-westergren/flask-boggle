from boggle import Boggle
from flask import Flask, session, request, render_template, flash, redirect

app = Flask(__name__)
boggle_game = Boggle()
app.config['SECRET_KEY'] = 'folke'


@app.route('/')
def homepage():
  
  session['board'] = boggle_game.make_board()

  return render_template('index.html', board=session['board'])

@app.route('/check-word')
def check_word():
    word = request.args['word']
    
    check_word = boggle_game.check_valid_word(session['board'], word)
    return ({'result': check_word})
    
