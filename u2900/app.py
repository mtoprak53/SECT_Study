import os

from flask import Flask, redirect, render_template, request, flash, session, g, abort
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

# from forms import SomeForm   #  <<== ENTER FORMS
# from models import SomeModel   #  <<== ENTER MODELS

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

# app.config["SQLALCHEMY_DATABASE_URI"] = (
#     os.environ.get("DATABASE_URL", "postgres:///some_db")   #  <<== ENTER DATABASE
# )

# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["SQLALCHEMY_ECHO"] = False
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = True
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "It is a secret.")
toolbar = DebugToolbarExtension(app)

# connect_db(app)


####################################################################################
# 


####################################################################################
# 


####################################################################################
# Homepage and error pages


@app.route('/')
def homepage():
    """
    """

    # if g.user:
    if False:
        pass
    else:
        # return render_template('home-anon.html')   # ORIGINAL
        return render_template('home.html')   # TEST


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







































