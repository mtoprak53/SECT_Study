from flask import Flask, request, render_template, redirect, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from surveys import Survey, Question, satisfaction_survey

app= Flask(__name__)

app.config['SECRET_KEY'] = 'azkabantutsagi7265'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

responses = []
number_of_questions = len(satisfaction_survey.questions)

@app.route('/')
def home_page():
  """Shows home page"""
  global responses
  responses = []
  title = satisfaction_survey.title
  instructions = satisfaction_survey.instructions
  return render_template('/home.html', survey_title=title, survey_instructions=instructions)


@app.route('/questions/<i>')
def show_question(i):
  # print(i, type(i))
  print(i, len(responses))

  if int(i) != len(responses):
    flash("Please follow onsite guidance", 'error')
    # i = len(responses)
    return redirect(f"/questions/{str(len(responses))}")

  question = satisfaction_survey.questions[int(i)].question
  choices = satisfaction_survey.questions[int(i)].choices
  return render_template('/questions.html', survey_question=question, survey_choices=choices, x=int(i)+1, noq=number_of_questions)

@app.route('/answer', methods=['POST'])
def save_answer():
  responses.append(request.form['question'])
  # return redirect('questions/<i>')

  # import pdb
  # pdb.set_trace()

  length_of_responses = len(responses)
  print(length_of_responses, number_of_questions)
  
  if number_of_questions > length_of_responses:
    return redirect(f"/questions/{str(len(responses))}")
  else:
    return render_template("/thanks.html")


  