"""Forms for adopt app."""

from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, TextAreaField, BooleanField
from wtforms.validators import InputRequired, Length, Optional, URL, NumberRange


class AddPetForm(FlaskForm):
    """A form to add new pets."""

    name = StringField(
        "Pet Name", 
        validators=[InputRequired()],
        )

    species = SelectField(
        "Species", 
        choices=[("cat", "Cat"), ("dog", "Dog"), ("porcupine", "Porcupine")],
        )

    photo_url = StringField(
        "Photo URL", 
        validators=[Optional(), URL()],
        )

    age = IntegerField(
        "Age", 
        validators=[Optional(), NumberRange(min=0, max=30)],
        )

    notes = TextAreaField(
        "Comments", 
        validators=[Optional(), Length(min=10)],
        )


class EditPetForm(FlaskForm):
    """A form to edit pets."""

    photo_url = StringField(
        "Photo URL", 
        validators=[Optional(), URL()],
        )

    notes = TextAreaField(
        "Comments", 
        validators=[Optional()],
        )

    available = BooleanField("Available?")