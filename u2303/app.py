"""Blogly application."""

from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Post, Tag, PostTag

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "sikontopokonto753468"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
toolbar = DebugToolbarExtension(app)

connect_db(app)
db.create_all()

# 404 error special route
@app.errorhandler(404)
def page_not_found(e):
    """Show custom 404 error page."""
    # the 404 status is set explicitly
    return render_template('404.html'), 404

# route - 1
@app.route('/')
def home_page():
    """start page"""
    posts = Post.query.order_by(Post.created_at.desc()).limit(5).all()
    return render_template('home.html', posts=posts)

# route - 2
@app.route('/users')
def users_page():
    """listing all users"""
    users = User.query.order_by(User.last_name.asc(), 
                                User.first_name.asc()).all()
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
        image_url=request.form["image_url"] or None)
    

    db.session.add(new_user)
    db.session.commit()
    flash(f"New User \"{new_user.full_name}\" saved successfully.", 'success')
    return redirect('/users')


# route - 5
@app.route('/users/<int:user_id>')
def show_user(user_id):
    """Show details about a user"""
    user = User.query.get_or_404(user_id)
    return render_template('profile_detail.html', user=user)

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

    # fixes empty image_url entries
    if not user.image_url:
        user.image_url = None

    db.session.add(user)
    db.session.commit()
    flash(f"User \"{user.full_name}\" edit saved successfully.", 'success')
    return redirect('/users')

# route - 8
@app.route('/users/<int:user_id>/delete', methods=["POST"])
def delete_user(user_id):
    """Deleting a user"""
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    flash(f"{user.full_name} deleted successfully.", 'success')
    return redirect('/users')

# PART - II
# ---------
# route - 9
@app.route('/users/<int:user_id>/posts/new')
def add_new_post(user_id):
    """Writing new post."""
    user = User.query.get_or_404(user_id)
    tags = Tag.query.all()
    return render_template('post_add.html', user=user, tags=tags)

# route - 10
@app.route('/users/<int:user_id>/posts/new', methods=["POST"])
def save_new_post(user_id):
    """Saving the new post."""
    
    user = User.query.get_or_404(user_id)
    tag_ids = [int(num) for num in request.form.getlist('tags')]
    tags = Tag.query.filter(Tag.id.in_(tag_ids)).all()

    new_post = Post(title = request.form['title'],
                    content = request.form['content'],
                    user = user, tags=tags)

    db.session.add(new_post)
    db.session.commit()
    flash(f"Post '{new_post.title}' added.")

    return redirect(f'/users/{user_id}')

# route - 11
@app.route('/posts/<int:post_id>')
def show_post(post_id):
    """Show post details."""
    post = Post.query.get_or_404(post_id)
    return render_template('post_detail.html', post=post)

# route - 12
@app.route('/posts/<int:post_id>/edit')
def edit_post(post_id):
    """Editing the post."""
    post = Post.query.get_or_404(post_id)
    tags = Tag.query.all()
    return render_template('post_edit.html', post=post, tags=tags)

# route - 13
@app.route('/posts/<int:post_id>/edit', methods=["POST"])
def save_edited_post(post_id):
    """Saving the editted post."""
    post = Post.query.get_or_404(post_id)    
    post.title = request.form["title"]
    post.content = request.form["content"]

    tag_ids = [int(num) for num in request.form.getlist('tags')]
    post.tags = Tag.query.filter(Tag.id.in_(tag_ids)).all()

    db.session.add(post)
    db.session.commit()
    flash(f"Post '{post.title}' edited", "success")

    return redirect(f"/posts/{post_id}")

# route - 14
@app.route('/posts/<int:post_id>/delete', methods=["POST"])
def delete_post(post_id):
    """Deleting a post."""

    post = Post.query.get_or_404(post_id)
    
    db.session.delete(post)
    db.session.commit()
    flash(f"{post.title} deleted successfully", 'success')
    return redirect(f"/users/{post.user_id}")

# PART - III
# ----------
# route - 15
@app.route('/tags')
def list_tags():
    """List all tags"""
    tags = Tag.query.all()
    return render_template('tag_list.html', tags=tags)

# route - 16
@app.route('/tags/<int:tag_id>')
def show_tag(tag_id):
    """Show tag details"""
    tag = Tag.query.get_or_404(tag_id)
    return render_template('tag_detail.html', tag=tag)

# route - 17
@app.route('/tags/new')
def create_new_tag():
    """Creating a new tag"""

    posts = Post.query.all()   # NEW
    return render_template('tag_add.html', posts=posts)

# route - 18
@app.route('/tags/new', methods=["POST"])
def save_new_tag():
    """Saving the new tag."""

    post_ids = [int(num) for num in request.form.getlist('posts')]
    posts = Post.query.filter(Post.id.in_(post_ids)).all()
    new_tag = Tag(name=request.form['name'], posts=posts)

    db.session.add(new_tag)
    db.session.commit()
    flash(f"Tag '{new_tag.name}' added.", "success")

    return redirect('/tags')

# route - 19
@app.route('/tags/<int:tag_id>/edit')
def edit_tag(tag_id):
    """Editing a tag."""
    tag = Tag.query.get_or_404(tag_id)
    posts = Post.query.all()
    return render_template('tag_edit.html', tag=tag, posts=posts)

# route - 20
@app.route('/tags/<int:tag_id>/edit', methods=["POST"])
def save_edited_tag(tag_id):
    """Saving an edited tag."""

    tag = Tag.query.get_or_404(tag_id)
    tag.name = request.form['name']
    post_ids = [int(num) for num in request.form.getlist('posts')]
    tag.posts = Post.query.filter(Post.id.in_(post_ids)).all()

    db.session.add(tag)
    db.session.commit()
    flash(f"Tag '{tag.name}' edited.", "success")

    return redirect("/tags")

# route - 21
@app.route('/tags/<int:tag_id>/delete', methods=["POST"])
def delete_tag(tag_id):
    """Deleting a tag."""
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    flash(f"Tag {tag.name} deleted.", 'success')
    return redirect('/tags')
