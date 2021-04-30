"""Blogly application."""

from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Post

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
    return render_template('profile_add.html')

# route - 4
@app.route('/users/new', methods=["POST"])
def adding_user():
    """adding new user"""
    new_user = User(
        first_name=request.form["first_name"],
        last_name=request.form["last_name"],
        image_url=request.form["image_url"]
        )
    db.session.add(new_user)
    db.session.commit()
    return redirect('/users')

# route - 5
@app.route('/users/<int:user_id>')
def show_user(user_id):
    """Show details about a user"""
    user = User.query.get_or_404(user_id)
    posts = user.posts
    return render_template('profile_detail.html', user=user, posts=posts)

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
    user = User.query.get_or_404(user_id)
    user.first_name = request.form["first_name"]
    user.last_name = request.form["last_name"]
    user.image_url = request.form["image_url"]
    db.session.commit()
    return redirect('/')

# route - 8
@app.route('/users/<int:user_id>/delete', methods=["POST"])
def delete_user(user_id):
    """Deleting a user"""
    User.query.filter_by(id=user_id).delete()
    db.session.commit()
    return redirect('/users')

# PART - II
# ---------
# route - 9
@app.route('/users/<int:user_id>/posts/new')
def add_new_post(user_id):
    """Writing new post."""
    user = User.query.get_or_404(user_id)
    return render_template('post_add.html', user=user)

# route - 10
@app.route('/users/<int:user_id>/posts/new', methods=["POST"])
def save_new_post(user_id):
    """Saving the new post."""    
    post = Post(
        title = request.form['title'],
        content = request.form['content'],
        user_id = user_id
    )
    db.session.add(post)
    db.session.commit()
    return redirect(f'/users/{user_id}')

# route - 11
@app.route('/posts/<int:post_id>')
def show_post(post_id):
    """Show post details."""
    post = Post.query.get_or_404(post_id)
    user = post.users
    return render_template('post_detail.html', post=post, user=user)

# route - 12
@app.route('/posts/<int:post_id>/edit')
def edit_post(post_id):
    """Editing the post."""
    post = Post.query.get_or_404(post_id)
    return render_template('post_edit.html', post=post)

# route - 13
@app.route('/posts/<int:post_id>/edit', methods=["POST"])
def save_edited_post(post_id):
    """X"""
    post = Post.query.get_or_404(post_id)    
    post.title = request.form["title"]
    post.content = request.form["content"]
    db.session.commit()
    return redirect(f"/posts/{post_id}")

# route - 14
@app.route('/posts/<int:post_id>/delete', methods=["POST"])
def delete_post(post_id):
    """Deleting a post."""
    post = Post.query.get_or_404(post_id)
    user_id = post.user_id
    Post.query.filter_by(id=post_id).delete()
    db.session.commit()
    return redirect(f"/users/{user_id}")
