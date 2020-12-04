from flask import Flask, request, render_template, redirect, session, jsonify

from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle

app = Flask(__name__)
# CORS(app)
app.config['SECRET_KEY'] = "nabukadnezzar1923"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.debug = False

# session cookie security issues
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)

toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def create_the_board():
    """ """
    board = boggle_game.make_board()
    session['board'] = board
    session['words'] = []
    high_score = session.get('high-score', 0)
    play_count = session.get('play-count', 0)

    # session keys control
    print(session.keys())
    
    return render_template('form.html', board=board, high_score=high_score, play_count=play_count)


@app.route('/add-word')
def new_word():
    """ """
    # word = request.json['word']
    word = request.args['word']
    board = session.get('board', None)

    # check the validity of the word
    res = boggle_game.check_valid_word(board, word)

    words = session.get('words', [])
    words.append(word)
    session['words'] = words

    # session keys control
    print(session.keys())

    return jsonify(result=res)


@app.route('/clear-history', methods=['POST'])
def clear_history():
    """ """
    
    session.clear()

    # session keys control
    print(session.keys())

    return jsonify(highScore=0, playCount=0)


@app.route('/send-numbers', methods=['POST'])
def send_numbers():
    """ """
    high_score = session.get('high-score', 0)
    play_count = session.get('play-count', 0)
    return jsonify(highScore=high_score, playCount=play_count)


@app.route('/get-numbers', methods=['POST'])
def get_numbers():
    """ """
    high_score = request.json['high_score']
    play_count = request.json['play_count']
    session['high-score'] = high_score
    session['play-count'] = play_count

    # session value control
    print(f"session['high-score']  ==>>  {session['high-score']}")
    print(f"session['play-count']  ==>>  {session['play-count']}")
    print(session.keys())

    return jsonify(playCount=play_count, highScore=high_score)