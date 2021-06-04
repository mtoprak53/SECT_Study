"""SQLAlchemy models for Calorie Counter"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

###########################################################
# DATABASE MODELS:


class FoodLog(db.Model):
    """
    """

    __tablename___ = 'foodlogs'

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key=True
    )

    food_id = db.Column(
        db.Integer,
        db.ForeignKey('foods.id', ondelete="cascade"),
        primary_key=True
    )

    amount = db.Column(
        db.Integer,
        nullable=False
    )

    date = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )


class Food(db.Model):
    """
    """

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
        nullable=False`
    )


class User(db.Model):
    """
    """

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

    @classmethod
    def signup(cls, username, password):
        """Signup user.
        Hashes password and adds user to the system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            password=hashed_pwd
        )

        db.session.add(user)
        return user


###########################################################
# DATABASE CONNECTION:

def connect_db(app):
    """Database connection function."""

    db.app = app
    db.init_app(app)
