"""Models for Blogly."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect this database to provided Flask app."""
    db.app = app
    db.init_app(app)


class User(db.Model):
    """User Model"""

    __tablename__ = 'users'

    # columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, nullable=False,
                          default="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqFCpRqRXjxV_7FnE8tv-8zD5oVAG8Mmz2wQ&usqp=CAU")

    # relationships
    posts = db.relationship('Post', backref='users')   # User <--> Post

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    # property version
    @property
    def full_name(self):
        """Return full name of user."""
        return f"{self.first_name} {self.last_name}"


class Post(db.Model):
    """Post Model"""
    __tablename__ = 'posts'

    # columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    user_id = db.Column(db.Integer, 
                        db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
        
    @property
    def friendly_date(self):
        """Return nicely-formatted date."""
        return self.created_at.strftime("%a %b %-d %Y, %-I:%M %p")

    # relationships
    matches = db.relationship('PostTag', backref='post', cascade="all, delete-orphan")   # Post <--> PostTag
    tags = db.relationship('Tag', secondary='post_tags', backref='posts')   # Post <--> Tag


class Tag(db.Model):
    """Tag Model"""
    __tablename__ = 'tags'

    # columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, unique=True)

    # relationships
    matches = db.relationship('PostTag',backref='tag', cascade="all, delete-orphan")   # Tag <--> PostTag


class PostTag(db.Model):
    """PostTag Model"""
    __tablename__ = 'post_tags'

    # columns
    post_id = db.Column(db.Integer, 
                        db.ForeignKey('posts.id'),
                        primary_key=True)
    tag_id = db.Column(db.Integer, 
                       db.ForeignKey('tags.id'),
                       primary_key=True)

