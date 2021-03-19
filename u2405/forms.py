from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import InputRequired, Length, NumberRange, Email, Optional


class RegisterForm(FlaskForm):
    """User registration form."""

    username = StringField("Username", 
                           validators=[InputRequired(), 
                                       Length(min=1, max=20)])
    password = PasswordField("Password", 
                             validators=[InputRequired(), 
                                         Length(min=6, max=55)])
    email = StringField("E-Mail", 
                        validators=[InputRequired(), Email(), Length(max=50)])
    first_name = StringField("First Name", 
                             validators=[InputRequired(), Length(max=30)])
    last_name = StringField("Last Name", 
                            validators=[InputRequired(), Length(max=30)])


class LoginForm(FlaskForm):
    """Login form."""

    username = StringField("Username", 
                           validators=[InputRequired(), 
                                       Length(min=1, max=20)])
    password = PasswordField("Password", 
                             validators=[InputRequired(), 
                                         Length(min=6, max=55)])


class FeedbackForm(FlaskForm):
    """Add feedback form."""

    title = StringField("Title", 
                        validators=[InputRequired(), Length(max=100)])
    content = TextAreaField("Content", validators=[InputRequired()])
