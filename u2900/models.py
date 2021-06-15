"""SQLAlchemy models for Calorie Counter"""

from datetime import datetime, date
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

###########################################################
# DATABASE MODELS:


class FoodLog(db.Model):
    """Each food consumption entry."""

    __tablename__ = 'foodlogs'

    id = db.Column(
        db.Integer,
        primary_key = True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade")
    )

    food_id = db.Column(
        db.Integer,
        db.ForeignKey('foods.id', ondelete="cascade")
    )

    amount = db.Column(
        db.Integer,
        nullable=False
    )

    date = db.Column(
        db.DateTime,
        nullable=False,
        default=date.today()
    )

    user = db.relationship('User')

    food = db.relationship('Food')


class Food(db.Model):
    """Info of the foods."""

    __tablename__ = 'foods'

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    name = db.Column(
        db.Text,
        nullable=False,
        unique=True
    )

    unit_calories = db.Column(
        db.Integer,
        nullable=False
    )


class UserInfo(db.Model):
    """User details."""

    __tablename__ = 'userinfos'

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='cascade'),
        primary_key=True
    )

    calorie_limit = db.Column(
        db.Integer,
        nullable=False
    )

    calorie_need = db.Column(
        db.Integer,
        nullable=False
    )

    user = db.relationship('User')


class User(db.Model):
    """User credentials."""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True
    )

    password = db.Column(
        db.Text,
        nullable=False
    )




    ###   MODIFY THIS   ###
    # def __repr__(self):
    #     """Show info about the user."""
        
    #     return f"<User #{self.id}: {self.username}, {self.password}>"


    @classmethod
    def signup(cls, username, password):
        """
        Signup user.
        Hashes password and adds user to the system.
        """

        # .generate_password_hash()
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            password=hashed_pwd
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """
        Find user with `username` & `password`.
        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password,
        and if it finds such a user, returns that user object.
        If it cannot find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            # .check_password_hash()
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False



    

###########################################################
# DATABASE CONNECTION:

def connect_db(app):
    """Database connection function."""

    db.app = app
    db.init_app(app)
