"""Blogly application."""

from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "sikontopokonto753468"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)


connect_db(app)
# db.create_all()

# route - 1
@app.route('/')
def home_page():
    """start page"""

    return redirect('/users')
    

# route - 2
@app.route('/users')
def users_page():
    """listing all users"""

    users = User.query.all()
    return render_template('users.html', users=users)


# route - 3
@app.route('/users/new')
def add_user_form():
    """form for new user"""

    return render_template('new_user.html')


# route - 4
@app.route('/users/new', methods=["POST"])
def adding_user():
    """adding new user"""

    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    image_url = request.form["image_url"]

    new_user = User(first_name=first_name, last_name=last_name, image_url=image_url)
    db.session.add(new_user)
    db.session.commit()

    return redirect('/users')


# route - 5
@app.route('/users/<int:user_id>')
def show_user(user_id):
    """Show details about a user"""

    user = User.query.get_or_404(user_id)
    return render_template('profile.html', user=user)


# route - 6
@app.route('/users/<int:user_id>/edit')
def edit_user(user_id):
    """Editing the User"""

    user = User.query.get_or_404(user_id)
    return render_template('profile_edit.html', user=user)


# route - 7
@app.route('/users/<int:user_id>/edit', methods=["POST"])
def save_edited_user(user_id):
    """Saving the user edit"""

    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    image_url = request.form["image_url"]

    user = User.query.get_or_404(user_id)

    user.first_name = first_name
    user.last_name = last_name    
    user.image_url = image_url
    
    db.session.commit()

    return redirect('/')


# route - 8
@app.route('/users/<int:user_id>/delete', methods=["POST"])
def delete_user(user_id):
    """Deleting a user"""

    User.query.filter_by(id=user_id).delete()

    db.session.commit()

    return redirect('/users')