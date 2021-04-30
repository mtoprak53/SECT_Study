from flask import flash, redirect, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


db = SQLAlchemy()

bcrypt = Bcrypt()


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)


class User(db.Model):
    """DB Model for users"""

    __tablename__ = 'users'

    username = db.Column(db.String(20), 
                         nullable=False, 
                         primary_key=True, 
                         unique=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)

    feedback = db.relationship("Feedback", 
                                backref="user", 
                                cascade="all, delete")

    # start of convenience class methods

    @classmethod
    def register(cls, username, pwd, email, first_name, last_name):
        """Register user w/ hashed password & return user."""

        hashed = bcrypt.generate_password_hash(pwd)
        # turn byte-string into normal (unicode utf-8) string
        hashed_utf8 = hashed.decode("utf8")

        # return instance of user w/ username & hashed pwd
        return cls(username=username, password=hashed_utf8, email=email, first_name=first_name, last_name=last_name)

    @classmethod
    def authenticate(cls, username, pwd):
        """Validate that user exists & password is correct.
        Return user if valid, else return False."""

        u = User.query.filter_by(username=username).first()

        if u and bcrypt.check_password_hash(u.password, pwd):
            # return user instance
            return u
        else:
            return False
            
    @property
    def full_name(self):
        """Return full name of user."""
        return f"{self.first_name} {self.last_name}"


class Feedback(db.Model):
    """DB Model for feedbacks"""

    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(20), 
                         db.ForeignKey('users.username'),
                         nullable=False)


def you_are_not_authorized(username):
    """returns True for not authorized cases"""

    return ('user_name' not in session) or (username != session['user_name'])


def no_authorization(username):
    """handles the routing of not authorized cases"""

    # no logged in user
    if 'user_name' not in session:
        flash("Please login first!", 'danger')
        return redirect('/login')

    # logged in user is not the wanted user
    if session['user_name'] != username:
        flash("You are not authorized!", 'danger')
        return redirect(f"/users/{session['user_name']}")