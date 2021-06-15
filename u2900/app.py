import os
import requests

from flask import Flask, redirect, render_template, request, flash, session, g, abort
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError   # for already taken usernames

from forms import UserAddForm, LoginForm
from models import db, connect_db, Food, FoodLog, User, UserInfo

from hidden import API_KEY

CURR_USER_KEY = "curr_user"

BASE_URL = "https://www.foodrepo.org/api/v3"

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    os.environ.get("DATABASE_URL", "postgresql:///calorie_db")
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
# app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", API_SECRET_KEY)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "top_secret")
toolbar = DebugToolbarExtension(app)

connect_db(app)

# db.drop_all()
# db.create_all()


####################################################################################
# User signup/login/logout


@app.before_request
def add_user_to_g():
    """If we're logged in, add curr_user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None
    

def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.

    Create new user and add to DB. Redirect to home page.

    If form not valid, present form.

    If  there already is a user with that username: flash message and re-present the form.
    """

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]
    form = UserAddForm()

    if form.validate_on_submit():   # .validate_on_submit()
        try:
            user = User.signup(   # .signup()
                username=form.username.data,
                password=form.password.data
                # first_name=form.first_name.data,
                # last_name=form.last_name.data,
            )
            db.session.commit()
            user_info = UserInfo(
                user_id=user.id,
                calorie_need=form.calorie_need.data,
                calorie_limit=form.calorie_limit.data                
            )
            db.session.add(user_info)
            db.session.commit()

        except IntegrityError as e:
            flash("Username already taken", 'danger')
            return render_template('signup.html', form=form)
        
        do_login(user)   # do_login()

        return redirect('/')
    
    else:
        return render_template('signup.html', form=form)


@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    form = LoginForm()

    if form.validate_on_submit():   # .validate_on_submit()
        user = User.authenticate(   # .authenticate()
            form.username.data,
            form.password.data
        )

        if user:
            do_login(user)   # do_login()
            flash(f"Hello, {user.username}!", 'success')
            return redirect('/')

        flash("Invalid credentials.", 'danger')

    return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    """Handle logout of user."""

    do_logout()   # do_logout

    flash("You have successfully logged out.", 'success')
    return redirect("/login")


####################################################################################
# 


@app.route('/add-food/<food_name>', methods=["POST"])
def add_food(food_name):
    """x"""

    food = Food(name=food_name, amount=100)
    db.session.add(food)
    db.session.commit()
    print("NABER!!")
    print("NABER-2!!")

    return f"{food_name} added!"


@app.route('/food-search', methods=["GET", "POST"])
def food_search():
    """
    """    

    if request.form:
        food = request.form["food"]

        print("#"*30)
        print(food)
        print("#"*30)

        ENDPOINT = '/products'
        url = BASE_URL + ENDPOINT

        print("#"*30)
        print(url)
        print("#"*30)

        query = {
            "query": {
                "wildcard": {
                    "_all_names" : f"*{food}*"
                }
            }
        }

        headers = {
            'Authorization': 'Token token=' + API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/vnd.api+json',
            'Accept-Encoding': 'gzip,deflate'
        }

        r = requests.post(url, json=query, headers=headers)
        if r.status_code == 200:
            results = r.json()
            return render_template('results.html', results=results)
        else:
            # return render_template('results.html', status_code=r.status_code)

            print("#"*30)
            print(r)
            print("#"*30)

            return render_template('results.html', r=r)



        # return f"Searched food is {food}"
        return render_template('results.html', results=results)

    return render_template('search.html')



####################################################################################
# 


####################################################################################
# Homepage and error pages


@app.route('/')
def homepage():
    """Show homepage"""

    if g.user:
        print("#"*30)
        print(f"g.user => {g.user}")
        print("#"*30)

        # user = User.query.get(g.user)
        # print("#"*30)
        # print(f"user => {user}")
        # print("#"*30)

        # user = g.user
        return render_template('home.html', user=g.user)
    else:
        return render_template('home-anon.html')


@app.errorhandler(404)
def page_not_found(e):
    """404 NOT FOUND page."""

    return render_template('404.html'), 404


####################################################################################
# Turn off all caching in Flask
#   (useful for dev; in production, this kind of stuff is typically handled elsewhere)
#
# https://stackoverflow.com/questions/34066804/disabling-caching-in-flask

# @app.after_request
# def add_header(req):
#     """Add non-caching headers on every request."""

#     req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
#     req.headers["Pragma"] = "no-cache"
#     req.headers["Expires"] = "0"    
#     req.headers["Cache-Control"] = "public, max-age=0"
#     return req







































