from flask import Flask, request, render_template, redirect, flash, jsonify
from flask import session
from flask_debugtoolbar import DebugToolbarExtension

from surveys import Survey, Question, satisfaction_survey

app= Flask(__name__)

app.config['SECRET_KEY'] = 'azkabantutsagi7265'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

number_of_questions = len(satisfaction_survey.questions)

@app.route('/')
def home_page():
  """Shows home page"""

  # clear session for a new survey
  if session:
    session.pop('responses')

  title = satisfaction_survey.title
  instructions = satisfaction_survey.instructions
  return render_template('/home.html', survey_title=title, survey_instructions=instructions)


@app.route('/new', methods=["POST"])
def session_init():
  """Creates empty respose list"""
  session["responses"] = []
  return redirect('/questions/0')


@app.route('/questions/<i>')
def show_question(i):
  r = session["responses"]

  # make sure to show only the next question in the survey
  if int(i) != len(r):
    flash("Please follow onsite guidance", 'error')
    return redirect(f"/questions/{str(len(r))}")

  question = satisfaction_survey.questions[int(i)].question
  choices = satisfaction_survey.questions[int(i)].choices
  return render_template('/questions.html', survey_question=question, survey_choices=choices, x=int(i)+1, noq=number_of_questions)


@app.route('/answer', methods=['POST'])
def save_answer():

  # get the new response and add to session
  new_answer = request.form['question']
  r = session["responses"]
  r.append(new_answer)
  session["responses"] = r
  
  # check if the survey is over
  if number_of_questions > len(r):
    return redirect(f"/questions/{str(len(r))}")
  else:
    return render_template("/thanks.html")
  