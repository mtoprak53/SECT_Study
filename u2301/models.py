"""Models for Blogly."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)


class User(db.Model):
    """User Model"""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    first_name = db.Column(db.String(20), nullable=False)

    last_name = db.Column(db.String(20), nullable=False)

    image_url = db.Column(db.String(200), default="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqFCpRqRXjxV_7FnE8tv-8zD5oVAG8Mmz2wQ&usqp=CAU")