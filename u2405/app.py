from flask import Flask, render_template, redirect, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from werkzeug.exceptions import Unauthorized

from models import connect_db, db, User, Feedback, you_are_not_authorized, no_authorization
from forms import RegisterForm, LoginForm, FeedbackForm
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres:///feedback_db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "xox555"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False


connect_db(app)


toolbar = DebugToolbarExtension(app)


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register_form():

    # logged in user
    if 'user_name' in session:
        flash("You are already logged in", 'danger')
        return redirect(f"/users/{session['user_name']}")

    form = RegisterForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        email = form.email.data
        first_name = form.first_name.data
        last_name = form.last_name.data
        new_user = User.register(
            username, password, email, first_name, last_name)
        
        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            form.username.errors.append("Username taken. Pick another.")
            form.email.errors.append("Email taken. Pick another.")
            return render_template('register.html', form=form)
        
        session['user_name'] = new_user.username
        flash(f"Welcome {new_user.username}, successfully created your account!", 'success')
        return redirect(f"/users/{new_user.username}")

    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login_user():

    # logged in user
    if 'user_name' in session:
        flash("You are already logged in", 'danger')
        return redirect(f"/users/{session['user_name']}")
    
    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username, password)  # <User> or False
        if user:
            flash(f"Welcome back, {user.username}!", "info")
            session['user_name'] = user.username
            return redirect(f"/users/{user.username}")
        else:
            flash("Wrong username or/and password!", "danger")

    return render_template('/login.html', form=form)


@app.route('/users/<username>')
def show_user(username):

    # Are you authorized (functions are in models file)
    if you_are_not_authorized(username):
        return no_authorization(username)

    user = User.query.get_or_404(username)
    user_feedbacks = Feedback.query.filter(Feedback.username==user.username).all()

    return render_template('user.html', user=user, feedbacks=user_feedbacks)


@app.route('/users/<username>/delete', methods=['POST'])
def delete_user(username):

    # Are you authorized (functions are in models file)
    if you_are_not_authorized(username):
        return no_authorization(username)

    user = User.query.get_or_404(username)

    user_feedbacks = Feedback.query.filter(Feedback.username==user.username).all()
    for uf in user_feedbacks:
        db.session.delete(uf)
    db.session.commit()

    db.session.delete(user)
    db.session.commit()

    flash(f"{user.username} account and its feedbacks permanently deleted!!", 'danger')

    return redirect('/logout')


@app.route('/users/<username>/feedback/add', methods=['GET', 'POST'])
def add_feedback(username):

    # Are you authorized (functions are in models file)
    if you_are_not_authorized(username):
        return no_authorization(username)

    form = FeedbackForm()

    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data
        new_feedback = Feedback(title=title, 
                                content=content, 
                                username=username)
        db.session.add(new_feedback)
        db.session.commit()
        flash("Feedback created!", 'success')
        return redirect(f"/users/{username}")

    return render_template('feedback_add.html', form=form)


@app.route('/feedback/<int:id>/update', methods=['GET', 'POST'])
def update_feedback(id):

    feedback = Feedback.query.get_or_404(id)
    username = feedback.username

    # Are you authorized (functions are in models file)
    if you_are_not_authorized(username):
        return no_authorization(username)

    form = FeedbackForm(obj=feedback)  # <<==  obj keyword argument !!!

    if form.validate_on_submit():
        feedback.title = form.title.data
        feedback.content = form.content.data
        db.session.commit()
        flash("Feedback updated!", 'success')
        return redirect(f"/users/{username}")

    return render_template('feedback_update.html', form=form)


@app.route('/feedback/<int:id>/delete', methods=['POST'])
def delete_feedback(id):

    feedback = Feedback.query.get_or_404(id)
    username = feedback.username

    # Are you authorized (functions are in models file)
    if you_are_not_authorized(username):
        return no_authorization(username)
    
    db.session.delete(feedback)
    db.session.commit()

    flash("Feedback has been deleted!!", 'danger')
    
    return redirect(f"/users/{username}")


@app.route('/logout')
def logout_user():
    flash(f"Goodbye, {session['user_name']}!", 'info')
    session.pop('user_name')
    return redirect('/')