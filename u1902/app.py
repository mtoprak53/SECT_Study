from flask import Flask, request, render_template
from stories import story

app = Flask(__name__)


@app.route('/')
def home_page():
  return render_template('home.html', words=story.prompts)

@app.route('/story')
def tell_story():
  words = story.prompts
  answers = {}
  for word in words:
    answers[word] = request.args[word]
  text = story.generate(answers)
  return render_template('story.html', text=text)

